@echo off
echo ============================================
echo Smart Restaurant Finder MVP Setup
echo ============================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo Node.js is installed!
echo.

echo Setting up Backend...
cd restaurant-finder-api
if not exist ".env" (
    copy .env.example .env
    echo Created .env file. Please edit it with your API keys before continuing.
    echo.
    echo You need:
    echo 1. OpenAI API Key from https://platform.openai.com/
    echo 2. Yelp API Key from https://www.yelp.com/developers
    echo.
    echo Press any key after you've added your API keys to .env file...
    pause
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Setting up Frontend...
cd ..\restaurant-finder-ui

if not exist ".env.development" (
    echo VITE_API_BASE_URL=http://localhost:3000/api > .env.development
    echo Created .env.development file
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo 1. Open TWO command prompts/terminals
echo.
echo 2. In the first terminal, run:
echo    cd restaurant-finder-api
echo    npm run dev
echo.
echo 3. In the second terminal, run:
echo    cd restaurant-finder-ui
echo    npm run dev
echo.
echo 4. Open your browser to http://localhost:8080
echo.
echo Make sure you have added your API keys to:
echo restaurant-finder-api\.env
echo.
pause
