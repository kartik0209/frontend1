// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  permissions: [],
  role: null,
  loading: false,
  error: null
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://afftrex.onrender.com/api/common/auth/login",
        {
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
          withCredentials: false,
        }
      );

      const { data } = response.data;
      
      // Store token in localStorage (as backup)
      localStorage.setItem("authToken", data);
      
      // Decode JWT to extract user details
      const decoded = jwtDecode(data);
      const { name, role, permissions, email, id } = decoded;

      const user = {
        id,
        name,
        email,
        role
      };

      return {
        token: data,
        user,
        permissions: permissions || [],
        role
      };
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            errorMessage = data?.message || "Invalid email or password.";
            break;
          case 401:
            errorMessage = "Invalid credentials.";
            break;
          case 403:
            errorMessage = "Access denied. Contact support.";
            break;
          case 404:
            errorMessage = "Login service not found.";
            break;
          case 429:
            errorMessage = "Too many attempts. Try later.";
            break;
          case 500:
            errorMessage = "Server error. Try again later.";
            break;
          default:
            errorMessage = data?.message || `Error: ${status}`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Check your connection.";
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for initializing auth from stored token
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return rejectWithValue('No token found');
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp <= currentTime) {
        localStorage.removeItem('authToken');
        return rejectWithValue('Token expired');
      }

      const { name, role, permissions, email, id } = decoded;
      const user = { id, name, email, role };
      
      return {
        token,
        user,
        permissions: permissions || [],
        role
      };
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue('Invalid token');
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      return initialState;
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
    }
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
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.role = null;
        state.error = action.payload;
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.role = null;
        state.error = null; // Don't show error for init failure
      });
  },
});

export const { logout, clearError, updateUserProfile, setUserPermissions } = authSlice.actions;
export default authSlice.reducer;