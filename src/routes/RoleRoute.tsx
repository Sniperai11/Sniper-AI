import React from 'react';
import { useSecurityStore } from '../store/useSecurityStore';
import { UserRole } from '../types';
import { ShieldX } from 'lucide-react';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const userProfile = useSecurityStore((state) => state.userProfile);

  const rawRole = userProfile?.role || userProfile?.user?.role || 'admin';
  const role = String(rawRole).toLowerCase();

  const isAllowed = !allowedRoles || allowedRoles.length === 0 || allowedRoles.some((r) => {
    const normR = String(r).toLowerCase();
    if ((normR === 'admin' || normR === 'ciso') && (role === 'admin' || role === 'ciso')) return true;
    return normR === role;
  });

  if (!userProfile || !isAllowed) {
    return (
      <div className="p-8 bg-slate-900/60 border border-rose-900/40 rounded-2xl text-center flex flex-col items-center justify-center my-6" dir="rtl">
        <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-4">
          <ShieldX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-100 mb-2">صلاحية معطلة بروتوكولياً</h4>
        <p className="text-xs text-slate-400 max-w-md">
          يتطلب الوصول إلى هذا القسم دوراً أمنياً من فئة ({allowedRoles.join(' أو ')}). دورك الحالي هو ({role || 'زائر'}).
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
