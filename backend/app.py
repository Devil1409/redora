"""REDORA — AI Smart Learning Assistant (Flask Backend)."""

import os
import traceback
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import mongo

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # JWT
    JWTManager(app)

    # MongoDB
    mongo.init_app(app)

    # Upload folder
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    # ── Register Blueprints ───────────────────────────────────────────
    from routes.auth_routes import auth_bp
    from routes.document_routes import doc_bp
    from routes.quiz_routes import quiz_bp
    from routes.analytics_routes import analytics_bp
    from routes.history_routes import history_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(doc_bp, url_prefix="/api/documents")
    app.register_blueprint(quiz_bp, url_prefix="/api/quizzes")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(history_bp, url_prefix="/api/history")

    # ── Error Handlers ────────────────────────────────────────────────
    @app.errorhandler(500)
    def handle_500(e):
        traceback.print_exc() # Print full error to terminal
        return jsonify({
            "success": False,
            "message": "Internal Server Error. Check terminal for traceback.",
            "error": str(e)
        }), 500

    @app.errorhandler(Exception)
    def handle_exception(e):
        traceback.print_exc() # Print full error to terminal
        return jsonify({
            "success": False,
            "message": "An unexpected error occurred",
            "error": str(e)
        }), 500

    # ── Health check ──────────────────────────────────────────────────
    @app.route("/api/health", methods=["GET"])
    def health():
        try:
            mongo.client.admin.command('ping')
            db_status = "connected"
        except Exception as e:
            db_status = f"disconnected: {str(e)}"
            
        return jsonify({
            "status": "ok", 
            "service": "REDORA API",
            "database": db_status
        }), 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
