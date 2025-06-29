// src/utils/errorHandler.js

/**
 * Centralized API error handler
 * @param {Error} error - The error object from API call
 * @returns {Error} Formatted error with user-friendly message
 */
export const handleAPIError = (error) => {
  console.error('API Error:', error);

  // Network errors
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timed out. Please try again.');
    }
    if (error.code === 'ERR_NETWORK') {
      return new Error('Network connection failed. Please check your internet.');
    }
    return new Error('Unable to connect to server. Please try again later.');
  }

  // HTTP status errors
  const { status, data } = error.response;
  const message = data?.message || data?.error || getDefaultErrorMessage(status);

  const customError = new Error(message);
  customError.status = status;
  customError.data = data;
  
  return customError;
};

/**
 * Get default error message based on HTTP status
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly error message
 */
const getDefaultErrorMessage = (status) => {
  const errorMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Authentication failed. Please login again.',
    403: 'You don\'t have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This request conflicts with existing data.',
    429: 'Too many requests. Please wait before trying again.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable.',
    503: 'Service maintenance in progress. Please try again later.',
    504: 'Request timeout. Please try again.',
  };

  return errorMessages[status] || `An error occurred (${status}). Please try again.`;
};

/**
 * Handle form validation errors
 * @param {object} error - Validation error object
 * @param {function} setFieldError - Formik setFieldError function
 */
export const handleFormErrors = (error, setFieldError) => {
  if (error.status === 422 && error.data?.errors) {
    // Handle validation errors from server
    Object.entries(error.data.errors).forEach(([field, messages]) => {
      const message = Array.isArray(messages) ? messages[0] : messages;
      setFieldError(field, message);
    });
    return true;
  }

  // Handle credential-specific errors
  const errorMessage = error.message.toLowerCase();
  if (errorMessage.includes('email')) {
    setFieldError('email', 'Invalid email address');
    return true;
  }
  if (errorMessage.includes('password') || errorMessage.includes('credentials')) {
    setFieldError('password', 'Invalid password');
    return true;
  }

  return false;
};

/**
 * Log error for debugging (can be extended to send to error reporting service)
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 * @param {object} metadata - Additional metadata
 */
export const logError = (error, context = 'Unknown', metadata = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    metadata,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.error('Error Log:', errorLog);

  // In production, you might want to send this to an error reporting service
  // Example: Sentry, LogRocket, Bugsnag, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorReportingService(errorLog);
  }
};

/**
 * Retry function with exponential backoff
 * @param {function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Result of function execution
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Don't retry on certain errors
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        throw error;
      }
      
      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};