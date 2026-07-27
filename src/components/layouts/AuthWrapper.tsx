import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../../api/auth/tokenManager';
import { useSecurityStore } from '../../store/useSecurityStore';

export const AuthWrapper = () => {
  const location = useLocation();
  
  // Real authentication check using the stored token
  const isAuthenticated = !!getToken();

  useEffect(() => {
    if (isAuthenticated) {
      useSecurityStore.getState().fetchAllData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
