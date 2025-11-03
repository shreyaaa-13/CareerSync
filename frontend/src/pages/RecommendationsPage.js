import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { recommendationAPI } from '../services/api';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Target,
  DollarSign,
  BookOpen,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [categoryScores, setCategoryScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // Try to get from backend first
      try {
        const response = await recommendationAPI.getRecommendations();
        if (response.data.recommendations && response.data.recommendations.length > 0) {
          setRecommendations(response.data.recommendations);
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.log('Backend not available, using local data');
      }

      // Fallback to local quiz results
      const quizResults = localStorage.getItem('quiz_results');
      if (quizResults) {
        const results = JSON.parse(quizResults);
        setCategoryScores(results.categoryScores);
        const localRecommendations = generateLocalRecommendations(results.categoryScores);
        setRecommendations(localRecommendations);
      } else {
        setError('No quiz results found. Please take the quiz first.');
      }
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalRecommendations = (scores) => {
    const careerDatabase = [
      {
        id: 1,
        title: 'Software Engineer',
        match_score: calculateMatch(scores, ['Technical', 'Logical', 'Analytical']),
        description: 'Design, develop, and maintain software applications and systems.',
        category: 'Technology',
        average_salary: '$80,000 - $150,000',
        job_outlook: 'Excellent',
        required_skills: ['Programming', 'Problem Solving', 'Data Structures', 'Algorithms'],
        education: "Bachelor's in Computer Science or related field",
        reasoning: 'Your strong technical and analytical skills make you well-suited for software development.'
      },
      {
        id: 2,
        title: 'Data Scientist',
        match_score: calculateMatch(scores, ['Analytical', 'Technical', 'Research']),
        description: 'Analyze complex data to help organizations make informed decisions.',
        category: 'Technology',
        average_salary: '$90,000 - $160,000',
        job_outlook: 'Excellent',
        required_skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization'],
        education: "Bachelor's or Master's in Data Science, Statistics, or CS",
        reasoning: 'Your analytical thinking and research skills are perfect for data science.'
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        match_score: calculateMatch(scores, ['Creative', 'Technical', 'Communication']),
        description: 'Create intuitive and visually appealing user interfaces for digital products.',
        category: 'Design',
        average_salary: '$70,000 - $130,000',
        job_outlook: 'Very Good',
        required_skills: ['Figma', 'User Research', 'Wireframing', 'Visual Design'],
        education: "Bachelor's in Design, HCI, or strong portfolio",
        reasoning: 'Your creativity combined with technical understanding is ideal for UX/UI design.'
      },
      {
        id: 4,
        title: 'Product Manager',
        match_score: calculateMatch(scores, ['Leadership', 'Communication', 'Business', 'Analytical']),
        description: 'Guide product development and strategy, working with cross-functional teams.',
        category: 'Business',
        average_salary: '$90,000 - $180,000',
        job_outlook: 'Very Good',
        required_skills: ['Strategic Thinking', 'Communication', 'Data Analysis', 'Agile'],
        education: "Bachelor's in Business or CS; MBA helpful",
        reasoning: 'Your leadership and communication skills make you a strong product manager candidate.'
      },
      {
        id: 5,
        title: 'Digital Marketing Manager',
        match_score: calculateMatch(scores, ['Creative', 'Communication', 'Business', 'Analytical']),
        description: 'Develop and execute online marketing strategies across digital channels.',
        category: 'Marketing',
        average_salary: '$60,000 - $110,000',
        job_outlook: 'Good',
        required_skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
        education: "Bachelor's in Marketing or Business",
        reasoning: 'Your creative and analytical balance is perfect for digital marketing.'
      },
      {
        id: 6,
        title: 'Business Analyst',
        match_score: calculateMatch(scores, ['Analytical', 'Business', 'Communication']),
        description: 'Analyze business processes and recommend improvements.',
        category: 'Business',
        average_salary: '$65,000 - $110,000',
        job_outlook: 'Good',
        required_skills: ['Data Analysis', 'SQL', 'Business Intelligence', 'Communication'],
        education: "Bachelor's in Business, IT, or related field",
        reasoning: 'Your analytical and business acumen make you well-suited for this role.'
      },
      {
        id: 7,
        title: 'Teacher/Educator',
        match_score: calculateMatch(scores, ['Communication', 'Teaching', 'Leadership']),
        description: 'Educate and inspire students in various subjects and grade levels.',
        category: 'Education',
        average_salary: '$45,000 - $75,000',
        job_outlook: 'Good',
        required_skills: ['Communication', 'Patience', 'Curriculum Development', 'Classroom Management'],
        education: "Bachelor's in Education plus teaching certification",
        reasoning: 'Your communication skills and patience make you a natural educator.'
      },
      {
        id: 8,
        title: 'Graphic Designer',
        match_score: calculateMatch(scores, ['Creative', 'Technical']),
        description: 'Create visual content for brands, marketing, and digital media.',
        category: 'Design',
        average_salary: '$45,000 - $80,000',
        job_outlook: 'Good',
        required_skills: ['Adobe Creative Suite', 'Typography', 'Branding', 'Visual Communication'],
        education: "Bachelor's in Graphic Design or strong portfolio",
        reasoning: 'Your creative abilities are well-suited for graphic design work.'
      }
    ];

    // Sort by match score and return top recommendations
    return careerDatabase
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 6);
  };

  const calculateMatch = (scores, relevantCategories) => {
    let totalScore = 0;
    let count = 0;

    relevantCategories.forEach(category => {
      if (scores[category]) {
        totalScore += scores[category];
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : 50;
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Potential Match';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
            <p className="text-gray-600 mb-6">Take the quiz to get personalized recommendations</p>
            <Link to="/quiz" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 inline-block">
              Take Quiz Now
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
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Your Career Recommendations</h1>
          </div>
          <p className="text-primary-100 text-lg">
            Based on your quiz results, we've identified {recommendations.length} careers that match your skills and interests.
          </p>
        </div>

        {/* Category Scores */}
        {Object.keys(categoryScores).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">Your Strength Profile</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryScores)
                .sort(([, a], [, b]) => b - a)
                .map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(score / 100) * 201} 201`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{score}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{category}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((career, index) => (
            <div key={career.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
              {/* Match Badge */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-gray-900">#{index + 1}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(career.match_score)}`}>
                        {career.match_score}% Match
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{career.title}</h3>
                    <p className="text-sm text-gray-600">{career.category}</p>
                  </div>
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
              </div>

              <div className="p-6">
                {/* Description */}
                <p className="text-gray-700 mb-4">{career.description}</p>

                {/* Why This Career */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Why this fits:</strong> {career.reasoning}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Salary Range</p>
                      <p className="text-sm font-semibold text-gray-900">{career.average_salary}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">Job Outlook</p>
                      <p className="text-sm font-semibold text-gray-900">{career.job_outlook}</p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-start space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-600">Education Required</p>
                    <p className="text-sm text-gray-900">{career.education}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Key Skills Needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.required_skills?.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/careers/${career.id}`}
                  className="flex items-center justify-center space-x-2 w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition"
                >
                  <span>View Career Details</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/careers" className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Explore All Careers</p>
                <p className="text-sm text-gray-600">Browse our full career database</p>
              </div>
            </Link>
            <Link to="/resume" className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">Upload Resume</p>
                <p className="text-sm text-gray-600">Get skill analysis & feedback</p>
              </div>
            </Link>
            <Link to="/chatbot" className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-semibold text-gray-900">Ask AI Assistant</p>
                <p className="text-sm text-gray-600">Get personalized career advice</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
