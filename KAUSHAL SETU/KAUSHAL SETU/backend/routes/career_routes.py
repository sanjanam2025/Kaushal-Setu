from flask import Blueprint, jsonify, request

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized
from services.matching_service import compute_match, get_user_skill_set, split_required_skills


career_bp = Blueprint(
    "career",
    __name__,
    url_prefix="/api/career"
)


@career_bp.route("/discover", methods=["POST"])
def discover_career():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json() or {}
    engineering_field = data.get("engineering_field")

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        if engineering_field:
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
                WHERE LOWER(engineering_field) = LOWER(%s)
                ORDER BY id
            """, (engineering_field,))
        else:
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

        rows = cursor.fetchall()
        cursor.close()

        # Annotate every career with how well the user already fits it.
        user_skills = get_user_skill_set(connection, user_id)

        careers = []

        for row in rows:
            required_skills = split_required_skills(row[5])
            matched, missing, score = compute_match(required_skills, user_skills)

            careers.append({
                "id": row[0],
                "job_id": row[1],
                "job_title": row[2],
                "company": row[3],
                "location": row[4],
                "required_skills": required_skills,
                "matched_skills": matched,
                "missing_skills": missing,
                "match_score": score,
                "experience_level": row[6],
                "employment_type": row[7],
                "salary_range": row[8],
                "engineering_field": row[9]
            })

        careers.sort(key=lambda item: item["match_score"], reverse=True)

        return jsonify({
            "success": True,
            "user_id": user_id,
            "engineering_field": engineering_field,
            "careers": careers,
            "total": len(careers)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to discover careers"
        }), 500

    finally:
        if connection:
            connection.close()


@career_bp.route("/recommendations", methods=["GET"])
def get_career_recommendations():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        user_skills = get_user_skill_set(connection, user_id)

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

        rows = cursor.fetchall()
        cursor.close()

        recommendations = []

        for row in rows:
            required_skills = split_required_skills(row[5])
            matched, missing, score = compute_match(required_skills, user_skills)

            recommendations.append({
                "id": row[0],
                "job_id": row[1],
                "job_title": row[2],
                "company": row[3],
                "location": row[4],
                "required_skills": required_skills,
                "matched_skills": matched,
                "missing_skills": missing,
                "match_score": score,
                "experience_level": row[6],
                "employment_type": row[7],
                "salary_range": row[8],
                "engineering_field": row[9]
            })

        recommendations.sort(
            key=lambda item: item["match_score"],
            reverse=True
        )

        return jsonify({
            "success": True,
            "user_id": user_id,
            "recommendations": recommendations,
            "total": len(recommendations)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load career recommendations"
        }), 500

    finally:
        if connection:
            connection.close()


@career_bp.route("/target-role", methods=["POST"])
def set_target_role():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    data = request.get_json() or {}
    target_role = data.get("target_role")

    if not target_role:
        return jsonify({
            "success": False,
            "message": "target_role is required"
        }), 400

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # First try the exact role name.
        cursor.execute("""
            SELECT role_id, role_name
            FROM roles
            WHERE LOWER(role_name) = LOWER(%s)
            LIMIT 1
        """, (target_role,))

        role = cursor.fetchone()

        # Frontend uses "Software Engineer",
        # while the existing roles table uses "Software Developer".
        if not role and target_role.strip().lower() == "software engineer":
            cursor.execute("""
                SELECT role_id, role_name
                FROM roles
                WHERE LOWER(role_name) = 'software developer'
                LIMIT 1
            """)

            role = cursor.fetchone()

        if not role:
            return jsonify({
                "success": False,
                "message": "Target role not found"
            }), 404

        role_id = role[0]
        stored_role_name = role[1]

        # Check whether the candidate already has a profile.
        cursor.execute("""
            SELECT id
            FROM candidate_profiles
            WHERE user_id = %s
            LIMIT 1
        """, (user_id,))

        profile = cursor.fetchone()

        if profile:
            cursor.execute("""
                UPDATE candidate_profiles
                SET target_role_id = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s
            """, (role_id, user_id))
        else:
            cursor.execute("""
                INSERT INTO candidate_profiles
                    (user_id, target_role_id)
                VALUES
                    (%s, %s)
            """, (user_id, role_id))

        connection.commit()

        return jsonify({
            "success": True,
            "user_id": user_id,
            "target_role": target_role,
            "target_role_id": role_id,
            "stored_role_name": stored_role_name,
            "message": "Target role saved successfully"
        }), 200

    except Exception:
        if connection:
            connection.rollback()

        return jsonify({
            "success": False,
            "message": "Failed to save target role"
        }), 500

    finally:
        if connection:
            connection.close()


@career_bp.route("/target-role", methods=["GET"])
def get_target_role():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                cp.target_role_id,
                r.role_name
            FROM candidate_profiles cp
            LEFT JOIN roles r
                ON cp.target_role_id = r.role_id
            WHERE cp.user_id = %s
            LIMIT 1
        """, (user_id,))

        row = cursor.fetchone()

        return jsonify({
            "success": True,
            "user_id": user_id,
            "target_role_id": row[0] if row else None,
            "target_role": row[1] if row else None
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load target role"
        }), 500

    finally:
        if connection:
            connection.close()


# ---------------------------------------------------------
# GET AVAILABLE ENGINEERING FIELDS (for career explorer)
# GET /api/career/fields
# ---------------------------------------------------------
@career_bp.route("/fields", methods=["GET"])
def get_engineering_fields():
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                engineering_field,
                COUNT(*) AS openings,
                COUNT(DISTINCT company) AS companies
            FROM job_postings
            WHERE engineering_field IS NOT NULL
            GROUP BY engineering_field
            ORDER BY openings DESC
        """)

        rows = cursor.fetchall()
        cursor.close()

        fields = [
            {
                "field": row[0],
                "openings": row[1],
                "companies": row[2]
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "fields": fields,
            "total": len(fields)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load engineering fields"
        }), 500

    finally:
        if connection:
            connection.close()