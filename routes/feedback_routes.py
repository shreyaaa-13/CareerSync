from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Feedback, User, Recommendation

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_feedback():
    """Submit feedback"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('feedback_type'):
            return jsonify({'error': 'Feedback type is required'}), 400
        
        feedback = Feedback(
            user_id=current_user_id,
            recommendation_id=data.get('recommendation_id'),
            rating=data.get('rating'),
            comment=data.get('comment'),
            feedback_type=data['feedback_type']
        )
        
        db.session.add(feedback)
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback': feedback.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@feedback_bp.route('/list', methods=['GET'])
@jwt_required()
def get_user_feedback():
    """Get user's feedback history"""
    try:
        current_user_id = get_jwt_identity()
        
        feedbacks = Feedback.query.filter_by(user_id=current_user_id)\
            .order_by(Feedback.created_at.desc())\
            .all()
        
        return jsonify({
            'feedbacks': [fb.to_dict() for fb in feedbacks],
            'total': len(feedbacks)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@feedback_bp.route('/<int:feedback_id>', methods=['GET'])
@jwt_required()
def get_feedback(feedback_id):
    """Get specific feedback"""
    try:
        current_user_id = get_jwt_identity()
        
        feedback = Feedback.query.filter_by(
            id=feedback_id,
            user_id=current_user_id
        ).first()
        
        if not feedback:
            return jsonify({'error': 'Feedback not found'}), 404
        
        return jsonify({'feedback': feedback.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@feedback_bp.route('/<int:feedback_id>', methods=['PUT'])
@jwt_required()
def update_feedback(feedback_id):
    """Update feedback"""
    try:
        current_user_id = get_jwt_identity()
        
        feedback = Feedback.query.filter_by(
            id=feedback_id,
            user_id=current_user_id
        ).first()
        
        if not feedback:
            return jsonify({'error': 'Feedback not found'}), 404
        
        data = request.get_json()
        
        if 'rating' in data:
            feedback.rating = data['rating']
        if 'comment' in data:
            feedback.comment = data['comment']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Feedback updated successfully',
            'feedback': feedback.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@feedback_bp.route('/<int:feedback_id>', methods=['DELETE'])
@jwt_required()
def delete_feedback(feedback_id):
    """Delete feedback"""
    try:
        current_user_id = get_jwt_identity()
        
        feedback = Feedback.query.filter_by(
            id=feedback_id,
            user_id=current_user_id
        ).first()
        
        if not feedback:
            return jsonify({'error': 'Feedback not found'}), 404
        
        db.session.delete(feedback)
        db.session.commit()
        
        return jsonify({'message': 'Feedback deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
