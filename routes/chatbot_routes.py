from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, ChatMessage, User
from services.chatbot_service import ChatbotService

chatbot_bp = Blueprint('chatbot', __name__)


@chatbot_bp.route('/message', methods=['POST'])
@jwt_required()
def send_message():
    """Send message to chatbot and get response"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('message'):
            return jsonify({'error': 'Message is required'}), 400
        
        user_message = data['message']
        context = data.get('context', {})
        
        # Get user info for personalization
        user = User.query.get(current_user_id)
        
        # Initialize chatbot service
        chatbot = ChatbotService()
        
        # Get response
        bot_response = chatbot.get_response(
            user_message=user_message,
            user=user,
            context=context
        )
        
        # Save conversation
        chat_message = ChatMessage(
            user_id=current_user_id,
            message=user_message,
            response=bot_response
        )
        chat_message.set_context(context)
        
        db.session.add(chat_message)
        db.session.commit()
        
        return jsonify({
            'message': user_message,
            'response': bot_response,
            'chat_id': chat_message.id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get user's chat history"""
    try:
        current_user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = ChatMessage.query.filter_by(user_id=current_user_id)\
            .order_by(ChatMessage.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        messages = pagination.items
        
        return jsonify({
            'messages': [msg.to_dict() for msg in messages],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/history/<int:chat_id>', methods=['GET'])
@jwt_required()
def get_chat_message(chat_id):
    """Get specific chat message"""
    try:
        current_user_id = get_jwt_identity()
        
        message = ChatMessage.query.filter_by(
            id=chat_id,
            user_id=current_user_id
        ).first()
        
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        return jsonify({'message': message.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/history/clear', methods=['DELETE'])
@jwt_required()
def clear_chat_history():
    """Clear user's chat history"""
    try:
        current_user_id = get_jwt_identity()
        
        ChatMessage.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        
        return jsonify({'message': 'Chat history cleared successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@chatbot_bp.route('/suggestions', methods=['GET'])
@jwt_required()
def get_suggestions():
    """Get suggested questions for chatbot"""
    try:
        suggestions = [
            "What career is best for me?",
            "How do I become a software engineer?",
            "What skills do I need for data science?",
            "Tell me about careers in healthcare",
            "What certifications should I pursue?",
            "How can I improve my resume?",
            "What are the highest paying careers?",
            "Should I pursue a master's degree?",
            "What are good entry-level jobs in tech?",
            "How do I switch careers?"
        ]
        
        return jsonify({'suggestions': suggestions}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
