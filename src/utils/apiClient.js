import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/authActions';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'https://afftrex.onrender.com/api',
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch(logout());
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
