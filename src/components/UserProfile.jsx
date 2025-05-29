import React from 'react';
import { useSelector } from 'react-redux';
import { ROLES } from '../utils/rbac';

const UserProfile = () => {
  const { user, role, permissions } = useSelector(state => state.auth);
  
  const getRoleBadgeColor = (role) => {
    const colors = {
      [ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800',
      [ROLES.ADMIN]: 'bg-purple-100 text-purple-800',
      [ROLES.MANAGER]: 'bg-blue-100 text-blue-800',
      [ROLES.PUBLISHER]: 'bg-green-100 text-green-800',
      [ROLES.ADVERTISER]: 'bg-yellow-100 text-yellow-800',
      [ROLES.USER]: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="user-profile p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}>
            {role?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-sm text-gray-700 mb-2">Permissions:</h4>
        <div className="flex flex-wrap gap-1">
          {permissions.map((permission) => (
            <span 
              key={permission} 
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
            >
              {permission.replace(':', ' ').replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
