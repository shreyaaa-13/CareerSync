import PyPDF2
import re
import os
try:
    import spacy
    nlp = spacy.load('en_core_web_sm')
except:
    nlp = None
    print("Warning: spaCy model not loaded. Install with: python -m spacy download en_core_web_sm")

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
except:
    print("Warning: NLTK not fully configured. Run: python -c \"import nltk; nltk.download('punkt'); nltk.download('stopwords')\"")


class ResumeAnalyzer:
    """NLP-based resume analyzer"""
    
    def __init__(self):
        # Common technical skills to look for
        self.skill_keywords = [
            # Programming Languages
            'python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
            'typescript', 'go', 'rust', 'scala', 'r', 'matlab',
            
            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django',
            'flask', 'spring', 'asp.net', 'jquery', 'bootstrap', 'tailwind',
            
            # Databases
            'sql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'redis', 'cassandra',
            'dynamodb', 'sqlite', 'nosql',
            
            # Cloud & DevOps
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
            'terraform', 'ansible', 'linux', 'unix',
            
            # Data Science & AI
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
            'scikit-learn', 'pandas', 'numpy', 'data analysis', 'statistics',
            'nlp', 'computer vision', 'ai', 'neural networks',
            
            # Business & Soft Skills
            'project management', 'agile', 'scrum', 'leadership', 'communication',
            'problem solving', 'teamwork', 'analytical', 'strategic planning',
            
            # Design
            'ui/ux', 'figma', 'adobe', 'photoshop', 'illustrator', 'sketch',
            'wireframing', 'prototyping',
            
            # Other
            'api', 'rest', 'graphql', 'microservices', 'testing', 'debugging',
            'optimization', 'security', 'networking'
        ]
        
        self.education_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'degree', 'diploma',
            'university', 'college', 'institute', 'education', 'graduated',
            'gpa', 'coursework', 'major', 'minor'
        ]
        
        self.experience_keywords = [
            'experience', 'worked', 'developed', 'managed', 'led', 'created',
            'implemented', 'designed', 'built', 'maintained', 'improved',
            'achieved', 'responsible', 'duties', 'role', 'position'
        ]
    
    def analyze_resume(self, file_path):
        """
        Analyze resume and extract key information
        
        Args:
            file_path: Path to resume file (PDF)
        
        Returns:
            Dictionary with analysis results
        """
        try:
            # Extract text from PDF
            text = self._extract_text_from_pdf(file_path)
            
            if not text:
                return {
                    'error': 'Could not extract text from resume',
                    'text': '',
                    'skills': [],
                    'education': '',
                    'experience': ''
                }
            
            # Extract information
            skills = self._extract_skills(text)
            education = self._extract_education(text)
            experience = self._extract_experience(text)
            
            # Perform analysis
            analysis = {
                'text': text[:1000],  # First 1000 chars for preview
                'skills': skills,
                'education': education,
                'experience': experience,
                'skill_count': len(skills),
                'skill_categories': self._categorize_skills(skills),
                'strength_areas': self._identify_strengths(skills),
                'improvement_areas': self._identify_improvements(skills),
                'overall_score': self._calculate_overall_score(skills, education, experience)
            }
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing resume: {str(e)}")
            return {
                'error': str(e),
                'text': '',
                'skills': [],
                'education': '',
                'experience': ''
            }
    
    def _extract_text_from_pdf(self, file_path):
        """Extract text from PDF file"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
            return ""
    
    def _extract_skills(self, text):
        """Extract skills from resume text"""
        try:
            text_lower = text.lower()
            found_skills = []
            
            # Look for skill keywords
            for skill in self.skill_keywords:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    # Capitalize properly
                    found_skills.append(skill.title())
            
            # Remove duplicates and sort
            found_skills = sorted(list(set(found_skills)))
            
            # Use spaCy for additional entity extraction if available
            if nlp and len(found_skills) < 10:
                doc = nlp(text[:5000])  # Limit text length for performance
                for ent in doc.ents:
                    if ent.label_ in ['ORG', 'PRODUCT', 'LANGUAGE']:
                        skill = ent.text.strip()
                        if len(skill) > 2 and skill.lower() not in [s.lower() for s in found_skills]:
                            found_skills.append(skill.title())
            
            return found_skills[:50]  # Limit to top 50 skills
            
        except Exception as e:
            print(f"Error extracting skills: {str(e)}")
            return []
    
    def _extract_education(self, text):
        """Extract education information"""
        try:
            text_lower = text.lower()
            education_section = ""
            
            # Find education section
            education_start = -1
            for keyword in ['education', 'academic', 'qualification']:
                pos = text_lower.find(keyword)
                if pos != -1:
                    education_start = pos
                    break
            
            if education_start != -1:
                # Extract next 500 characters after education keyword
                education_section = text[education_start:education_start + 500]
            else:
                # Look for degree keywords anywhere in text
                for keyword in self.education_keywords:
                    if keyword in text_lower:
                        # Find sentence containing the keyword
                        sentences = text.split('.')
                        for sentence in sentences:
                            if keyword in sentence.lower():
                                education_section += sentence + ". "
            
            return education_section.strip()
            
        except Exception as e:
            print(f"Error extracting education: {str(e)}")
            return ""
    
    def _extract_experience(self, text):
        """Extract work experience information"""
        try:
            text_lower = text.lower()
            experience_section = ""
            
            # Find experience section
            experience_start = -1
            for keyword in ['experience', 'employment', 'work history', 'professional']:
                pos = text_lower.find(keyword)
                if pos != -1:
                    experience_start = pos
                    break
            
            if experience_start != -1:
                # Extract next 1000 characters after experience keyword
                experience_section = text[experience_start:experience_start + 1000]
            else:
                # Look for experience keywords anywhere in text
                for keyword in self.experience_keywords:
                    if keyword in text_lower:
                        sentences = text.split('.')
                        for sentence in sentences:
                            if keyword in sentence.lower():
                                experience_section += sentence + ". "
            
            return experience_section.strip()
            
        except Exception as e:
            print(f"Error extracting experience: {str(e)}")
            return ""
    
    def _categorize_skills(self, skills):
        """Categorize skills into different domains"""
        categories = {
            'Programming': [],
            'Web Development': [],
            'Data Science': [],
            'Cloud & DevOps': [],
            'Design': [],
            'Business': [],
            'Other': []
        }
        
        programming_langs = ['python', 'java', 'javascript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust']
        web_tech = ['html', 'css', 'react', 'angular', 'vue', 'node', 'django', 'flask']
        data_science = ['machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'data']
        cloud_devops = ['aws', 'azure', 'docker', 'kubernetes', 'jenkins', 'git']
        design = ['ui/ux', 'figma', 'photoshop', 'illustrator', 'design']
        business = ['project management', 'agile', 'scrum', 'leadership']
        
        for skill in skills:
            skill_lower = skill.lower()
            categorized = False
            
            if any(lang in skill_lower for lang in programming_langs):
                categories['Programming'].append(skill)
                categorized = True
            if any(tech in skill_lower for tech in web_tech):
                categories['Web Development'].append(skill)
                categorized = True
            if any(ds in skill_lower for ds in data_science):
                categories['Data Science'].append(skill)
                categorized = True
            if any(cd in skill_lower for cd in cloud_devops):
                categories['Cloud & DevOps'].append(skill)
                categorized = True
            if any(d in skill_lower for d in design):
                categories['Design'].append(skill)
                categorized = True
            if any(b in skill_lower for b in business):
                categories['Business'].append(skill)
                categorized = True
            
            if not categorized:
                categories['Other'].append(skill)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}
    
    def _identify_strengths(self, skills):
        """Identify strength areas based on skills"""
        strengths = []
        
        skill_lower = [s.lower() for s in skills]
        
        if any('python' in s or 'java' in s or 'javascript' in s for s in skill_lower):
            strengths.append("Strong programming foundation")
        
        if any('react' in s or 'angular' in s or 'vue' in s for s in skill_lower):
            strengths.append("Modern web development expertise")
        
        if any('machine learning' in s or 'tensorflow' in s or 'data' in s for s in skill_lower):
            strengths.append("Data science and AI capabilities")
        
        if any('aws' in s or 'azure' in s or 'docker' in s for s in skill_lower):
            strengths.append("Cloud and DevOps knowledge")
        
        if len(skills) > 15:
            strengths.append("Diverse technical skill set")
        
        return strengths if strengths else ["Foundational skills present"]
    
    def _identify_improvements(self, skills):
        """Identify areas for improvement"""
        improvements = []
        
        skill_lower = [s.lower() for s in skills]
        
        if not any('git' in s for s in skill_lower):
            improvements.append("Learn version control (Git)")
        
        if not any('cloud' in s or 'aws' in s or 'azure' in s for s in skill_lower):
            improvements.append("Gain cloud platform experience")
        
        if not any('agile' in s or 'scrum' in s for s in skill_lower):
            improvements.append("Understand Agile methodologies")
        
        if len(skills) < 10:
            improvements.append("Expand technical skill set")
        
        return improvements if improvements else ["Continue building on existing skills"]
    
    def _calculate_overall_score(self, skills, education, experience):
        """Calculate overall resume score (0-100)"""
        score = 0
        
        # Skills score (max 50 points)
        skill_score = min(50, len(skills) * 2)
        score += skill_score
        
        # Education score (max 25 points)
        if education:
            if any(keyword in education.lower() for keyword in ['master', 'phd', 'doctorate']):
                score += 25
            elif any(keyword in education.lower() for keyword in ['bachelor', 'degree']):
                score += 20
            else:
                score += 10
        
        # Experience score (max 25 points)
        if experience:
            # Simple heuristic: longer experience section = more experience
            exp_length = len(experience)
            if exp_length > 500:
                score += 25
            elif exp_length > 300:
                score += 20
            elif exp_length > 100:
                score += 15
            else:
                score += 10
        
        return min(100, score)
