from datetime import datetime, timedelta, timezone

import jwt
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from config.config import JWT_ALGORITHM, JWT_EXPIRES_HOURS, SECRET_KEY
from config.database import get_db_connection

auth_bp = Blueprint("auth", __name__)


def _create_token(user_id: int, email: str) -> str:
    """Issue a signed JWT with a real expiry claim."""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return {
            "success": False,
            "message": "Name, email and password are required"
        }, 400

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        if cursor.fetchone():
            return {
                "success": False,
                "message": "Email already registered"
            }, 409

        hashed_password = generate_password_hash(password)

        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
            RETURNING id, name, email
            """,
            (name, email, hashed_password)
        )

        user = cursor.fetchone()
        connection.commit()

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "user_id": user[0],
                "name": user[1],
                "email": user[2]
            }
        }, 201

    except Exception as e:
        if connection:
            connection.rollback()

        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if connection:
            connection.close()

from werkzeug.security import check_password_hash


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "success": False,
            "message": "Email and password are required"
        }, 400

    connection = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, name, email, password
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "success": False,
                "message": "Invalid email or password"
            }, 401

        user_id, name, user_email, stored_password = user

        if not check_password_hash(stored_password, password):
            return {
                "success": False,
                "message": "Invalid email or password"
            }, 401
        token = _create_token(user_id, user_email)

        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user_id,
                "name": name,
                "email": user_email
            }
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

    finally:
        if connection:
            connection.close()

@auth_bp.route("/api/auth/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return {
            "success": False,
            "message": "Authorization token required"
        }, 401

    token = auth_header.split(" ", 1)[1]

    try:
        decoded = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, name, email
            FROM users
            WHERE id = %s
            """,
            (decoded["user_id"],)
        )

        user = cursor.fetchone()
        connection.close()

        if not user:
            return {
                "success": False,
                "message": "User not found"
            }, 404

        return {
            "success": True,
            "user": {
                "user_id": user[0],
                "name": user[1],
                "email": user[2]
            }
        }, 200

    except jwt.ExpiredSignatureError:
        return {
            "success": False,
            "message": "Token expired"
        }, 401

    except jwt.InvalidTokenError:
        return {
            "success": False,
            "message": "Invalid or expired token"
        }, 401

# ============================================================
# LOGOUT
# ============================================================

@auth_bp.post("/api/auth/logout")
def logout():
    return jsonify({
        "success": True,
        "message": "Logout successful"
    }), 200