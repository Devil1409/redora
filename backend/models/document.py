"""Document model for MongoDB."""

from datetime import datetime, timezone


def create_document_record(user_id, filename, original_name, page_count=0):
    """Create a new document record."""
    return {
        "user_id": user_id,
        "filename": filename,
        "original_name": original_name,
        "page_count": page_count,
        "extracted_text": "",
        "summary": "",
        "key_topics": [],
        "status": "uploaded",  # uploaded -> processing -> completed -> error
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "metadata": {
            "file_size": 0,
            "word_count": 0,
            "processing_time": 0,
        },
    }
