# Run script for REDORA

Write-Host "🚀 Starting REDORA AI Learning Assistant..." -ForegroundColor Cyan

# Start Backend
Write-Host "📦 Initializing Backend (Flask)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python app.py"

# Start Frontend
Write-Host "🎨 Initializing Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "✅ Both services are starting in separate windows!" -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 Backend: http://localhost:5000" -ForegroundColor Cyan
