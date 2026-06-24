@echo off
title GitHub Uploader
echo ===================================================
echo   Packaging Swifty Code for GitHub Upload...
echo ===================================================

echo [1/4] Initializing Git...
git init
git add .
git commit -m "Finalizing Swifty Deployment Code"

echo.
echo [2/4] Linking to Princekumar0025/Swifty...
git branch -M main
git remote add origin https://github.com/Princekumar0025/Swifty.git
:: If the remote is already added, this will silently fail and we continue
git remote set-url origin https://github.com/Princekumar0025/Swifty.git

echo.
echo [3/4] Uploading Files to GitHub...
echo.
echo ===================================================
echo IMPORTANT: If a browser window opens, please click "Authorize" 
echo to securely prove to GitHub that you own the Princekumar0025 profile!
echo ===================================================
git push -u origin main

echo.
pause
