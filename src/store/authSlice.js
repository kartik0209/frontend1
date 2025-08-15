// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/authService';
import apiClient from '../services/apiServices';
import { getRolePermissions } from '../utils/rbac';
import { secureStorage } from '../utils/helpers';
import { logError } from '../utils/errorHandler';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  permissions: [],
  role: null,
  loading: false,
  error: null,
  subdomain: null,
  companyData: null,
};

// Enhanced login with centralized auth service
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      const { data: token } = response;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Validate and decode token
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp <= currentTime) {
        throw new Error('Token expired');
      }

      // Store token securely
      secureStorage.setItem('authToken', token);

      const { name, role, email, id, subdomain } = decoded;
      const user = { id, name, email, role };
      const permissions = decoded.permissions || getRolePermissions(role);

      return {
        token,
        user,
        permissions,
        role,
        subdomain: subdomain || credentials.subdomain || 'afftrex',
      };
    } catch (error) {
      logError(error, 'loginUser', { email: credentials.email });
      return rejectWithValue(error.message);
    }
  }
);

// Optimized auth initialization
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = secureStorage.getItem('authToken');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token expires in next 5 minutes
      if (decoded.exp <= currentTime + 300) {
        secureStorage.removeItem('authToken');
        return rejectWithValue('Token expired');
      }

      const { name, role, email, id, subdomain } = decoded;
      const user = { id, name, email, role };
      const permissions = decoded.permissions || getRolePermissions(role);
      
      return {
        token,
        user,
        permissions,
        role,
        subdomain,
      };
    } catch (error) {
      secureStorage.removeItem('authToken');
      logError(error, 'initializeAuth');
      return rejectWithValue('Invalid token');
    }
  }
);

// Fetch company data
export const fetchCompanyData = createAsyncThunk(
  'auth/fetchCompanyData',
  async (subdomain, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/company/auth/loginInfo', {
        params: { subdomain }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch company data');
      }
    } catch (error) {
      logError(error, 'fetchCompanyData', { subdomain });
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch company data'
      );
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await authAPI.refreshToken(token);
      
      const { data: newToken } = response;
      if (!newToken) {
        throw new Error('No token received');
      }

      // Validate and decode new token
      const decoded = jwtDecode(newToken);
      secureStorage.setItem('authToken', newToken);

      const { name, role, email, id, subdomain } = decoded;
      const user = { id, name, email, role };
      const permissions = decoded.permissions || getRolePermissions(role);

      return {
        token: newToken,
        user,
        permissions,
        role,
        subdomain,
      };
    } catch (error) {
      logError(error, 'refreshToken');
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      secureStorage.removeItem('authToken');
      return { ...initialState };
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUserPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setCompanyData: (state, action) => {
      state.companyData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.role = action.payload.role;
        state.subdomain = action.payload.subdomain;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.role = null;
        state.subdomain = null;
        state.error = action.payload;
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.role = action.payload.role;
        state.subdomain = action.payload.subdomain;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.role = null;
        state.subdomain = null;
        state.error = null;
      })
      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
        state.role = action.payload.role;
        state.subdomain = action.payload.subdomain;
      })
      .addCase(refreshToken.rejected, (state) => {
        // Force logout on refresh token failure
        secureStorage.removeItem('authToken');
        return { ...initialState };
      })
      // Company data cases
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.companyData = action.payload;
      })
      .addCase(fetchCompanyData.rejected, (state, action) => {
        // Don't clear company data on failure, just log the error
        console.warn('Failed to fetch company data:', action.payload);
      });
  },
});

export const { 
  logout, 
  clearError, 
  updateUserProfile, 
  setUserPermissions,
  setCompanyData,
  setLoading
} = authSlice.actions;

export default authSlice.reducer;