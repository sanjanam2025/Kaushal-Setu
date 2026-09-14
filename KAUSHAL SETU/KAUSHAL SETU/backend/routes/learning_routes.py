from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized

learning_bp = Blueprint(
    "learning",
    __name__,
    url_prefix="/api"
)


# ---------------------------------------------------------
# GET ALL LEARNING PROGRESS
# ---------------------------------------------------------
@learning_bp.route("/learning-progress", methods=["GET"])
def get_learning_progress():

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM learning_progress
        WHERE user_id = %s
        ORDER BY id
        """,
        (user_id,)
    )

    rows = cursor.fetchall()
    columns = [column[0] for column in cursor.description]

    learning_progress = [
        dict(zip(columns, row))
        for row in rows
    ]

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "user_id": user_id,
        "learning_progress": learning_progress,
        "total": len(learning_progress)
    })


# ---------------------------------------------------------
# GET LEARNING PROGRESS FOR A SKILL
# ---------------------------------------------------------
@learning_bp.route(
    "/learning-progress/skills/<skill_id>",
    methods=["GET"]
)
def get_skill_learning_progress(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM learning_progress
        WHERE user_id = %s
          AND LOWER(skill_name) = LOWER(%s)
        ORDER BY id
        """,
        (user_id, skill_id)
    )

    rows = cursor.fetchall()
    columns = [column[0] for column in cursor.description]

    progress_records = [
        dict(zip(columns, row))
        for row in rows
    ]

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "user_id": user_id,
        "skill_id": skill_id,
        "learning_progress": progress_records,
        "total": len(progress_records)
    })


# ---------------------------------------------------------
# START LEARNING A SKILL
# ---------------------------------------------------------
@learning_bp.route(
    "/learning-progress/skills/<skill_id>/start",
    methods=["POST"]
)
def start_learning_skill(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT *
            FROM learning_progress
            WHERE user_id = %s
              AND LOWER(skill_name) = LOWER(%s)
            ORDER BY id
            LIMIT 1
            """,
            (user_id, skill_id)
        )

        existing_row = cursor.fetchone()

        if existing_row:

            columns = [column[0] for column in cursor.description]

            existing_record = dict(
                zip(columns, existing_row)
            )

            cursor.close()
            connection.close()

            return jsonify({
                "success": True,
                "message": "Learning already started",
                "user_id": user_id,
                "skill_id": skill_id,
                "learning_progress": existing_record
            }), 200

        cursor.execute(
            """
            INSERT INTO learning_progress
            (
                user_id,
                skill_name,
                progress_percentage,
                status
            )
            VALUES
            (
                %s,
                %s,
                0,
                'In Progress'
            )
            RETURNING *
            """,
            (user_id, skill_id)
        )

        new_row = cursor.fetchone()
        columns = [column[0] for column in cursor.description]

        connection.commit()

        learning_progress = dict(
            zip(columns, new_row)
        )

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Learning started successfully",
            "user_id": user_id,
            "skill_id": skill_id,
            "learning_progress": learning_progress
        }), 201

    except Exception:

        connection.rollback()
        cursor.close()
        connection.close()

        return jsonify({
            "success": False,
            "message": "Failed to start learning"
        }), 500


# ---------------------------------------------------------
# UPDATE LEARNING PROGRESS
# ---------------------------------------------------------
@learning_bp.route(
    "/learning-progress/skills/<skill_id>",
    methods=["PUT"]
)
def update_learning_progress(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json(silent=True) or {}

    progress_percentage = data.get("progress_percentage")

    if progress_percentage is None:
        return jsonify({
            "success": False,
            "message": "progress_percentage is required"
        }), 400

    try:
        progress_percentage = float(progress_percentage)
    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "progress_percentage must be a number"
        }), 400

    if progress_percentage < 0 or progress_percentage > 100:
        return jsonify({
            "success": False,
            "message": "progress_percentage must be between 0 and 100"
        }), 400

    if progress_percentage == int(progress_percentage):
        progress_percentage = int(progress_percentage)

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM learning_progress
            WHERE user_id = %s
              AND LOWER(skill_name) = LOWER(%s)
            ORDER BY id
            LIMIT 1
            """,
            (user_id, skill_id)
        )

        existing = cursor.fetchone()

        if not existing:
            cursor.close()
            connection.close()

            return jsonify({
                "success": False,
                "message": "Learning progress not found",
                "user_id": user_id,
                "skill_id": skill_id
            }), 404

        progress_id = existing[0]

        if progress_percentage >= 100:

            cursor.execute(
                """
                UPDATE learning_progress
                SET
                    progress_percentage = %s,
                    status = 'Completed',
                    completed_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                """,
                (progress_percentage, progress_id)
            )

        else:

            cursor.execute(
                """
                UPDATE learning_progress
                SET
                    progress_percentage = %s,
                    status = 'In Progress',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                """,
                (progress_percentage, progress_id)
            )

        updated_row = cursor.fetchone()
        columns = [column[0] for column in cursor.description]

        connection.commit()

        learning_progress = dict(
            zip(columns, updated_row)
        )

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Learning progress updated successfully",
            "user_id": user_id,
            "skill_id": skill_id,
            "learning_progress": learning_progress
        }), 200

    except Exception:

        connection.rollback()
        cursor.close()
        connection.close()

        return jsonify({
            "success": False,
            "message": "Failed to update learning progress"
        }), 500


# ---------------------------------------------------------
# COMPLETE LEARNING
# ---------------------------------------------------------
@learning_bp.route(
    "/learning-progress/skills/<skill_id>/complete",
    methods=["POST"]
)
def complete_learning_skill(skill_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = get_db_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM learning_progress
            WHERE user_id = %s
              AND LOWER(skill_name) = LOWER(%s)
            ORDER BY id
            LIMIT 1
            """,
            (user_id, skill_id)
        )

        existing = cursor.fetchone()

        if not existing:
            cursor.close()
            connection.close()

            return jsonify({
                "success": False,
                "message": "Learning progress not found",
                "user_id": user_id,
                "skill_id": skill_id
            }), 404

        progress_id = existing[0]

        cursor.execute(
            """
            UPDATE learning_progress
            SET
                progress_percentage = 100,
                status = 'Completed',
                completed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
            """,
            (progress_id,)
        )

        updated_row = cursor.fetchone()
        columns = [column[0] for column in cursor.description]

        connection.commit()

        learning_progress = dict(
            zip(columns, updated_row)
        )

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Learning completed successfully",
            "user_id": user_id,
            "skill_id": skill_id,
            "learning_progress": learning_progress
        }), 200

    except Exception:

        connection.rollback()
        cursor.close()
        connection.close()

        return jsonify({
            "success": False,
            "message": "Failed to complete learning"
        }), 500