"""User model for MongoDB."""

from datetime import datetime, timezone
import bcrypt


def create_user_document(username, email, password):
    """Create a new user document for MongoDB insertion."""
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return {
        "username": username,
        "email": email.lower().strip(),
        "password": hashed.decode("utf-8"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "profile": {
            "avatar": None,
            "bio": "",
            "study_streak": 0,
            "total_documents": 0,
            "total_quizzes": 0,
            "total_study_time": 0,
        },
        "settings": {
            "dark_mode": True,
            "notifications": True,
            "difficulty_preference": "auto",
        },
    }


def verify_password(stored_hash, password):
    """Verify a password against the stored hash."""
    return bcrypt.checkpw(
        password.encode("utf-8"), stored_hash.encode("utf-8")
    )
