"""AI service — Optimized for NCERT and Long Academic Documents."""

import os
import time
import json
import re
import requests
from groq import Groq
from config import Config

def _get_groq_client():
    keys = Config.GROQ_API_KEYS
    if not keys: raise RuntimeError("No Groq API keys")
    # Simple rotation based on time to distribute load
    key = keys[int(time.time()) % len(keys)]
    return Groq(api_key=key)

def stream_summarize_chunks(chunks, style="detailed", include_heading=True):
    """
    Processes multiple text chunks (sections) and yields summaries for each.
    Optimized for 100+ page NCERT-style documents.
    """
    client = _get_groq_client()
    
    system_prompt = "You are an elite academic assistant. Summarize the provided text with high precision, focusing on definitions, key concepts, and important details. Use markdown."

    for i, chunk in enumerate(chunks):
        # Rotate client per chunk
        client = _get_groq_client()
        if i > 0:
            time.sleep(1.5)

        max_retries = 3
        success = False
        
        for attempt in range(max_retries):
            try:
                if attempt == 0 and include_heading:
                    if len(chunks) > 1:
                        yield f"\n\n### Section {i+1}\n\n"
                    else:
                        yield f"\n\n### Summary\n\n"
                
                completion = client.chat.completions.create(
                    model=Config.GROQ_SUMMARY_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Summarize this section accurately:\n\n{chunk}"},
                    ],
                    temperature=0.3,
                    stream=True,
                )

                for part in completion:
                    if part.choices[0].delta.content:
                        yield part.choices[0].delta.content
                
                success = True
                break
                
            except Exception as e:
                print(f"Groq attempt {attempt+1} failed on section {i+1}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(3 * (attempt + 1))
                    client = _get_groq_client()
                else:
                    yield f"\n\n[Section {i+1} Fallback Activated]\n\n"
                    yield from _fallback_hf_block(chunk)

def _fallback_hf_block(text):
    """Cloud HF Fallback for a single chunk."""
    if not Config.HF_API_TOKEN:
        yield "Fallback failed: No HF API Token."
        return
        
    url = f"https://api-inference.huggingface.co/models/{Config.HF_MODEL}"
    headers = {"Authorization": f"Bearer {Config.HF_API_TOKEN}"}
    try:
        payload = {"inputs": text[:3000], "parameters": {"max_length": 400}}
        res = requests.post(url, headers=headers, json=payload, timeout=15)
        result = res.json()
        summary = result[0]['summary_text'] if isinstance(result, list) else "Section summary temporarily unavailable."
        for word in summary.split():
            yield word + " "
            time.sleep(0.01)
    except:
        yield "Section summary temporarily unavailable."

def generate_quiz(text_segments, num_questions=5, difficulty="medium", focus_topics=None):
    """Generates quiz by sampling from different sections of the book."""
    try:
        client = _get_groq_client()
        
        # We take snippets from the segments to ensure the quiz covers the whole book
        # If segments is a string, make it a list
        if isinstance(text_segments, str):
            text_segments = [text_segments]
            
        sampled_text = "\n\n".join([s[:2000] for s in text_segments[:5]]) 
        
        prompt = f"""Create {num_questions} MCQs for a {difficulty} level student. 
Focus on these topics if possible: {focus_topics if focus_topics else 'All key concepts'}

Text Snippets:
{sampled_text}

Return ONLY a valid JSON array of objects with: 
"question", "options" (array of 4), "correct_answer" (index 0-3), "explanation", "topic".

Example format:
[
  {{"question": "...", "options": ["...", "...", "...", "..."], "correct_answer": 0, "explanation": "...", "topic": "..."}}
]"""

        res = client.chat.completions.create(
            model=Config.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a professional quiz generator. Return ONLY valid JSON."}, 
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        raw = res.choices[0].message.content.strip()
        
        # Clean potential markdown wrapping
        json_match = re.search(r"\[.*\]", raw, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return json.loads(raw)
    except Exception as e:
        print(f"Quiz gen failed: {e}")
        return []

def extract_key_topics(text):
    """Extract key topics from the beginning of the text."""
    try:
        client = _get_groq_client()
        response = client.chat.completions.create(
            model=Config.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "Extract 5-10 key topics. Return ONLY a JSON array of strings."},
                {"role": "user", "content": f"Extract topics from:\n\n{text[:6000]}"},
            ],
            temperature=0.3,
        )
        raw = response.choices[0].message.content.strip()
        json_match = re.search(r"\[.*\]", raw, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return json.loads(raw)
    except:
        # Simple extraction if AI fails
        return ["General Content", "Key Concepts"]
