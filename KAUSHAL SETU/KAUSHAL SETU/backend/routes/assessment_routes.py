from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized
from services.assessment_catalog import (
    ASSESSMENT_CATALOG,
    get_assessment_meta,
)


assessment_bp = Blueprint("assessment", __name__)


# ---------------------------------------------------------
# GET ALL ASSESSMENTS
# GET /api/assessments
# ---------------------------------------------------------
@assessment_bp.route("/api/assessments", methods=["GET"])
def get_assessments():
    user_id = get_user_id_from_token()

    assessments = []

    for meta in ASSESSMENT_CATALOG.values():
        item = dict(meta)
        item.pop("questions", None)
        assessments.append(item)

    # Mark which assessments the current user has already passed.
    passed_ids = set()

    if user_id:
        connection = None

        try:
            connection = get_db_connection()
            cursor = connection.cursor()

            cursor.execute(
                """
                SELECT skill
                FROM assessment_attempts
                WHERE user_id = %s AND passed = 1
                """,
                (user_id,),
            )

            passed_ids = {row[0] for row in cursor.fetchall()}
            cursor.close()

        except Exception:
            passed_ids = set()

        finally:
            if connection:
                connection.close()

    for item in assessments:
        attempts = item.pop("attempts", None)

        if item["id"] in passed_ids:
            item["status"] = "Verified"
        else:
            item["status"] = "Ready to Start"

    return {"success": True, "assessments": assessments}, 200


# ---------------------------------------------------------
# GET SINGLE ASSESSMENT WITH QUESTIONS (no answers leaked)
# GET /api/assessments/<assessment_id>
# ---------------------------------------------------------
@assessment_bp.route("/api/assessments/<assessment_id>", methods=["GET"])
def get_assessment_by_id(assessment_id):
    meta = get_assessment_meta(assessment_id)

    if not meta:
        return {"success": False, "message": "Assessment not found"}, 404

    questions = [
        {
            "id": question["id"],
            "question": question["question"],
            "options": question["options"],
        }
        for question in meta["questions"]
    ]

    assessment = {key: value for key, value in meta.items() if key != "questions"}
    assessment["questions"] = questions

    return {"success": True, "assessment": assessment}, 200


# ---------------------------------------------------------
# SUBMIT ASSESSMENT (server-side grading)
# POST /api/assessments/<assessment_id>/submit
# ---------------------------------------------------------
@assessment_bp.route(
    "/api/assessments/<assessment_id>/submit",
    methods=["POST"],
)
def submit_assessment(assessment_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    meta = get_assessment_meta(assessment_id)

    if not meta:
        return {"success": False, "message": "Assessment not found"}, 404

    data = request.get_json(silent=True) or {}
    answers = data.get("answers")

    if not isinstance(answers, dict):
        return {"success": False, "message": "answers object is required"}, 400

    # Grade every catalog question against the answer key.
    per_question = []
    correct_count = 0

    for question in meta["questions"]:
        submitted = answers.get(str(question["id"]))
        is_correct = submitted == question["correctAnswer"]

        if is_correct:
            correct_count += 1

        per_question.append(
            {
                "question_id": question["id"],
                "skill": question["skill"],
                "correct": is_correct,
                "correct_option": question["correctAnswer"],
                "explanation": question["explanation"],
            }
        )

    total_questions = len(meta["questions"])
    score = round((correct_count / total_questions) * 100, 2)
    passed = score >= 60

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COALESCE(MAX(attempt_number), 0) + 1
            FROM assessment_attempts
            WHERE user_id = %s
              AND skill = %s
            """,
            (user_id, assessment_id),
        )

        attempt_number = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO assessment_attempts
            (
                user_id,
                skill,
                score,
                passed,
                attempt_number
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, created_at
            """,
            (
                user_id,
                assessment_id,
                score,
                1 if passed else 0,
                attempt_number,
            ),
        )

        saved_attempt = cursor.fetchone()

        # A passing attempt verifies the primary skill covered by the test.
        skill_updates = []

        if passed:
            cursor.execute(
                """
                SELECT id, assessment_score
                FROM verified_skills
                WHERE user_id = %s AND LOWER(skill) = LOWER(%s)
                """,
                (user_id, meta["primarySkill"]),
            )

            existing = cursor.fetchone()

            if existing:
                cursor.execute(
                    """
                    UPDATE verified_skills
                    SET assessment_score = GREATEST(COALESCE(assessment_score, 0), %s)
                    WHERE id = %s
                    RETURNING id, skill, assessment_score
                    """,
                    (score, existing[0]),
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO verified_skills (user_id, skill, assessment_score)
                    VALUES (%s, %s, %s)
                    RETURNING id, skill, assessment_score
                    """,
                    (user_id, meta["primarySkill"], score),
                )

            skill_updates = cursor.fetchone()

        connection.commit()

        result = {
            "assessment_id": assessment_id,
            "assessment_title": meta["title"],
            "user_id": user_id,
            "score": score,
            "passed": passed,
            "correct_answers": correct_count,
            "total_questions": total_questions,
            "attempt_id": saved_attempt[0],
            "attempt_number": attempt_number,
            "created_at": saved_attempt[1].isoformat() if saved_attempt[1] else None,
            "per_question": per_question,
        }

        if skill_updates:
            result["verified_skill"] = {
                "id": skill_updates[0],
                "skill": skill_updates[1],
                "assessment_score": (
                    float(skill_updates[2]) if skill_updates[2] is not None else None
                ),
            }

        return {
            "success": True,
            "message": "Assessment submitted successfully",
            "result": result,
        }, 201

    except Exception:
        if connection:
            connection.rollback()

        return {"success": False, "message": "Failed to save assessment result"}, 500

    finally:
        if connection:
            connection.close()


# ---------------------------------------------------------
# GET ASSESSMENT RESULTS (attempt history)
# GET /api/assessments/<assessment_id>/results
# ---------------------------------------------------------
@assessment_bp.route(
    "/api/assessments/<assessment_id>/results",
    methods=["GET"],
)
def get_assessment_results(assessment_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                skill,
                score,
                passed,
                attempt_number,
                created_at
            FROM assessment_attempts
            WHERE user_id = %s
              AND skill = %s
            ORDER BY created_at DESC
            """,
            (user_id, assessment_id),
        )

        rows = cursor.fetchall()
        cursor.close()

        results = []

        for row in rows:
            results.append(
                {
                    "attempt_id": row[0],
                    "user_id": row[1],
                    "assessment_id": row[2],
                    "score": float(row[3]) if row[3] is not None else 0,
                    "passed": bool(row[4]),
                    "attempt_number": row[5],
                    "created_at": row[6].isoformat() if row[6] else None,
                }
            )

        return {
            "success": True,
            "assessment_id": assessment_id,
            "results": results,
        }, 200

    except Exception:
        return {"success": False, "message": "Failed to retrieve assessment results"}, 500

    finally:
        if connection:
            connection.close()