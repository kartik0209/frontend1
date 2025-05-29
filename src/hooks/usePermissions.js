import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/rbac';

export const usePermissions = () => {
  const { permissions, role, user } = useSelector(state => state.auth);
  
  return {
    permissions,
    role,
    user,
    hasPermission: (permission) => hasPermission(permissions, permission),
    hasAnyPermission: (perms) => hasAnyPermission(permissions, perms),
    hasAllPermissions: (perms) => hasAllPermissions(permissions, perms),
    isRole: (requiredRole) => role === requiredRole,
    canAccess: (requiredPermissions = [], requiredRole = null) => {
      if (requiredRole && role !== requiredRole) return false;
      if (requiredPermissions.length === 0) return true;
      return hasAnyPermission(permissions, requiredPermissions);
    }
  };
};
