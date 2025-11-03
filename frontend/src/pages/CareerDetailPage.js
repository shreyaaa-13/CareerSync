import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { careerAPI } from '../services/api';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  BookOpen,
  Briefcase,
  Users,
  Clock,
  Award,
  CheckCircle,
  Target,
  Lightbulb,
  Code,
  GraduationCap,
  Building,
  MapPin,
  Star
} from 'lucide-react';

const CareerDetailPage = () => {
  const { id } = useParams();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareerDetails();
  }, [id]);

  const loadCareerDetails = async () => {
    try {
      setLoading(true);
      try {
        const response = await careerAPI.getCareer(id);
        setCareer(response.data);
      } catch (apiErr) {
        // Use mock data based on ID
        setCareer(getMockCareerData(id));
      }
    } catch (err) {
      console.error('Error loading career:', err);
      setCareer(getMockCareerData(id));
    } finally {
      setLoading(false);
    }
  };

  const getMockCareerData = (careerId) => {
    const careers = {
      '1': {
        id: 1,
        title: 'Software Engineer',
        category: 'Technology',
        description: 'Design, develop, test, and maintain software applications and systems using various programming languages and frameworks.',
        average_salary: '$80,000 - $150,000',
        job_outlook: 'Excellent',
        growth_rate: '22% (Much faster than average)',
        education_requirements: "Bachelor's degree in Computer Science or related field",
        
        overview: [
          'Create and maintain software applications',
          'Write clean, efficient code',
          'Collaborate with cross-functional teams',
          'Debug and troubleshoot issues',
          'Participate in code reviews',
          'Stay updated with latest technologies'
        ],
        
        required_skills: [
          'Programming Languages (Python, Java, JavaScript)',
          'Data Structures & Algorithms',
          'Version Control (Git)',
          'Problem-solving',
          'Database Management (SQL)',
          'Web Development Frameworks',
          'Testing & Debugging',
          'Agile Methodologies'
        ],
        
        soft_skills: [
          'Communication',
          'Teamwork',
          'Time Management',
          'Adaptability',
          'Critical Thinking',
          'Attention to Detail'
        ],
        
        work_environment: [
          'Office or remote work',
          'Collaborative team environment',
          'Fast-paced and dynamic',
          'Flexible working hours',
          'Continuous learning culture'
        ],
        
        typical_tasks: [
          'Write and review code',
          'Design software architecture',
          'Implement new features',
          'Fix bugs and optimize performance',
          'Attend team meetings and standups',
          'Document code and processes',
          'Mentor junior developers'
        ],
        
        career_path: [
          { level: 'Junior Developer', years: '0-2 years', salary: '$60k-$80k' },
          { level: 'Mid-Level Developer', years: '2-5 years', salary: '$80k-$110k' },
          { level: 'Senior Developer', years: '5-8 years', salary: '$110k-$150k' },
          { level: 'Lead Developer/Architect', years: '8+ years', salary: '$150k-$200k+' }
        ],
        
        certifications: [
          'AWS Certified Developer',
          'Microsoft Certified: Azure Developer',
          'Oracle Certified Professional',
          'Google Professional Cloud Developer',
          'Certified Kubernetes Administrator'
        ],
        
        industries: [
          'Technology & Software',
          'Finance & Banking',
          'Healthcare',
          'E-commerce',
          'Gaming',
          'Telecommunications'
        ],
        
        pros: [
          'High earning potential',
          'Strong job market demand',
          'Remote work opportunities',
          'Continuous learning',
          'Creative problem-solving',
          'Global opportunities'
        ],
        
        cons: [
          'Can be stressful with tight deadlines',
          'Requires constant skill updates',
          'Long hours during crunch time',
          'Sedentary work lifestyle'
        ],
        
        related_careers: [
          'Data Scientist',
          'DevOps Engineer',
          'Full Stack Developer',
          'Mobile App Developer'
        ]
      },
      '2': {
        id: 2,
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Analyze complex data sets to help organizations make informed business decisions using statistical analysis and machine learning.',
        average_salary: '$90,000 - $160,000',
        job_outlook: 'Excellent',
        growth_rate: '36% (Much faster than average)',
        education_requirements: "Bachelor's or Master's in Data Science, Statistics, or Computer Science",
        
        overview: [
          'Extract insights from large datasets',
          'Build predictive models',
          'Create data visualizations',
          'Communicate findings to stakeholders',
          'Develop machine learning algorithms',
          'Optimize business processes'
        ],
        
        required_skills: [
          'Python/R Programming',
          'Statistics & Mathematics',
          'Machine Learning',
          'SQL & Database Management',
          'Data Visualization (Tableau, PowerBI)',
          'Big Data Technologies (Hadoop, Spark)',
          'Deep Learning Frameworks',
          'A/B Testing'
        ],
        
        soft_skills: [
          'Analytical Thinking',
          'Communication',
          'Business Acumen',
          'Curiosity',
          'Attention to Detail',
          'Storytelling with Data'
        ],
        
        work_environment: [
          'Office or remote',
          'Collaborative with business teams',
          'Data-driven culture',
          'Research-oriented',
          'Cross-functional projects'
        ],
        
        typical_tasks: [
          'Clean and preprocess data',
          'Perform exploratory data analysis',
          'Build and train ML models',
          'Create dashboards and reports',
          'Present findings to leadership',
          'Deploy models to production',
          'Monitor model performance'
        ],
        
        career_path: [
          { level: 'Junior Data Scientist', years: '0-2 years', salary: '$70k-$95k' },
          { level: 'Data Scientist', years: '2-5 years', salary: '$95k-$130k' },
          { level: 'Senior Data Scientist', years: '5-8 years', salary: '$130k-$170k' },
          { level: 'Lead/Principal Data Scientist', years: '8+ years', salary: '$170k-$250k+' }
        ],
        
        certifications: [
          'Google Data Analytics Certificate',
          'IBM Data Science Professional',
          'Microsoft Certified: Azure Data Scientist',
          'AWS Certified Machine Learning',
          'Tableau Desktop Specialist'
        ],
        
        industries: [
          'Technology',
          'Finance & Insurance',
          'Healthcare & Pharmaceuticals',
          'Retail & E-commerce',
          'Marketing & Advertising',
          'Government'
        ],
        
        pros: [
          'Very high demand',
          'Excellent salary',
          'Impactful work',
          'Diverse applications',
          'Intellectual challenge',
          'Remote opportunities'
        ],
        
        cons: [
          'Steep learning curve',
          'Data quality issues',
          'Requires continuous learning',
          'Can be isolated work'
        ],
        
        related_careers: [
          'Machine Learning Engineer',
          'Data Engineer',
          'Business Intelligence Analyst',
          'AI Research Scientist'
        ]
      }
    };

    return careers[careerId] || careers['1'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading career details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Not Found</h2>
            <p className="text-gray-600 mb-4">The career you're looking for doesn't exist.</p>
            <Link to="/careers" className="text-primary-600 hover:text-primary-700">
              ← Back to Careers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/careers" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-3">
                {career.category}
              </span>
              <h1 className="text-4xl font-bold mb-3">{career.title}</h1>
              <p className="text-lg text-primary-100 mb-6">{career.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-200">Salary Range</p>
                    <p className="font-semibold">{career.average_salary}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-200">Job Outlook</p>
                    <p className="font-semibold">{career.job_outlook}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-primary-200">Growth Rate</p>
                    <p className="font-semibold">{career.growth_rate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
                What You'll Do
              </h2>
              <ul className="space-y-2">
                {career.overview.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Code className="w-6 h-6 mr-2 text-primary-600" />
                Technical Skills Required
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {career.required_skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-800">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary-600" />
                Soft Skills Needed
              </h2>
              <div className="flex flex-wrap gap-2">
                {career.soft_skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Typical Tasks */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary-600" />
                Day-to-Day Tasks
              </h2>
              <ul className="space-y-2">
                {career.typical_tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career Path */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
                Career Progression
              </h2>
              <div className="space-y-4">
                {career.career_path.map((level, idx) => (
                  <div key={idx} className="relative pl-8 pb-4 border-l-2 border-primary-200 last:border-0">
                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary-600 transform -translate-x-[9px]"></div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-1">{level.level}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {level.years}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {level.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Pros
                </h3>
                <ul className="space-y-2">
                  {career.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
                  Challenges
                </h3>
                <ul className="space-y-2">
                  {career.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-orange-600 mr-2">!</span>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Education */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                Education
              </h3>
              <p className="text-gray-700 text-sm">{career.education_requirements}</p>
            </div>

            {/* Work Environment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-primary-600" />
                Work Environment
              </h3>
              <ul className="space-y-2">
                {career.work_environment.map((env, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{env}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary-600" />
                Certifications
              </h3>
              <ul className="space-y-2">
                {career.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Top Industries
              </h3>
              <div className="space-y-2">
                {career.industries.map((industry, idx) => (
                  <div key={idx} className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700">
                    {industry}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Careers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Careers</h3>
              <div className="space-y-2">
                {career.related_careers.map((related, idx) => (
                  <Link
                    key={idx}
                    to={`/careers/${idx + 3}`}
                    className="block px-3 py-2 bg-primary-50 text-primary-700 rounded hover:bg-primary-100 transition text-sm"
                  >
                    {related} →
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
              <p className="text-sm text-primary-100 mb-4">
                Take our career assessment quiz to see if this path is right for you!
              </p>
              <Link
                to="/quiz"
                className="block w-full bg-white text-primary-600 text-center py-2 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetailPage;
