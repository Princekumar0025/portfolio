@echo off
title Swifty Server Launcher
echo ===================================================
echo   Installing missing dependencies (like Stripe)...
echo ===================================================
pip install -r requirements.txt > crash_log.txt 2>&1

echo.
echo ===================================================
echo   Starting the Swifty Python Server...
echo ===================================================
python app.py >> crash_log.txt 2>&1

echo.
echo ===================================================
echo   SERVER CRASHED OR STOPPED! 
echo   (Saving logs to crash_log.txt so Antigravity can read it...)
echo ===================================================
