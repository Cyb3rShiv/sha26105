@echo off
echo ======================================================================
echo Launching Cyber-Quant Platform (Backend + Frontend)
echo Problem Statement: PS 26105 - Tech Crafters
echo ======================================================================
start "Cyber-Quant Backend API (Port 8000)" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 2 /nobreak >nul
start "Cyber-Quant Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"
echo.
echo ======================================================================
echo Platform is launching!
echo Backend API:  http://127.0.0.1:8000 (Swagger: http://127.0.0.1:8000/docs)
echo Frontend UI:  http://localhost:5173
echo ======================================================================
