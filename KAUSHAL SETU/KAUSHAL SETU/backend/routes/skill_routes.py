from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized


skill_bp = Blueprint("skill", __name__, url_prefix="/api/skills")


# ---------------------------------------------------------
# GET ALL SKILLS
# GET /api/skills
# ---------------------------------------------------------

@skill_bp.route("", methods=["GET"])
def get_skills():
    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT DISTINCT skill
            FROM verified_skills
            WHERE skill IS NOT NULL
            ORDER BY skill
        """)

        rows = cursor.fetchall()

        skills = [
            {
                "skill": row[0]
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "skills": skills
        }), 200

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# GET CURRENT USER SKILLS
# GET /api/skills/user
# ---------------------------------------------------------

@skill_bp.route("/user", methods=["GET"])
def get_user_skills():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, user_id, skill, assessment_score
            FROM verified_skills
            WHERE user_id = %s
            ORDER BY skill
        """, (user_id,))

        rows = cursor.fetchall()

        skills = [
            {
                "id": row[0],
                "user_id": row[1],
                "skill": row[2],
                "assessment_score": row[3]
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "skills": skills
        }), 200

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# ADD USER SKILL
# POST /api/skills/user
# ---------------------------------------------------------

@skill_bp.route("/user", methods=["POST"])
def add_user_skill():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json() or {}

    skill_name = data.get("skill_name")
    proficiency_level = data.get("proficiency_level")

    if not skill_name:
        return jsonify({
            "success": False,
            "message": "skill_name is required"
        }), 400

    proficiency_scores = {
        "beginner": 25,
        "intermediate": 50,
        "advanced": 75,
        "expert": 100
    }

    assessment_score = proficiency_scores.get(
        str(proficiency_level).lower(),
        0
    )

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO verified_skills
                (user_id, skill, assessment_score)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, skill, assessment_score
        """, (
            user_id,
            skill_name,
            assessment_score
        ))

        row = cursor.fetchone()

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Skill added successfully",
            "skill": {
                "id": row[0],
                "user_id": row[1],
                "skill": row[2],
                "assessment_score": row[3]
            }
        }), 201

    except Exception:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to save skill"
        }), 500

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# GET USER SKILLS BY USER ID
# GET /api/skills/user/<user_id>
# ---------------------------------------------------------

@skill_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_skills_by_id(user_id):
    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, user_id, skill, assessment_score
            FROM verified_skills
            WHERE user_id = %s
            ORDER BY skill
        """, (user_id,))

        rows = cursor.fetchall()

        skills = [
            {
                "id": row[0],
                "user_id": row[1],
                "skill": row[2],
                "assessment_score": row[3]
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "skills": skills
        }), 200

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# DELETE USER SKILL
# DELETE /api/skills/user/<skill_id>
# ---------------------------------------------------------

@skill_bp.route("/user/<int:skill_id>", methods=["DELETE"])
def delete_user_skill(skill_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM verified_skills
            WHERE id = %s AND user_id = %s
            RETURNING id, skill
        """, (skill_id, user_id))

        deleted = cursor.fetchone()

        if not deleted:
            connection.rollback()

            return {
                "success": False,
                "message": "Skill not found"
            }, 404

        connection.commit()

        return {
            "success": True,
            "message": "Skill deleted successfully",
            "skill": {
                "id": deleted[0],
                "skill": deleted[1]
            }
        }, 200

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# GET SKILL VERIFICATION
# GET /api/skills/<skill_id>/verification
# ---------------------------------------------------------

@skill_bp.route("/<int:skill_id>/verification", methods=["GET"])
def get_skill_verification(skill_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, user_id, skill, assessment_score
            FROM verified_skills
            WHERE id = %s AND user_id = %s
        """, (
            skill_id,
            user_id
        ))

        skill = cursor.fetchone()

        if not skill:
            return jsonify({
                "success": False,
                "message": "Skill verification record not found"
            }), 404

        return jsonify({
            "success": True,
            "verification": {
                "id": skill[0],
                "user_id": skill[1],
                "skill": skill[2],
                "assessment_score": (
                    float(skill[3])
                    if skill[3] is not None
                    else None
                ),
                "verified": True
            }
        }), 200

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# VERIFY SKILL
# POST /api/skills/<skill_id>/verify
# ---------------------------------------------------------

@skill_bp.route("/<int:skill_id>/verify", methods=["POST"])
def verify_skill(skill_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json() or {}

    assessment_score = data.get("assessment_score")

    if assessment_score is None:
        return jsonify({
            "success": False,
            "message": "assessment_score is required"
        }), 400

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, user_id, skill, assessment_score
            FROM verified_skills
            WHERE id = %s AND user_id = %s
        """, (
            skill_id,
            user_id
        ))

        skill = cursor.fetchone()

        if not skill:
            return jsonify({
                "success": False,
                "message": "Skill not found"
            }), 404

        cursor.execute("""
            UPDATE verified_skills
            SET assessment_score = %s
            WHERE id = %s AND user_id = %s
        """, (
            assessment_score,
            skill_id,
            user_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Skill verified successfully",
            "verification": {
                "id": skill[0],
                "user_id": user_id,
                "skill": skill[2],
                "assessment_score": float(assessment_score),
                "verified": True
            }
        }), 200

    except Exception:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to save skill"
        }), 500

    finally:
        cursor.close()
        connection.close()


# ---------------------------------------------------------
# GET VERIFIED SKILLS
# GET /api/skills/verified
# ---------------------------------------------------------

@skill_bp.route("/verified", methods=["GET"])
def get_verified_skills():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id, user_id, skill, assessment_score
            FROM verified_skills
            WHERE user_id = %s
            ORDER BY id
        """, (user_id,))

        rows = cursor.fetchall()

        skills = []

        for row in rows:
            skills.append({
                "id": row[0],
                "user_id": row[1],
                "skill": row[2],
                "assessment_score": (
                    float(row[3])
                    if row[3] is not None
                    else None
                ),
                "verified": True
            })

        return jsonify({
            "success": True,
            "skills": skills
        }), 200

    finally:
        cursor.close()
        connection.close()