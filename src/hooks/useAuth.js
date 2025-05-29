import { useSelector, useDispatch } from 'react-redux';
import { logout, loginUser, updateUserProfile } from '../store/authActions';

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
