from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()


class User(UserMixin, db.Model):
    """User model for authentication and profile"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='student')  # student, admin
    phone = db.Column(db.String(20))
    education_level = db.Column(db.String(50))
    current_status = db.Column(db.String(100))  # student, working, job_seeking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    quiz_attempts = db.relationship('QuizAttempt', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    resumes = db.relationship('Resume', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    recommendations = db.relationship('Recommendation', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    chat_messages = db.relationship('ChatMessage', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    feedbacks = db.relationship('Feedback', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'phone': self.phone,
            'education_level': self.education_level,
            'current_status': self.current_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }


class QuizQuestion(db.Model):
    """Quiz questions for career assessment"""
    __tablename__ = 'quiz_questions'
    
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # logical, creative, technical, communication, etc.
    options = db.Column(db.Text, nullable=False)  # JSON array of options
    correct_answer = db.Column(db.String(10))  # For scored questions
    weight = db.Column(db.Float, default=1.0)  # Question importance
    order_index = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_options(self):
        """Parse options from JSON"""
        return json.loads(self.options) if self.options else []
    
    def set_options(self, options_list):
        """Set options as JSON"""
        self.options = json.dumps(options_list)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'question_text': self.question_text,
            'category': self.category,
            'options': self.get_options(),
            'weight': self.weight,
            'order_index': self.order_index
        }


class QuizAttempt(db.Model):
    """User quiz attempts and results"""
    __tablename__ = 'quiz_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    answers = db.Column(db.Text, nullable=False)  # JSON of question_id: answer
    scores = db.Column(db.Text)  # JSON of category: score
    total_score = db.Column(db.Float)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    time_taken = db.Column(db.Integer)  # seconds
    
    def get_answers(self):
        """Parse answers from JSON"""
        return json.loads(self.answers) if self.answers else {}
    
    def set_answers(self, answers_dict):
        """Set answers as JSON"""
        self.answers = json.dumps(answers_dict)
    
    def get_scores(self):
        """Parse scores from JSON"""
        return json.loads(self.scores) if self.scores else {}
    
    def set_scores(self, scores_dict):
        """Set scores as JSON"""
        self.scores = json.dumps(scores_dict)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'answers': self.get_answers(),
            'scores': self.get_scores(),
            'total_score': self.total_score,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'time_taken': self.time_taken
        }


class Career(db.Model):
    """Career options database"""
    __tablename__ = 'careers'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # technology, healthcare, business, etc.
    required_skills = db.Column(db.Text)  # JSON array
    education_requirements = db.Column(db.Text)
    average_salary = db.Column(db.String(50))
    job_outlook = db.Column(db.String(50))  # excellent, good, fair
    work_environment = db.Column(db.Text)
    personality_traits = db.Column(db.Text)  # JSON array
    related_careers = db.Column(db.Text)  # JSON array of career IDs
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    roadmaps = db.relationship('CareerRoadmap', backref='career', lazy='dynamic', cascade='all, delete-orphan')
    recommendations = db.relationship('Recommendation', backref='career', lazy='dynamic')
    
    def get_required_skills(self):
        """Parse required skills from JSON"""
        return json.loads(self.required_skills) if self.required_skills else []
    
    def set_required_skills(self, skills_list):
        """Set required skills as JSON"""
        self.required_skills = json.dumps(skills_list)
    
    def get_personality_traits(self):
        """Parse personality traits from JSON"""
        return json.loads(self.personality_traits) if self.personality_traits else []
    
    def set_personality_traits(self, traits_list):
        """Set personality traits as JSON"""
        self.personality_traits = json.dumps(traits_list)
    
    def get_related_careers(self):
        """Parse related careers from JSON"""
        return json.loads(self.related_careers) if self.related_careers else []
    
    def set_related_careers(self, careers_list):
        """Set related careers as JSON"""
        self.related_careers = json.dumps(careers_list)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'required_skills': self.get_required_skills(),
            'education_requirements': self.education_requirements,
            'average_salary': self.average_salary,
            'job_outlook': self.job_outlook,
            'work_environment': self.work_environment,
            'personality_traits': self.get_personality_traits(),
            'related_careers': self.get_related_careers(),
            'is_active': self.is_active
        }


class CareerRoadmap(db.Model):
    """Career roadmap with milestones"""
    __tablename__ = 'career_roadmaps'
    
    id = db.Column(db.Integer, primary_key=True)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id'), nullable=False)
    phase = db.Column(db.String(50), nullable=False)  # beginner, intermediate, advanced
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    duration = db.Column(db.String(50))  # e.g., "3-6 months"
    resources = db.Column(db.Text)  # JSON array of courses, certifications
    skills_to_develop = db.Column(db.Text)  # JSON array
    projects = db.Column(db.Text)  # JSON array
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_resources(self):
        """Parse resources from JSON"""
        return json.loads(self.resources) if self.resources else []
    
    def set_resources(self, resources_list):
        """Set resources as JSON"""
        self.resources = json.dumps(resources_list)
    
    def get_skills_to_develop(self):
        """Parse skills from JSON"""
        return json.loads(self.skills_to_develop) if self.skills_to_develop else []
    
    def set_skills_to_develop(self, skills_list):
        """Set skills as JSON"""
        self.skills_to_develop = json.dumps(skills_list)
    
    def get_projects(self):
        """Parse projects from JSON"""
        return json.loads(self.projects) if self.projects else []
    
    def set_projects(self, projects_list):
        """Set projects as JSON"""
        self.projects = json.dumps(projects_list)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'career_id': self.career_id,
            'phase': self.phase,
            'title': self.title,
            'description': self.description,
            'duration': self.duration,
            'resources': self.get_resources(),
            'skills_to_develop': self.get_skills_to_develop(),
            'projects': self.get_projects(),
            'order_index': self.order_index
        }


class Resume(db.Model):
    """User resume uploads and analysis"""
    __tablename__ = 'resumes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    extracted_text = db.Column(db.Text)
    extracted_skills = db.Column(db.Text)  # JSON array
    extracted_education = db.Column(db.Text)
    extracted_experience = db.Column(db.Text)
    analysis_results = db.Column(db.Text)  # JSON with detailed analysis
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_extracted_skills(self):
        """Parse extracted skills from JSON"""
        return json.loads(self.extracted_skills) if self.extracted_skills else []
    
    def set_extracted_skills(self, skills_list):
        """Set extracted skills as JSON"""
        self.extracted_skills = json.dumps(skills_list)
    
    def get_analysis_results(self):
        """Parse analysis results from JSON"""
        return json.loads(self.analysis_results) if self.analysis_results else {}
    
    def set_analysis_results(self, results_dict):
        """Set analysis results as JSON"""
        self.analysis_results = json.dumps(results_dict)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'extracted_skills': self.get_extracted_skills(),
            'extracted_education': self.extracted_education,
            'extracted_experience': self.extracted_experience,
            'analysis_results': self.get_analysis_results(),
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }


class Recommendation(db.Model):
    """AI-generated career recommendations"""
    __tablename__ = 'recommendations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    career_id = db.Column(db.Integer, db.ForeignKey('careers.id'), nullable=False)
    quiz_attempt_id = db.Column(db.Integer, db.ForeignKey('quiz_attempts.id'))
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'))
    match_score = db.Column(db.Float, nullable=False)  # 0-100
    reasoning = db.Column(db.Text)  # Why this career was recommended
    strengths = db.Column(db.Text)  # JSON array
    areas_to_improve = db.Column(db.Text)  # JSON array
    is_viewed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_strengths(self):
        """Parse strengths from JSON"""
        return json.loads(self.strengths) if self.strengths else []
    
    def set_strengths(self, strengths_list):
        """Set strengths as JSON"""
        self.strengths = json.dumps(strengths_list)
    
    def get_areas_to_improve(self):
        """Parse areas to improve from JSON"""
        return json.loads(self.areas_to_improve) if self.areas_to_improve else []
    
    def set_areas_to_improve(self, areas_list):
        """Set areas to improve as JSON"""
        self.areas_to_improve = json.dumps(areas_list)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'career_id': self.career_id,
            'career': self.career.to_dict() if self.career else None,
            'match_score': self.match_score,
            'reasoning': self.reasoning,
            'strengths': self.get_strengths(),
            'areas_to_improve': self.get_areas_to_improve(),
            'is_viewed': self.is_viewed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ChatMessage(db.Model):
    """Chatbot conversation history"""
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    context = db.Column(db.Text)  # JSON with conversation context
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_context(self):
        """Parse context from JSON"""
        return json.loads(self.context) if self.context else {}
    
    def set_context(self, context_dict):
        """Set context as JSON"""
        self.context = json.dumps(context_dict)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'response': self.response,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Feedback(db.Model):
    """User feedback on recommendations"""
    __tablename__ = 'feedbacks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recommendation_id = db.Column(db.Integer, db.ForeignKey('recommendations.id'))
    rating = db.Column(db.Integer)  # 1-5 stars
    comment = db.Column(db.Text)
    feedback_type = db.Column(db.String(50))  # recommendation, platform, roadmap
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recommendation_id': self.recommendation_id,
            'rating': self.rating,
            'comment': self.comment,
            'feedback_type': self.feedback_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Notification(db.Model):
    """User notifications"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(50))  # tip, alert, update
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'notification_type': self.notification_type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
