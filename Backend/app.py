from flask import Flask, request
import os
import psycopg2
from werkzeug.security import generate_password_hash

app = Flask(__name__)


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def init_db():
    # Tables are already created in Supabase.
    # Do not recreate or modify them here.
    pass


# ============================================================
# HOME API
# ============================================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "Hi Roy your, KaushalSetu Backend is Running!"
    }


# ============================================================
# REGISTRATION API
# ============================================================

@app.post("/api/register")
def register():

    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    hashed_password = generate_password_hash(password)

    if not name or not email or not password:
        return {
            "success": False,
            "message": "Name, email and password are required"
        }, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (name, email, hashed_password)
        )

        user_id = cursor.fetchone()[0]

        conn.commit()

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "user_id": user_id,
                "name": name,
                "email": email
            }
        }, 201

    except psycopg2.IntegrityError:

        conn.rollback()

        return {
            "success": False,
            "message": "Email already registered"
        }, 409

    finally:
        conn.close()




# ============================================================
# JOBS API
# ============================================================

@app.get("/api/jobs")
def get_jobs():

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

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
            ORDER BY id
        """)

        rows = cursor.fetchall()

        jobs = []

        for row in rows:
            jobs.append({
                "id": row[0],
                "job_id": row[1],
                "title": row[2],
                "company": row[3],
                "location": row[4],
                "required_skills": [
                    skill.strip()
                    for skill in row[5].split(",")
                ] if row[5] else [],
                "experience": row[6],
                "job_type": row[7],
                "salary": row[8],
                "source": row[9],
                "posted_date": str(row[10]) if row[10] else None,
                "engineering_field": row[11]
            })

        return {
            "success": True,
            "jobs": jobs,
            "total_jobs": len(jobs)
        }, 200

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:

        if conn:
            conn.close()


# ============================================================
# SINGLE JOB API
# ============================================================
@app.get("/api/jobs/<job_id>")
def get_job(job_id):

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

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
            return {
                "success": False,
                "message": "Job not found"
            }, 404

        job = {
            "id": row[0],
            "job_id": row[1],
            "title": row[2],
            "company": row[3],
            "location": row[4],
            "required_skills": [
                skill.strip()
                for skill in row[5].split(",")
            ] if row[5] else [],
            "experience": row[6],
            "job_type": row[7],
            "salary": row[8],
            "source": row[9],
            "posted_date": str(row[10]) if row[10] else None,
            "engineering_field": row[11]
        }

        return {
            "success": True,
            "job": job
        }, 200

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:

        if conn:
            conn.close()


# ============================================================
# MOCK SKILLS DATA
# ============================================================

SKILLS = [
    {
        "skill_id": "SK001",
        "skill_name": "Electrical Wiring",
        "category": "Electrical",
        "level": "Basic"
    },
    {
        "skill_id": "SK002",
        "skill_name": "Basic Maintenance",
        "category": "Electrical",
        "level": "Intermediate"
    },
    {
        "skill_id": "SK003",
        "skill_name": "Industrial Safety",
        "category": "Electrical",
        "level": "Intermediate"
    },
    {
        "skill_id": "SK004",
        "skill_name": "PLC Basics",
        "category": "Automation",
        "level": "Basic"
    },
    {
        "skill_id": "SK005",
        "skill_name": "Solar Installation",
        "category": "Renewable Energy",
        "level": "Basic"
    }
]


# ============================================================
# SKILLS API
# ============================================================

@app.get("/api/skills")
def get_skills():

    return {
        "success": True,
        "skills": SKILLS
    }


# ============================================================
# MOCK LEARNING DATA
# ============================================================

LEARNING_RESOURCES = [
    {
        "resource_id": "LR001",
        "skill": "Industrial Safety",
        "title": "Industrial Electrical Safety Fundamentals",
        "provider": "KaushalSetu Demo Learning",
        "level": "Intermediate",
        "resource_type": "Course",
        "url": "/demo/learning/LR001",
        "duration": "4 weeks"
    },
    {
        "resource_id": "LR002",
        "skill": "PLC Basics",
        "title": "PLC Fundamentals",
        "provider": "KaushalSetu Demo Learning",
        "level": "Basic",
        "resource_type": "Training",
        "url": "/demo/learning/LR002",
        "duration": "6 weeks"
    },
    {
        "resource_id": "LR003",
        "skill": "Solar Installation",
        "title": "Solar Installation Basics",
        "provider": "KaushalSetu Demo Learning",
        "level": "Basic",
        "resource_type": "Course",
        "url": "/demo/learning/LR003",
        "duration": "5 weeks"
    },
    {
        "resource_id": "LR004",
        "skill": "Electrical Wiring",
        "title": "Electrical Wiring Fundamentals",
        "provider": "KaushalSetu Demo Learning",
        "level": "Basic",
        "resource_type": "Course",
        "url": "/demo/learning/LR004",
        "duration": "5 weeks"
    },
    {
        "resource_id": "LR005",
        "skill": "Basic Maintenance",
        "title": "Electrical Equipment Maintenance",
        "provider": "KaushalSetu Demo Learning",
        "level": "Intermediate",
        "resource_type": "Training",
        "url": "/demo/learning/LR005",
        "duration": "6 weeks"
    }
]


# ============================================================
# LEARNING API
# ============================================================

@app.get("/api/learning")
def get_learning():

    return {
        "success": True,
        "resources": LEARNING_RESOURCES
    }


# ============================================================
# SKILL MATCHING API
# ============================================================

@app.post("/api/match-jobs")
def match_jobs():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")

    if user_id is None:
        return {
            "success": False,
            "message": "user_id is required"
        }, 400

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get verified skills from Supabase
        cursor.execute("""
            SELECT skill
            FROM verified_skills
            WHERE user_id = %s
        """, (user_id,))

        verified_rows = cursor.fetchall()
        verified_skills = [row[0] for row in verified_rows]

        verified_skills_set = set(verified_skills)

        # Get all jobs from Supabase
        cursor.execute("""
            SELECT
                job_id,
                job_title,
                company,
                location,
                required_skills,
                engineering_field
            FROM job_postings
            ORDER BY id
        """)

        job_rows = cursor.fetchall()

        results = []

        for row in job_rows:

            required_skills = [
                skill.strip()
                for skill in row[4].split(",")
            ] if row[4] else []

            matched_skills = [
                skill
                for skill in required_skills
                if skill in verified_skills_set
            ]

            missing_skills = [
                skill
                for skill in required_skills
                if skill not in verified_skills_set
            ]

            match_percentage = (
                round(
                    (len(matched_skills) / len(required_skills)) * 100,
                    2
                )
                if required_skills else 0
            )

            results.append({
                "job_id": row[0],
                "title": row[1],
                "company": row[2],
                "location": row[3],
                "engineering_field": row[5],
                "match_percentage": match_percentage,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "eligible": len(missing_skills) == 0
            })

        # Highest match first
        results.sort(
            key=lambda x: x["match_percentage"],
            reverse=True
        )

        return {
            "success": True,
            "user_id": user_id,
            "verified_skills": verified_skills,
            "results": results
        }, 200

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:

        if conn:
            conn.close()

   


# ============================================================
# LEARNING RECOMMENDATION API
# ============================================================

@app.post("/api/recommend-learning")
def recommend_learning():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    missing_skills = data.get("missing_skills", [])

    if user_id is None:
        return {
            "success": False,
            "message": "user_id is required"
        }, 400

    if not isinstance(missing_skills, list):

        return {
            "success": False,
            "message": "missing_skills must be a list"
        }, 400

    recommendations = []

    for missing_skill in missing_skills:

        matching_resources = [
            resource
            for resource in LEARNING_RESOURCES
            if resource["skill"].lower() == str(missing_skill).lower()
        ]

        recommendations.append({
            "skill": missing_skill,
            "resources": matching_resources
        })

    return {
        "success": True,
        "user_id": user_id,
        "recommendations": recommendations
    }
# ============================================================
# LABOUR MARKET JOB POSTINGS API
# ============================================================

@app.get("/api/labour-market/job-postings")
def get_labour_market_job_postings():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                job_title,
                company,
                location,
                required_skills,
                experience_level,
                employment_type,
                salary_range,
                source,
                posted_date,
                created_at
            FROM job_postings
            ORDER BY posted_date DESC
        """)

        rows = cursor.fetchall()

        job_postings = []

        for row in rows:
            job_postings.append({
                "id": row[0],
                "job_title": row[1],
                "company": row[2],
                "location": row[3],
                "required_skills": [
                    skill.strip()
                    for skill in row[4].split(",")
                ],
                "experience_level": row[5],
                "employment_type": row[6],
                "salary_range": row[7],
                "source": row[8],
                "posted_date": str(row[9]) if row[9] else None,
                "created_at": str(row[10]) if row[10] else None
            })

        return {
            "success": True,
            "count": len(job_postings),
            "job_postings": job_postings
        }

    finally:
        conn.close()

