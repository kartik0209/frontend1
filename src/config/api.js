// src/config/api.js
const API_CONFIG = {
  BASE_URL:  'https://afftrex.onrender.com/api',
  TIMEOUT: 15000, // Reduced for better performance
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  RETRY_ATTEMPTS: 2,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

export default API_CONFIG;