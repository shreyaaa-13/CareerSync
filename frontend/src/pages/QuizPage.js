import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { quizAPI } from '../services/api';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Save,
  Sparkles,
  Target,
  Lightbulb,
  Users,
  Code,
  Briefcase
} from 'lucide-react';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState('start'); // start, quiz, submitting, completed
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Category icons mapping
  const categoryIcons = {
    'Logical': <Target className="w-6 h-6" />,
    'Analytical': <Lightbulb className="w-6 h-6" />,
    'Technical': <Code className="w-6 h-6" />,
    'Creative': <Sparkles className="w-6 h-6" />,
    'Communication': <Users className="w-6 h-6" />,
    'Leadership': <Briefcase className="w-6 h-6" />,
    'Teamwork': <Users className="w-6 h-6" />,
    'Business': <Briefcase className="w-6 h-6" />
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizState === 'quiz') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState]);

  // Fetch questions
  useEffect(() => {
    if (quizState === 'quiz' && questions.length === 0) {
      fetchQuestions();
    }
  }, [quizState]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuestions();
      setQuestions(response.data.questions || []);
      setError('');
    } catch (err) {
      console.error('API Error:', err);
      // Use fallback questions if API fails
      setQuestions(getFallbackQuestions());
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const getFallbackQuestions = () => {
    return [
      {
        id: 1,
        question_text: 'I enjoy solving complex logical problems and puzzles.',
        category: 'Logical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 2,
        question_text: 'I prefer working with numbers and data over creative tasks.',
        category: 'Analytical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 3,
        question_text: 'I am comfortable learning and using new technology.',
        category: 'Technical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 4,
        question_text: 'I enjoy expressing ideas through art, design, or writing.',
        category: 'Creative',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 5,
        question_text: 'I am good at explaining complex concepts to others.',
        category: 'Communication',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 6,
        question_text: 'I prefer working in teams rather than independently.',
        category: 'Teamwork',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 7,
        question_text: 'I enjoy leading projects and making strategic decisions.',
        category: 'Leadership',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 8,
        question_text: 'I am interested in understanding how things work technically.',
        category: 'Technical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 9,
        question_text: 'I enjoy analyzing data to find patterns and insights.',
        category: 'Analytical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 10,
        question_text: 'I am patient and enjoy helping others learn.',
        category: 'Teaching',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 11,
        question_text: 'I like creating visual designs and aesthetically pleasing content.',
        category: 'Creative',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 12,
        question_text: 'I am comfortable with public speaking and presentations.',
        category: 'Communication',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 13,
        question_text: 'I enjoy building and fixing things with my hands.',
        category: 'Practical',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 14,
        question_text: 'I am interested in business strategy and entrepreneurship.',
        category: 'Business',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 15,
        question_text: 'I enjoy researching and learning about new topics.',
        category: 'Research',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ];
  };

  const handleStartQuiz = () => {
    setQuizState('quiz');
    setTimeElapsed(0);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setQuizState('submitting');
      setLoading(true);

      // Calculate category scores
      const categoryScores = calculateCategoryScores();
      
      // Format answers for API
      const formattedAnswers = questions.map(q => ({
        question_id: q.id,
        answer: answers[q.id] || 0
      }));

      try {
        // Try to submit to backend
        await quizAPI.submitQuiz({ answers: formattedAnswers });
      } catch (apiErr) {
        console.log('Backend not available, using local recommendations');
      }
      
      // Store results locally for recommendations page
      localStorage.setItem('quiz_results', JSON.stringify({
        answers: answers,
        categoryScores: categoryScores,
        timestamp: new Date().toISOString()
      }));
      
      setQuizState('completed');
      setTimeout(() => {
        navigate('/recommendations');
      }, 2000);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setQuizState('quiz');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryScores = () => {
    const scores = {};
    
    questions.forEach(question => {
      const category = question.category;
      const answer = answers[question.id] || 0;
      
      if (!scores[category]) {
        scores[category] = { total: 0, count: 0 };
      }
      
      scores[category].total += answer;
      scores[category].count += 1;
    });
    
    // Calculate averages
    const categoryAverages = {};
    Object.keys(scores).forEach(category => {
      categoryAverages[category] = Math.round((scores[category].total / scores[category].count) * 20); // Convert to percentage
    });
    
    return categoryAverages;
  };

  const handleSaveProgress = () => {
    localStorage.setItem('quiz_progress', JSON.stringify({
      answers,
      currentQuestionIndex,
      timeElapsed
    }));
    alert('Progress saved! You can continue later.');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Start Screen
  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
                <Target className="w-12 h-12 text-primary-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Career Assessment Quiz
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Answer the following questions honestly to help us understand your strengths and preferences. 
                Your responses will guide us in suggesting the best career options for you.
              </p>
            </div>

            {/* Quiz Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">~10</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">6+</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>

            {/* Categories Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Categories:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Logical/Analytical', icon: <Target className="w-5 h-5" />, color: 'blue' },
                  { name: 'Creative/Artistic', icon: <Sparkles className="w-5 h-5" />, color: 'purple' },
                  { name: 'Communication', icon: <Users className="w-5 h-5" />, color: 'green' },
                  { name: 'Technical', icon: <Code className="w-5 h-5" />, color: 'indigo' },
                  { name: 'Leadership', icon: <Briefcase className="w-5 h-5" />, color: 'orange' },
                  { name: 'Teamwork', icon: <Users className="w-5 h-5" />, color: 'pink' }
                ].map((cat, idx) => (
                  <div key={idx} className={`flex items-center space-x-2 p-3 bg-${cat.color}-50 rounded-lg`}>
                    <div className={`text-${cat.color}-600`}>{cat.icon}</div>
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <Lightbulb className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">Tips for Best Results:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Answer honestly based on your true preferences</li>
                    <li>• Take your time - there's no rush</li>
                    <li>• You can save progress and continue later</li>
                    <li>• Your answers help us suggest careers that match your strengths</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Completed Screen
  if (quizState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the Career Assessment Quiz! 
            We're generating your personalized career recommendations...
          </p>
          <div className="flex justify-center">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header with Timer and Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career Assessment Quiz</h1>
              <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <button
                onClick={handleSaveProgress}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 text-right mt-1">
              {getProgress()}% Complete ({Object.keys(answers).length}/{questions.length} answered)
            </div>
          </div>
        </div>

        {/* Question Card */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchQuestions}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            {/* Category Badge */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                {categoryIcons[currentQuestion.category] || <Target className="w-6 h-6" />}
              </div>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {currentQuestion.question_text}
            </h2>

            {/* Answer Options - Likert Scale */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Rate your agreement with this statement:</p>
              
              <div className="grid grid-cols-5 gap-3">
                {currentQuestion.options?.map((option, index) => {
                  const value = index + 1;
                  const isSelected = answers[currentQuestion.id] === value;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(currentQuestion.id, value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-2 ${
                          isSelected ? 'text-primary-600' : 'text-gray-400'
                        }`}>
                          {value}
                        </div>
                        <div className={`text-xs ${
                          isSelected ? 'text-primary-700' : 'text-gray-600'
                        }`}>
                          {option}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tooltip */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    <strong>How this helps:</strong> Your {currentQuestion.category.toLowerCase()} score 
                    helps us suggest careers that match your strengths in this area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length || loading}
              className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{loading ? 'Submitting...' : 'Submit Quiz'}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Warning if not all answered */}
        {currentQuestionIndex === questions.length - 1 && Object.keys(answers).length !== questions.length && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Please answer all questions before submitting. 
              You have {questions.length - Object.keys(answers).length} unanswered question(s).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
