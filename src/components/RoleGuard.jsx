import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission } from '../utils/rbac';

const RoleGuard = ({ 
  children, 
  requiredPermission, 
  requiredPermissions = [], 
  requiredRole,
  fallback = null 
}) => {
  const { user, permissions, role } = useSelector(state => state.auth);

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
    return fallback;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return fallback;
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0 && !hasAnyPermission(permissions, requiredPermissions)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;