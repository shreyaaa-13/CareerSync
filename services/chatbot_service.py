import os
import re
from datetime import datetime

try:
    import openai
    openai.api_key = os.getenv('OPENAI_API_KEY', '')
    OPENAI_AVAILABLE = bool(openai.api_key)
except:
    OPENAI_AVAILABLE = False
    print("Warning: OpenAI not configured. Using rule-based chatbot.")


class ChatbotService:
    """AI-powered chatbot for career guidance"""
    
    def __init__(self):
        self.use_openai = OPENAI_AVAILABLE
        
        # Predefined responses for common questions
        self.knowledge_base = {
            'software engineer': {
                'description': 'Software engineers design, develop, and maintain software applications and systems.',
                'skills': ['Programming (Python, Java, C++)', 'Data structures', 'Algorithms', 'Problem solving', 'Version control (Git)'],
                'education': 'Bachelor\'s degree in Computer Science or related field',
                'salary': '$80,000 - $150,000+ per year',
                'path': 'Learn programming → Build projects → Contribute to open source → Apply for internships → Entry-level position'
            },
            'data scientist': {
                'description': 'Data scientists analyze complex data to help organizations make better decisions.',
                'skills': ['Python/R', 'Statistics', 'Machine Learning', 'SQL', 'Data visualization'],
                'education': 'Bachelor\'s or Master\'s in Data Science, Statistics, or Computer Science',
                'salary': '$90,000 - $160,000+ per year',
                'path': 'Learn statistics & programming → Master ML algorithms → Work on data projects → Build portfolio → Apply for positions'
            },
            'web developer': {
                'description': 'Web developers create and maintain websites and web applications.',
                'skills': ['HTML/CSS', 'JavaScript', 'React/Angular/Vue', 'Node.js', 'Responsive design'],
                'education': 'Bachelor\'s degree or bootcamp certification',
                'salary': '$60,000 - $120,000+ per year',
                'path': 'Learn HTML/CSS/JS → Master a framework → Build portfolio websites → Freelance or apply for jobs'
            },
            'product manager': {
                'description': 'Product managers guide the development and success of products.',
                'skills': ['Strategic thinking', 'Communication', 'Data analysis', 'User research', 'Agile/Scrum'],
                'education': 'Bachelor\'s degree in Business, CS, or related field; MBA helpful',
                'salary': '$90,000 - $180,000+ per year',
                'path': 'Gain technical/business experience → Learn product management → Work on side projects → Transition to PM role'
            }
        }
    
    def get_response(self, user_message, user=None, context=None):
        """
        Get chatbot response to user message
        
        Args:
            user_message: User's question/message
            user: User object for personalization
            context: Additional context (dict)
        
        Returns:
            Bot response string
        """
        try:
            if self.use_openai:
                return self._get_openai_response(user_message, user, context)
            else:
                return self._get_rule_based_response(user_message, user, context)
        except Exception as e:
            print(f"Error getting chatbot response: {str(e)}")
            return "I apologize, but I'm having trouble processing your question right now. Please try again or rephrase your question."
    
    def _get_openai_response(self, user_message, user, context):
        """Get response using OpenAI GPT"""
        try:
            # Build system message with context
            system_message = """You are a helpful career guidance counselor AI assistant. 
            Your role is to help students and professionals discover suitable career paths, 
            provide advice on skill development, education, and career transitions.
            
            Be encouraging, informative, and practical in your responses.
            Keep responses concise (2-3 paragraphs) unless more detail is requested.
            """
            
            # Add user context if available
            if user:
                system_message += f"\n\nUser profile: {user.full_name}"
                if user.education_level:
                    system_message += f", Education: {user.education_level}"
                if user.current_status:
                    system_message += f", Status: {user.current_status}"
            
            # Make API call
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI API error: {str(e)}")
            # Fallback to rule-based
            return self._get_rule_based_response(user_message, user, context)
    
    def _get_rule_based_response(self, user_message, user, context):
        """Get response using rule-based system"""
        
        message_lower = user_message.lower()
        
        # Greeting
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
            name = user.full_name if user else "there"
            return f"Hello {name}! I'm your AI career guidance assistant. I can help you explore career options, understand required skills, and plan your career path. What would you like to know?"
        
        # Career-specific questions
        for career, info in self.knowledge_base.items():
            if career in message_lower or any(word in message_lower for word in career.split()):
                return self._format_career_response(career, info, message_lower)
        
        # General career advice
        if any(word in message_lower for word in ['best career', 'what career', 'which career', 'career for me']):
            return """To recommend the best career for you, I need to understand your interests and skills better. 
            
            I suggest you:
            1. Complete our career assessment quiz to identify your strengths
            2. Upload your resume for skill analysis
            3. Then I can provide personalized career recommendations
            
            Alternatively, you can ask me about specific careers like "Tell me about software engineering" or "What does a data scientist do?"
            """
        
        # Skills questions
        if any(word in message_lower for word in ['skills', 'learn', 'study', 'prepare']):
            return """The skills you need depend on your target career. Here are some universally valuable skills:
            
            **Technical Skills:**
            - Programming (Python, JavaScript)
            - Data analysis
            - Cloud platforms (AWS, Azure)
            
            **Soft Skills:**
            - Communication
            - Problem-solving
            - Teamwork
            - Adaptability
            
            Tell me which career you're interested in, and I can provide specific skill recommendations!
            """
        
        # Education questions
        if any(word in message_lower for word in ['degree', 'education', 'university', 'college', 'study']):
            return """Education requirements vary by career:
            
            - **Tech careers**: Bachelor's in CS or bootcamp + portfolio
            - **Healthcare**: Specific degrees + certifications required
            - **Business**: Bachelor's in Business; MBA helpful for advancement
            - **Creative fields**: Portfolio often more important than degree
            
            Many careers now value skills and experience over formal education. What field interests you?
            """
        
        # Salary questions
        if any(word in message_lower for word in ['salary', 'pay', 'earn', 'money', 'income']):
            return """Salaries vary widely based on location, experience, and industry:
            
            **Entry-level ranges:**
            - Software Engineer: $60k-$90k
            - Data Scientist: $70k-$100k
            - Web Developer: $50k-$75k
            - Product Manager: $80k-$110k
            
            With 5+ years experience, these can increase 50-100%. Which specific career are you curious about?
            """
        
        # Career change
        if any(word in message_lower for word in ['change career', 'switch', 'transition', 'new career']):
            return """Career transitions are increasingly common! Here's how to approach it:
            
            1. **Identify transferable skills** from your current role
            2. **Upskill** in your target field (online courses, certifications)
            3. **Build a portfolio** with projects in the new field
            4. **Network** with people in your target industry
            5. **Start with related roles** that bridge your experience
            
            What career are you considering transitioning to?
            """
        
        # Resume help
        if any(word in message_lower for word in ['resume', 'cv', 'application']):
            return """Great question! Here are key resume tips:
            
            1. **Tailor it** to each job posting
            2. **Use action verbs** (developed, managed, created)
            3. **Quantify achievements** (increased sales by 30%)
            4. **Keep it concise** (1-2 pages)
            5. **Include relevant skills** matching the job
            
            You can upload your resume on our platform for detailed analysis and suggestions!
            """
        
        # Certifications
        if any(word in message_lower for word in ['certification', 'certificate', 'course']):
            return """Popular certifications by field:
            
            **Tech:**
            - AWS Certified Solutions Architect
            - Google Professional Certificates
            - CompTIA A+/Network+/Security+
            
            **Data:**
            - Google Data Analytics Certificate
            - IBM Data Science Certificate
            
            **Business:**
            - PMP (Project Management)
            - Six Sigma
            - Scrum Master (CSM)
            
            Which area interests you most?
            """
        
        # Default response
        return """I'm here to help with your career questions! I can assist with:
        
        - Exploring different career paths
        - Understanding required skills and education
        - Career transition advice
        - Resume and interview tips
        - Salary expectations
        - Certification recommendations
        
        What specific aspect of your career would you like to discuss?
        """
    
    def _format_career_response(self, career, info, message_lower):
        """Format a detailed career response"""
        
        # Check what specific info is requested
        if 'skills' in message_lower or 'learn' in message_lower:
            skills_list = '\n'.join([f"- {skill}" for skill in info['skills']])
            return f"""**Key skills for {career.title()}:**

{skills_list}

{info['path']}

Would you like to know more about education requirements or salary expectations?
"""
        
        elif 'salary' in message_lower or 'pay' in message_lower:
            return f"""**{career.title()} Salary Information:**

Average salary range: {info['salary']}

Salary varies based on:
- Location (higher in tech hubs)
- Experience level
- Company size
- Specific technologies/specializations

Would you like to know about the career path or required skills?
"""
        
        elif 'education' in message_lower or 'degree' in message_lower:
            return f"""**Education for {career.title()}:**

{info['education']}

Many employers also value:
- Relevant certifications
- Portfolio of projects
- Open source contributions
- Internship experience

Would you like to know about the career path or required skills?
"""
        
        else:
            # General overview
            skills_list = ', '.join(info['skills'][:3])
            return f"""**{career.title()}**

{info['description']}

**Key Skills:** {skills_list}

**Education:** {info['education']}

**Salary Range:** {info['salary']}

**Career Path:** {info['path']}

Would you like more details about any specific aspect?
"""
