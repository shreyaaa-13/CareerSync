# AI-Based Career Guidance System - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** and npm - [Download](https://nodejs.org/)
- **Git** (optional) - [Download](https://git-scm.com/)

### Optional (for production)
- MySQL or PostgreSQL
- OpenAI API Key (for advanced chatbot features)

## Backend Setup

### Step 1: Navigate to Project Directory
```bash
cd "C:\xampp\htdocs\AI Based Career guidance System"
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Download NLP Models
```bash
# Download spaCy model
python -m spacy download en_core_web_sm

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### Step 5: Configure Environment Variables
```bash
# Copy example env file
copy .env.example .env

# Edit .env file with your settings
notepad .env
```

**Important .env settings:**
```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///career_guidance.db
JWT_SECRET_KEY=your-jwt-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here  # Optional
```

### Step 6: Initialize Database
```bash
python init_db.py
```

This will create:
- Database tables
- Admin user (admin@careerguidance.com / admin123)
- Sample student users
- Sample careers and quiz questions

### Step 7: Test Backend
```bash
python app.py
```

Backend should now be running at `http://localhost:5000`

Test the API:
```bash
# Health check
curl http://localhost:5000/api/health
```

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

**If you encounter errors, try:**
```bash
npm install --legacy-peer-deps
```

### Step 3: Install TailwindCSS
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

### Step 4: Start Development Server
```bash
npm start
```

Frontend should now be running at `http://localhost:3000`

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd "C:\xampp\htdocs\AI Based Career guidance System"
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd "C:\xampp\htdocs\AI Based Career guidance System\frontend"
npm start
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

### Default Credentials

**Admin Account:**
- Email: admin@careerguidance.com
- Password: admin123

**Student Account:**
- Email: john.doe@example.com
- Password: password123

## Testing

### Backend API Testing

**Test Authentication:**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john.doe@example.com\",\"password\":\"password123\"}"
```

**Test Quiz Questions:**
```bash
# Get questions (requires token)
curl http://localhost:5000/api/quiz/questions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Testing

1. **Registration Flow:**
   - Go to http://localhost:3000/register
   - Create a new account
   - Verify redirect to dashboard

2. **Login Flow:**
   - Go to http://localhost:3000/login
   - Login with credentials
   - Verify dashboard access

3. **Navigation:**
   - Test all navigation links
   - Verify protected routes require authentication

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Backend (Port 5000):**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in app.py if needed
app.run(host='0.0.0.0', port=5001, debug=True)
```

**Frontend (Port 3000):**
```bash
# Set different port
set PORT=3001 && npm start
```

#### 2. Module Not Found Errors

**Backend:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Frontend:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Database Errors

```bash
# Reset database
python
>>> from app import create_app
>>> from models import db
>>> app = create_app()
>>> with app.app_context():
...     db.drop_all()
...     db.create_all()
>>> exit()

# Re-initialize
python init_db.py
```

#### 4. CORS Errors

Verify in `config.py`:
```python
CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
```

#### 5. TailwindCSS Not Working

The `@tailwind` warnings in CSS are normal. They will be processed during build.

If styles don't appear:
```bash
# Reinstall TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 6. spaCy Model Not Found

```bash
# Download model
python -m spacy download en_core_web_sm

# Verify installation
python -c "import spacy; nlp = spacy.load('en_core_web_sm'); print('Success!')"
```

## Production Deployment

### Backend Deployment

1. **Update Environment:**
```env
FLASK_ENV=production
SECRET_KEY=<strong-random-key>
JWT_SECRET_KEY=<strong-random-key>
DATABASE_URL=<production-database-url>
```

2. **Use Production Server:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **Recommended Platforms:**
   - Heroku
   - AWS EC2
   - Render
   - DigitalOcean

### Frontend Deployment

1. **Build Production:**
```bash
npm run build
```

2. **Deploy Build Folder:**
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront

3. **Update API URL:**
Create `.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Security Checklist

- [ ] Change default SECRET_KEY and JWT_SECRET_KEY
- [ ] Use strong passwords for admin account
- [ ] Enable HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting
- [ ] Regular security updates

## Performance Optimization

### Backend
- Use production database (PostgreSQL/MySQL)
- Enable caching (Redis)
- Optimize database queries
- Use CDN for static files

### Frontend
- Enable code splitting
- Optimize images
- Use lazy loading
- Enable service workers (PWA)

## Monitoring & Logging

### Backend Logging
```python
import logging
logging.basicConfig(level=logging.INFO)
```

### Error Tracking
- Sentry (recommended)
- LogRocket
- New Relic

## Support

For issues or questions:
1. Check this guide
2. Review error logs
3. Check GitHub issues
4. Contact support team

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features
3. ✅ Customize branding and content
4. ✅ Add your own career data
5. ✅ Configure OpenAI API for enhanced chatbot
6. ✅ Deploy to production
7. ✅ Monitor and maintain

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [spaCy Documentation](https://spacy.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**Congratulations! Your AI-Based Career Guidance System is ready to use! 🎉**
