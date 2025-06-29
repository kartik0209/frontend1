import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission, hasAnyPermission } from '../../utils/rbac';

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredPermissions = [], 
  requiredRole,
  fallback = null 
}) => {
  const { isAuthenticated, user, permissions, role } = useSelector(state => state.auth);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
    return fallback || <Navigate to="/dashboard" replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(permissions, requiredPermission)) {
    return fallback || <Navigate to="/dashboard" replace />;
  }

  // Check multiple permissions (user needs at least one)
  if (requiredPermissions.length > 0 && !hasAnyPermission(permissions, requiredPermissions)) {
    return fallback || <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
