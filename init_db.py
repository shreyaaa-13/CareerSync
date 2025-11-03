"""
Database initialization script with sample data
Run this script to set up the database with initial data
"""

from app import create_app
from models import db, User, Career, CareerRoadmap, QuizQuestion
from datetime import datetime
import os

def init_database():
    """Initialize database with sample data"""
    
    app = create_app()
    
    with app.app_context():
        # Drop all tables and recreate
        print("Creating database tables...")
        db.drop_all()
        db.create_all()
        
        # Create admin user
        print("Creating admin user...")
        admin = User(
            email='admin@careerguidance.com',
            full_name='Admin User',
            role='admin',
            education_level='masters',
            current_status='working'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create sample student users
        print("Creating sample users...")
        student1 = User(
            email='john.doe@example.com',
            full_name='John Doe',
            role='student',
            education_level='bachelors',
            current_status='student',
            phone='1234567890'
        )
        student1.set_password('password123')
        db.session.add(student1)
        
        student2 = User(
            email='jane.smith@example.com',
            full_name='Jane Smith',
            role='student',
            education_level='high_school',
            current_status='job_seeking',
            phone='0987654321'
        )
        student2.set_password('password123')
        db.session.add(student2)
        
        # Create careers
        print("Creating career data...")
        
        # Software Engineer
        career1 = Career(
            title='Software Engineer',
            description='Software engineers design, develop, test, and maintain software applications and systems. They work with various programming languages and frameworks to create solutions for businesses and users.',
            category='Technology',
            education_requirements='Bachelor\'s degree in Computer Science or related field, or equivalent experience',
            average_salary='$80,000 - $150,000',
            job_outlook='Excellent',
            work_environment='Office or remote, collaborative team environment'
        )
        career1.set_required_skills(['Python', 'Java', 'JavaScript', 'Git', 'Data Structures', 'Algorithms', 'Problem Solving', 'Debugging', 'API Development'])
        career1.set_personality_traits(['Analytical', 'Detail-oriented', 'Problem solver', 'Team player', 'Continuous learner'])
        db.session.add(career1)
        
        # Data Scientist
        career2 = Career(
            title='Data Scientist',
            description='Data scientists analyze complex data sets to help organizations make informed decisions. They use statistical analysis, machine learning, and data visualization to extract insights from data.',
            category='Technology',
            education_requirements='Bachelor\'s or Master\'s degree in Data Science, Statistics, Computer Science, or related field',
            average_salary='$90,000 - $160,000',
            job_outlook='Excellent',
            work_environment='Office or remote, often collaborative with business teams'
        )
        career2.set_required_skills(['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'NumPy', 'TensorFlow', 'Scikit-learn'])
        career2.set_personality_traits(['Analytical', 'Curious', 'Detail-oriented', 'Problem solver', 'Good communicator'])
        db.session.add(career2)
        
        # Web Developer
        career3 = Career(
            title='Web Developer',
            description='Web developers create and maintain websites and web applications. They work on both front-end (user interface) and back-end (server-side) development.',
            category='Technology',
            education_requirements='Bachelor\'s degree in Computer Science or bootcamp certification',
            average_salary='$60,000 - $120,000',
            job_outlook='Very Good',
            work_environment='Office, remote, or freelance'
        )
        career3.set_required_skills(['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Responsive Design', 'Git', 'REST APIs', 'Database Management'])
        career3.set_personality_traits(['Creative', 'Detail-oriented', 'Problem solver', 'User-focused', 'Adaptable'])
        db.session.add(career3)
        
        # Product Manager
        career4 = Career(
            title='Product Manager',
            description='Product managers guide the development and success of products. They work with engineering, design, and business teams to define product strategy and roadmap.',
            category='Business',
            education_requirements='Bachelor\'s degree in Business, Computer Science, or related field; MBA helpful',
            average_salary='$90,000 - $180,000',
            job_outlook='Very Good',
            work_environment='Office or remote, highly collaborative'
        )
        career4.set_required_skills(['Strategic Thinking', 'Communication', 'Data Analysis', 'User Research', 'Agile/Scrum', 'Project Management', 'Prioritization'])
        career4.set_personality_traits(['Strategic', 'Leadership', 'Communicator', 'Analytical', 'Empathetic'])
        db.session.add(career4)
        
        # UX/UI Designer
        career5 = Career(
            title='UX/UI Designer',
            description='UX/UI designers create intuitive and visually appealing user interfaces for digital products. They focus on user experience and interface design.',
            category='Design',
            education_requirements='Bachelor\'s degree in Design, HCI, or related field, or strong portfolio',
            average_salary='$70,000 - $130,000',
            job_outlook='Very Good',
            work_environment='Office or remote, collaborative with product teams'
        )
        career5.set_required_skills(['Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'User Research', 'Visual Design', 'Interaction Design'])
        career5.set_personality_traits(['Creative', 'Empathetic', 'Detail-oriented', 'User-focused', 'Collaborative'])
        db.session.add(career5)
        
        # Digital Marketing Manager
        career6 = Career(
            title='Digital Marketing Manager',
            description='Digital marketing managers develop and execute online marketing strategies to promote products and services across digital channels.',
            category='Marketing',
            education_requirements='Bachelor\'s degree in Marketing, Business, or related field',
            average_salary='$60,000 - $110,000',
            job_outlook='Good',
            work_environment='Office or remote, fast-paced'
        )
        career6.set_required_skills(['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics', 'Email Marketing', 'Google Ads', 'Marketing Automation'])
        career6.set_personality_traits(['Creative', 'Analytical', 'Strategic', 'Communicator', 'Trend-aware'])
        db.session.add(career6)
        
        db.session.commit()
        
        # Create roadmaps for Software Engineer
        print("Creating career roadmaps...")
        
        roadmap1_1 = CareerRoadmap(
            career_id=1,
            phase='Beginner',
            title='Foundation & Learning',
            description='Build strong programming fundamentals and learn core concepts',
            duration='3-6 months',
            order_index=1
        )
        roadmap1_1.set_resources([
            {'type': 'course', 'name': 'CS50 Introduction to Computer Science', 'url': 'https://cs50.harvard.edu'},
            {'type': 'course', 'name': 'Python for Everybody', 'url': 'https://www.py4e.com'},
            {'type': 'book', 'name': 'Clean Code by Robert Martin'}
        ])
        roadmap1_1.set_skills_to_develop(['Programming basics', 'Data structures', 'Algorithms', 'Version control (Git)'])
        roadmap1_1.set_projects(['Build a calculator app', 'Create a to-do list application', 'Develop a personal portfolio website'])
        db.session.add(roadmap1_1)
        
        roadmap1_2 = CareerRoadmap(
            career_id=1,
            phase='Intermediate',
            title='Practical Development',
            description='Work on real projects and learn industry tools',
            duration='6-12 months',
            order_index=2
        )
        roadmap1_2.set_resources([
            {'type': 'course', 'name': 'Full Stack Web Development', 'url': 'https://www.theodinproject.com'},
            {'type': 'platform', 'name': 'LeetCode for coding practice', 'url': 'https://leetcode.com'},
            {'type': 'certification', 'name': 'AWS Certified Developer'}
        ])
        roadmap1_2.set_skills_to_develop(['Web frameworks', 'Databases', 'APIs', 'Testing', 'Cloud platforms'])
        roadmap1_2.set_projects(['Build a full-stack web application', 'Contribute to open source', 'Create a REST API'])
        db.session.add(roadmap1_2)
        
        roadmap1_3 = CareerRoadmap(
            career_id=1,
            phase='Advanced',
            title='Professional Development',
            description='Prepare for job market and advance your career',
            duration='Ongoing',
            order_index=3
        )
        roadmap1_3.set_resources([
            {'type': 'book', 'name': 'Designing Data-Intensive Applications'},
            {'type': 'platform', 'name': 'System Design Interview Prep'},
            {'type': 'community', 'name': 'Join tech communities and attend meetups'}
        ])
        roadmap1_3.set_skills_to_develop(['System design', 'Scalability', 'Security', 'DevOps', 'Leadership'])
        roadmap1_3.set_projects(['Build a scalable application', 'Optimize existing projects', 'Mentor junior developers'])
        db.session.add(roadmap1_3)
        
        # Create quiz questions
        print("Creating quiz questions...")
        
        questions = [
            {
                'text': 'I enjoy solving complex logical problems and puzzles.',
                'category': 'Logical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I prefer working with numbers and data over creative tasks.',
                'category': 'Analytical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am comfortable learning and using new technology.',
                'category': 'Technical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I enjoy expressing ideas through art, design, or writing.',
                'category': 'Creative',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am good at explaining complex concepts to others.',
                'category': 'Communication',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I prefer working in teams rather than independently.',
                'category': 'Teamwork',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I enjoy leading projects and making strategic decisions.',
                'category': 'Leadership',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am interested in understanding how things work technically.',
                'category': 'Technical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I enjoy analyzing data to find patterns and insights.',
                'category': 'Analytical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am patient and enjoy helping others learn.',
                'category': 'Teaching',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I like creating visual designs and aesthetically pleasing content.',
                'category': 'Creative',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am comfortable with public speaking and presentations.',
                'category': 'Communication',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I enjoy building and fixing things with my hands.',
                'category': 'Practical',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I am interested in business strategy and entrepreneurship.',
                'category': 'Business',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            },
            {
                'text': 'I enjoy researching and learning about new topics.',
                'category': 'Research',
                'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
            }
        ]
        
        for idx, q in enumerate(questions):
            question = QuizQuestion(
                question_text=q['text'],
                category=q['category'],
                order_index=idx + 1,
                weight=1.0
            )
            question.set_options(q['options'])
            db.session.add(question)
        
        db.session.commit()
        
        print("\n" + "="*50)
        print("Database initialized successfully!")
        print("="*50)
        print("\nDefault Admin Credentials:")
        print("Email: admin@careerguidance.com")
        print("Password: admin123")
        print("\nSample Student Credentials:")
        print("Email: john.doe@example.com")
        print("Password: password123")
        print("="*50 + "\n")


if __name__ == '__main__':
    init_database()
