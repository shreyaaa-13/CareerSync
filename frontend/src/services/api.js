import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Quiz API
export const quizAPI = {
  getQuestions: (category) => api.get('/quiz/questions', { params: { category } }),
  getCategories: () => api.get('/quiz/categories'),
  submitQuiz: (data) => api.post('/quiz/submit', data),
  getAttempts: () => api.get('/quiz/attempts'),
  getAttempt: (id) => api.get(`/quiz/attempts/${id}`),
  getLatestAttempt: () => api.get('/quiz/latest-attempt'),
  getStatistics: () => api.get('/quiz/statistics'),
};

// Career API
export const careerAPI = {
  getCareers: (params) => api.get('/careers/', { params }),
  getCategories: () => api.get('/careers/categories'),
  getCareer: (id) => api.get(`/careers/${id}`),
  getCareerRoadmap: (id) => api.get(`/careers/${id}/roadmap`),
  getRelatedCareers: (id) => api.get(`/careers/${id}/related`),
  getPopularCareers: () => api.get('/careers/popular'),
};

// Resume API
export const resumeAPI = {
  uploadResume: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResumes: () => api.get('/resume/list'),
  getResume: (id) => api.get(`/resume/${id}`),
  getResumeAnalysis: (id) => api.get(`/resume/${id}/analysis`),
  deleteResume: (id) => api.delete(`/resume/${id}`),
  getLatestResume: () => api.get('/resume/latest'),
};

// Recommendation API
export const recommendationAPI = {
  getRecommendations: () => api.get('/recommendations/'),
  generateRecommendations: () => api.post('/recommendations/generate'),
  getRecommendation: (id) => api.get(`/recommendations/${id}`),
  acceptRecommendation: (id) => api.post(`/recommendations/${id}/accept`),
  getTopRecommendations: () => api.get('/recommendations/top'),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (data) => api.post('/chatbot/message', data),
  getChatHistory: (params) => api.get('/chatbot/history', { params }),
  getChatMessage: (id) => api.get(`/chatbot/history/${id}`),
  clearHistory: () => api.delete('/chatbot/history/clear'),
  getSuggestions: () => api.get('/chatbot/suggestions'),
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: (data) => api.post('/feedback/submit', data),
  getFeedback: () => api.get('/feedback/list'),
  getFeedbackById: (id) => api.get(`/feedback/${id}`),
  updateFeedback: (id, data) => api.put(`/feedback/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedback/${id}`),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications/', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications/clear-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getCareers: (params) => api.get('/admin/careers', { params }),
  createCareer: (data) => api.post('/admin/careers', data),
  updateCareer: (id, data) => api.put(`/admin/careers/${id}`, data),
  deleteCareer: (id) => api.delete(`/admin/careers/${id}`),
  getQuestions: () => api.get('/admin/quiz/questions'),
  createQuestion: (data) => api.post('/admin/quiz/questions', data),
  updateQuestion: (id, data) => api.put(`/admin/quiz/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/quiz/questions/${id}`),
  createRoadmapPhase: (careerId, data) => api.post(`/admin/careers/${careerId}/roadmap`, data),
  updateRoadmapPhase: (id, data) => api.put(`/admin/roadmap/${id}`, data),
  deleteRoadmapPhase: (id) => api.delete(`/admin/roadmap/${id}`),
};

export default api;
