from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Career, CareerRoadmap
from sqlalchemy import or_

career_bp = Blueprint('career', __name__)


@career_bp.route('/', methods=['GET'])
@jwt_required()
def get_careers():
    """Get all careers with optional filtering"""
    try:
        # Get query parameters
        category = request.args.get('category')
        search = request.args.get('search')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Build query
        query = Career.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                or_(
                    Career.title.ilike(search_term),
                    Career.description.ilike(search_term)
                )
            )
        
        # Paginate results
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        careers = pagination.items
        
        return jsonify({
            'careers': [career.to_dict() for career in careers],
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@career_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all career categories"""
    try:
        categories = db.session.query(Career.category)\
            .filter_by(is_active=True)\
            .distinct()\
            .all()
        
        category_list = [cat[0] for cat in categories]
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@career_bp.route('/<int:career_id>', methods=['GET'])
@jwt_required()
def get_career(career_id):
    """Get specific career details"""
    try:
        career = Career.query.filter_by(id=career_id, is_active=True).first()
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        return jsonify({'career': career.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@career_bp.route('/<int:career_id>/roadmap', methods=['GET'])
@jwt_required()
def get_career_roadmap(career_id):
    """Get career roadmap"""
    try:
        career = Career.query.filter_by(id=career_id, is_active=True).first()
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        roadmap = CareerRoadmap.query.filter_by(career_id=career_id)\
            .order_by(CareerRoadmap.order_index)\
            .all()
        
        return jsonify({
            'career': career.to_dict(),
            'roadmap': [phase.to_dict() for phase in roadmap]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@career_bp.route('/<int:career_id>/related', methods=['GET'])
@jwt_required()
def get_related_careers(career_id):
    """Get related careers"""
    try:
        career = Career.query.filter_by(id=career_id, is_active=True).first()
        
        if not career:
            return jsonify({'error': 'Career not found'}), 404
        
        related_ids = career.get_related_careers()
        
        if not related_ids:
            # If no related careers defined, find by same category
            related = Career.query.filter(
                Career.id != career_id,
                Career.category == career.category,
                Career.is_active == True
            ).limit(5).all()
        else:
            related = Career.query.filter(
                Career.id.in_(related_ids),
                Career.is_active == True
            ).all()
        
        return jsonify({
            'related_careers': [c.to_dict() for c in related]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@career_bp.route('/popular', methods=['GET'])
@jwt_required()
def get_popular_careers():
    """Get most popular careers based on recommendations"""
    try:
        from models import Recommendation
        from sqlalchemy import func
        
        # Get careers with most recommendations
        popular = db.session.query(
            Career,
            func.count(Recommendation.id).label('recommendation_count')
        ).join(Recommendation).filter(Career.is_active == True)\
            .group_by(Career.id)\
            .order_by(func.count(Recommendation.id).desc())\
            .limit(10)\
            .all()
        
        return jsonify({
            'popular_careers': [
                {
                    **career.to_dict(),
                    'recommendation_count': count
                }
                for career, count in popular
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
