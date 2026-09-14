"""Shared configuration loading and validation for the Kaushal Setu backend."""

import os

from dotenv import load_dotenv

load_dotenv()

# Base directory of the backend package (backend/).
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# CORS origins allowed to call the API. Comma-separated in the environment.
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

# JWT settings.
SECRET_KEY = os.getenv("SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "72"))

# Flask settings.
DEBUG_MODE = os.getenv("FLASK_DEBUG", "1") == "1"


def validate_config() -> list[str]:
    """Return a list of fatal configuration problems (empty list means OK)."""
    problems = []

    if not SECRET_KEY:
        problems.append(
            "SECRET_KEY is not set. Add SECRET_KEY=<random string> to backend/.env"
        )

    if not os.getenv("DATABASE_URL"):
        problems.append(
            "DATABASE_URL is not set. Add DATABASE_URL=postgresql://user:pass@host:5432/dbname to backend/.env"
        )

    return problems
