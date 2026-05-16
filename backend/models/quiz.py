"""Quiz model for MongoDB."""

from datetime import datetime, timezone


def create_quiz_record(user_id, document_id, questions, difficulty="medium"):
    """Create a new quiz record."""
    return {
        "user_id": user_id,
        "document_id": document_id,
        "questions": questions,  # List of question objects
        "difficulty": difficulty,  # easy, medium, hard
        "total_questions": len(questions),
        "status": "pending",  # pending, in_progress, completed
        "score": None,
        "answers": [],
        "time_taken": 0,
        "created_at": datetime.now(timezone.utc),
        "completed_at": None,
    }


def create_question(question_text, options, correct_answer, explanation="", topic=""):
    """Create a question object for a quiz."""
    return {
        "question": question_text,
        "options": options,  # List of 4 option strings
        "correct_answer": correct_answer,  # Index 0-3
        "explanation": explanation,
        "topic": topic,
        "difficulty": "medium",
    }
