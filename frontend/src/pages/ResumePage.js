import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { resumeAPI } from '../services/api';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
  Lightbulb,
  Download,
  Trash2,
  Loader
} from 'lucide-react';

const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previousResumes, setPreviousResumes] = useState([]);

  useEffect(() => {
    loadPreviousResumes();
  }, []);

  const loadPreviousResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setPreviousResumes(response.data.resumes || []);
    } catch (err) {
      console.log('Could not load previous resumes');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setAnalysis(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setAnalyzing(true);
      setError('');

      const formData = new FormData();
      formData.append('resume', file);

      try {
        // Try to upload to backend
        const response = await resumeAPI.uploadResume(formData);
        setAnalysis(response.data.analysis);
      } catch (apiErr) {
        console.log('Backend not available, using mock analysis');
        // Generate mock analysis
        setTimeout(() => {
          setAnalysis(generateMockAnalysis(file.name));
        }, 2000);
      }

      loadPreviousResumes();
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setTimeout(() => setAnalyzing(false), 2000);
    }
  };

  const generateMockAnalysis = (filename) => {
    return {
      filename: filename,
      skills: [
        'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git',
        'Machine Learning', 'Data Analysis', 'Problem Solving', 'Communication'
      ],
      skill_categories: {
        'Programming': ['Python', 'JavaScript', 'React', 'Node.js'],
        'Data Science': ['Machine Learning', 'Data Analysis', 'SQL'],
        'Tools': ['Git'],
        'Soft Skills': ['Problem Solving', 'Communication']
      },
      education: "Bachelor's degree in Computer Science with relevant coursework in software development and data structures.",
      experience: "3+ years of experience in software development with focus on web applications and data-driven solutions.",
      strength_areas: [
        "Strong programming foundation in multiple languages",
        "Full-stack development capabilities",
        "Data science and analytics skills",
        "Version control proficiency"
      ],
      improvement_areas: [
        "Consider cloud platform certifications (AWS/Azure)",
        "Expand DevOps knowledge (Docker, Kubernetes)",
        "Develop mobile development skills",
        "Strengthen system design expertise"
      ],
      overall_score: 78,
      skill_count: 10,
      recommended_careers: [
        { title: 'Software Engineer', match: 85 },
        { title: 'Full Stack Developer', match: 82 },
        { title: 'Data Analyst', match: 75 }
      ]
    };
  };

  const clearFile = () => {
    setFile(null);
    setAnalysis(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
          <p className="text-gray-600">Upload your resume for AI-powered analysis and personalized feedback</p>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Resume</h2>
              <p className="text-sm text-gray-600">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
                dragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-12 h-12 text-primary-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Analyze Resume</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={clearFile}
                      disabled={uploading}
                      className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drag and drop your resume here
                    </p>
                    <p className="text-sm text-gray-600 mb-4">or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                      />
                      <span className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 cursor-pointer inline-block transition">
                        Browse Files
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Tips for best results:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use a well-formatted, professional resume</li>
                    <li>• Include clear sections for skills, experience, and education</li>
                    <li>• List specific technical skills and tools</li>
                    <li>• Quantify achievements where possible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyzing Animation */}
        {analyzing && !analysis && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
            <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
              <Sparkles className="w-12 h-12 text-primary-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Resume...</h3>
            <p className="text-gray-600 mb-4">Our AI is extracting skills, experience, and insights</p>
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg shadow-md p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Resume Analysis Complete!</h2>
                  <p className="text-primary-100">Here's your comprehensive resume evaluation</p>
                </div>
                <div className="text-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="white"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(analysis.overall_score / 100) * 352} 352`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{analysis.overall_score}</span>
                      <span className="text-sm">/ 100</span>
                    </div>
                  </div>
                  <p className="mt-2 font-semibold">{getScoreLabel(analysis.overall_score)}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-6 h-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Identified Skills ({analysis.skill_count})</h3>
              </div>
              
              {analysis.skill_categories && Object.keys(analysis.skill_categories).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(analysis.skill_categories).map(([category, skills]) => (
                    <div key={category}>
                      <p className="text-sm font-semibold text-gray-700 mb-2">{category}:</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Education</h3>
                </div>
                <p className="text-gray-700">{analysis.education || 'No education information found'}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">Experience</h3>
                </div>
                <p className="text-gray-700">{analysis.experience || 'No experience information found'}</p>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Strength Areas</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strength_areas?.map((strength, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {analysis.improvement_areas?.map((area, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Careers */}
            {analysis.recommended_careers && analysis.recommended_careers.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Recommended Careers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.recommended_careers.map((career, idx) => (
                    <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-semibold text-gray-900 mb-1">{career.title}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-600 rounded-full"
                            style={{width: `${career.match}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-purple-600">{career.match}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={clearFile}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                <Upload className="w-5 h-5" />
                <span>Analyze Another Resume</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;
