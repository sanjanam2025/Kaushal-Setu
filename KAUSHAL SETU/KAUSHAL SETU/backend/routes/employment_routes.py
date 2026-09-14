from flask import Blueprint, jsonify, request
from config.database import get_db_connection

employment_bp = Blueprint(
    "employment",
    __name__,
    url_prefix="/api"
)


# ============================================================
# GET EMPLOYMENT OUTCOMES
# ============================================================

@employment_bp.get("/employment-outcomes")
def get_employment_outcomes():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered,
                employer_name,
                created_at,
                updated_at
            FROM placement_outcomes
            ORDER BY id DESC
            """
        )

        rows = cur.fetchall()

        cur.close()
        conn.close()

        outcomes = []

        for row in rows:
            outcomes.append({
                "id": row[0],
                "application_id": row[1],
                "user_id": row[2],
                "job_id": row[3],
                "placement_status": row[4],
                "joining_date": (
                    row[5].isoformat()
                    if row[5]
                    else None
                ),
                "salary_offered": row[6],
                "employer_name": row[7],
                "created_at": (
                    row[8].isoformat()
                    if row[8]
                    else None
                ),
                "updated_at": (
                    row[9].isoformat()
                    if row[9]
                    else None
                )
            })

        return jsonify({
            "success": True,
            "outcomes": outcomes,
            "total_outcomes": len(outcomes)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load employment outcomes"
        }), 500
    

# ============================================================
# GET EMPLOYMENT OUTCOME BY APPLICATION
# ============================================================

@employment_bp.get("/employment-outcomes/applications/<int:application_id>")
def get_application_employment_outcome(application_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered,
                employer_name,
                created_at,
                updated_at
            FROM placement_outcomes
            WHERE application_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (application_id,)
        )

        row = cur.fetchone()

        cur.close()
        conn.close()

        if not row:
            return jsonify({
                "success": False,
                "message": "Employment outcome not found for this application"
            }), 404

        outcome = {
            "id": row[0],
            "application_id": row[1],
            "user_id": row[2],
            "job_id": row[3],
            "placement_status": row[4],
            "joining_date": (
                row[5].isoformat()
                if row[5]
                else None
            ),
            "salary_offered": row[6],
            "employer_name": row[7],
            "created_at": (
                row[8].isoformat()
                if row[8]
                else None
            ),
            "updated_at": (
                row[9].isoformat()
                if row[9]
                else None
            )
        }

        return jsonify({
            "success": True,
            "outcome": outcome
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load employment outcomes"
        }), 500

# ============================================================
# GET EMPLOYMENT OUTCOME BY JOB AND APPLICATION
# ============================================================

@employment_bp.get("/jobs/<job_id>/applications/<int:application_id>/outcome")
def get_job_application_outcome(job_id, application_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered,
                employer_name,
                created_at,
                updated_at
            FROM placement_outcomes
            WHERE job_id = %s
              AND application_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (job_id, application_id)
        )

        row = cur.fetchone()

        cur.close()
        conn.close()

        if not row:
            return jsonify({
                "success": False,
                "message": "Employment outcome not found for this job and application"
            }), 404

        outcome = {
            "id": row[0],
            "application_id": row[1],
            "user_id": row[2],
            "job_id": row[3],
            "placement_status": row[4],
            "joining_date": (
                row[5].isoformat()
                if row[5]
                else None
            ),
            "salary_offered": row[6],
            "employer_name": row[7],
            "created_at": (
                row[8].isoformat()
                if row[8]
                else None
            ),
            "updated_at": (
                row[9].isoformat()
                if row[9]
                else None
            )
        }

        return jsonify({
            "success": True,
            "outcome": outcome
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load employment outcomes"
        }), 500

# ============================================================
# GET EMPLOYMENT OUTCOMES BY JOB
# ============================================================

@employment_bp.get("/jobs/<job_id>/outcome")
def get_job_outcome(job_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered,
                employer_name,
                created_at,
                updated_at
            FROM placement_outcomes
            WHERE job_id = %s
            ORDER BY id DESC
            """,
            (job_id,)
        )

        rows = cur.fetchall()

        cur.close()
        conn.close()

        outcomes = []

        for row in rows:
            outcomes.append({
                "id": row[0],
                "application_id": row[1],
                "user_id": row[2],
                "job_id": row[3],
                "placement_status": row[4],
                "joining_date": (
                    row[5].isoformat()
                    if row[5]
                    else None
                ),
                "salary_offered": row[6],
                "employer_name": row[7],
                "created_at": (
                    row[8].isoformat()
                    if row[8]
                    else None
                ),
                "updated_at": (
                    row[9].isoformat()
                    if row[9]
                    else None
                )
            })

        return jsonify({
            "success": True,
            "job_id": job_id,
            "outcomes": outcomes,
            "total_outcomes": len(outcomes)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load employment outcomes"
        }), 500

# ============================================================
# GET LATEST EMPLOYMENT STATUS
# ============================================================

@employment_bp.get("/employment-outcomes/latest-status")
def get_latest_employment_status():
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({
                "success": False,
                "message": "user_id is required"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            """
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered,
                employer_name,
                created_at,
                updated_at
            FROM placement_outcomes
            WHERE user_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (user_id,)
        )

        row = cur.fetchone()

        cur.close()
        conn.close()

        if not row:
            return jsonify({
                "success": False,
                "message": "Employment status not found for this user"
            }), 404

        outcome = {
            "id": row[0],
            "application_id": row[1],
            "user_id": row[2],
            "job_id": row[3],
            "placement_status": row[4],
            "joining_date": (
                row[5].isoformat()
                if row[5]
                else None
            ),
            "salary_offered": row[6],
            "employer_name": row[7],
            "created_at": (
                row[8].isoformat()
                if row[8]
                else None
            ),
            "updated_at": (
                row[9].isoformat()
                if row[9]
                else None
            )
        }

        return jsonify({
            "success": True,
            "latest_status": outcome
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load employment outcomes"
        }), 500

    