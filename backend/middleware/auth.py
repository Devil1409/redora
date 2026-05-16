"""JWT authentication middleware."""

from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity


def auth_required(f):
    """Decorator to require JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Authentication required",
                "error": str(e)
            }), 401
    return decorated


def get_current_user_id():
    """Get the current authenticated user's ID."""
    return get_jwt_identity()
