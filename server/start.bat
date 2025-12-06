@echo off
echo Installing dependencies...
call npm install
echo.
echo Starting server...
echo Make sure you have created .env file with your GEMINI_API_KEY!
echo.
call npm run dev
pause


