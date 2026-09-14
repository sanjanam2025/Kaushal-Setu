"""Kaushal Setu Flask application entrypoint.

Registers every blueprint, applies CORS for the frontend origin,
validates configuration at startup and provides health endpoints.
"""

import traceback

from flask import Flask, jsonify
from flask_cors import CORS

from config.config import CORS_ORIGINS, DEBUG_MODE, validate_config
from config.database import get_db_connection
from routes.application_routes import application_bp
from routes.assessment_routes import assessment_bp
from routes.auth_routes import auth_bp
from routes.career_routes import career_bp
from routes.curriculum_routes import curriculum_bp
from routes.dashboard_routes import dashboard_bp
from routes.employment_routes import employment_bp
from routes.job_routes import job_bp
from routes.labour_market_routes import labour_market_bp
from routes.learning_routes import learning_bp
from routes.matching_routes import matching_bp
from routes.reassessment_routes import reassessment_bp
from routes.role_routes import role_bp
from routes.skill_routes import skill_bp

app = Flask(__name__)

# Restrict CORS to the configured frontend origins. The default list covers
# local development (Vite on 3000/5173); production origins are set via env.
CORS(
    app,
    resources={r"/api/*": {"origins": CORS_ORIGINS}},
    supports_credentials=False,
    allow_headers=["Content-Type", "Authorization", "Accept"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
)

app.register_blueprint(skill_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(assessment_bp)
app.register_blueprint(job_bp)
app.register_blueprint(matching_bp)
app.register_blueprint(labour_market_bp)
app.register_blueprint(curriculum_bp)
app.register_blueprint(career_bp)
app.register_blueprint(role_bp)
app.register_blueprint(learning_bp)
app.register_blueprint(reassessment_bp)
app.register_blueprint(employment_bp)
app.register_blueprint(application_bp)
app.register_blueprint(dashboard_bp)


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"success": False, "message": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(_error):
    return jsonify({"success": False, "message": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(error):
    if DEBUG_MODE:
        traceback.print_exc()
    return (
        jsonify(
            {
                "success": False,
                "message": "Internal server error",
                "detail": str(error) if DEBUG_MODE else None,
            }
        ),
        500,
    )


@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok", "service": "kaushal-setu-api"}


@app.route("/api/db-test", methods=["GET"])
def db_test():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    cursor.fetchone()
    cursor.close()
    connection.close()
    return {"database": "connected"}


if __name__ == "__main__":
    problems = validate_config()

    if problems:
        print("Startup configuration problems detected:")
        for problem in problems:
            print(f"  - {problem}")
        print("The server will still start, but endpoints that need these values will fail.")

    app.run(debug=DEBUG_MODE, port=5000)