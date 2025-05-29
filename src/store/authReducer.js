import { AUTH_TYPES } from './types';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  permissions: [],
  role: null,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TYPES.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_TYPES.LOGIN_SUCCESS:
      const { token, user, permissions, role } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        token,
        permissions,
        role,
        loading: false,
        error: null
      };

    case AUTH_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        permissions: [],
        role: null,
        loading: false,
        error: action.payload
      };

    case AUTH_TYPES.LOGOUT:
      return {
        ...initialState
      };

    case AUTH_TYPES.SET_USER_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload
      };

    case AUTH_TYPES.UPDATE_USER_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_TYPES.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default authReducer;