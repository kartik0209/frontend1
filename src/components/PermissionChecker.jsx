import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

const PermissionChecker = ({ 
  requiredPermission, 
  requiredPermissions = [], 
  requiredRole,
  children,
  fallback = null,
  showFallback = true 
}) => {
  const { hasPermission, hasAnyPermission, isRole } = usePermissions();
  
  let hasAccess = true;
  
  if (requiredRole && !isRole(requiredRole)) {
    hasAccess = false;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    hasAccess = false;
  }
  
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    hasAccess = false;
  }
  
  if (!hasAccess) {
    return showFallback ? fallback : null;
  }
  
  return children;
};

export default PermissionChecker;