# ============================================================
# LABOUR MARKET SKILL DEMAND API
# ============================================================

@app.get("/api/labour-market/skill-demand")
def get_skill_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT required_skills
            FROM job_postings
        """)

        rows = cursor.fetchall()

        skill_counts = {}

        for row in rows:
            required_skills = row[0]

            if not required_skills:
                continue

            # Convert stored comma-separated skills into a list
            if isinstance(required_skills, str):
                skills = required_skills.split(",")
            else:
                skills = required_skills

            for skill in skills:
                skill = str(skill).strip()

                if skill:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1

        demand = [
            {
                "skill": skill,
                "job_postings_count": count
            }
            for skill, count in skill_counts.items()
        ]

        # Highest demand first
        demand.sort(
            key=lambda x: x["job_postings_count"],
            reverse=True
        )

        return {
            "success": True,
            "total_job_postings": len(rows),
            "skill_demand": demand
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET ROLE DEMAND API
# ============================================================

@app.get("/api/labour-market/role-demand")
def get_role_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT job_title, COUNT(*) AS job_postings_count
            FROM job_postings
            GROUP BY job_title
            ORDER BY job_postings_count DESC
        """)

        rows = cursor.fetchall()

        role_demand = []

        for row in rows:
            role_demand.append({
                "job_title": row[0],
                "job_postings_count": row[1]
            })

        return {
            "role_demand": role_demand,
            "success": True
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET HIGH-DEMAND SKILLS API
# ============================================================

@app.get("/api/labour-market/high-demand-skills")
def get_high_demand_skills():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT required_skills
            FROM job_postings
        """)

        rows = cursor.fetchall()

        skill_counts = {}

        for row in rows:
            required_skills = row[0]

            if not required_skills:
                continue

            skills = required_skills.split(",")

            for skill in skills:
                skill = skill.strip()

                if skill:
                    skill_counts[skill] = skill_counts.get(skill, 0) + 1

        high_demand_skills = [
            {
                "skill": skill,
                "job_postings_count": count
            }
            for skill, count in skill_counts.items()
        ]

        high_demand_skills.sort(
            key=lambda x: x["job_postings_count"],
            reverse=True
        )

        return {
            "high_demand_skills": high_demand_skills,
            "success": True
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET LOCATION DEMAND API
# ============================================================

@app.get("/api/labour-market/location-demand")
def get_location_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT location, COUNT(*) AS job_postings_count
            FROM job_postings
            WHERE location IS NOT NULL
              AND location <> ''
            GROUP BY location
            ORDER BY job_postings_count DESC
        """)

        rows = cursor.fetchall()

        location_demand = [
            {
                "location": row[0],
                "job_postings_count": row[1]
            }
            for row in rows
        ]

        return {
            "success": True,
            "location_demand": location_demand
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET EXPERIENCE DEMAND API
# ============================================================

@app.get("/api/labour-market/experience-demand")
def get_experience_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT experience_level, COUNT(*) AS job_postings_count
            FROM job_postings
            WHERE experience_level IS NOT NULL
              AND experience_level <> ''
            GROUP BY experience_level
            ORDER BY job_postings_count DESC
        """)

        rows = cursor.fetchall()

        experience_demand = [
            {
                "experience_level": row[0],
                "job_postings_count": row[1]
            }
            for row in rows
        ]

        return {
            "success": True,
            "experience_demand": experience_demand
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET EMPLOYMENT TYPE DEMAND API
# ============================================================

@app.get("/api/labour-market/employment-type-demand")
def get_employment_type_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT employment_type, COUNT(*) AS job_postings_count
            FROM job_postings
            WHERE employment_type IS NOT NULL
              AND employment_type <> ''
            GROUP BY employment_type
            ORDER BY job_postings_count DESC
        """)

        rows = cursor.fetchall()

        employment_type_demand = [
            {
                "employment_type": row[0],
                "job_postings_count": row[1]
            }
            for row in rows
        ]

        return {
            "success": True,
            "employment_type_demand": employment_type_demand
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

@app.get("/api/labour-market/sector-demand")
def get_sector_demand():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                sector,
                COUNT(*) AS job_count
            FROM job_postings
            WHERE sector IS NOT NULL
            GROUP BY sector
            ORDER BY job_count DESC
        """)

        rows = cursor.fetchall()

        sector_demand = [
            {
                "sector": row[0],
                "job_count": row[1]
            }
            for row in rows
        ]

        return {
            "sector_demand": sector_demand,
            "success": True
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# LABOUR MARKET INDUSTRY TRENDS API
# ============================================================

@app.get("/api/labour-market/industry-trends")
def get_industry_trends():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                sector,
                trend_name,
                trend_type,
                growth_level
            FROM industry_trends
            ORDER BY id
        """)

        rows = cursor.fetchall()

        industry_trends = [
            {
                "sector": row[0],
                "trend_name": row[1],
                "trend_type": row[2],
                "growth_level": row[3]
            }
            for row in rows
        ]

        cursor.close()

        return {
            "industry_trends": industry_trends,
            "success": True
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

@app.get("/api/labour-market/employer-requirements")
def get_employer_requirements():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM employer_requirements
            ORDER BY id
        """)

        rows = cursor.fetchall()

        columns = [desc[0] for desc in cursor.description]

        employer_requirements = [
            dict(zip(columns, row))
            for row in rows
        ]

        return {
            "employer_requirements": employer_requirements,
            "success": True
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

@app.get("/api/labour-market/overview")
def get_labour_market_overview():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Total job postings
        cursor.execute("""
            SELECT COUNT(*)
            FROM job_postings
        """)
        total_job_postings = cursor.fetchone()[0]

        # Demand by sector
        cursor.execute("""
            SELECT sector, COUNT(*) AS job_count
            FROM job_postings
            WHERE sector IS NOT NULL
            GROUP BY sector
            ORDER BY job_count DESC
        """)
        sector_demand = [
            {
                "sector": row[0],
                "job_count": row[1]
            }
            for row in cursor.fetchall()
        ]

        # Demand by location
        cursor.execute("""
            SELECT location, COUNT(*) AS job_count
            FROM job_postings
            WHERE location IS NOT NULL
            GROUP BY location
            ORDER BY job_count DESC
        """)
        location_demand = [
            {
                "location": row[0],
                "job_count": row[1]
            }
            for row in cursor.fetchall()
        ]

        # Demand by experience level
        cursor.execute("""
            SELECT experience_level, COUNT(*) AS job_count
            FROM job_postings
            WHERE experience_level IS NOT NULL
            GROUP BY experience_level
            ORDER BY job_count DESC
        """)
        experience_demand = [
            {
                "experience_level": row[0],
                "job_count": row[1]
            }
            for row in cursor.fetchall()
        ]

        # Demand by employment type
        cursor.execute("""
            SELECT employment_type, COUNT(*) AS job_count
            FROM job_postings
            WHERE employment_type IS NOT NULL
            GROUP BY employment_type
            ORDER BY job_count DESC
        """)
        employment_type_demand = [
            {
                "employment_type": row[0],
                "job_count": row[1]
            }
            for row in cursor.fetchall()
        ]

        return {
            "success": True,
            "total_job_postings": total_job_postings,
            "sector_demand": sector_demand,
            "location_demand": location_demand,
            "experience_demand": experience_demand,
            "employment_type_demand": employment_type_demand
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

@app.get("/api/labour-market/insights")
def get_labour_market_insights():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Highest-demand skill
        cursor.execute("""
            SELECT skill, COUNT(*) AS job_postings_count
            FROM (
                SELECT TRIM(skill) AS skill
                FROM job_postings,
                unnest(string_to_array(required_skills, ',')) AS skill
            ) AS skills
            GROUP BY skill
            ORDER BY job_postings_count DESC
            LIMIT 1
        """)
        skill = cursor.fetchone()

        # 2. Highest-demand sector
        cursor.execute("""
            SELECT sector, COUNT(*) AS job_count
            FROM job_postings
            WHERE sector IS NOT NULL
            GROUP BY sector
            ORDER BY job_count DESC
            LIMIT 1
        """)
        sector = cursor.fetchone()

        # 3. Highest-demand location
        cursor.execute("""
            SELECT location, COUNT(*) AS job_count
            FROM job_postings
            WHERE location IS NOT NULL
            GROUP BY location
            ORDER BY job_count DESC
            LIMIT 1
        """)
        location = cursor.fetchone()

        # 4. Most common experience level
        cursor.execute("""
            SELECT experience_level, COUNT(*) AS job_count
            FROM job_postings
            WHERE experience_level IS NOT NULL
            GROUP BY experience_level
            ORDER BY job_count DESC
            LIMIT 1
        """)
        experience = cursor.fetchone()

        # 5. Most common employment type
        cursor.execute("""
            SELECT employment_type, COUNT(*) AS job_count
            FROM job_postings
            WHERE employment_type IS NOT NULL
            GROUP BY employment_type
            ORDER BY job_count DESC
            LIMIT 1
        """)
        employment = cursor.fetchone()

        return {
            "success": True,
            "insights": {
                "highest_demand_skill": {
                    "skill": skill[0] if skill else None,
                    "job_postings_count": skill[1] if skill else 0
                },
                "highest_demand_sector": {
                    "sector": sector[0] if sector else None,
                    "job_count": sector[1] if sector else 0
                },
                "highest_demand_location": {
                    "location": location[0] if location else None,
                    "job_count": location[1] if location else 0
                },
                "most_common_experience_level": {
                    "experience_level": experience[0] if experience else None,
                    "job_count": experience[1] if experience else 0
                },
                "most_common_employment_type": {
                    "employment_type": employment[0] if employment else None,
                    "job_count": employment[1] if employment else 0
                }
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# COURSE MAPPINGS API
# ============================================================

@app.get("/api/curriculum/course-mappings")
def get_course_mappings():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                course_name,
                qualification,
                skill,
                industry_demand,
                curriculum_status
            FROM course_mappings
            ORDER BY id
        """)

        rows = cursor.fetchall()

        course_mappings = []

        for row in rows:
            course_mappings.append({
                "id": row[0],
                "course_name": row[1],
                "qualification": row[2],
                "skill": row[3],
                "industry_demand": row[4],
                "curriculum_status": row[5]
            })

        return {
            "success": True,
            "course_mappings": course_mappings,
            "total_mappings": len(course_mappings)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

@app.get("/api/curriculum/recommendations")
def get_curriculum_recommendations():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                course_name,
                qualification,
                skill,
                industry_demand,
                curriculum_status
            FROM course_mappings
            WHERE industry_demand = 'High'
              AND curriculum_status != 'Current'
            ORDER BY id
        """)

        rows = cursor.fetchall()

        recommendations = []

        for row in rows:
            recommendations.append({
                "id": row[0],
                "course_name": row[1],
                "qualification": row[2],
                "skill": row[3],
                "industry_demand": row[4],
                "curriculum_status": row[5],
                "recommendation": "Review curriculum based on high industry demand"
            })

        return {
            "success": True,
            "recommendations": recommendations,
            "total_recommendations": len(recommendations)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# OBSOLETE COURSE DETECTION API
# ============================================================

@app.get("/api/curriculum/obsolete-courses")
def get_obsolete_courses():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                course_name,
                qualification,
                skill,
                industry_demand,
                curriculum_status
            FROM course_mappings
            WHERE curriculum_status = 'Obsolete'
               OR industry_demand = 'Low'
            ORDER BY id
        """)

        rows = cursor.fetchall()

        obsolete_courses = []

        for row in rows:
            reason = []

            if row[5] == "Obsolete":
                reason.append("Curriculum is obsolete")

            if row[4] == "Low":
                reason.append("Low industry demand")

            obsolete_courses.append({
                "id": row[0],
                "course_name": row[1],
                "qualification": row[2],
                "skill": row[3],
                "industry_demand": row[4],
                "curriculum_status": row[5],
                "reason": reason
            })

        return {
            "success": True,
            "obsolete_courses": obsolete_courses,
            "total_obsolete_courses": len(obsolete_courses)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# TRAINER CAPACITY API
# ============================================================

@app.get("/api/training/trainer-capacity")
def get_trainer_capacity():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                district,
                skill,
                required_trainers,
                available_trainers,
                trainer_gap
            FROM trainer_capacity
            ORDER BY id
        """)

        rows = cursor.fetchall()

        trainer_capacity = []

        for row in rows:
            trainer_capacity.append({
                "id": row[0],
                "district": row[1],
                "skill": row[2],
                "required_trainers": row[3],
                "available_trainers": row[4],
                "trainer_gap": row[5]
            })

        return {
            "success": True,
            "trainer_capacity": trainer_capacity,
            "total_records": len(trainer_capacity)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# EQUIPMENT CAPACITY API
# ============================================================

@app.get("/api/training/equipment-capacity")
def get_equipment_capacity():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                district,
                skill,
                required_equipment,
                available_equipment,
                equipment_gap
            FROM equipment_capacity
            ORDER BY id
        """)

        rows = cursor.fetchall()

        equipment_capacity = []

        for row in rows:
            equipment_capacity.append({
                "id": row[0],
                "district": row[1],
                "skill": row[2],
                "required_equipment": row[3],
                "available_equipment": row[4],
                "equipment_gap": row[5]
            })

        return {
            "success": True,
            "equipment_capacity": equipment_capacity,
            "total_records": len(equipment_capacity)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# DISTRICT TRAINING PLANS API
# ============================================================

@app.get("/api/training/district-plans")
def get_district_training_plans():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                district,
                skill,
                required_trainers,
                available_trainers,
                trainer_gap,
                required_equipment,
                available_equipment,
                equipment_gap,
                recommended_action
            FROM district_training_plans
            ORDER BY id
        """)

        rows = cursor.fetchall()

        district_plans = []

        for row in rows:
            district_plans.append({
                "id": row[0],
                "district": row[1],
                "skill": row[2],
                "required_trainers": row[3],
                "available_trainers": row[4],
                "trainer_gap": row[5],
                "required_equipment": row[6],
                "available_equipment": row[7],
                "equipment_gap": row[8],
                "recommended_action": row[9]
            })

        return {
            "success": True,
            "district_training_plans": district_plans,
            "total_plans": len(district_plans)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# COMBINED DISTRICT TRAINING CAPACITY API
# ============================================================

@app.get("/api/training/overview")
def get_training_overview():

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                district,
                skill,
                required_trainers,
                available_trainers,
                trainer_gap,
                required_equipment,
                available_equipment,
                equipment_gap,
                recommended_action
            FROM district_training_plans
            ORDER BY district, skill
        """)

        rows = cursor.fetchall()

        overview = []

        for row in rows:
            overview.append({
                "district": row[0],
                "skill": row[1],
                "required_trainers": row[2],
                "available_trainers": row[3],
                "trainer_gap": row[4],
                "required_equipment": row[5],
                "available_equipment": row[6],
                "equipment_gap": row[7],
                "recommended_action": row[8]
            })

        return {
            "success": True,
            "training_overview": overview,
            "total_records": len(overview)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# CREATE JOB APPLICATION
# ============================================================

@app.post("/api/applications")
def create_application():
    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    job_id = data.get("job_id")

    if not user_id or not job_id:
        return {
            "success": False,
            "message": "user_id and job_id are required"
        }, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO applications
                (user_id, job_id, application_status)
            VALUES (%s, %s, %s)
            RETURNING id, user_id, job_id, application_status,
                      applied_date, updated_at
        """, (
            user_id,
            job_id,
            "Applied"
        ))

        row = cursor.fetchone()
        conn.commit()

        return {
            "success": True,
            "message": "Job application submitted successfully",
            "application": {
                "id": row[0],
                "user_id": row[1],
                "job_id": row[2],
                "application_status": row[3],
                "applied_date": row[4],
                "updated_at": row[5]
            }
        }, 201

    except Exception as e:
        conn.rollback()
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# GET USER APPLICATIONS
# ============================================================

@app.get("/api/applications/<int:user_id>")
def get_user_applications(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                user_id,
                job_id,
                application_status,
                applied_date,
                updated_at
            FROM applications
            WHERE user_id = %s
            ORDER BY applied_date DESC
        """, (user_id,))

        rows = cursor.fetchall()

        applications = []

        for row in rows:
            applications.append({
                "id": row[0],
                "user_id": row[1],
                "job_id": row[2],
                "application_status": row[3],
                "applied_date": row[4],
                "updated_at": row[5]
            })

        return {
            "success": True,
            "user_id": user_id,
            "applications": applications,
            "total_applications": len(applications)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# UPDATE APPLICATION STATUS
# ============================================================

@app.put("/api/applications/<int:application_id>")
def update_application_status(application_id):

    data = request.get_json(silent=True) or {}
    application_status = data.get("application_status")

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Selected",
        "Rejected"
    ]

    if application_status not in allowed_statuses:
        return {
            "success": False,
            "message": "Invalid application status"
        }, 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE applications
            SET
                application_status = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING
                id,
                user_id,
                job_id,
                application_status,
                applied_date,
                updated_at
        """, (application_status, application_id))

        row = cursor.fetchone()

        if row is None:
            conn.rollback()
            return {
                "success": False,
                "message": "Application not found"
            }, 404

        conn.commit()

        return {
            "success": True,
            "message": "Application status updated successfully",
            "application": {
                "id": row[0],
                "user_id": row[1],
                "job_id": row[2],
                "application_status": row[3],
                "applied_date": row[4],
                "updated_at": row[5]
            }
        }

    except Exception as e:
        conn.rollback()
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

@app.get("/api/placement-outcomes")
def get_placement_outcomes():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                placement_status,
                joining_date,
                salary_offered
            FROM placement_outcomes
            ORDER BY id
        """)

        rows = cursor.fetchall()

        placement_outcomes = []

        for row in rows:
            placement_outcomes.append({
                "id": row[0],
                "application_id": row[1],
                "user_id": row[2],
                "job_id": row[3],
                "placement_status": row[4],
                "joining_date": row[5],
                "salary_offered": row[6]
            })

        return {
            "success": True,
            "placement_outcomes": placement_outcomes,
            "total_records": len(placement_outcomes)
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        conn.close()

# ============================================================
# EMPLOYER FEEDBACK API
# ============================================================

@app.get("/api/employer-feedback")
def get_employer_feedback():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
                application_id,
                user_id,
                job_id,
                feedback,
                rating,
                created_at
            FROM employer_feedback
            ORDER BY id
        """)

        rows = cursor.fetchall()

        employer_feedback = []

        for row in rows:
            employer_feedback.append({
                "id": row[0],
                "application_id": row[1],
                "user_id": row[2],
                "job_id": row[3],
                "feedback": row[4],
                "rating": row[5],
                "created_at": str(row[6]) if row[6] else None
            })

        return {
            "success": True,
            "employer_feedback": employer_feedback,
            "total_records": len(employer_feedback)
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# EMPLOYMENT FEEDBACK SUMMARY API
# ============================================================

@app.get("/api/employment-feedback/summary")
def get_employment_feedback_summary():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Total applications
        cursor.execute("""
            SELECT COUNT(*)
            FROM applications
        """)
        total_applications = cursor.fetchone()[0]

        # Total placed candidates
        cursor.execute("""
            SELECT COUNT(*)
            FROM placement_outcomes
            WHERE placement_status = 'Placed'
        """)
        total_placed = cursor.fetchone()[0]

        # Average employer rating
        cursor.execute("""
            SELECT AVG(rating)
            FROM employer_feedback
        """)
        average_rating = cursor.fetchone()[0]

        # Total employer feedback records
        cursor.execute("""
            SELECT COUNT(*)
            FROM employer_feedback
        """)
        total_feedback = cursor.fetchone()[0]

        # Placement rate
        if total_applications > 0:
            placement_rate = (total_placed / total_applications) * 100
        else:
            placement_rate = 0

        return {
            "success": True,
            "summary": {
                "total_applications": total_applications,
                "total_placed": total_placed,
                "placement_rate": round(placement_rate, 2),
                "total_employer_feedback": total_feedback,
                "average_employer_rating": round(float(average_rating), 2)
                if average_rating is not None else 0
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# ENGINEERING FIELDS API
# ============================================================

@app.get("/api/engineering-fields")
def get_engineering_fields():
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, field_name
            FROM engineering_fields
            ORDER BY id
        """)

        rows = cursor.fetchall()

        fields = []

        for row in rows:
            fields.append({
                "id": row[0],
                "field_name": row[1]
            })

        return {
            "success": True,
            "engineering_fields": fields,
            "total_fields": len(fields)
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

# ============================================================
# JOBS BY ENGINEERING FIELD API
# ============================================================

@app.get("/api/jobs/engineering-field/<path:field_name>")
def get_jobs_by_engineering_field(field_name):

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                id,
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
            WHERE LOWER(engineering_field) = LOWER(%s)
            ORDER BY id
        """, (field_name,))

        rows = cursor.fetchall()

        jobs = []

        for row in rows:
            jobs.append({
                "id": row[0],
                "job_title": row[1],
                "company": row[2],
                "location": row[3],
                "required_skills": [
                    skill.strip()
                    for skill in row[4].split(",")
                ] if row[4] else [],
                "experience_level": row[5],
                "employment_type": row[6],
                "salary_range": row[7],
                "source": row[8],
                "posted_date": str(row[9]) if row[9] else None,
                "engineering_field": row[10]
            })

        return {
            "success": True,
            "engineering_field": field_name,
            "jobs": jobs,
            "total_jobs": len(jobs)
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if conn:
            conn.close()

@app.post("/api/match-jobs/engineering-field")
def match_jobs_by_engineering_field():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    engineering_field = data.get("engineering_field")

    if not user_id or not engineering_field:
        return {
            "success": False,
            "message": "user_id and engineering_field are required"
        }, 400

    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get user's verified skills
        cursor.execute("""
            SELECT skill
            FROM verified_skills
            WHERE user_id = %s
        """, (user_id,))

        verified_rows = cursor.fetchall()
        verified_skills = [row[0] for row in verified_rows]

        # Get jobs from selected engineering field
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

        job_rows = cursor.fetchall()

        results = []

        for row in job_rows:

            required_skills = [
                skill.strip()
                for skill in row[5].split(",")
            ] if row[5] else []

            matched_skills = [
                skill for skill in required_skills
                if skill in verified_skills
            ]

            missing_skills = [
                skill for skill in required_skills
                if skill not in verified_skills
            ]

            match_percentage = (
                round((len(matched_skills) / len(required_skills)) * 100, 2)
                if required_skills else 0
            )

            results.append({
                "job_id": row[1],
                "title": row[2],
                "company": row[3],
                "location": row[4],
                "required_skills": required_skills,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "match_percentage": match_percentage,
                "eligible": match_percentage >= 100,
                "engineering_field": row[9]
            })

        return {
            "success": True,
            "user_id": user_id,
            "engineering_field": engineering_field,
            "verified_skills": verified_skills,
            "results": results
        }, 200

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:

        if conn:
            conn.close()


# ============================================================
# ASSESSMENT QUESTIONS
# Correct answers remain ONLY on backend
# ============================================================

ASSESSMENTS = {

    "Industrial Safety": [

        {
            "question_id": "IS001",
            "question": "What is the main purpose of workplace safety procedures?",
            "options": [
                "To reduce workplace risks",
                "To increase working hours",
                "To avoid training",
                "To reduce communication"
            ],
            "correct_answer": "To reduce workplace risks"
        },

        {
            "question_id": "IS002",
            "question": "Why should safety equipment be used?",
            "options": [
                "To reduce the risk of injury",
                "To increase speed",
                "To avoid supervision",
                "To replace training"
            ],
            "correct_answer": "To reduce the risk of injury"
        },

        {
            "question_id": "IS003",
            "question": "What should a worker do after identifying a workplace hazard?",
            "options": [
                "Report it according to workplace procedures",
                "Ignore it",
                "Continue working without caution",
                "Remove safety signs"
            ],
            "correct_answer": "Report it according to workplace procedures"
        }
    ],

    "Electrical Wiring": [

        {
            "question_id": "EW001",
            "question": "What should be done before working on an electrical circuit?",
            "options": [
                "Switch off and isolate the power",
                "Increase the voltage",
                "Touch the wires",
                "Remove safety equipment"
            ],
            "correct_answer": "Switch off and isolate the power"
        },

        {
            "question_id": "EW002",
            "question": "What is the purpose of electrical insulation?",
            "options": [
                "To prevent unwanted current flow",
                "To increase wire temperature",
                "To increase voltage",
                "To make wires heavier"
            ],
            "correct_answer": "To prevent unwanted current flow"
        },

        {
            "question_id": "EW003",
            "question": "Which tool is commonly used to check electrical voltage?",
            "options": [
                "Multimeter",
                "Hammer",
                "Wrench",
                "Tape measure"
            ],
            "correct_answer": "Multimeter"
        }
    ],

    "Basic Maintenance": [

        {
            "question_id": "BM001",
            "question": "What is preventive maintenance?",
            "options": [
                "Regular maintenance to prevent failures",
                "Repairing equipment only after failure",
                "Ignoring equipment problems",
                "Removing equipment"
            ],
            "correct_answer": "Regular maintenance to prevent failures"
        },

        {
            "question_id": "BM002",
            "question": "Why should equipment be inspected regularly?",
            "options": [
                "To identify problems early",
                "To increase equipment damage",
                "To avoid maintenance",
                "To increase electricity usage"
            ],
            "correct_answer": "To identify problems early"
        },

        {
            "question_id": "BM003",
            "question": "What should be checked before maintaining electrical equipment?",
            "options": [
                "Power isolation and safety",
                "Only the equipment color",
                "The worker's phone",
                "The room temperature only"
            ],
            "correct_answer": "Power isolation and safety"
        }
    ],

    "Solar Installation": [

        {
            "question_id": "SI001",
            "question": "What is the main purpose of a solar panel?",
            "options": [
                "To convert sunlight into electrical energy",
                "To store petrol",
                "To produce mechanical force",
                "To cool buildings"
            ],
            "correct_answer": "To convert sunlight into electrical energy"
        },

        {
            "question_id": "SI002",
            "question": "Why is correct panel orientation important?",
            "options": [
                "To receive suitable sunlight",
                "To increase panel weight",
                "To reduce wiring",
                "To prevent all maintenance"
            ],
            "correct_answer": "To receive suitable sunlight"
        },

        {
            "question_id": "SI003",
            "question": "What should be checked before installing a solar system?",
            "options": [
                "Site conditions and safety requirements",
                "Only the wall color",
                "The worker's mobile phone",
                "Only the weather from last month"
            ],
            "correct_answer": "Site conditions and safety requirements"
        }
    ]
}

# ============================================================
# GET ASSESSMENT QUESTIONS
# Correct answers are NOT returned to frontend
# ============================================================

@app.get("/api/assessment/<skill>")
def get_assessment(skill):

    if skill not in ASSESSMENTS:
        return {
            "success": False,
            "message": "Assessment not found for this skill"
        }, 404

    questions = []

    for item in ASSESSMENTS[skill]:

        questions.append({
            "question_id": item["question_id"],
            "question": item["question"],
            "options": item["options"]
        })

    return {
        "success": True,
        "skill": skill,
        "questions": questions,
        "total_questions": len(questions),
        "pass_percentage": 70
    }


# ============================================================
# SUBMIT ASSESSMENT
# ============================================================

@app.post("/api/assessment/submit")
def submit_assessment():

    data = request.get_json(silent=True) or {}

    user_id = data.get("user_id")
    skill = data.get("skill")
    answers = data.get("answers", [])

    # --------------------------------------------------------
    # Validate user_id and skill
    # --------------------------------------------------------

    if user_id is None or not skill:

        return {
            "success": False,
            "message": "user_id and skill are required"
        }, 400

    # --------------------------------------------------------
    # Validate answers
    # --------------------------------------------------------

    if not isinstance(answers, list):

        return {
            "success": False,
            "message": "answers must be a list"
        }, 400

    # --------------------------------------------------------
    # Check whether assessment exists
    # --------------------------------------------------------

    if skill not in ASSESSMENTS:

        return {
            "success": False,
            "message": "Assessment not found for this skill"
        }, 404

    questions = ASSESSMENTS[skill]

    # --------------------------------------------------------
    # Convert submitted answers into dictionary
    # --------------------------------------------------------

    submitted_answers = {
        answer.get("question_id"): answer.get("answer")
        for answer in answers
        if isinstance(answer, dict)
    }

    # --------------------------------------------------------
    # Calculate score
    # --------------------------------------------------------

    correct_answers = 0

    for question in questions:

        question_id = question["question_id"]

        submitted_answer = submitted_answers.get(question_id)

        if submitted_answer == question["correct_answer"]:
            correct_answers += 1

    total_questions = len(questions)

    if total_questions == 0:

        return {
            "success": False,
            "message": "Assessment has no questions"
        }, 500

    score = round(
        (correct_answers / total_questions) * 100,
        2
    )

    pass_percentage = 70

    passed = score >= pass_percentage

    # --------------------------------------------------------
    # Database connection
    # --------------------------------------------------------

    conn = get_db_connection()
    cursor = conn.cursor()

    # --------------------------------------------------------
    # Get next attempt number
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT COALESCE(MAX(attempt_number), 0) + 1
        FROM assessment_attempts
        WHERE user_id = %s AND skill = %s
        """,
        (user_id, skill)
    )

    attempt_number = cursor.fetchone()[0]

    # --------------------------------------------------------
    # Save assessment attempt
    # --------------------------------------------------------

    cursor.execute(
        """
        INSERT INTO assessment_attempts
        (
            user_id,
            skill,
            score,
            passed,
            attempt_number
        )
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            user_id,
            skill,
            score,
            int(passed),
            attempt_number
        )
    )

    conn.commit()

    # --------------------------------------------------------
    # If passed → store verified skill
    # --------------------------------------------------------

    if passed:

        cursor.execute(
            """
            INSERT INTO verified_skills
            (
                user_id,
                skill,
                assessment_score
            )
            VALUES (%s, %s, %s)

            ON CONFLICT(user_id, skill)
            DO UPDATE SET
                assessment_score = excluded.assessment_score
            """,
            (
                user_id,
                skill,
                score
            )
        )

        conn.commit()

        conn.close()

        return {
            "success": True,
            "user_id": user_id,
            "skill": skill,
            "score": score,
            "correct_answers": correct_answers,
            "total_questions": total_questions,
            "pass_percentage": pass_percentage,
            "passed": True,
            "verified": True,
            "attempt_number": attempt_number,
            "message": "Skill verified successfully"
        }

    # --------------------------------------------------------
    # Failed assessment
    # --------------------------------------------------------

    conn.close()

    return {
        "success": True,
        "user_id": user_id,
        "skill": skill,
        "score": score,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "pass_percentage": pass_percentage,
        "passed": False,
        "verified": False,
        "attempt_number": attempt_number,
        "message": "Assessment not passed"
    }
# ============================================================
# GET VERIFIED SKILLS
# ============================================================

@app.get("/api/verified-skills/<int:user_id>")
def get_verified_skills(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT skill, assessment_score
        FROM verified_skills
        WHERE user_id = %s
        ORDER BY skill
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    verified_skills = []

    for row in rows:

        verified_skills.append({
            "skill": row[0],
            "assessment_score": row[1]
        })

    return {
        "success": True,
        "user_id": user_id,
        "verified_skills": verified_skills,
        "count": len(verified_skills)
    }


# ============================================================
# GET ASSESSMENT ATTEMPTS
# ============================================================

@app.get("/api/assessment-attempts/<int:user_id>")
def get_assessment_attempts(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            skill,
            score,
            passed,
            attempt_number,
            created_at
        FROM assessment_attempts
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    attempts = []

    for row in rows:

        attempts.append({
            "attempt_id": row[0],
            "skill": row[1],
            "score": row[2],
            "passed": bool(row[3]),
            "attempt_number": row[4],
            "created_at": row[5]
        })

    return {
        "success": True,
        "user_id": user_id,
        "attempts": attempts,
        "count": len(attempts)
    }


# ============================================================
# DATABASE HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT 1"
        )

        cursor.fetchone()

        conn.close()

        return {
            "success": True,
            "database": "connected",
            "message": "KaushalSetu backend is healthy"
        }

    except Exception as e:

        return {
            "success": False,
            "database": "error",
            "message": str(e)
        }, 500


# ============================================================
# START APPLICATION
# ============================================================

if __name__ == "__main__":
    init_db()

    print("\n========== KAUSHALSETU API ROUTES ==========")

    for rule in app.url_map.iter_rules():
        methods = ",".join(sorted(rule.methods - {"HEAD", "OPTIONS"}))
        print(f"{methods:10} {rule}")

    print("============================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )