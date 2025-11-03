from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Career, CareerRoadmap, QuizQuestion, QuizAttempt, Recommendation, Feedback
from functools import wraps
from sqlalchemy import func
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)


def admin_required(fn):
    """Decorator to require admin role"""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return fn(*args, **kwargs)
    
    return wrapper


@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Get admin dashboard statistics"""
    try:
        # User statistics
        total_users = User.query.filter_by(role='student').count()
        active_users = User.query.filter_by(role='student', is_active=True).count()
        new_users_this_month = User.query.filter(
            User.created_at >= datetime.utcnow() - timedelta(days=30)
        ).count()
        
        # Quiz statistics
        total_quiz_attempts = QuizAttempt.query.count()
        avg_quiz_score = db.session.query(func.avg(QuizAttempt.total_score)).scalar() or 0
        
        # Career statistics
        total_careers = Career.query.filter_by(is_active=True).count()
        total_recommendations = Recommendation.query.count()
        
        # Popular careers
        popular_careers = db.session.query(
            Career.title,
            func.count(Recommendation.id).label('count')
        ).join(Recommendation).group_by(Career.id)\
            .order_by(func.count(Recommendation.id).desc())\
            .limit(5).all()
        
        # Recent feedback
        recent_feedback_count = Feedback.query.filter(
            Feedback.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        avg_feedback_rating = db.session.query(func.avg(Feedback.rating)).scalar() or 0
        
        return jsonify({
            'users': {
                'total': total_users,
                'active': active_users,
                'new_this_month': new_users_this_month
            },
            'quiz': {
                'total_attempts': total_quiz_attempts,
                'average_score': round(avg_quiz_score, 2)
            },
            'careers': {
                'total': total_careers,
                'total_recommendations': total_recommendations
            },
            'popular_careers': [
                {'title': title, 'recommendations': count}
                for title, count in popular_careers
            ],
            'feedback': {
                'recent_count': recent_feedback_count,
                'average_rating': round(avg_feedback_rating, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        role = request.args.get('role')
        
        query = User.query
        
        if role:
            query = query.filter_by(role=role)
        
        pagination = query.order_by(User.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        users = pagination.items
        
        return jsonify({
            'users': [user.to_dict() for user in users],
            'total': pagination.total,
            'page': page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    """Get specific user details"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user statistics
        quiz_attempts = QuizAttempt.query.filter_by(user_id=user_id).count()
        recommendations = Recommendation.query.filter_by(user_id=user_id).count()
        
        user_data = user.to_dict()
        user_data['statistics'] = {
            'quiz_attempts': quiz_attempts,
            'recommendations': recommendations
        }
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['PUT'])
@admin_required
def toggle_user_status(user_id):
    """Activate or deactivate user"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user.is_active = not user.is_active
        db.session.commit()
        
        return jsonify({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Career Management
@admin_bp.route('/careers', methods=['GET'])
@admin_required
def get_all_careers():
    """Get all careers (including inactive)"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = Career.query.order_by(Career.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        careers = pagination.items
        
        return jsonify({
            'careers': [career.to_dict() for career in careers],
            'total': pagination.total,
            'page': page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/careers', methods=['POST'])
@admin_required
def create_career():
    """Create new career"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if career already exists
        if Career.query.filter_by(title=data['title']).first():
            return jsonify({'error': 'Career with this title already exists'}), 400
        
        career = Career(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            education_requirements=data.get('education_requirements'),
            average_salary=data.get('average_salary'),
            job_outlook=data.get('job_outlook'),
            work_environment=data.get('work_environment')
        )
        
        if 'required_skills' in data:
            career.set_required_skills(data['required_skills'])
        if 'personality_traits' in data:
            career.set_personality_traits(data['personality_traits'])
        if 'related_careers' in data:
            career.set_related_careers(data['related_careers'])
        
        db.session.add(career)
        db.session.commit()
        
        return jsonify({
            'message': 'Career created successfully',
            'career': career.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/careers/<int:career_id>', methods=['PUT'])
@admin_required
def update_career(career_id):
    """Update career"""
    try:
        career = Career.query.get(career_id)
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            career.title = data['title']
        if 'description' in data:
            career.description = data['description']
        if 'category' in data:
            career.category = data['category']
        if 'education_requirements' in data:
            career.education_requirements = data['education_requirements']
        if 'average_salary' in data:
            career.average_salary = data['average_salary']
        if 'job_outlook' in data:
            career.job_outlook = data['job_outlook']
        if 'work_environment' in data:
            career.work_environment = data['work_environment']
        if 'required_skills' in data:
            career.set_required_skills(data['required_skills'])
        if 'personality_traits' in data:
            career.set_personality_traits(data['personality_traits'])
        if 'related_careers' in data:
            career.set_related_careers(data['related_careers'])
        
        career.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Career updated successfully',
            'career': career.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/careers/<int:career_id>', methods=['DELETE'])
@admin_required
def delete_career(career_id):
    """Delete career (soft delete by setting is_active to False)"""
    try:
        career = Career.query.get(career_id)
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        career.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Career deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Quiz Management
@admin_bp.route('/quiz/questions', methods=['GET'])
@admin_required
def get_all_questions():
    """Get all quiz questions"""
    try:
        questions = QuizQuestion.query.order_by(QuizQuestion.order_index).all()
        
        return jsonify({
            'questions': [q.to_dict() for q in questions],
            'total': len(questions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/quiz/questions', methods=['POST'])
@admin_required
def create_question():
    """Create new quiz question"""
    try:
        data = request.get_json()
        
        required_fields = ['question_text', 'category', 'options']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        question = QuizQuestion(
            question_text=data['question_text'],
            category=data['category'],
            correct_answer=data.get('correct_answer'),
            weight=data.get('weight', 1.0),
            order_index=data.get('order_index', 0)
        )
        question.set_options(data['options'])
        
        db.session.add(question)
        db.session.commit()
        
        return jsonify({
            'message': 'Question created successfully',
            'question': question.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/quiz/questions/<int:question_id>', methods=['PUT'])
@admin_required
def update_question(question_id):
    """Update quiz question"""
    try:
        question = QuizQuestion.query.get(question_id)
        
        if not question:
            return jsonify({'error': 'Question not found'}), 404
        
        data = request.get_json()
        
        if 'question_text' in data:
            question.question_text = data['question_text']
        if 'category' in data:
            question.category = data['category']
        if 'options' in data:
            question.set_options(data['options'])
        if 'correct_answer' in data:
            question.correct_answer = data['correct_answer']
        if 'weight' in data:
            question.weight = data['weight']
        if 'order_index' in data:
            question.order_index = data['order_index']
        if 'is_active' in data:
            question.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Question updated successfully',
            'question': question.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/quiz/questions/<int:question_id>', methods=['DELETE'])
@admin_required
def delete_question(question_id):
    """Delete quiz question"""
    try:
        question = QuizQuestion.query.get(question_id)
        
        if not question:
            return jsonify({'error': 'Question not found'}), 404
        
        question.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Question deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Roadmap Management
@admin_bp.route('/careers/<int:career_id>/roadmap', methods=['POST'])
@admin_required
def create_roadmap_phase(career_id):
    """Create roadmap phase for career"""
    try:
        career = Career.query.get(career_id)
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        data = request.get_json()
        
        required_fields = ['phase', 'title']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        roadmap = CareerRoadmap(
            career_id=career_id,
            phase=data['phase'],
            title=data['title'],
            description=data.get('description'),
            duration=data.get('duration'),
            order_index=data.get('order_index', 0)
        )
        
        if 'resources' in data:
            roadmap.set_resources(data['resources'])
        if 'skills_to_develop' in data:
            roadmap.set_skills_to_develop(data['skills_to_develop'])
        if 'projects' in data:
            roadmap.set_projects(data['projects'])
        
        db.session.add(roadmap)
        db.session.commit()
        
        return jsonify({
            'message': 'Roadmap phase created successfully',
            'roadmap': roadmap.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/roadmap/<int:roadmap_id>', methods=['PUT'])
@admin_required
def update_roadmap_phase(roadmap_id):
    """Update roadmap phase"""
    try:
        roadmap = CareerRoadmap.query.get(roadmap_id)
        
        if not roadmap:
            return jsonify({'error': 'Roadmap phase not found'}), 404
        
        data = request.get_json()
        
        if 'phase' in data:
            roadmap.phase = data['phase']
        if 'title' in data:
            roadmap.title = data['title']
        if 'description' in data:
            roadmap.description = data['description']
        if 'duration' in data:
            roadmap.duration = data['duration']
        if 'order_index' in data:
            roadmap.order_index = data['order_index']
        if 'resources' in data:
            roadmap.set_resources(data['resources'])
        if 'skills_to_develop' in data:
            roadmap.set_skills_to_develop(data['skills_to_develop'])
        if 'projects' in data:
            roadmap.set_projects(data['projects'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Roadmap phase updated successfully',
            'roadmap': roadmap.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/roadmap/<int:roadmap_id>', methods=['DELETE'])
@admin_required
def delete_roadmap_phase(roadmap_id):
    """Delete roadmap phase"""
    try:
        roadmap = CareerRoadmap.query.get(roadmap_id)
        
        if not roadmap:
            return jsonify({'error': 'Roadmap phase not found'}), 404
        
        db.session.delete(roadmap)
        db.session.commit()
        
        return jsonify({'message': 'Roadmap phase deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
