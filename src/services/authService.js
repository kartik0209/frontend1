// src/services/authService.js
import apiClient from './apiServices';
import { handleAPIError } from '../utils/errorHandler';

const AUTH_ENDPOINTS = {
  LOGIN: '/common/auth/login',
  FORGOT_PASSWORD: '/common/auth/forgot-password',
  RESET_PASSWORD: '/common/auth/reset-password',
 // VERIFY_EMAIL: '/common/auth/verify-email',
  REFRESH_TOKEN: '/common/auth/refresh-token',
  SIGNUP_PUBLISHER: '/common/advertiser/signup',
  SIGNUP_ADVERTISER: '/common/publisher/signup',
};

export const authAPI = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        subdomain: credentials.subdomain || 'afftrex',
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Forgot password
  forgotPassword: async (payload) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
        email: payload.email.trim().toLowerCase(),
        subdomain: payload.subdomain || 'afftrex',
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Reset password
  resetPassword: async (payload) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        email: payload.email,
        token: payload.token,
        newPassword: payload.newPassword,
        subdomain: payload.subdomain,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Verify email
//   verifyEmail: async (payload) => {
//     try {
//       const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, {
//         email: payload.email,
//         token: payload.token,
//       });
//       return response.data;
//     } catch (error) {
//       throw handleAPIError(error);
//     }
//   },

  // Refresh token
  refreshToken: async (token) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
        refreshToken: token,
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Signup publisher
  signupPublisher: async (payload) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.SIGNUP_PUBLISHER, {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        subdomain: payload.subdomain || 'afftrex',
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  // Signup advertiser
  signupAdvertiser: async (payload) => {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.SIGNUP_ADVERTISER, {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        subdomain: payload.subdomain || 'afftrex',
      });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
};
