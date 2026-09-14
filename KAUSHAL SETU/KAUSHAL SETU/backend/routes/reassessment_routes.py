from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized


reassessment_bp = Blueprint(
    "reassessment",
    __name__,
    url_prefix="/api/reassessments"
)


# =========================================================
# START REASSESSMENT
# =========================================================
@reassessment_bp.route(
    "/skills/<skill_id>/start",
    methods=["POST"]
)
def start_reassessment(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        reassessment_skill = "reassessment:" + skill_id

        # -------------------------------------------------
        # GET NEXT ATTEMPT NUMBER
        # -------------------------------------------------
        cursor.execute(
            """
            SELECT COUNT(*)
            FROM assessment_attempts
            WHERE user_id = %s
            AND skill = %s
            """,
            (
                user_id,
                reassessment_skill
            )
        )

        count_result = cursor.fetchone()

        attempt_number = int(count_result[0]) + 1

        # -------------------------------------------------
        # CREATE REASSESSMENT
        # -------------------------------------------------
        cursor.execute(
            """
            INSERT INTO assessment_attempts
            (
                user_id,
                skill,
                attempt_number,
                score,
                passed
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id
            """,
            (
                user_id,
                reassessment_skill,
                attempt_number,
                0,
                0
            )
        )

        reassessment_id = cursor.fetchone()[0]

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Reassessment started successfully",
            "user_id": user_id,
            "skill_id": skill_id,
            "reassessment_id": reassessment_id,
            "attempt_number": attempt_number,
            "reassessment": {
                "id": reassessment_id,
                "user_id": user_id,
                "skill": reassessment_skill,
                "attempt_number": attempt_number,
                "score": 0.0,
                "passed": 0
            }
        }), 201

    except Exception:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to start reassessment"
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================================================
# SUBMIT REASSESSMENT
# =========================================================
@reassessment_bp.route(
    "/<int:reassessment_id>/submit",
    methods=["POST"]
)
def submit_reassessment(reassessment_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json(silent=True)

    if data is None:
        data = {}

    answers = data.get("answers", {})

    if not isinstance(answers, dict):
        return jsonify({
            "success": False,
            "message": "answers must be an object"
        }), 400

    # =====================================================
    # REASSESSMENT ANSWERS
    # =====================================================
    correct_answers = {
        "1": 1,
        "2": 1,
        "3": 1,
        "4": 1
    }

    total_questions = len(correct_answers)
    correct_count = 0

    for question_id, correct_answer in correct_answers.items():

        submitted_answer = answers.get(question_id)

        if str(submitted_answer) == str(correct_answer):
            correct_count += 1

    score = round(
        (correct_count / total_questions) * 100,
        2
    )

    passed = 1 if score >= 75 else 0

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        # =================================================
        # CHECK REASSESSMENT
        # =================================================
        # IMPORTANT:
        # Do not put '%' directly inside the SQL query.
        # Pass the LIKE pattern as a parameter.
        # This avoids "tuple index out of range".
        # =================================================
        reassessment_pattern = "reassessment:%"

        cursor.execute(
            """
            SELECT id
            FROM assessment_attempts
            WHERE id = %s
            AND user_id = %s
            AND skill LIKE %s
            """,
            (
                reassessment_id,
                user_id,
                reassessment_pattern
            )
        )

        existing = cursor.fetchone()

        if existing is None:

            return jsonify({
                "success": False,
                "message": "Reassessment not found",
                "reassessment_id": reassessment_id
            }), 404

        # =================================================
        # UPDATE SCORE
        # =================================================
        cursor.execute(
            """
            UPDATE assessment_attempts
            SET
                score = %s,
                passed = %s
            WHERE id = %s
            AND user_id = %s
            """,
            (
                score,
                passed,
                reassessment_id,
                user_id
            )
        )

        connection.commit()

        # =================================================
        # SUCCESS RESPONSE
        # =================================================
        return jsonify({
            "success": True,
            "message": "Reassessment submitted successfully",
            "user_id": user_id,
            "reassessment_id": reassessment_id,
            "score": score,
            "passed": bool(passed),
            "correct_answers": correct_count,
            "total_questions": total_questions
        }), 200

    except Exception:

        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to submit reassessment"
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================================================
# GET REASSESSMENT RESULT
# =========================================================
@reassessment_bp.route(
    "/<int:reassessment_id>/result",
    methods=["GET"]
)
def get_reassessment_result(reassessment_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        reassessment_pattern = "reassessment:%"

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                skill,
                attempt_number,
                score,
                passed,
                created_at
            FROM assessment_attempts
            WHERE id = %s
            AND user_id = %s
            AND skill LIKE %s
            """,
            (
                reassessment_id,
                user_id,
                reassessment_pattern
            )
        )

        row = cursor.fetchone()

        if row is None:

            return jsonify({
                "success": False,
                "message": "Reassessment result not found"
            }), 404

        result = {
            "id": row[0],
            "user_id": row[1],
            "skill": row[2],
            "attempt_number": row[3],
            "score": float(row[4]) if row[4] is not None else 0.0,
            "passed": row[5],
            "created_at": row[6]
        }

        return jsonify({
            "success": True,
            "user_id": user_id,
            "reassessment_id": reassessment_id,
            "result": result
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Failed to get reassessment result"
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================================================
# REASSESSMENT HISTORY
# =========================================================
@reassessment_bp.route(
    "/skills/<skill_id>/history",
    methods=["GET"]
)
def get_reassessment_history(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        reassessment_skill = "reassessment:" + skill_id

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                skill,
                attempt_number,
                score,
                passed,
                created_at
            FROM assessment_attempts
            WHERE user_id = %s
            AND skill = %s
            ORDER BY id DESC
            """,
            (
                user_id,
                reassessment_skill
            )
        )

        rows = cursor.fetchall()

        history = []

        for row in rows:

            history.append({
                "id": row[0],
                "user_id": row[1],
                "skill": row[2],
                "attempt_number": row[3],
                "score": float(row[4]) if row[4] is not None else 0.0,
                "passed": row[5],
                "created_at": row[6]
            })

        return jsonify({
            "success": True,
            "user_id": user_id,
            "skill_id": skill_id,
            "history": history,
            "total": len(history)
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Failed to get reassessment history"
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================================================
# REASSESSMENT STATUS
# =========================================================
@reassessment_bp.route(
    "/skills/<skill_id>/status",
    methods=["GET"]
)
def get_reassessment_status(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        reassessment_skill = "reassessment:" + skill_id

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                skill,
                attempt_number,
                score,
                passed,
                created_at
            FROM assessment_attempts
            WHERE user_id = %s
            AND skill = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (
                user_id,
                reassessment_skill
            )
        )

        row = cursor.fetchone()

        if row is None:

            return jsonify({
                "success": True,
                "user_id": user_id,
                "skill_id": skill_id,
                "status": "Not Started",
                "has_reassessment": False
            }), 200

        if row[5] == 1:

            status = "Passed"

        elif row[4] is not None and float(row[4]) > 0:

            status = "Completed"

        else:

            status = "In Progress"

        reassessment = {
            "id": row[0],
            "user_id": row[1],
            "skill": row[2],
            "attempt_number": row[3],
            "score": float(row[4]) if row[4] is not None else 0.0,
            "passed": row[5],
            "created_at": row[6]
        }

        return jsonify({
            "success": True,
            "user_id": user_id,
            "skill_id": skill_id,
            "status": status,
            "has_reassessment": True,
            "reassessment": reassessment
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Failed to get reassessment status"
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================================================
# REASSESSMENT ELIGIBILITY
# =========================================================
@reassessment_bp.route(
    "/skills/<skill_id>/eligibility",
    methods=["GET"]
)
def get_reassessment_eligibility(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM learning_progress
            WHERE user_id = %s
            AND LOWER(skill_name) = LOWER(%s)
            AND status = 'Completed'
            """,
            (
                user_id,
                skill_id
            )
        )

        completed_learning = cursor.fetchone()[0]

        eligible = completed_learning > 0

        return jsonify({
            "success": True,
            "user_id": user_id,
            "skill_id": skill_id,
            "eligible": eligible,
            "reason": (
                "Learning completed"
                if eligible
                else "Learning not completed"
            )
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Failed to check reassessment eligibility"
        }), 500

    finally:

        cursor.close()
        connection.close()