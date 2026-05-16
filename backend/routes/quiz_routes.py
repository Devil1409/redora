"""Quiz routes — generate, submit, review."""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime, timezone

from middleware.auth import auth_required
from models.quiz import create_quiz_record
from models.performance import create_performance_record
from services.ai_service import generate_quiz
from services.adaptive_service import analyze_performance

from database import mongo

quiz_bp = Blueprint("quizzes", __name__)


@quiz_bp.route("/generate", methods=["POST"])
@auth_required
def generate_quiz_route():
    """Generate a quiz from a document."""

    user_id = get_jwt_identity()
    data = request.get_json()
    doc_id = data.get("document_id")
    num_questions = min(int(data.get("num_questions", 5)), 20)
    difficulty = data.get("difficulty", "auto")

    if not doc_id:
        return jsonify({"success": False, "message": "document_id is required"}), 400

    doc = mongo.db.documents.find_one({"_id": ObjectId(doc_id), "user_id": user_id})
    if not doc:
        return jsonify({"success": False, "message": "Document not found"}), 404

    text = doc.get("extracted_text", "") or doc.get("summary", "")
    if not text:
        return jsonify({"success": False, "message": "No text available for quiz"}), 400

    # Adaptive difficulty
    focus_topics = None
    if difficulty == "auto":
        analysis = analyze_performance(mongo.db, user_id)
        difficulty = analysis["recommended_difficulty"]
        focus_topics = analysis.get("weak_topics")

    # Chunk text for quiz sampling (NCERT optimized)
    from services.pdf_service import chunk_text
    text_chunks = chunk_text(text, max_chars=12000)

    # Generate questions from chunks
    questions = generate_quiz(text_chunks, num_questions, difficulty, focus_topics)

    # Save quiz
    quiz_doc = create_quiz_record(user_id, doc_id, questions, difficulty)
    result = mongo.db.quizzes.insert_one(quiz_doc)

    return jsonify({
        "success": True,
        "quiz": {
            "id": str(result.inserted_id),
            "questions": questions,
            "difficulty": difficulty,
            "total_questions": len(questions),
            "focus_topics": focus_topics,
        },
    }), 201


@quiz_bp.route("/<quiz_id>/submit", methods=["POST"])
@auth_required
def submit_quiz(quiz_id):
    """Submit quiz answers and calculate score."""

    user_id = get_jwt_identity()
    data = request.get_json()
    answers = data.get("answers", [])  # [{question_index, selected_answer}]
    time_taken = data.get("time_taken", 0)

    quiz = mongo.db.quizzes.find_one({"_id": ObjectId(quiz_id), "user_id": user_id})
    if not quiz:
        return jsonify({"success": False, "message": "Quiz not found"}), 404

    questions = quiz["questions"]
    score = 0
    details = []

    for i, q in enumerate(questions):
        user_answer = None
        for ans in answers:
            if ans.get("question_index") == i:
                user_answer = ans.get("selected_answer")
                break

        is_correct = user_answer == q.get("correct_answer")
        if is_correct:
            score += 1

        details.append({
            "question_index": i,
            "question": q["question"],
            "correct_answer": q.get("correct_answer"),
            "user_answer": user_answer,
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
            "topic": q.get("topic", "General"),
        })

    percentage = round((score / len(questions)) * 100, 1) if questions else 0

    # Update quiz
    mongo.db.quizzes.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": {
            "status": "completed",
            "score": score,
            "answers": answers,
            "time_taken": time_taken,
            "completed_at": datetime.now(timezone.utc),
        }}
    )

    # Save performance record
    perf = create_performance_record(
        user_id, quiz_id, quiz.get("document_id", ""),
        score, len(questions), details
    )

    # Analyze weak/strong topics
    weak = [d["topic"] for d in details if not d["is_correct"]]
    strong = [d["topic"] for d in details if d["is_correct"]]
    perf["weak_topics"] = list(set(weak))
    perf["strong_topics"] = list(set(strong))
    perf["difficulty_level"] = quiz.get("difficulty", "medium")

    mongo.db.performances.insert_one(perf)

    # Update user stats
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"profile.total_quizzes": 1}}
    )

    return jsonify({
        "success": True,
        "result": {
            "score": score,
            "total": len(questions),
            "percentage": percentage,
            "details": details,
            "time_taken": time_taken,
            "weak_topics": list(set(weak)),
            "strong_topics": list(set(strong)),
        },
    }), 200


@quiz_bp.route("/", methods=["GET"])
@auth_required
def get_quizzes():
    """Get all quizzes for current user."""

    user_id = get_jwt_identity()
    quizzes = list(
        mongo.db.quizzes.find({"user_id": user_id})
        .sort("created_at", -1)
        .limit(50)
    )

    result = []
    for q in quizzes:
        result.append({
            "id": str(q["_id"]),
            "document_id": q.get("document_id", ""),
            "difficulty": q.get("difficulty", "medium"),
            "total_questions": q.get("total_questions", 0),
            "score": q.get("score"),
            "status": q.get("status", "pending"),
            "created_at": str(q["created_at"]),
            "completed_at": str(q.get("completed_at", "")),
        })

    return jsonify({"success": True, "quizzes": result}), 200


@quiz_bp.route("/<quiz_id>", methods=["GET"])
@auth_required
def get_quiz(quiz_id):
    """Get a single quiz with full details."""

    user_id = get_jwt_identity()
    quiz = mongo.db.quizzes.find_one({"_id": ObjectId(quiz_id), "user_id": user_id})

    if not quiz:
        return jsonify({"success": False, "message": "Quiz not found"}), 404

    return jsonify({
        "success": True,
        "quiz": {
            "id": str(quiz["_id"]),
            "document_id": quiz.get("document_id", ""),
            "questions": quiz.get("questions", []),
            "difficulty": quiz.get("difficulty", "medium"),
            "total_questions": quiz.get("total_questions", 0),
            "score": quiz.get("score"),
            "status": quiz.get("status", "pending"),
            "time_taken": quiz.get("time_taken", 0),
            "created_at": str(quiz["created_at"]),
        },
    }), 200


@quiz_bp.route("/adaptive-info", methods=["GET"])
@auth_required
def get_adaptive_info():
    """Get adaptive learning recommendations for the user."""

    user_id = get_jwt_identity()
    analysis = analyze_performance(mongo.db, user_id)

    return jsonify({"success": True, "adaptive": analysis}), 200
