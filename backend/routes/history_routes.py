"""History routes — study session history."""

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from middleware.auth import auth_required

from database import mongo

history_bp = Blueprint("history", __name__)


@history_bp.route("/", methods=["GET"])
@auth_required
def get_history():
    user_id = get_jwt_identity()
    docs = list(mongo.db.documents.find({"user_id": user_id}).sort("created_at", -1).limit(20))
    quizzes = list(mongo.db.quizzes.find({"user_id": user_id}).sort("created_at", -1).limit(20))
    timeline = []
    for d in docs:
        timeline.append({"type": "document", "id": str(d["_id"]), "title": d["original_name"], "status": d.get("status", "uploaded"), "created_at": str(d["created_at"])})
    for q in quizzes:
        timeline.append({"type": "quiz", "id": str(q["_id"]), "title": f"Quiz ({q.get('difficulty','medium')})", "score": q.get("score"), "total": q.get("total_questions", 0), "status": q.get("status", "pending"), "created_at": str(q["created_at"])})
    timeline.sort(key=lambda x: x["created_at"], reverse=True)
    return jsonify({"success": True, "history": timeline[:30]}), 200


@history_bp.route("/clear", methods=["DELETE"])
@auth_required
def clear_history():
    user_id = get_jwt_identity()
    mongo.db.documents.delete_many({"user_id": user_id})
    mongo.db.quizzes.delete_many({"user_id": user_id})
    mongo.db.performances.delete_many({"user_id": user_id})
    mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"profile.total_documents": 0, "profile.total_quizzes": 0}})
    return jsonify({"success": True, "message": "History cleared"}), 200
