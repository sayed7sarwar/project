import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const requestOTP = (data) => API.post('/auth/request-otp', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const updateProfile = (data) => API.put('/auth/profile', data);

export const getActiveSurveys = (params) => API.get('/survey/active', { params });
export const submitResponse = (data) => API.post('/survey/respond', data);
export const getDashboardData = (surveyId) => API.get(`/survey/dashboard/${surveyId}`);

export const submitGrievance = (data) => API.post('/grievance/submit', data);
export const getGrievances = (params) => API.get('/grievance', { params });
export const upvoteGrievance = (id) => API.post(`/grievance/${id}/upvote`);

export default API;
