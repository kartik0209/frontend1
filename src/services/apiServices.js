// src/services/apiService.js
import axios from 'axios';
import API_CONFIG from '../config/api';

// Create optimized axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: false,
});

// Cache for GET requests
const cache = new Map();

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache key for GET requests
    if (config.method === 'get') {
      const cacheKey = `${config.url}_${JSON.stringify(config.params || {})}`;
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
        // Return cached response
        config.adapter = () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        });
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}_${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Retry logic for network errors
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }
    
    if (originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS && 
        (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
      originalRequest._retryCount++;
      return apiClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Clear cache function
export const clearCache = () => {
  cache.clear();
};

export default apiClient;