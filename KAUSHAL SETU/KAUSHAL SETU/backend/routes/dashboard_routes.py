from flask import Blueprint, jsonify

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized
from services.matching_service import build_job_matches

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("", methods=["GET"])
def get_dashboard():
    """Aggregate the signed-in user's progress across every module."""
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()

        # ------------------------------------------------------------
        # Skills: verified profile
        # ------------------------------------------------------------
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT skill, assessment_score
            FROM verified_skills
            WHERE user_id = %s
            ORDER BY skill
            """,
            (user_id,),
        )
        skill_rows = cursor.fetchall()

        skills = [
            {
                "skill": row[0],
                "score": float(row[1]) if row[1] is not None else None,
            }
            for row in skill_rows
        ]

        # ------------------------------------------------------------
        # Assessments: attempts and best score
        # ------------------------------------------------------------
        cursor.execute(
            """
            SELECT
                skill,
                COUNT(*) AS attempts,
                MAX(score) AS best_score,
                BOOL_OR(passed = 1) AS passed
            FROM assessment_attempts
            WHERE user_id = %s
              AND skill NOT LIKE %s
            GROUP BY skill
            ORDER BY skill
            """,
            (user_id, 'reassessment:%'),
        )
        assessment_rows = cursor.fetchall()

        assessments = [
            {
                "assessment_id": row[0],
                "attempts": row[1],
                "best_score": float(row[2]) if row[2] is not None else None,
                "passed": bool(row[3]),
            }
            for row in assessment_rows
        ]

        # ------------------------------------------------------------
        # Learning: per-skill progress
        # ------------------------------------------------------------
        cursor.execute(
            """
            SELECT skill_name, progress_percentage, status
            FROM learning_progress
            WHERE user_id = %s
            ORDER BY skill_name
            """,
            (user_id,),
        )
        learning_rows = cursor.fetchall()

        learning = [
            {
                "skill": row[0],
                "progress": float(row[1]) if row[1] is not None else 0,
                "status": row[2],
            }
            for row in learning_rows
        ]

        # ------------------------------------------------------------
        # Target role
        # ------------------------------------------------------------
        cursor.execute(
            """
            SELECT
                cp.target_role_id,
                r.role_name
            FROM candidate_profiles cp
            LEFT JOIN roles r
                ON cp.target_role_id = r.role_id
            WHERE cp.user_id = %s
            LIMIT 1
            """,
            (user_id,),
        )
        target_row = cursor.fetchone()

        target_role = {
            "role_id": target_row[0],
            "role_name": target_row[1],
        } if target_row and target_row[0] else None

        # ------------------------------------------------------------
        # Applications
        # ------------------------------------------------------------
        cursor.execute(
            """
            SELECT application_status, COUNT(*)
            FROM applications
            WHERE user_id = %s
            GROUP BY application_status
            """,
            (user_id,),
        )
        app_rows = cursor.fetchall()

        applications = {
            "total": sum(row[1] for row in app_rows),
            "by_status": {row[0]: row[1] for row in app_rows},
        }

        cursor.close()

        # ------------------------------------------------------------
        # Job matches: top 5 by score
        # ------------------------------------------------------------
        matches = build_job_matches(connection, user_id)
        top_matches = matches[:5]

        # Average match score across jobs that require at least one skill.
        scored = [m["match_score"] for m in matches if m["required_skills"]]
        average_match = round(sum(scored) / len(scored), 2) if scored else 0

        # ------------------------------------------------------------
        # Next best action (deterministic guidance from real state)
        # ------------------------------------------------------------
        next_step = None

        if not skills:
            next_step = {
                "action": "add-skills",
                "title": "Add your first skills",
                "description": "Your profile has no verified skills yet. Add the skills you already have to unlock assessments and job matching.",
                "link": "/skills",
            }
        elif not assessments:
            next_step = {
                "action": "take-assessment",
                "title": "Take your first skill assessment",
                "description": "Verify one of your skills to strengthen your profile. Verified skills rank higher in job matching.",
                "link": "/assessment",
            }
        elif not target_role:
            next_step = {
                "action": "choose-career",
                "title": "Choose a career direction",
                "description": "Pick a target role so we can compute your skill gaps and build your learning path.",
                "link": "/career",
            }
        else:
            next_step = {
                "action": "apply",
                "title": "Explore your job matches",
                "description": "You have verified skills and a career direction. See which roles fit you best and close the remaining gaps.",
                "link": "/job-matching",
            }

        return jsonify(
            {
                "success": True,
                "user_id": user_id,
                "skills": {
                    "items": skills,
                    "total": len(skills),
                    "verified": sum(
                        1 for s in skills if s["score"] is not None and s["score"] >= 60
                    ),
                    "average_score": round(
                        sum(
                            s["score"] for s in skills if s["score"] is not None
                        ) / max(1, sum(1 for s in skills if s["score"] is not None)),
                        2,
                    ) if any(s["score"] is not None for s in skills) else 0,
                },
                "assessments": {
                    "items": assessments,
                    "total": len(assessments),
                    "passed": sum(1 for a in assessments if a["passed"]),
                },
                "learning": {
                    "items": learning,
                    "total": len(learning),
                    "in_progress": sum(
                        1 for l in learning if l["status"] == "In Progress"
                    ),
                    "completed": sum(
                        1 for l in learning if l["status"] == "Completed"
                    ),
                    "average_progress": round(
                        sum(l["progress"] for l in learning) / max(1, len(learning)),
                        2,
                    ) if learning else 0,
                },
                "target_role": target_role,
                "applications": applications,
                "job_matches": {
                    "items": top_matches,
                    "average_score": average_match,
                    "total": len(matches),
                },
                "next_step": next_step,
            }
        ), 200

    except Exception:
        return jsonify(
            {
                "success": False,
                "message": "Failed to load dashboard",
            }
        ), 500

    finally:
        if connection:
            connection.close()
