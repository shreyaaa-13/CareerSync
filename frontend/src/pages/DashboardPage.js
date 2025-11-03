import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Target, FileText, Sparkles, MessageSquare } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/quiz" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <Target className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Take Quiz</h3>
            <p className="text-gray-600">Assess your skills and interests</p>
          </Link>
          <Link to="/resume" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <FileText className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <p className="text-gray-600">Analyze your skills</p>
          </Link>
          <Link to="/recommendations" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <Sparkles className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <p className="text-gray-600">View career suggestions</p>
          </Link>
          <Link to="/chatbot" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <MessageSquare className="w-12 h-12 text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">Get career guidance</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
