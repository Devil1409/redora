import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    """Application configuration."""

    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    # MongoDB
    MONGO_URI = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/redora"
    )

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Groq API Keys (rotation pool)
    GROQ_API_KEYS = [
        v for k, v in sorted(os.environ.items())
        if k.startswith("GROQ_API_KEY") and v
    ]

    # Hugging Face Cloud Inference
    HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
    HF_MODEL = os.getenv("HF_MODEL", "facebook/bart-large-cnn")

    # Upload
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 104857600)) # 100MB for 100pgs
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")

    # AI Model settings
    GROQ_MODEL = "llama-3.1-8b-instant"
    GROQ_SUMMARY_MODEL = "llama-3.1-8b-instant"
    MAX_CHUNK_TOKENS = 3000 # Smaller chunks for better streaming feedback
