// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiServices';
import { getRolePermissions } from '../utils/rbac';

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

// Secure token storage
const secureStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
};

// Enhanced login with better error handling
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/common/auth/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        subdomain: credentials.subdomain || 'afftrex',
      });

      const { data: token } = response.data;
      
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
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        const errorMap = {
          400: data?.message || 'Invalid email or password.',
          401: 'Invalid credentials.',
          403: 'Access denied. Contact support.',
          404: 'Service not found.',
          429: 'Too many attempts. Try again later.',
          500: 'Server error. Try again later.',
        };
        errorMessage = errorMap[status] || `Error: ${status}`;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Check connection.';
      } else if (error.name === 'InvalidTokenError') {
        errorMessage = 'Invalid token format.';
      }
      
      return rejectWithValue(errorMessage);
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
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch company data'
      );
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
      // Company data cases
      .addCase(fetchCompanyData.fulfilled, (state, action) => {
        state.companyData = action.payload;
      });
  },
});

export const { 
  logout, 
  clearError, 
  updateUserProfile, 
  setUserPermissions,
  setCompanyData 
} = authSlice.actions;

export default authSlice.reducer;