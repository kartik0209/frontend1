import { AUTH_TYPES } from './types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const loginRequest = () => ({
  type: AUTH_TYPES.LOGIN_REQUEST
});

export const loginSuccess = (token, user, permissions, role) => ({
  type: AUTH_TYPES.LOGIN_SUCCESS,
  payload: { token, user, permissions, role }
});

export const loginFailure = (error) => ({
  type: AUTH_TYPES.LOGIN_FAILURE,
  payload: error
});

export const logout = () => {
  localStorage.removeItem('authToken');
  return {
    type: AUTH_TYPES.LOGOUT
  };
};

export const setUserPermissions = (permissions) => ({
  type: AUTH_TYPES.SET_USER_PERMISSIONS,
  payload: permissions
});

export const updateUserProfile = (userData) => ({
  type: AUTH_TYPES.UPDATE_USER_PROFILE,
  payload: userData
});

export const clearAuthError = () => ({
  type: AUTH_TYPES.CLEAR_AUTH_ERROR
});


export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    
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
      localStorage.setItem("authToken", data);
      
      const decoded = jwtDecode(data);
      const { name, role, permissions, email, id } = decoded;

      const user = {
        id,
        name,
        email,
        role
      };

      dispatch(loginSuccess(data, user, permissions || [], role));
      
      return { success: true };
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
      }
      
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };
};

// Action to initialize auth from stored token
export const initializeAuth = () => {
  return (dispatch) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          const { name, role, permissions, email, id } = decoded;
          const user = { id, name, email, role };
          
          dispatch(loginSuccess(token, user, permissions || [], role));
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
  };
};