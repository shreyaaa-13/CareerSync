from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, QuizQuestion, QuizAttempt, User
from datetime import datetime

quiz_bp = Blueprint('quiz', __name__)


@quiz_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_questions():
    """Get all active quiz questions"""
    try:
        category = request.args.get('category')
        
        query = QuizQuestion.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        questions = query.order_by(QuizQuestion.order_index).all()
        
        return jsonify({
            'questions': [q.to_dict() for q in questions],
            'total': len(questions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all quiz categories"""
    try:
        categories = db.session.query(QuizQuestion.category).filter_by(is_active=True).distinct().all()
        category_list = [cat[0] for cat in categories]
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_quiz():
    """Submit quiz answers and calculate scores"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('answers'):
            return jsonify({'error': 'Answers are required'}), 400
        
        answers = data['answers']  # Dictionary of question_id: answer
        time_taken = data.get('time_taken', 0)
        
        # Calculate scores by category
        category_scores = {}
        total_score = 0
        total_weight = 0
        
        for question_id, answer in answers.items():
            question = QuizQuestion.query.get(int(question_id))
            if not question:
                continue
            
            category = question.category
            weight = question.weight
            
            # Initialize category if not exists
            if category not in category_scores:
                category_scores[category] = {'score': 0, 'total': 0, 'count': 0}
            
            # Calculate score (simplified - can be enhanced with more complex logic)
            # For now, we'll use a simple scoring: each answer contributes based on weight
            score = weight * (ord(answer.upper()) - ord('A') + 1) if len(answer) == 1 else weight
            
            category_scores[category]['score'] += score
            category_scores[category]['total'] += weight * 5  # Assuming max 5 options
            category_scores[category]['count'] += 1
            
            total_score += score
            total_weight += weight * 5
        
        # Normalize scores to 0-100 scale
        for category in category_scores:
            if category_scores[category]['total'] > 0:
                category_scores[category]['percentage'] = (
                    category_scores[category]['score'] / category_scores[category]['total']
                ) * 100
            else:
                category_scores[category]['percentage'] = 0
        
        total_percentage = (total_score / total_weight * 100) if total_weight > 0 else 0
        
        # Save quiz attempt
        attempt = QuizAttempt(
            user_id=current_user_id,
            total_score=total_percentage,
            time_taken=time_taken
        )
        attempt.set_answers(answers)
        attempt.set_scores(category_scores)
        
        db.session.add(attempt)
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz submitted successfully',
            'attempt_id': attempt.id,
            'total_score': total_percentage,
            'category_scores': category_scores,
            'completed_at': attempt.completed_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/attempts', methods=['GET'])
@jwt_required()
def get_attempts():
    """Get user's quiz attempts"""
    try:
        current_user_id = get_jwt_identity()
        
        attempts = QuizAttempt.query.filter_by(user_id=current_user_id)\
            .order_by(QuizAttempt.completed_at.desc()).all()
        
        return jsonify({
            'attempts': [attempt.to_dict() for attempt in attempts],
            'total': len(attempts)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/attempts/<int:attempt_id>', methods=['GET'])
@jwt_required()
def get_attempt(attempt_id):
    """Get specific quiz attempt details"""
    try:
        current_user_id = get_jwt_identity()
        
        attempt = QuizAttempt.query.filter_by(
            id=attempt_id,
            user_id=current_user_id
        ).first()
        
        if not attempt:
            return jsonify({'error': 'Attempt not found'}), 404
        
        return jsonify({'attempt': attempt.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/latest-attempt', methods=['GET'])
@jwt_required()
def get_latest_attempt():
    """Get user's latest quiz attempt"""
    try:
        current_user_id = get_jwt_identity()
        
        attempt = QuizAttempt.query.filter_by(user_id=current_user_id)\
            .order_by(QuizAttempt.completed_at.desc()).first()
        
        if not attempt:
            return jsonify({'error': 'No attempts found'}), 404
        
        return jsonify({'attempt': attempt.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@quiz_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    """Get user's quiz statistics"""
    try:
        current_user_id = get_jwt_identity()
        
        attempts = QuizAttempt.query.filter_by(user_id=current_user_id).all()
        
        if not attempts:
            return jsonify({
                'total_attempts': 0,
                'average_score': 0,
                'best_score': 0,
                'latest_score': 0,
                'improvement': 0
            }), 200
        
        scores = [attempt.total_score for attempt in attempts if attempt.total_score]
        
        statistics = {
            'total_attempts': len(attempts),
            'average_score': sum(scores) / len(scores) if scores else 0,
            'best_score': max(scores) if scores else 0,
            'latest_score': attempts[0].total_score if attempts[0].total_score else 0,
            'improvement': 0
        }
        
        # Calculate improvement (latest vs first)
        if len(scores) > 1:
            statistics['improvement'] = scores[0] - scores[-1]
        
        return jsonify(statistics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
