# CareerSync-AI-Based Career Guidance System

A comprehensive web platform that helps students and professionals discover suitable career paths using AI-powered recommendations, skill assessments, and personalized roadmaps.

## Features

### Core Features
- **User Authentication**: Secure registration/login with role-based access (Student/Admin)
- **Career Assessment Quiz**: Interactive quiz analyzing interests, personality, and skills
- **AI-Powered Recommendations**: Smart career suggestions based on quiz results and resume analysis
- **Resume Analyzer**: PDF upload with NLP-based skill extraction and gap analysis
- **Personalized Career Roadmap**: Visual roadmaps with degrees, certifications, courses, and timelines
- **AI Chatbot Assistant**: Interactive career guidance chatbot powered by GPT
- **Admin Dashboard**: Complete platform management and analytics

### Additional Features
- Feedback and rating system
- Downloadable PDF reports
- Progress tracking dashboard
- Career search and filtering
- Real-time notifications

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (easily upgradeable to MySQL/PostgreSQL)
- **Authentication**: Flask-Login, JWT, Bcrypt
- **AI/ML**: Scikit-learn, spaCy, NLTK, OpenAI API

### Frontend
- **Framework**: React with modern hooks
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
cd "C:\xampp\htdocs\AI Based Career guidance System"
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

5. Download NLTK data:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

6. Configure environment:
```bash
copy .env.example .env
# Edit .env with your configuration
```

7. Initialize database:
```bash
python init_db.py
```

8. Run the backend:
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

### Default Admin Credentials
- Email: admin@careerguidance.com
- Password: admin123

### For Students
1. Register with your email
2. Complete the career assessment quiz
3. Upload your resume for analysis
4. View AI-powered career recommendations
5. Explore personalized career roadmaps
6. Chat with the AI assistant for guidance

### For Admins
1. Login with admin credentials
2. Manage users and careers
3. Add/edit quiz questions
4. View analytics and reports
5. Monitor platform activity

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Quiz
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Career
- `GET /api/careers` - Get all careers
- `GET /api/careers/<id>` - Get specific career
- `GET /api/careers/<id>/roadmap` - Get career roadmap

### Resume
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/analysis/<id>` - Get analysis results

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get platform analytics
- `POST /api/admin/careers` - Add new career

## Project Structure

```
AI Based Career guidance System/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── config.py        # Configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── utils/       # Utilities
│   └── public/          # Static assets
├── uploads/             # User uploads
├── app.py              # Main application
├── requirements.txt    # Python dependencies
└── README.md          # Documentation
```

## Security Features

- Password hashing with Bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS protection
- File upload restrictions
- SQL injection prevention
- XSS protection

## Deployment

### Local Development
Follow the installation steps above.

### Production Deployment

1. Set environment to production in `.env`
2. Use a production database (MySQL/PostgreSQL)
3. Set strong SECRET_KEY and JWT_SECRET_KEY
4. Enable HTTPS
5. Use gunicorn for serving:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Recommended Hosting
- Backend: AWS EC2, Heroku, Render
- Frontend: Vercel, Netlify
- Database: AWS RDS, PostgreSQL on Heroku

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

## Acknowledgments

- OpenAI for GPT API
- spaCy and NLTK for NLP capabilities
- Flask and React communities
