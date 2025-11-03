from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models import db, Resume, User
from services.resume_analyzer import ResumeAnalyzer
import os

resume_bp = Blueprint('resume', __name__)


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload and analyze resume"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only PDF, DOC, DOCX allowed'}), 400
        
        # Secure filename and save
        filename = secure_filename(file.filename)
        timestamp = str(int(os.path.getmtime(__file__) * 1000)) if os.path.exists(__file__) else '0'
        unique_filename = f"{current_user_id}_{timestamp}_{filename}"
        
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'resumes')
        os.makedirs(upload_folder, exist_ok=True)
        
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Analyze resume
        analyzer = ResumeAnalyzer()
        analysis_results = analyzer.analyze_resume(file_path)
        
        # Save to database
        resume = Resume(
            user_id=current_user_id,
            filename=filename,
            file_path=file_path,
            extracted_text=analysis_results.get('text', ''),
            extracted_education=analysis_results.get('education', ''),
            extracted_experience=analysis_results.get('experience', '')
        )
        resume.set_extracted_skills(analysis_results.get('skills', []))
        resume.set_analysis_results(analysis_results)
        
        db.session.add(resume)
        db.session.commit()
        
        return jsonify({
            'message': 'Resume uploaded and analyzed successfully',
            'resume': resume.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/list', methods=['GET'])
@jwt_required()
def get_resumes():
    """Get user's uploaded resumes"""
    try:
        current_user_id = get_jwt_identity()
        
        resumes = Resume.query.filter_by(user_id=current_user_id)\
            .order_by(Resume.uploaded_at.desc())\
            .all()
        
        return jsonify({
            'resumes': [resume.to_dict() for resume in resumes],
            'total': len(resumes)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/<int:resume_id>', methods=['GET'])
@jwt_required()
def get_resume(resume_id):
    """Get specific resume details"""
    try:
        current_user_id = get_jwt_identity()
        
        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=current_user_id
        ).first()
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        return jsonify({'resume': resume.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/<int:resume_id>/analysis', methods=['GET'])
@jwt_required()
def get_resume_analysis(resume_id):
    """Get detailed resume analysis"""
    try:
        current_user_id = get_jwt_identity()
        
        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=current_user_id
        ).first()
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        analysis = resume.get_analysis_results()
        
        return jsonify({
            'resume_id': resume.id,
            'filename': resume.filename,
            'analysis': analysis,
            'uploaded_at': resume.uploaded_at.isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    """Delete resume"""
    try:
        current_user_id = get_jwt_identity()
        
        resume = Resume.query.filter_by(
            id=resume_id,
            user_id=current_user_id
        ).first()
        
        if not resume:
            return jsonify({'error': 'Resume not found'}), 404
        
        # Delete file from disk
        if os.path.exists(resume.file_path):
            os.remove(resume.file_path)
        
        # Delete from database
        db.session.delete(resume)
        db.session.commit()
        
        return jsonify({'message': 'Resume deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@resume_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_resume():
    """Get user's latest resume"""
    try:
        current_user_id = get_jwt_identity()
        
        resume = Resume.query.filter_by(user_id=current_user_id)\
            .order_by(Resume.uploaded_at.desc())\
            .first()
        
        if not resume:
            return jsonify({'error': 'No resume found'}), 404
        
        return jsonify({'resume': resume.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
