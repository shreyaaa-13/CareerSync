import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, MessageSquare, FileText, Award } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Target className="w-12 h-12 text-primary-600" />,
      title: 'Career Assessment',
      description: 'Take our comprehensive quiz to discover your strengths and ideal career paths'
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary-600" />,
      title: 'AI Recommendations',
      description: 'Get personalized career suggestions powered by advanced AI algorithms'
    },
    {
      icon: <FileText className="w-12 h-12 text-primary-600" />,
      title: 'Resume Analysis',
      description: 'Upload your resume for detailed skill analysis and improvement suggestions'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-primary-600" />,
      title: 'Career Roadmaps',
      description: 'Follow step-by-step roadmaps with courses, certifications, and milestones'
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-primary-600" />,
      title: 'AI Chatbot',
      description: 'Get instant answers to your career questions from our intelligent assistant'
    },
    {
      icon: <Award className="w-12 h-12 text-primary-600" />,
      title: 'Track Progress',
      description: 'Monitor your career development journey and celebrate achievements'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-2xl font-bold text-primary-600">Career Guidance</div>
            <div className="space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect <span className="text-primary-600">Career Path</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered career guidance platform that helps you explore suitable career options based on your skills, interests, and qualifications
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-8 py-3 rounded-lg text-lg font-medium transition">
              Start Your Journey
            </Link>
            <Link to="/login" className="bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg text-lg font-medium transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need to plan your career success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your ideal career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up for free in seconds' },
              { step: '2', title: 'Take Assessment', desc: 'Complete our career quiz' },
              { step: '3', title: 'Get Recommendations', desc: 'Receive AI-powered suggestions' },
              { step: '4', title: 'Follow Roadmap', desc: 'Achieve your career goals' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Career Journey?</h2>
          <p className="text-xl mb-8">Join thousands of students and professionals discovering their perfect career path</p>
          <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-medium inline-block transition">
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">Career Guidance</div>
            <p className="text-gray-400 mb-4">AI-powered career guidance for everyone</p>
            <p className="text-gray-500 text-sm">&copy; 2024 Career Guidance System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
