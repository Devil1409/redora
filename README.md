# REDORA — AI Smart Learning Assistant

REDORA is a premium, full-stack AI-powered learning platform designed to help students transform PDFs into actionable knowledge.

## 🚀 Features
- **PDF Intelligence**: Extract and clean text from complex academic documents.
- **Ultra-Fast Summarization**: Powered by Groq's Llama 3.1 8B (10x faster than traditional APIs).
- **Adaptive Learning**: AI-generated quizzes that adjust difficulty based on your performance.
- **Deep Analytics**: Track your topic mastery and study trends over time.
- **Modern SaaS UI**: Dark mode, glassmorphism, and responsive dashboard.

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS, React Router, Axios, Recharts.
- **Backend**: Python Flask, Flask REST APIs, JWT.
- **Database**: MongoDB Atlas.
- **AI Engine**: Groq (Primary), Hugging Face Transformers (Fallback).

## 🏁 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB Atlas Account

### 2. Backend Setup
1. Navigate to `backend/`
2. Create a `.env` file from `.env.example`
3. Add your **MongoDB URI** and **Groq API Key**
4. Install dependencies: `pip install -r requirements.txt`
5. Run: `python app.py`

### 3. Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run: `npm run dev`

## 📂 Folder Structure
```text
redora/
├── backend/            # Flask API
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # AI & Processing Logic
│   └── uploads/        # PDF Storage
└── frontend/           # React App
    ├── src/
    │   ├── components/ # Reusable UI
    │   ├── context/    # Auth & State
    │   ├── pages/      # Route Pages
    │   └── services/   # API Clients
```

## 📜 License
MIT
