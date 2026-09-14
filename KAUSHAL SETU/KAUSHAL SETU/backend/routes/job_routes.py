from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized


job_bp = Blueprint("job", __name__, url_prefix="/api/jobs")


# ---------------------------------------------------------
# SHARED HELPERS
# ---------------------------------------------------------


def parse_skills(raw):
    """Normalize a required-skills column (text or list) into a list."""
    if not raw:
        return []

    if isinstance(raw, list):
        return [str(skill).strip() for skill in raw if str(skill).strip()]

    return [
        skill.strip()
        for skill in str(raw).split(",")
        if skill.strip()
    ]


def row_to_job(row):
    """Map a job_postings row tuple to the API job shape."""
    return {
        "id": row[0],
        "job_id": row[1],
        "title": row[2],
        "company": row[3],
        "location": row[4],
        "required_skills": parse_skills(row[5]),
        "experience": row[6],
        "job_type": row[7],
        "salary": row[8],
        "source": row[9],
        "posted_date": str(row[10]) if row[10] else None,
        "engineering_field": row[11],
    }


JOB_SELECT = """
    SELECT
        id,
        job_id,
        job_title,
        company,
        location,
        required_skills,
        experience_level,
        employment_type,
        salary_range,
        source,
        posted_date,
        engineering_field
    FROM job_postings
"""


# ---------------------------------------------------------
# GET ALL JOBS (with optional filters)
# GET /api/jobs?search=&location=&field=&job_type=
# ---------------------------------------------------------

@job_bp.route("", methods=["GET"])
def get_jobs():
    search = (request.args.get("search") or "").strip()
    location = (request.args.get("location") or "").strip()
    field = (request.args.get("field") or "").strip()
    job_type = (request.args.get("job_type") or "").strip()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        clauses = []
        params = []

        if search:
            pattern = f"%{search.lower()}%"
            clauses.append(
                "(LOWER(job_title) LIKE %s OR LOWER(company) LIKE %s OR LOWER(required_skills) LIKE %s)"
            )
            params.extend([pattern, pattern, pattern])

        if location:
            clauses.append("LOWER(location) LIKE %s")
            params.append(f"%{location.lower()}%")

        if field:
            clauses.append("LOWER(engineering_field) = LOWER(%s)")
            params.append(field)

        if job_type:
            clauses.append("LOWER(employment_type) LIKE %s")
            params.append(f"%{job_type.lower()}%")

        query = JOB_SELECT

        if clauses:
            query += " WHERE " + " AND ".join(clauses)

        query += " ORDER BY id"

        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()

        jobs = [row_to_job(row) for row in rows]

        return jsonify({
            "success": True,
            "jobs": jobs,
            "total_jobs": len(jobs)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load jobs"
        }), 500

    finally:
        if connection:
            connection.close()


# ---------------------------------------------------------
# GET SINGLE JOB
# GET /api/jobs/<job_id>
# ---------------------------------------------------------

@job_bp.route("/<job_id>", methods=["GET"])
def get_job(job_id):
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                job_id,
                job_title,
                company,
                location,
                required_skills,
                experience_level,
                employment_type,
                salary_range,
                source,
                posted_date,
                engineering_field
            FROM job_postings
            WHERE job_id = %s
        """, (job_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({
                "success": False,
                "message": "Job not found"
            }), 404

        job = row_to_job(row)

        return jsonify({
            "success": True,
            "job": job
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load job"
        }), 500

    finally:
        if connection:
            connection.close()


# ---------------------------------------------------------
# APPLY FOR JOB
# POST /api/jobs/<job_id>/apply
# ---------------------------------------------------------

@job_bp.route("/<job_id>/apply", methods=["POST"])
def apply_for_job(job_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # -------------------------------------------------
        # Check whether job exists
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                job_id,
                job_title,
                company
            FROM job_postings
            WHERE job_id = %s
        """, (job_id,))

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "success": False,
                "message": "Job not found"
            }), 404

        # -------------------------------------------------
        # Check whether user already applied
        # -------------------------------------------------

        cursor.execute("""
            SELECT id
            FROM applications
            WHERE user_id = %s
              AND job_id = %s
            LIMIT 1
        """, (
            user_id,
            job_id
        ))

        existing = cursor.fetchone()

        if existing:

            return jsonify({
                "success": False,
                "message": "You have already applied for this job",
                "application_id": existing[0]
            }), 409

        # -------------------------------------------------
        # Create application
        # -------------------------------------------------

        cursor.execute("""
            INSERT INTO applications
            (
                user_id,
                job_id,
                application_status,
                applied_date,
                updated_at
            )
            VALUES
            (
                %s,
                %s,
                %s,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING id
        """, (
            user_id,
            job_id,
            "Applied"
        ))

        application_id = cursor.fetchone()[0]

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Job application submitted successfully",
            "application": {
                "application_id": application_id,
                "user_id": user_id,
                "job_id": job_id,
                "status": "Applied",
                "job_title": job[1],
                "company": job[2]
            }
        }), 201

    except Exception:

        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to submit application"
        }), 500

    finally:

        if connection:
            connection.close()


# ---------------------------------------------------------
# GET CURRENT USER'S APPLICATIONS
# GET /api/jobs/applications/me
# ---------------------------------------------------------

@job_bp.route("/applications/me", methods=["GET"])
def get_my_applications():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                a.id,
                a.job_id,
                a.application_status,
                a.applied_date,
                j.job_title,
                j.company,
                j.location,
                j.salary_range
            FROM applications a
            LEFT JOIN job_postings j
                ON a.job_id = j.job_id
            WHERE a.user_id = %s
            ORDER BY a.applied_date DESC
        """, (user_id,))

        rows = cursor.fetchall()
        cursor.close()

        applications = []

        for row in rows:
            applications.append({
                "application_id": row[0],
                "job_id": row[1],
                "status": row[2],
                "applied_date": row[3].isoformat() if row[3] else None,
                "job_title": row[4],
                "company": row[5],
                "location": row[6],
                "salary": row[7]
            })

        return jsonify({
            "success": True,
            "applications": applications,
            "total": len(applications)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load applications"
        }), 500

    finally:
        if connection:
            connection.close()