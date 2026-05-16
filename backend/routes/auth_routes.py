"""Authentication routes — register, login, profile."""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity
from bson import ObjectId
from datetime import datetime, timezone

from models.user import create_user_document, verify_password
from middleware.auth import auth_required

from database import mongo

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""

    data = request.get_json()
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not all([username, email, password]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters"}), 400

    # Check existing user
    if mongo.db.users.find_one({"email": email.lower()}):
        return jsonify({"success": False, "message": "Email already registered"}), 409

    if mongo.db.users.find_one({"username": username}):
        return jsonify({"success": False, "message": "Username already taken"}), 409

    # Create user
    try:
        user_doc = create_user_document(username, email, password)
        result = mongo.db.users.insert_one(user_doc)
        token = create_access_token(identity=str(result.inserted_id))

        return jsonify({
            "success": True,
            "message": "Registration successful",
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "username": username,
                "email": email.lower(),
            },
        }), 201
    except Exception as e:
        print(f"DEBUG REGISTER ERROR: {str(e)}")
        return jsonify({"success": False, "message": "Server error during registration", "error": str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and return JWT."""

    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not all([email, password]):
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email.lower()})
    if not user or not verify_password(user["password"], password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
        },
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@auth_required
def get_profile():
    """Get current user profile."""

    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "profile": user.get("profile", {}),
            "settings": user.get("settings", {}),
            "created_at": str(user["created_at"]),
        },
    }), 200


@auth_bp.route("/profile", methods=["PUT"])
@auth_required
def update_profile():
    """Update user profile."""
    from app import mongo

    user_id = get_jwt_identity()
    data = request.get_json()

    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "bio" in data:
        update_fields["profile.bio"] = data["bio"]
    if "settings" in data:
        for key, val in data["settings"].items():
            update_fields[f"settings.{key}"] = val

    update_fields["updated_at"] = datetime.now(timezone.utc)

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    return jsonify({"success": True, "message": "Profile updated"}), 200
