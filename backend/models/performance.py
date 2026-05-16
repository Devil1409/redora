"""Performance tracking model for MongoDB."""

from datetime import datetime, timezone


def create_performance_record(user_id, quiz_id, document_id, score, total, details):
    """Create a performance record after quiz completion."""
    return {
        "user_id": user_id,
        "quiz_id": quiz_id,
        "document_id": document_id,
        "score": score,
        "total_questions": total,
        "percentage": round((score / total) * 100, 1) if total > 0 else 0,
        "details": details,  # Per-question breakdown
        "weak_topics": [],
        "strong_topics": [],
        "difficulty_level": "medium",
        "created_at": datetime.now(timezone.utc),
    }


def create_analytics_snapshot(user_id):
    """Create a blank analytics snapshot for a user."""
    return {
        "user_id": user_id,
        "total_quizzes": 0,
        "average_score": 0,
        "total_documents": 0,
        "study_streak": 0,
        "topic_mastery": {},
        "difficulty_distribution": {"easy": 0, "medium": 0, "hard": 0},
        "weekly_activity": [],
        "updated_at": datetime.now(timezone.utc),
    }
