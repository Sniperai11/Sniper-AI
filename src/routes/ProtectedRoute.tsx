import React from 'react';
import { useSecurityStore } from '../store/useSecurityStore';
import { AuthModal } from '../features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userProfile = useSecurityStore((state) => state.userProfile);

  if (!userProfile) {
    return (
      <div className="py-8 px-4 flex items-center justify-center min-h-[600px]">
        <AuthModal isInline={true} />
      </div>
    );
  }

  return <>{children}</>;
};
