from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized

curriculum_bp = Blueprint(
    "curriculum",
    __name__,
    url_prefix="/api/curriculum"
)


@curriculum_bp.route("", methods=["GET"])
def get_curriculum():
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM course_mappings
            ORDER BY id
        """)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        curriculum = [
            dict(zip(columns, row))
            for row in rows
        ]

        return jsonify({
            "success": True,
            "curriculum": curriculum,
            "total": len(curriculum)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load curriculum"
        }), 500

    finally:
        if connection:
            connection.close()


@curriculum_bp.route("/<int:curriculum_id>", methods=["GET"])
def get_curriculum_by_id(curriculum_id):
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM course_mappings
            WHERE id = %s
        """, (curriculum_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({
                "success": False,
                "message": "Curriculum not found"
            }), 404

        columns = [desc[0] for desc in cursor.description]

        return jsonify({
            "success": True,
            "curriculum": dict(zip(columns, row))
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load curriculum"
        }), 500

    finally:
        if connection:
            connection.close()


@curriculum_bp.route("/recommendations", methods=["GET"])
def get_curriculum_recommendations():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT skill
            FROM verified_skills
            WHERE user_id = %s
        """, (user_id,))

        skill_rows = cursor.fetchall()

        user_skills = {
            str(row[0]).strip().lower()
            for row in skill_rows
            if row[0]
        }

        cursor.execute("""
            SELECT *
            FROM course_mappings
            ORDER BY id
        """)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        recommendations = []

        for row in rows:
            course = dict(zip(columns, row))

            skill_value = course.get("skill")

            if skill_value:
                course_skill = str(skill_value).strip().lower()

                if course_skill not in user_skills:
                    recommendations.append(course)

            else:
                recommendations.append(course)

        return jsonify({
            "success": True,
            "user_id": user_id,
            "recommendations": recommendations,
            "total": len(recommendations)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load curriculum"
        }), 500

    finally:
        if connection:
            connection.close()