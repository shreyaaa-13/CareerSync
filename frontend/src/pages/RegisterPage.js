import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', full_name: '',
    education_level: '', current_status: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700"><AlertCircle className="w-5 h-5 mr-2" />{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-md" required />
          <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
            <option value="">Education Level</option>
            <option value="high_school">High School</option>
            <option value="bachelors">Bachelor's</option>
            <option value="masters">Master's</option>
            <option value="phd">PhD</option>
          </select>
          <select name="current_status" value={formData.current_status} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
            <option value="">Current Status</option>
            <option value="student">Student</option>
            <option value="working">Working</option>
            <option value="job_seeking">Job Seeking</option>
          </select>
          <button type="submit" disabled={loading} className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700">{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="mt-6 text-center text-sm">Already have an account? <Link to="/login" className="text-primary-600">Sign in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
