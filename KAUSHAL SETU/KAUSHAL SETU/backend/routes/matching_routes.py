from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized
from services.matching_service import (
    compute_match,
    get_user_skill_set,
    split_required_skills,
)


matching_bp = Blueprint(
    "matching",
    __name__,
    url_prefix="/api/matching"
)


# ---------------------------------------------------------
# GET MATCHING JOBS
# GET /api/matching/jobs?threshold=70
# ---------------------------------------------------------

@matching_bp.route("/jobs", methods=["GET"])
def get_matching_jobs():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    try:
        threshold = float(request.args.get("threshold", 0))
    except (TypeError, ValueError):
        threshold = 0

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
                engineering_field
            FROM job_postings
            ORDER BY id
        """)

        job_rows = cursor.fetchall()
        cursor.close()

        user_skills = get_user_skill_set(connection, user_id)

        matching_jobs = []

        for row in job_rows:
            required_skills = split_required_skills(row[5])
            matched_skills, missing_skills, match_score = compute_match(
                required_skills, user_skills
            )

            if match_score < threshold:
                continue

            matching_jobs.append({
                "id": row[0],
                "job_id": row[1],
                "title": row[2],
                "company": row[3],
                "location": row[4],
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "match_score": match_score,
                "experience": row[6],
                "job_type": row[7],
                "salary": row[8],
                "engineering_field": row[9]
            })

        # Highest match first
        matching_jobs.sort(
            key=lambda job: job["match_score"],
            reverse=True
        )

        return jsonify({
            "success": True,
            "user_id": user_id,
            "jobs": matching_jobs,
            "total_jobs": len(matching_jobs)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to compute job matches"
        }), 500

    finally:
        if connection:
            connection.close()


# ---------------------------------------------------------
# GET JOB MATCHING ANALYSIS
# GET /api/matching/analysis/<job_id>
# ---------------------------------------------------------

@matching_bp.route("/analysis/<job_id>", methods=["GET"])
def get_matching_analysis(job_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # -------------------------------------------------
        # Get job
        # -------------------------------------------------

        cursor.execute("""
            SELECT
                job_id,
                job_title,
                company,
                location,
                required_skills,
                engineering_field,
                experience_level,
                employment_type,
                salary_range
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
        # User's verified skills and comparison
        # -------------------------------------------------

        user_skills = get_user_skill_set(connection, user_id)
        required_skills = split_required_skills(job[4])
        matched_skills, missing_skills, match_score = compute_match(
            required_skills, user_skills
        )

        eligible = len(missing_skills) == 0

        return jsonify({
            "success": True,
            "user_id": user_id,
            "job": {
                "job_id": job[0],
                "title": job[1],
                "company": job[2],
                "location": job[3],
                "engineering_field": job[5],
                "experience": job[6],
                "job_type": job[7],
                "salary": job[8]
            },
            "analysis": {
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "match_score": match_score,
                "eligible": eligible
            }
        }), 200

    except Exception:

        return jsonify({
            "success": False,
            "message": "Failed to compute matching analysis"
        }), 500

    finally:

        if connection:
            connection.close()