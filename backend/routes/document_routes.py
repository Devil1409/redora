"""Document routes — with Streaming and Long PDF support."""

import os
import time
import json
from flask import Blueprint, request, jsonify, Response, stream_with_context
from flask_jwt_extended import get_jwt_identity
from bson import ObjectId
from datetime import datetime, timezone
from werkzeug.utils import secure_filename

from middleware.auth import auth_required
from models.document import create_document_record
from services.pdf_service import extract_text_from_pdf, chunk_text
from services.ai_service import stream_summarize_chunks, extract_key_topics
from config import Config

from database import mongo

doc_bp = Blueprint("documents", __name__)

@doc_bp.route("/upload", methods=["POST"])
@auth_required
def upload_document():
    user_id = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400

    file = request.files["file"]
    filename = secure_filename(f"{user_id}_{int(time.time())}_{file.filename}")
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Extract text (Up to 100 pages)
    extraction = extract_text_from_pdf(filepath)
    if not extraction["success"]:
        return jsonify({"success": False, "message": extraction["error"]}), 500

    # Create record
    doc = create_document_record(user_id, filename, file.filename, extraction["page_count"])
    doc["extracted_text"] = extraction["text"]
    doc["metadata"]["word_count"] = extraction["word_count"]
    doc["metadata"]["file_size"] = os.path.getsize(filepath)
    doc["status"] = "processing"
    
    result = mongo.db.documents.insert_one(doc)
    
    return jsonify({
        "success": True,
        "document": {
            "id": str(result.inserted_id),
            "filename": file.filename,
            "page_count": extraction["page_count"],
            "word_count": extraction["word_count"]
        }
    }), 201

@doc_bp.route("/upload_multiple", methods=["POST"])
@auth_required
def upload_multiple_documents():
    user_id = get_jwt_identity()

    if "files" not in request.files:
        return jsonify({"success": False, "message": "No files provided"}), 400

    files = request.files.getlist("files")
    if not files:
        return jsonify({"success": False, "message": "No files selected"}), 400

    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    extracted_docs = []
    
    # Extract text for all files
    for file in files:
        filename = secure_filename(f"{user_id}_{int(time.time())}_{file.filename}")
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)

        extraction = extract_text_from_pdf(filepath)
        if extraction["success"]:
            extracted_docs.append({
                "filename": filename,
                "original_name": file.filename,
                "filepath": filepath,
                "text": extraction["text"],
                "page_count": extraction["page_count"],
                "word_count": extraction["word_count"]
            })

    if not extracted_docs:
        return jsonify({"success": False, "message": "Failed to extract text from PDFs"}), 500

    # If the user uploads multiple files together, they want them summarized together.
    # We will merge them all into a single 'group'
    groups = [extracted_docs]

    final_documents = []
    for group in groups:
        # Merge texts and names
        documents_list = [{"title": d["original_name"], "text": d["text"]} for d in group]
        merged_original_name = " + ".join([d["original_name"] for d in group])
        total_pages = sum([d["page_count"] for d in group])
        total_words = sum([d["word_count"] for d in group])

        # We use the first file's saved filename as base
        db_doc = create_document_record(user_id, group[0]["filename"], merged_original_name, total_pages)
        db_doc["sections"] = documents_list
        db_doc["extracted_text"] = "\n\n".join([d["text"] for d in group])
        db_doc["metadata"]["word_count"] = total_words
        db_doc["status"] = "processing"
        
        result = mongo.db.documents.insert_one(db_doc)
        final_documents.append({
            "id": str(result.inserted_id),
            "filename": merged_original_name,
            "page_count": total_pages,
            "word_count": total_words
        })

    return jsonify({
        "success": True,
        "documents": final_documents
    }), 201

@doc_bp.route("/<doc_id>/stream-summarize", methods=["GET"])
@auth_required
def stream_summarize(doc_id):
    """Stream summary generation to the client."""
    user_id = get_jwt_identity()
    doc = mongo.db.documents.find_one({"_id": ObjectId(doc_id), "user_id": user_id})

    if not doc:
        return jsonify({"success": False, "message": "Document not found"}), 404

    text = doc.get("extracted_text", "")
    style = request.args.get("style", "detailed")

    @stream_with_context
    def generate():
        sections = doc.get("sections")
        text = doc.get("extracted_text", "")
        
        # Step 1: Extract topics (using first 10,000 chars)
        topics = extract_key_topics(text[:10000])
        mongo.db.documents.update_one({"_id": ObjectId(doc_id)}, {"$set": {"key_topics": topics}})
        yield f"data: {json.dumps({'topics': topics})}\n\n"

        # Step 2: Sectional Streaming
        full_summary = ""
        
        if sections and len(sections) > 1:
            for sec in sections:
                heading = f"### {sec['title']}\n\n"
                yield f"data: {json.dumps({'chunk': heading})}\n\n"
                full_summary += heading
                
                chunks = chunk_text(sec["text"], max_chars=12000)
                for part in stream_summarize_chunks(chunks, style, include_heading=False):
                    full_summary += part
                    yield f"data: {json.dumps({'chunk': part})}\n\n"
                
                yield "data: " + json.dumps({'chunk': '\n\n'}) + "\n\n"
                full_summary += "\n\n"
        else:
            chunks = chunk_text(text, max_chars=12000) 
            for part in stream_summarize_chunks(chunks, style, include_heading=True):
                full_summary += part
                yield f"data: {json.dumps({'chunk': part})}\n\n"
        
        # Step 3: Finalize
        mongo.db.documents.update_one(
            {"_id": ObjectId(doc_id)}, 
            {"$set": {"summary": full_summary, "status": "completed", "updated_at": datetime.now(timezone.utc)}}
        )
        yield "data: [DONE]\n\n"

    return Response(generate(), mimetype="text/event-stream")

@doc_bp.route("/", methods=["GET"])
@auth_required
def get_documents():
    user_id = get_jwt_identity()
    docs = list(mongo.db.documents.find({"user_id": user_id}).sort("created_at", -1))
    return jsonify({
        "success": True, 
        "documents": [{
            "id": str(d["_id"]), 
            "filename": d["original_name"], 
            "page_count": d.get("page_count", 0),
            "status": d.get("status", "uploaded"),
            "created_at": str(d["created_at"])
        } for d in docs]
    }), 200

@doc_bp.route("/<doc_id>", methods=["GET"])
@auth_required
def get_document(doc_id):
    user_id = get_jwt_identity()
    doc = mongo.db.documents.find_one({"_id": ObjectId(doc_id), "user_id": user_id})
    if not doc: return jsonify({"success": False}), 404
    return jsonify({
        "success": True, 
        "document": {
            "id": str(doc["_id"]),
            "filename": doc["original_name"],
            "summary": doc.get("summary", ""),
            "key_topics": doc.get("key_topics", []),
            "page_count": doc.get("page_count", 0),
            "metadata": doc.get("metadata", {})
        }
    }), 200

@doc_bp.route("/<doc_id>", methods=["DELETE"])
@auth_required
def delete_document(doc_id):
    user_id = get_jwt_identity()
    mongo.db.documents.delete_one({"_id": ObjectId(doc_id), "user_id": user_id})
    return jsonify({"success": True}), 200
