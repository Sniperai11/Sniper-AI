import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSecurityStore } from '../../store/useSecurityStore';

export const AuthWrapper = () => {
  const { userProfile } = useSecurityStore();
  const location = useLocation();

  // For migration purposes, if no user is found, we can mock one or redirect.
  // Since we are migrating, we will just allow it for now if we want to preview the UI,
  // or we can strictly enforce it. Let's assume the user is always authenticated in this preview.
  const isAuthenticated = true; // Replace with actual auth check (e.g. !!userProfile)

  if (!isAuthenticated) {
    return <Navigate to="/legacy/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
