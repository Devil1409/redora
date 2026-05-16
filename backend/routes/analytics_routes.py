"""Analytics routes — dashboard stats, performance charts."""

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime, timezone, timedelta
from middleware.auth import auth_required

from database import mongo

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/dashboard", methods=["GET"])
@auth_required
def get_dashboard():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    profile = user.get("profile", {}) if user else {}
    total_docs = mongo.db.documents.count_documents({"user_id": user_id})
    completed_docs = mongo.db.documents.count_documents({"user_id": user_id, "status": "completed"})
    total_quizzes = mongo.db.quizzes.count_documents({"user_id": user_id})
    completed_quizzes = mongo.db.quizzes.count_documents({"user_id": user_id, "status": "completed"})
    performances = list(mongo.db.performances.find({"user_id": user_id}).sort("created_at", -1))
    avg_score = 0
    if performances:
        scores = [p["percentage"] for p in performances]
        avg_score = round(sum(scores) / len(scores), 1)
    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    recent_quizzes = mongo.db.quizzes.count_documents({"user_id": user_id, "created_at": {"$gte": week_ago}})
    recent_docs = mongo.db.documents.count_documents({"user_id": user_id, "created_at": {"$gte": week_ago}})
    weekly_scores = []
    for i in range(7):
        day = datetime.now(timezone.utc) - timedelta(days=6 - i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        day_perfs = []
        for p in performances:
            # Ensure p["created_at"] is timezone-aware for comparison
            p_date = p["created_at"]
            if p_date.tzinfo is None:
                p_date = p_date.replace(tzinfo=timezone.utc)
            
            if day_start <= p_date < day_end:
                day_perfs.append(p)

        day_avg = round(sum(p["percentage"] for p in day_perfs) / len(day_perfs), 1) if day_perfs else None
        weekly_scores.append({"date": day_start.strftime("%Y-%m-%d"), "day": day_start.strftime("%a"), "score": day_avg, "quizzes": len(day_perfs)})
    topic_data = {}
    for p in performances:
        for d in p.get("details", []):
            topic = d.get("topic", "General")
            if topic not in topic_data:
                topic_data[topic] = {"correct": 0, "total": 0}
            topic_data[topic]["total"] += 1
            if d.get("is_correct"):
                topic_data[topic]["correct"] += 1
    topic_mastery = [{"topic": t, "mastery": round((v["correct"] / v["total"]) * 100, 1) if v["total"] > 0 else 0, "attempts": v["total"]} for t, v in sorted(topic_data.items(), key=lambda x: x[1]["total"], reverse=True)[:10]]
    return jsonify({"success": True, "dashboard": {"stats": {"total_documents": total_docs, "completed_documents": completed_docs, "total_quizzes": total_quizzes, "completed_quizzes": completed_quizzes, "average_score": avg_score, "study_streak": profile.get("study_streak", 0)}, "recent_activity": {"quizzes_this_week": recent_quizzes, "documents_this_week": recent_docs}, "weekly_scores": weekly_scores, "topic_mastery": topic_mastery}}), 200


@analytics_bp.route("/performance-history", methods=["GET"])
@auth_required
def get_performance_history():
    user_id = get_jwt_identity()
    performances = list(mongo.db.performances.find({"user_id": user_id}).sort("created_at", -1).limit(30))
    history = []
    for p in performances:
        history.append({"id": str(p["_id"]), "quiz_id": p.get("quiz_id", ""), "score": p["score"], "total": p["total_questions"], "percentage": p["percentage"], "difficulty": p.get("difficulty_level", "medium"), "weak_topics": p.get("weak_topics", []), "strong_topics": p.get("strong_topics", []), "created_at": str(p["created_at"])})
    return jsonify({"success": True, "history": history}), 200
