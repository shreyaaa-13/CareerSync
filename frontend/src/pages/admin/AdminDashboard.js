import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Briefcase, 
  FileQuestion,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  Plus,
  Edit,
  Trash2,
  Search,
  BarChart3,
  Award,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Try to load from backend
      try {
        const response = await adminAPI.getDashboard();
        setStats(response.data.stats);
      } catch (apiErr) {
        // Use mock data
        setStats(getMockStats());
      }
      loadUsers();
      loadCareers();
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setStats(getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const getMockStats = () => ({
    total_users: 156,
    active_users: 142,
    total_careers: 12,
    total_quiz_attempts: 89,
    total_recommendations: 234,
    total_resumes: 67,
    recent_signups: 23,
    popular_careers: [
      { title: 'Software Engineer', views: 145 },
      { title: 'Data Scientist', views: 128 },
      { title: 'UX Designer', views: 98 }
    ]
  });

  const loadUsers = () => {
    // Mock user data
    setUsers([
      { id: 1, full_name: 'John Doe', email: 'john.doe@example.com', role: 'student', is_active: true, created_at: '2024-01-15' },
      { id: 2, full_name: 'Jane Smith', email: 'jane.smith@example.com', role: 'student', is_active: true, created_at: '2024-01-20' },
      { id: 3, full_name: 'Mike Johnson', email: 'mike.j@example.com', role: 'student', is_active: false, created_at: '2024-02-01' },
      { id: 4, full_name: 'Sarah Williams', email: 'sarah.w@example.com', role: 'student', is_active: true, created_at: '2024-02-10' },
      { id: 5, full_name: 'Admin User', email: 'admin@careerguidance.com', role: 'admin', is_active: true, created_at: '2024-01-01' }
    ]);
  };

  const loadCareers = () => {
    // Mock career data
    setCareers([
      { id: 1, title: 'Software Engineer', category: 'Technology', job_outlook: 'Excellent', created_at: '2024-01-10' },
      { id: 2, title: 'Data Scientist', category: 'Technology', job_outlook: 'Excellent', created_at: '2024-01-10' },
      { id: 3, title: 'UX Designer', category: 'Design', job_outlook: 'Very Good', created_at: '2024-01-12' },
      { id: 4, title: 'Product Manager', category: 'Business', job_outlook: 'Very Good', created_at: '2024-01-15' }
    ]);
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCareers = careers.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-semibold">+{stats?.recent_signups || 0}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</h3>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">{Math.round((stats?.active_users / stats?.total_users) * 100)}%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.active_users || 0}</h3>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.total_careers || 0}</h3>
          <p className="text-sm text-gray-600">Career Paths</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileQuestion className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats?.total_quiz_attempts || 0}</h3>
          <p className="text-sm text-gray-600">Quiz Attempts</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Award className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-gray-900">Recommendations</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total_recommendations || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Generated</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Resumes Analyzed</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total_resumes || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Total uploads</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900">Engagement Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">91%</p>
          <p className="text-sm text-gray-600 mt-1">User activity</p>
        </div>
      </div>

      {/* Popular Careers */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">Popular Career Paths</h3>
        </div>
        <div className="space-y-3">
          {stats?.popular_careers?.map((career, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{career.title}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${(career.views / 150) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">{career.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Users Tab
  const UsersTab = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="ml-4 flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">{user.full_name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Careers Tab
  const CareersTab = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="ml-4 flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4" />
            <span>Add Career</span>
          </button>
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career) => (
          <div key={career.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{career.title}</h3>
                <p className="text-sm text-gray-600">{career.category}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                career.job_outlook === 'Excellent' ? 'bg-green-100 text-green-800' :
                career.job_outlook === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {career.job_outlook}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Clock className="w-4 h-4 mr-1" />
              Added {new Date(career.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Admin panel for managing users, careers, and quiz questions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition ${
                activeTab === 'careers'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Careers</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'careers' && <CareersTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
