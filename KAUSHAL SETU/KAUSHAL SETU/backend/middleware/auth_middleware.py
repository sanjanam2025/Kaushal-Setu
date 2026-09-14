"""JWT authentication helpers shared by every route module.

Replaces the get_user_id_from_token function that was previously
copy-pasted into eight different route files.
"""

import os

import jwt
from flask import request


def extract_token() -> str | None:
    """Return the raw Bearer token from the Authorization header, or None."""
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    return auth_header.split(" ", 1)[1]


def decode_token(token: str):
    """Decode a JWT and return the payload, or None if invalid/expired."""
    try:
        return jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"],
        )
    except jwt.InvalidTokenError:
        return None


def get_user_id_from_token():
    """Return the authenticated user id from the request, or None."""
    token = extract_token()

    if not token:
        return None

    payload = decode_token(token)

    if not payload:
        return None

    return payload.get("user_id")


def unauthorized(message: str = "Authentication required"):
    """Standard 401 JSON response for protected endpoints."""
    return (
        {
            "success": False,
            "message": message,
        },
        401,
    )
