import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Target,
  Clock,
  CheckCircle,
  Edit,
  Save,
  X,
  BarChart3,
  Brain,
  Palette,
  Users,
  Code,
  Briefcase
} from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
    loadQuizHistory();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      // Try to load from backend
      try {
        const response = await authAPI.getCurrentUser();
        setProfileData(response.data);
        setEditedData(response.data);
      } catch (apiErr) {
        // Use mock data
        const mockData = {
          full_name: user?.full_name || 'John Doe',
          email: user?.email || 'john.doe@example.com',
          phone: '+1 234 567 8900',
          location: 'New York, USA',
          bio: 'Aspiring software engineer passionate about technology and innovation.',
          joined_date: '2024-01-15',
          total_quizzes: 3,
          total_resumes: 2,
          recommendations_received: 5
        };
        setProfileData(mockData);
        setEditedData(mockData);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadQuizHistory = () => {
    // Load from localStorage
    const storedResults = localStorage.getItem('quiz_results');
    if (storedResults) {
      const results = JSON.parse(storedResults);
      const history = [
        {
          id: 1,
          date: results.completedAt || new Date().toISOString(),
          scores: results.categoryScores || {},
          totalScore: calculateTotalScore(results.categoryScores || {}),
          status: 'Completed'
        }
      ];
      
      // Add mock previous attempts
      history.push(
        {
          id: 2,
          date: '2024-10-15T10:30:00',
          scores: {
            'Logical/Analytical': 4.2,
            'Creative/Artistic': 3.8,
            'Technical': 4.5,
            'Communication': 3.5,
            'Leadership': 3.9,
            'Teamwork': 4.1
          },
          totalScore: 78,
          status: 'Completed'
        },
        {
          id: 3,
          date: '2024-09-20T14:20:00',
          scores: {
            'Logical/Analytical': 3.9,
            'Creative/Artistic': 3.5,
            'Technical': 4.2,
            'Communication': 3.8,
            'Leadership': 3.6,
            'Teamwork': 4.0
          },
          totalScore: 74,
          status: 'Completed'
        }
      );
      
      setQuizHistory(history);
    } else {
      // Mock data if no quiz taken
      setQuizHistory([
        {
          id: 1,
          date: '2024-10-28T15:45:00',
          scores: {
            'Logical/Analytical': 4.5,
            'Creative/Artistic': 4.0,
            'Technical': 4.8,
            'Communication': 3.7,
            'Leadership': 4.2,
            'Teamwork': 4.3
          },
          totalScore: 82,
          status: 'Completed'
        },
        {
          id: 2,
          date: '2024-10-15T10:30:00',
          scores: {
            'Logical/Analytical': 4.2,
            'Creative/Artistic': 3.8,
            'Technical': 4.5,
            'Communication': 3.5,
            'Leadership': 3.9,
            'Teamwork': 4.1
          },
          totalScore: 78,
          status: 'Completed'
        },
        {
          id: 3,
          date: '2024-09-20T14:20:00',
          scores: {
            'Logical/Analytical': 3.9,
            'Creative/Artistic': 3.5,
            'Technical': 4.2,
            'Communication': 3.8,
            'Leadership': 3.6,
            'Teamwork': 4.0
          },
          totalScore: 74,
          status: 'Completed'
        }
      ]);
    }
  };

  const calculateTotalScore = (scores) => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round((average / 5) * 100);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Try to save to backend
      await authAPI.updateProfile(editedData);
      setProfileData(editedData);
      setIsEditing(false);
    } catch (err) {
      // Save locally
      setProfileData(editedData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Logical/Analytical': return <Brain className="w-4 h-4" />;
      case 'Creative/Artistic': return <Palette className="w-4 h-4" />;
      case 'Technical': return <Code className="w-4 h-4" />;
      case 'Communication': return <Users className="w-4 h-4" />;
      case 'Leadership': return <Target className="w-4 h-4" />;
      case 'Teamwork': return <Users className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 4.0) return 'text-green-600 bg-green-100';
    if (score >= 3.0) return 'text-blue-600 bg-blue-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getTotalScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profileData?.full_name?.charAt(0) || 'U'}
                </div>
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.full_name}
                      onChange={(e) => setEditedData({...editedData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="font-medium text-gray-900">{profileData?.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm text-gray-600 mb-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="font-medium text-gray-900">{profileData?.email}</p>
                </div>

                <div>
                  <label className="flex items-center text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member Since
                  </label>
                  <p className="font-medium text-gray-900">
                    {new Date(profileData?.joined_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">Quizzes Taken</span>
                  </div>
                  <span className="font-bold text-blue-600">{quizHistory.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Recommendations</span>
                  </div>
                  <span className="font-bold text-green-600">{profileData?.recommendations_received || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700">Resumes Uploaded</span>
                  </div>
                  <span className="font-bold text-purple-600">{profileData?.total_resumes || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quiz History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Quiz History & Scores</h2>
              </div>

              {quizHistory.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Attempts Yet</h3>
                  <p className="text-gray-600 mb-4">Take your first career assessment quiz to see your results here</p>
                  <a
                    href="/quiz"
                    className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Take Quiz Now
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {quizHistory.map((quiz, idx) => (
                    <div key={quiz.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      {/* Quiz Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Target className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              Career Assessment Quiz #{quizHistory.length - idx}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(quiz.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getTotalScoreColor(quiz.totalScore)}`}>
                            {quiz.totalScore}%
                          </div>
                          <span className="flex items-center text-sm text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {quiz.status}
                          </span>
                        </div>
                      </div>

                      {/* Category Scores */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(quiz.scores).map(([category, score]) => (
                          <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1.5 rounded ${getScoreColor(score)}`}>
                                {getCategoryIcon(category)}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{category}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-600 rounded-full"
                                  style={{ width: `${(score / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-gray-900 w-8">{score.toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Strengths */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Top Strengths:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(quiz.scores)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([category, score]) => (
                              <span key={category} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {category} ({score.toFixed(1)})
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Trend */}
              {quizHistory.length > 1 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <h4 className="font-semibold text-gray-900">Progress Trend</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Your latest score: <span className="font-bold text-primary-600">{quizHistory[0].totalScore}%</span>
                    {quizHistory[0].totalScore > quizHistory[1].totalScore ? (
                      <span className="text-green-600 ml-2">
                        ↑ +{quizHistory[0].totalScore - quizHistory[1].totalScore}% improvement
                      </span>
                    ) : quizHistory[0].totalScore < quizHistory[1].totalScore ? (
                      <span className="text-orange-600 ml-2">
                        ↓ {quizHistory[1].totalScore - quizHistory[0].totalScore}% from previous
                      </span>
                    ) : (
                      <span className="text-gray-600 ml-2">→ Same as previous</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
