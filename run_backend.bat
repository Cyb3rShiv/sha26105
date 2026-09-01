@echo off
echo ======================================================================
echo Starting Cyber-Quant FastAPI Backend Service (FinTrust Bank)
echo ======================================================================
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
