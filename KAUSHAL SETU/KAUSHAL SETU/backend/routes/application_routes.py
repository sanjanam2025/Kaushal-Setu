from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized

application_bp = Blueprint("application", __name__)


@application_bp.route("/api/applications", methods=["GET"])
def list_applications():
    """List the authenticated user's job applications."""
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
                a.id,
                a.user_id,
                a.job_id,
                a.application_status,
                a.applied_date,
                a.updated_at,
                j.job_title,
                j.company,
                j.location
            FROM applications a
            LEFT JOIN job_postings j
                ON a.job_id = j.job_id
            WHERE a.user_id = %s
            ORDER BY a.applied_date DESC
            """,
            (user_id,),
        )

        rows = cursor.fetchall()
        cursor.close()

        applications = []

        for row in rows:
            applications.append(
                {
                    "application_id": row[0],
                    "user_id": row[1],
                    "job_id": row[2],
                    "status": row[3],
                    "applied_date": row[4].isoformat() if row[4] else None,
                    "updated_at": row[5].isoformat() if row[5] else None,
                    "job_title": row[6],
                    "company": row[7],
                    "location": row[8],
                }
            )

        return jsonify(
            {
                "success": True,
                "applications": applications,
                "total": len(applications),
            }
        ), 200

    except Exception:
        return jsonify(
            {
                "success": False,
                "message": "Failed to load applications",
            }
        ), 500

    finally:
        if connection:
            connection.close()


@application_bp.route("/api/applications/<int:application_id>", methods=["GET"])
def get_application(application_id):
    """Fetch a single application owned by the authenticated user."""
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
                a.id,
                a.user_id,
                a.job_id,
                a.application_status,
                a.applied_date,
                a.updated_at,
                j.job_title,
                j.company,
                j.location
            FROM applications a
            LEFT JOIN job_postings j
                ON a.job_id = j.job_id
            WHERE a.id = %s AND a.user_id = %s
            LIMIT 1
            """,
            (application_id, user_id),
        )

        row = cursor.fetchone()
        cursor.close()

        if not row:
            return jsonify(
                {
                    "success": False,
                    "message": "Application not found",
                }
            ), 404

        return jsonify(
            {
                "success": True,
                "application": {
                    "application_id": row[0],
                    "user_id": row[1],
                    "job_id": row[2],
                    "status": row[3],
                    "applied_date": row[4].isoformat() if row[4] else None,
                    "updated_at": row[5].isoformat() if row[5] else None,
                    "job_title": row[6],
                    "company": row[7],
                    "location": row[8],
                },
            }
        ), 200

    except Exception:
        return jsonify(
            {
                "success": False,
                "message": "Failed to load application",
            }
        ), 500

    finally:
        if connection:
            connection.close()
