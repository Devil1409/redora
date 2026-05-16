"""PDF processing service — optimized for long documents (up to 100+ pages)."""

import os
import re
import time
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    """
    Extract text from a PDF file. 
    Handles large files by processing page by page with memory efficiency.
    """
    start_time = time.time()

    try:
        reader = PdfReader(file_path)
        total_pages = len(reader.pages)
        
        # Limit to 100 pages for safety, or process all if specified
        process_limit = min(total_pages, 120) 
        
        full_text_list = []
        for i in range(process_limit):
            page_text = reader.pages[i].extract_text()
            if page_text:
                # Add page markers for AI context
                full_text_list.append(f"[Page {i+1}]\n{page_text}")

        raw_text = "\n\n".join(full_text_list)
        cleaned = clean_extracted_text(raw_text)
        
        word_count = len(cleaned.split())
        processing_time = round(time.time() - start_time, 2)

        return {
            "success": True,
            "text": cleaned,
            "page_count": total_pages,
            "word_count": word_count,
            "processing_time": processing_time,
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"PDF Extraction Error: {str(e)}",
            "text": "",
            "page_count": 0,
            "word_count": 0,
            "processing_time": 0,
        }

def clean_extracted_text(text):
    """Clean and normalize extracted PDF text for AI readability."""
    # Remove excessive whitespace and control characters
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', text)
    # Normalize multiple newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Remove page numbers often found at bottom/top
    text = re.sub(r"\n\s*\d+\s*\n", "\n", text)
    # Fix hyphenated words at line ends
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    # Consolidate spaces
    text = re.sub(r"[ \t]+", " ", text)
    
    return text.strip()

def chunk_text(text, max_chars=8000):
    """
    Intelligently chunk text for LLM context windows.
    Attempts to break at paragraph or sentence boundaries.
    """
    if len(text) <= max_chars:
        return [text]
        
    chunks = []
    # Split by paragraphs first
    paragraphs = text.split("\n\n")
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) < max_chars:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            
            # If a single paragraph is larger than max_chars, split by sentences
            if len(para) > max_chars:
                sentences = re.split(r'(?<=[.!?])\s+', para)
                sub_chunk = ""
                for sent in sentences:
                    if len(sub_chunk) + len(sent) < max_chars:
                        sub_chunk += sent + " "
                    else:
                        chunks.append(sub_chunk.strip())
                        sub_chunk = sent + " "
                current_chunk = sub_chunk
            else:
                current_chunk = para + "\n\n"
                
    if current_chunk:
        chunks.append(current_chunk.strip())
        
    return chunks
