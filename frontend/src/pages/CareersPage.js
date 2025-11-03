import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { careerAPI } from '../services/api';
import { 
  Search, 
  Filter,
  TrendingUp,
  DollarSign,
  BookOpen,
  Briefcase,
  ChevronRight,
  Star,
  Users,
  Code,
  Palette,
  BarChart,
  Heart,
  Zap
} from 'lucide-react';

const CareersPage = () => {
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOutlook, setSelectedOutlook] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Technology', 'Business', 'Design', 'Healthcare', 'Education', 'Marketing'];
  const outlooks = ['All', 'Excellent', 'Very Good', 'Good'];

  const categoryIcons = {
    'Technology': <Code className="w-5 h-5" />,
    'Business': <Briefcase className="w-5 h-5" />,
    'Design': <Palette className="w-5 h-5" />,
    'Healthcare': <Heart className="w-5 h-5" />,
    'Education': <BookOpen className="w-5 h-5" />,
    'Marketing': <BarChart className="w-5 h-5" />
  };

  useEffect(() => {
    loadCareers();
  }, []);

  useEffect(() => {
    filterCareers();
  }, [searchTerm, selectedCategory, selectedOutlook, careers]);

  const loadCareers = async () => {
    try {
      setLoading(true);
      try {
        const response = await careerAPI.getCareers();
        setCareers(response.data.careers || []);
      } catch (apiErr) {
        // Use fallback career data
        setCareers(getFallbackCareers());
      }
    } catch (err) {
      console.error('Error loading careers:', err);
      setCareers(getFallbackCareers());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackCareers = () => {
    return [
      {
        id: 1,
        title: 'Software Engineer',
        category: 'Technology',
        description: 'Design, develop, test, and maintain software applications and systems using various programming languages and frameworks.',
        average_salary: '$80,000 - $150,000',
        job_outlook: 'Excellent',
        education_requirements: "Bachelor's degree in Computer Science or related field",
        required_skills: ['Python', 'Java', 'JavaScript', 'Git', 'Problem Solving'],
        work_environment: 'Office or remote, collaborative team environment'
      },
      {
        id: 2,
        title: 'Data Scientist',
        category: 'Technology',
        description: 'Analyze complex data sets to help organizations make informed business decisions using statistical analysis and machine learning.',
        average_salary: '$90,000 - $160,000',
        job_outlook: 'Excellent',
        education_requirements: "Bachelor's or Master's in Data Science, Statistics, or CS",
        required_skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
        work_environment: 'Office or remote, collaborative with business teams'
      },
      {
        id: 3,
        title: 'UX/UI Designer',
        category: 'Design',
        description: 'Create intuitive and visually appealing user interfaces for digital products, focusing on user experience and interaction design.',
        average_salary: '$70,000 - $130,000',
        job_outlook: 'Very Good',
        education_requirements: "Bachelor's in Design, HCI, or strong portfolio",
        required_skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping'],
        work_environment: 'Office or remote, collaborative with product teams'
      },
      {
        id: 4,
        title: 'Product Manager',
        category: 'Business',
        description: 'Guide product development and strategy, working with engineering, design, and business teams to define product roadmap.',
        average_salary: '$90,000 - $180,000',
        job_outlook: 'Very Good',
        education_requirements: "Bachelor's in Business or CS; MBA helpful",
        required_skills: ['Strategic Thinking', 'Communication', 'Data Analysis', 'Agile', 'Leadership'],
        work_environment: 'Office or remote, highly collaborative'
      },
      {
        id: 5,
        title: 'Digital Marketing Manager',
        category: 'Marketing',
        description: 'Develop and execute online marketing strategies to promote products and services across digital channels.',
        average_salary: '$60,000 - $110,000',
        job_outlook: 'Good',
        education_requirements: "Bachelor's in Marketing or Business",
        required_skills: ['SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics'],
        work_environment: 'Office or remote, fast-paced'
      },
      {
        id: 6,
        title: 'Web Developer',
        category: 'Technology',
        description: 'Create and maintain websites and web applications, working on both front-end and back-end development.',
        average_salary: '$60,000 - $120,000',
        job_outlook: 'Very Good',
        education_requirements: "Bachelor's in CS or bootcamp certification",
        required_skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
        work_environment: 'Office, remote, or freelance'
      },
      {
        id: 7,
        title: 'Business Analyst',
        category: 'Business',
        description: 'Analyze business processes and recommend improvements to increase efficiency and profitability.',
        average_salary: '$65,000 - $110,000',
        job_outlook: 'Good',
        education_requirements: "Bachelor's in Business, IT, or related field",
        required_skills: ['Data Analysis', 'SQL', 'Business Intelligence', 'Communication'],
        work_environment: 'Office or remote, collaborative'
      },
      {
        id: 8,
        title: 'Graphic Designer',
        category: 'Design',
        description: 'Create visual content for brands, marketing materials, and digital media using design software.',
        average_salary: '$45,000 - $80,000',
        job_outlook: 'Good',
        education_requirements: "Bachelor's in Graphic Design or strong portfolio",
        required_skills: ['Adobe Creative Suite', 'Typography', 'Branding', 'Visual Communication'],
        work_environment: 'Office, remote, or freelance'
      },
      {
        id: 9,
        title: 'Cybersecurity Analyst',
        category: 'Technology',
        description: 'Protect organizations from cyber threats by monitoring systems, implementing security measures, and responding to incidents.',
        average_salary: '$75,000 - $130,000',
        job_outlook: 'Excellent',
        education_requirements: "Bachelor's in Cybersecurity, IT, or related field",
        required_skills: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Security Tools'],
        work_environment: 'Office or remote, sometimes on-call'
      },
      {
        id: 10,
        title: 'Content Writer',
        category: 'Marketing',
        description: 'Create engaging written content for websites, blogs, social media, and marketing materials.',
        average_salary: '$40,000 - $75,000',
        job_outlook: 'Good',
        education_requirements: "Bachelor's in English, Journalism, or Communications",
        required_skills: ['Writing', 'SEO', 'Research', 'Editing', 'Content Strategy'],
        work_environment: 'Remote or office, flexible hours'
      },
      {
        id: 11,
        title: 'DevOps Engineer',
        category: 'Technology',
        description: 'Bridge development and operations teams, automating and streamlining software deployment and infrastructure management.',
        average_salary: '$85,000 - $145,000',
        job_outlook: 'Excellent',
        education_requirements: "Bachelor's in CS or IT",
        required_skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux'],
        work_environment: 'Office or remote, collaborative'
      },
      {
        id: 12,
        title: 'HR Manager',
        category: 'Business',
        description: 'Oversee recruitment, employee relations, training, and organizational development.',
        average_salary: '$65,000 - $115,000',
        job_outlook: 'Good',
        education_requirements: "Bachelor's in HR, Business, or Psychology",
        required_skills: ['Recruitment', 'Employee Relations', 'Communication', 'Conflict Resolution'],
        work_environment: 'Office, people-focused'
      }
    ];
  };

  const filterCareers = () => {
    let filtered = [...careers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.required_skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(career => career.category === selectedCategory);
    }

    // Outlook filter
    if (selectedOutlook !== 'All') {
      filtered = filtered.filter(career => career.job_outlook === selectedOutlook);
    }

    setFilteredCareers(filtered);
  };

  const getOutlookColor = (outlook) => {
    switch (outlook) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Very Good': return 'text-blue-600 bg-blue-100';
      case 'Good': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Careers</h1>
          <p className="text-lg text-gray-600">Browse and search available career paths to find your perfect match</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search careers by title, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Outlook Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                Job Outlook
              </label>
              <div className="flex flex-wrap gap-2">
                {outlooks.map((outlook) => (
                  <button
                    key={outlook}
                    onClick={() => setSelectedOutlook(outlook)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedOutlook === outlook
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {outlook}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredCareers.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{careers.length}</span> careers
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading careers...</p>
          </div>
        ) : filteredCareers.length === 0 ? (
          /* No Results */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No careers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedOutlook('All');
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Career Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <div key={career.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 border-b">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-white rounded-lg text-primary-600">
                      {categoryIcons[career.category] || <Briefcase className="w-5 h-5" />}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOutlookColor(career.job_outlook)}`}>
                      {career.job_outlook}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{career.title}</h3>
                  <p className="text-sm text-gray-600">{career.category}</p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{career.description}</p>

                  {/* Quick Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{career.average_salary}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BookOpen className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 line-clamp-1">{career.education_requirements}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.required_skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {career.required_skills?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{career.required_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/careers/${career.id}`}
                    className="flex items-center justify-center space-x-2 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition group-hover:shadow-lg"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Careers Section */}
        {!searchTerm && selectedCategory === 'All' && selectedOutlook === 'All' && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Popular Career Paths</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Software Engineer', 'Data Scientist', 'UX Designer', 'Product Manager'].map((title, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg text-center hover:shadow-md transition cursor-pointer">
                  <Zap className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-600 mt-1">High Demand</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPage;
