import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken } from '../../api/auth/tokenManager';

export const AuthWrapper = () => {
  const location = useLocation();
  
  // Real authentication check using the stored token
  const isAuthenticated = !!getToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
