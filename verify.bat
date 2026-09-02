@echo off
echo ======================================================================
echo  RUNNING FULL CYBER-QUANT AUTOMATED VERIFICATION SUITE
echo ======================================================================
echo.

echo [1/2] Running Backend Mathematical and API Test Suite...
python verify_all.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend verification tests failed!
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Running Frontend Production Build Validation...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build validation failed!
    cd ..
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ======================================================================
echo  ALL AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY (100%%)
echo ======================================================================
