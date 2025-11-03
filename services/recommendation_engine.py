import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models import Career, QuizAttempt, Resume
import json


class RecommendationEngine:
    """AI-powered career recommendation engine"""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    
    def generate_recommendations(self, user, quiz_attempt=None, resume=None, top_n=10):
        """
        Generate career recommendations based on quiz results and resume
        
        Args:
            user: User object
            quiz_attempt: QuizAttempt object (optional)
            resume: Resume object (optional)
            top_n: Number of recommendations to return
        
        Returns:
            List of recommendation dictionaries
        """
        try:
            # Get all active careers
            careers = Career.query.filter_by(is_active=True).all()
            
            if not careers:
                return []
            
            # Calculate scores for each career
            career_scores = []
            
            for career in careers:
                score_data = self._calculate_career_score(
                    career=career,
                    user=user,
                    quiz_attempt=quiz_attempt,
                    resume=resume
                )
                career_scores.append(score_data)
            
            # Sort by match score
            career_scores.sort(key=lambda x: x['match_score'], reverse=True)
            
            # Return top N recommendations
            return career_scores[:top_n]
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return []
    
    def _calculate_career_score(self, career, user, quiz_attempt=None, resume=None):
        """Calculate match score for a specific career"""
        
        total_score = 0
        weights = {'quiz': 0.4, 'resume': 0.4, 'profile': 0.2}
        
        strengths = []
        areas_to_improve = []
        reasoning_parts = []
        
        # 1. Quiz-based scoring
        if quiz_attempt:
            quiz_score = self._score_from_quiz(career, quiz_attempt)
            total_score += quiz_score * weights['quiz']
            
            if quiz_score > 70:
                strengths.append(f"Strong aptitude in {career.category}")
                reasoning_parts.append(f"Your quiz results show {quiz_score:.0f}% compatibility")
            elif quiz_score < 50:
                areas_to_improve.append(f"Develop skills in {career.category}")
        
        # 2. Resume-based scoring
        if resume:
            resume_score = self._score_from_resume(career, resume)
            total_score += resume_score * weights['resume']
            
            if resume_score > 70:
                strengths.append("Relevant experience and skills")
                reasoning_parts.append(f"Your resume shows {resume_score:.0f}% skill match")
            elif resume_score < 50:
                missing_skills = self._get_missing_skills(career, resume)
                if missing_skills:
                    areas_to_improve.append(f"Acquire skills: {', '.join(missing_skills[:3])}")
        
        # 3. Profile-based scoring
        profile_score = self._score_from_profile(career, user)
        total_score += profile_score * weights['profile']
        
        # Normalize score to 0-100
        if not quiz_attempt and not resume:
            total_score = profile_score  # Only profile available
        elif not quiz_attempt:
            total_score = (resume_score * 0.7 + profile_score * 0.3)
        elif not resume:
            total_score = (quiz_score * 0.7 + profile_score * 0.3)
        
        # Generate reasoning
        reasoning = self._generate_reasoning(career, total_score, reasoning_parts)
        
        # Add default strengths/improvements if none found
        if not strengths:
            strengths = ["Good foundational potential", "Willingness to learn"]
        if not areas_to_improve:
            areas_to_improve = ["Gain practical experience", "Build portfolio projects"]
        
        return {
            'career_id': career.id,
            'match_score': min(100, max(0, total_score)),
            'reasoning': reasoning,
            'strengths': strengths,
            'areas_to_improve': areas_to_improve
        }
    
    def _score_from_quiz(self, career, quiz_attempt):
        """Calculate score based on quiz results"""
        try:
            scores = quiz_attempt.get_scores()
            
            # Map career categories to quiz categories
            category_mapping = {
                'technology': ['technical', 'logical'],
                'healthcare': ['communication', 'analytical'],
                'business': ['communication', 'leadership'],
                'creative': ['creative', 'artistic'],
                'education': ['communication', 'patience'],
                'engineering': ['technical', 'logical', 'analytical']
            }
            
            career_category = career.category.lower()
            relevant_categories = category_mapping.get(career_category, ['logical', 'technical'])
            
            # Calculate average score for relevant categories
            relevant_scores = []
            for cat in relevant_categories:
                for score_cat, score_data in scores.items():
                    if cat in score_cat.lower():
                        if 'percentage' in score_data:
                            relevant_scores.append(score_data['percentage'])
            
            if relevant_scores:
                return sum(relevant_scores) / len(relevant_scores)
            
            # Fallback to total score
            return quiz_attempt.total_score if quiz_attempt.total_score else 50
            
        except Exception as e:
            print(f"Error scoring from quiz: {str(e)}")
            return 50
    
    def _score_from_resume(self, career, resume):
        """Calculate score based on resume analysis"""
        try:
            resume_skills = set([s.lower() for s in resume.get_extracted_skills()])
            career_skills = set([s.lower() for s in career.get_required_skills()])
            
            if not career_skills:
                return 60  # Default score if no required skills defined
            
            # Calculate skill overlap
            matching_skills = resume_skills.intersection(career_skills)
            
            if len(career_skills) > 0:
                skill_match_percentage = (len(matching_skills) / len(career_skills)) * 100
            else:
                skill_match_percentage = 50
            
            # Bonus for experience
            experience_bonus = 0
            if resume.extracted_experience:
                experience_text = resume.extracted_experience.lower()
                if career.title.lower() in experience_text or career.category.lower() in experience_text:
                    experience_bonus = 20
            
            return min(100, skill_match_percentage + experience_bonus)
            
        except Exception as e:
            print(f"Error scoring from resume: {str(e)}")
            return 50
    
    def _score_from_profile(self, career, user):
        """Calculate score based on user profile"""
        try:
            score = 50  # Base score
            
            # Education level bonus
            education_mapping = {
                'high_school': 50,
                'bachelors': 70,
                'masters': 85,
                'phd': 95
            }
            
            if user.education_level:
                score = education_mapping.get(user.education_level.lower(), 60)
            
            return score
            
        except Exception as e:
            print(f"Error scoring from profile: {str(e)}")
            return 50
    
    def _get_missing_skills(self, career, resume):
        """Get skills that are required but missing from resume"""
        try:
            resume_skills = set([s.lower() for s in resume.get_extracted_skills()])
            career_skills = set([s.lower() for s in career.get_required_skills()])
            
            missing = career_skills - resume_skills
            return list(missing)
            
        except Exception as e:
            return []
    
    def _generate_reasoning(self, career, score, reasoning_parts):
        """Generate human-readable reasoning for recommendation"""
        
        if score >= 80:
            base = f"Excellent match for {career.title}! "
        elif score >= 60:
            base = f"Good fit for {career.title}. "
        elif score >= 40:
            base = f"Moderate fit for {career.title}. "
        else:
            base = f"Potential opportunity in {career.title}. "
        
        if reasoning_parts:
            return base + " ".join(reasoning_parts) + "."
        else:
            return base + "This career aligns with your profile and interests."
