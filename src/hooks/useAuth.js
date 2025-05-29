// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { logout, loginUser, updateUserProfile } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  
  return {
    ...auth,
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logout()),
    updateProfile: (userData) => dispatch(updateUserProfile(userData))
  };
};