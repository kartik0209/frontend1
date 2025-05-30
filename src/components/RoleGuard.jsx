// src/components/RoleGuard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/rbac';

const RoleGuard = ({ 
  children, 
  requiredPermission, 
  requiredPermissions, 
  requireAll = false,
  fallback = null 
}) => {
  const { permissions = [], role } = useSelector(state => state.auth);

  // Debug logging
  // console.log('RoleGuard Debug:', {
  //   userPermissions: permissions,
  //   userRole: role,
  //   requiredPermission,
  //   requiredPermissions,
  //   requireAll
  // });

  let hasAccess = false;

  if (requiredPermission) {
    // Single permission check
    hasAccess = hasPermission(permissions, requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    // Multiple permissions check
    if (requireAll) {
      hasAccess = hasAllPermissions(permissions, requiredPermissions);
    } else {
      hasAccess = hasAnyPermission(permissions, requiredPermissions);
    }
  } else {
    // If no permissions specified, allow access
    hasAccess = true;
  }

  console.log('RoleGuard Access:', hasAccess);

  return hasAccess ? children : fallback;
};

export default RoleGuard;