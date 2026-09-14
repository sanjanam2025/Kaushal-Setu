from flask import Blueprint, jsonify
from config.database import get_db_connection


labour_market_bp = Blueprint(
    "labour_market",
    __name__,
    url_prefix="/api/market"
)


@labour_market_bp.route("/trends", methods=["GET"])
def get_market_trends():
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM industry_trends
            ORDER BY id
        """)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        trends = []

        for row in rows:
            trends.append(dict(zip(columns, row)))

        return jsonify({
            "success": True,
            "trends": trends,
            "total": len(trends)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load market data"
        }), 500

    finally:
        if connection:
            connection.close()


@labour_market_bp.route("/in-demand-skills", methods=["GET"])
def get_in_demand_skills():
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM skill_demand
            ORDER BY id
        """)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        skills = []

        for row in rows:
            skills.append(dict(zip(columns, row)))

        return jsonify({
            "success": True,
            "skills": skills,
            "total": len(skills)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load market data"
        }), 500

    finally:
        if connection:
            connection.close()


@labour_market_bp.route("/salaries", methods=["GET"])
def get_market_salaries():
    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM job_postings
            WHERE salary_range IS NOT NULL
            ORDER BY id
        """)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        salaries = []

        for row in rows:
            record = dict(zip(columns, row))

            salaries.append({
                "job_id": record.get("job_id"),
                "job_title": record.get("job_title"),
                "company": record.get("company"),
                "location": record.get("location"),
                "engineering_field": record.get("engineering_field"),
                "salary_range": record.get("salary_range")
            })

        return jsonify({
            "success": True,
            "salaries": salaries,
            "total": len(salaries)
        }), 200

    except Exception:
        return jsonify({
            "success": False,
            "message": "Failed to load market data"
        }), 500

    finally:
        if connection:
            connection.close()