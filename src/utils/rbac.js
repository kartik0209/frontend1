export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  PUBLISHER: 'publisher',
  ADVERTISER: 'advertiser',
  USER: 'user'
};

export const PERMISSIONS = {
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  
  // User management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Campaign management
  CAMPAIGNS_VIEW: 'campaigns:view',
  CAMPAIGNS_CREATE: 'campaigns:create',
  CAMPAIGNS_EDIT: 'campaigns:edit',
  CAMPAIGNS_DELETE: 'campaigns:delete',
  
  // Publisher management
  PUBLISHERS_VIEW: 'publishers:view',
  PUBLISHERS_MANAGE: 'publishers:manage',
  
  // Advertiser management
  ADVERTISERS_VIEW: 'advertisers:view',
  ADVERTISERS_MANAGE: 'advertisers:manage',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_EDIT,
    PERMISSIONS.PUBLISHERS_VIEW,
    PERMISSIONS.PUBLISHERS_MANAGE,
    PERMISSIONS.ADVERTISERS_VIEW,
    PERMISSIONS.ADVERTISERS_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW
  ],
  
  [ROLES.MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_EDIT,
    PERMISSIONS.PUBLISHERS_VIEW,
    PERMISSIONS.ADVERTISERS_VIEW,
    PERMISSIONS.REPORTS_VIEW
  ],
  
  [ROLES.PUBLISHER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.REPORTS_VIEW
  ],
  
  [ROLES.ADVERTISER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CAMPAIGNS_VIEW,
    PERMISSIONS.CAMPAIGNS_CREATE,
    PERMISSIONS.CAMPAIGNS_EDIT,
    PERMISSIONS.REPORTS_VIEW
  ],
  
  [ROLES.USER]: [
    PERMISSIONS.DASHBOARD_VIEW
  ]
};

// Utility functions for permission checking
export const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};