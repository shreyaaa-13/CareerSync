from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Recommendation, Career, QuizAttempt, Resume, User
from services.recommendation_engine import RecommendationEngine

recommendation_bp = Blueprint('recommendation', __name__)


@recommendation_bp.route('/', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get user's career recommendations"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get existing recommendations
        recommendations = Recommendation.query.filter_by(user_id=current_user_id)\
            .order_by(Recommendation.match_score.desc())\
            .all()
        
        if not recommendations:
            return jsonify({
                'recommendations': [],
                'message': 'No recommendations yet. Please complete the quiz or upload your resume.'
            }), 200
        
        return jsonify({
            'recommendations': [rec.to_dict() for rec in recommendations],
            'total': len(recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@recommendation_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_recommendations():
    """Generate new career recommendations based on quiz and resume"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get latest quiz attempt
        latest_quiz = QuizAttempt.query.filter_by(user_id=current_user_id)\
            .order_by(QuizAttempt.completed_at.desc())\
            .first()
        
        # Get latest resume
        latest_resume = Resume.query.filter_by(user_id=current_user_id)\
            .order_by(Resume.uploaded_at.desc())\
            .first()
        
        if not latest_quiz and not latest_resume:
            return jsonify({
                'error': 'Please complete the quiz or upload your resume first'
            }), 400
        
        # Initialize recommendation engine
        engine = RecommendationEngine()
        
        # Generate recommendations
        recommendations = engine.generate_recommendations(
            user=user,
            quiz_attempt=latest_quiz,
            resume=latest_resume
        )
        
        # Delete old recommendations for this user
        Recommendation.query.filter_by(user_id=current_user_id).delete()
        
        # Save new recommendations
        for rec_data in recommendations:
            recommendation = Recommendation(
                user_id=current_user_id,
                career_id=rec_data['career_id'],
                quiz_attempt_id=latest_quiz.id if latest_quiz else None,
                resume_id=latest_resume.id if latest_resume else None,
                match_score=rec_data['match_score'],
                reasoning=rec_data['reasoning']
            )
            recommendation.set_strengths(rec_data['strengths'])
            recommendation.set_areas_to_improve(rec_data['areas_to_improve'])
            
            db.session.add(recommendation)
        
        db.session.commit()
        
        # Fetch saved recommendations with career details
        saved_recommendations = Recommendation.query.filter_by(user_id=current_user_id)\
            .order_by(Recommendation.match_score.desc())\
            .all()
        
        return jsonify({
            'message': 'Recommendations generated successfully',
            'recommendations': [rec.to_dict() for rec in saved_recommendations],
            'total': len(saved_recommendations)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@recommendation_bp.route('/<int:recommendation_id>', methods=['GET'])
@jwt_required()
def get_recommendation(recommendation_id):
    """Get specific recommendation details"""
    try:
        current_user_id = get_jwt_identity()
        
        recommendation = Recommendation.query.filter_by(
            id=recommendation_id,
            user_id=current_user_id
        ).first()
        
        if not recommendation:
            return jsonify({'error': 'Recommendation not found'}), 404
        
        # Mark as viewed
        if not recommendation.is_viewed:
            recommendation.is_viewed = True
            db.session.commit()
        
        return jsonify({'recommendation': recommendation.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@recommendation_bp.route('/<int:recommendation_id>/accept', methods=['POST'])
@jwt_required()
def accept_recommendation(recommendation_id):
    """Mark recommendation as accepted/selected"""
    try:
        current_user_id = get_jwt_identity()
        
        recommendation = Recommendation.query.filter_by(
            id=recommendation_id,
            user_id=current_user_id
        ).first()
        
        if not recommendation:
            return jsonify({'error': 'Recommendation not found'}), 404
        
        recommendation.is_viewed = True
        db.session.commit()
        
        return jsonify({
            'message': 'Recommendation accepted',
            'recommendation': recommendation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@recommendation_bp.route('/top', methods=['GET'])
@jwt_required()
def get_top_recommendations():
    """Get top 5 recommendations for user"""
    try:
        current_user_id = get_jwt_identity()
        
        recommendations = Recommendation.query.filter_by(user_id=current_user_id)\
            .order_by(Recommendation.match_score.desc())\
            .limit(5)\
            .all()
        
        return jsonify({
            'top_recommendations': [rec.to_dict() for rec in recommendations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
