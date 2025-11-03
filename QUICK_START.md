# Quick Start Guide - AI Career Guidance System

## 🚀 Get Started in 5 Minutes

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to project
cd "C:\xampp\htdocs\AI Based Career guidance System"

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLP models
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Setup environment
copy .env.example .env

# Initialize database with sample data
python init_db.py

# Start backend
python app.py
```

✅ Backend running at http://localhost:5000

### Step 2: Frontend Setup (2 minutes)

```bash
# Open new terminal
cd "C:\xampp\htdocs\AI Based Career guidance System\frontend"

# Install dependencies
npm install

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer

# Start frontend
npm start
```

✅ Frontend running at http://localhost:3000

### Step 3: Login & Explore (1 minute)

**Open browser:** http://localhost:3000

**Login with demo account:**
- Email: `john.doe@example.com`
- Password: `password123`

**Or admin account:**
- Email: `admin@careerguidance.com`
- Password: `admin123`

## 🎯 What to Try First

1. **Take the Quiz** - Assess your skills and interests
2. **View Recommendations** - Get AI-powered career suggestions
3. **Explore Careers** - Browse available career paths
4. **Chat with AI** - Ask career-related questions
5. **Upload Resume** - Get skill analysis (PDF format)

## 📱 Features Overview

### For Students
- ✅ Career assessment quiz
- ✅ AI-powered recommendations
- ✅ Resume analysis
- ✅ Career roadmaps
- ✅ AI chatbot assistant
- ✅ Progress tracking

### For Admins
- ✅ User management
- ✅ Career database management
- ✅ Quiz question management
- ✅ Analytics dashboard

## 🔧 Common Commands

### Backend
```bash
# Start server
python app.py

# Reset database
python init_db.py

# Run in production
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
# Development
npm start

# Production build
npm run build

# Run tests
npm test
```

## 🐛 Quick Fixes

**Port already in use?**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module not found?**
```bash
# Backend
pip install -r requirements.txt --force-reinstall

# Frontend
rm -rf node_modules && npm install
```

**Database issues?**
```bash
python init_db.py
```

## 📚 Documentation

- Full Setup Guide: `SETUP_GUIDE.md`
- API Documentation: `README.md`
- Frontend Pages Guide: `FRONTEND_PAGES_GUIDE.md`

## 🎉 You're All Set!

Start exploring the platform and customize it to your needs!

**Need help?** Check the full `SETUP_GUIDE.md` for detailed instructions.
