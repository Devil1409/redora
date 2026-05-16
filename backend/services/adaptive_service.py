"""Adaptive learning service — adjusts difficulty based on performance."""

from bson import ObjectId


def analyze_performance(db, user_id):
    """Analyze user performance and return adaptive recommendations."""
    performances = list(
        db.performances.find({"user_id": user_id}).sort("created_at", -1).limit(20)
    )

    if not performances:
        return {
            "recommended_difficulty": "medium",
            "weak_topics": [],
            "strong_topics": [],
            "average_score": 0,
            "trend": "neutral",
            "message": "Take your first quiz to get personalized recommendations!",
        }

    # Calculate stats
    scores = [p["percentage"] for p in performances]
    avg = sum(scores) / len(scores)
    recent_avg = sum(scores[:5]) / min(len(scores), 5)

    # Determine trend
    if len(scores) >= 3:
        trend = "improving" if scores[0] > scores[-1] else "declining" if scores[0] < scores[-1] else "stable"
    else:
        trend = "neutral"

    # Collect topic performance
    topic_scores = {}
    for p in performances:
        for detail in p.get("details", []):
            topic = detail.get("topic", "General")
            if topic not in topic_scores:
                topic_scores[topic] = {"correct": 0, "total": 0}
            topic_scores[topic]["total"] += 1
            if detail.get("is_correct"):
                topic_scores[topic]["correct"] += 1

    # Classify topics
    weak = []
    strong = []
    for topic, data in topic_scores.items():
        rate = (data["correct"] / data["total"]) * 100 if data["total"] > 0 else 0
        if rate < 50:
            weak.append(topic)
        elif rate >= 80:
            strong.append(topic)

    # Recommend difficulty
    if recent_avg >= 85:
        difficulty = "hard"
    elif recent_avg >= 60:
        difficulty = "medium"
    else:
        difficulty = "easy"

    return {
        "recommended_difficulty": difficulty,
        "weak_topics": weak[:5],
        "strong_topics": strong[:5],
        "average_score": round(avg, 1),
        "recent_average": round(recent_avg, 1),
        "trend": trend,
        "total_quizzes": len(performances),
        "message": _generate_message(difficulty, trend, weak),
    }


def _generate_message(difficulty, trend, weak_topics):
    """Generate a personalized message."""
    messages = {
        ("hard", "improving"): "Outstanding progress! You're ready for advanced challenges.",
        ("hard", "stable"): "Excellent consistency at the top level!",
        ("medium", "improving"): "Great improvement! Keep pushing forward.",
        ("medium", "declining"): "Let's refocus — try reviewing your weak areas.",
        ("easy", "declining"): "Don't worry! Let's go back to basics and rebuild your foundation.",
    }
    msg = messages.get((difficulty, trend), "Keep practicing to improve your skills!")
    if weak_topics:
        msg += f" Focus on: {', '.join(weak_topics[:3])}."
    return msg
