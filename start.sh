#!/bin/bash

echo "Starting Resume Analyzer application..."

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
    echo "FLASK_ENV=development" >> .env
    echo "Please update your OpenAI API key in the .env file."
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "Setting up backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

echo "Setting up frontend..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo "Resume Analyzer is starting..."
echo "Backend will be available at http://localhost:5000"
echo "Frontend will be available at http://localhost:3000"
echo "Please wait a moment for both services to start..."

# Open browser after a short delay
sleep 5
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
fi

# Wait for user to kill the process
echo "Press Ctrl+C to stop the application"
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
