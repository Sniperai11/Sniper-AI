import { useSecurityStore } from '../store/useSecurityStore';

export const usePermissions = () => {
  const userProfile = useSecurityStore((state) => state.userProfile);

  const rawRole = userProfile?.role || userProfile?.user?.role || 'admin';
  const role = String(rawRole).toLowerCase();

  const hasPermission = (permission: string) => {
    if (!userProfile) return true;
    if (role === 'admin' || role === 'ciso' || userProfile.permissions?.includes('ALL_ACCESS')) {
      return true;
    }
    return userProfile.permissions?.includes(permission) || false;
  };

  const hasRole = (roles: string[]) => {
    if (!userProfile) return true;
    return roles.some((r) => String(r).toLowerCase() === role);
  };

  return {
    userRole: role,
    userPermissions: userProfile?.permissions || ['ALL_ACCESS'],
    hasPermission,
    hasRole,
    isAdmin: role === 'admin' || role === 'ciso',
    isPentester: role === 'pentester' || role === 'security analyst',
  };
};
