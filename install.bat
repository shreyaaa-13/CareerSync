@echo off
echo ========================================
echo AI Career Guidance System - Installer
echo ========================================
echo.

echo [1/6] Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)
echo Python found!
echo.

echo [2/6] Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo Virtual environment created!
echo.

echo [3/6] Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo [4/6] Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!
echo.

echo [5/6] Downloading NLP models...
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
echo NLP models downloaded!
echo.

echo [6/6] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your settings.
) else (
    echo .env file already exists.
)
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your settings
echo 2. Run: python init_db.py
echo 3. Run: python app.py
echo.
echo For frontend setup, see QUICK_START.md
echo.
pause
