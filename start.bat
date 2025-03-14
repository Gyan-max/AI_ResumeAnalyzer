@echo off
echo Starting Resume Analyzer application...

REM Check if .env file exists, create if not
if not exist .env (
    echo Creating .env file...
    echo OPENAI_API_KEY=your_openai_api_key_here > .env
    echo FLASK_ENV=development >> .env
    echo Please update your OpenAI API key in the .env file.
)

REM Check if Python is installed
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 14 or higher.
    exit /b 1
)

echo Setting up backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
start cmd /k "python app.py"

echo Setting up frontend...
cd ../frontend
npm install
start cmd /k "npm start"

echo Resume Analyzer is starting...
echo Backend will be available at http://localhost:5000
echo Frontend will be available at http://localhost:3000
echo Please wait a moment for both services to start...

timeout /t 5
start http://localhost:3000
