import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { EnterpriseLayout } from '../components/layouts/EnterpriseLayout';
import { AuthWrapper } from '../components/layouts/AuthWrapper';
import { ErrorBoundary } from '../components/layouts/ErrorBoundary';
import { NotFound } from '../pages/NotFound';
import { useProfile } from '../hooks/api/useProfile';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Admin Route Guard that checks user role (from Firestore user attribute or user profile)
const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: profile, isLoading } = useProfile();
  const [firestoreRole, setFirestoreRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleFromFirestore = async () => {
      try {
        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const userId = profile?.user?.id || profile?.user?.uid;
        if (userId) {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists() && userDoc.data()?.role) {
            setFirestoreRole(userDoc.data().role);
          }
        }
      } catch {
        // Fallback to profile role if Firestore query is unavailable
      }
    };

    if (profile?.user) {
      fetchRoleFromFirestore();
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const effectiveRole = firestoreRole || profile?.user?.role || 'Viewer';
  const isAdmin = effectiveRole.toLowerCase() === 'admin';

  if (!isAdmin) {
    return <Navigate to="/command-center" replace />;
  }

  return <>{children}</>;
};

// Page components
import { CommandCenter } from '../pages/CommandCenter';
import { AssetIntelligence } from '../pages/AssetIntelligence';
import { AssetDetails } from '../pages/AssetDetails';
import { AIPentest } from '../pages/AIPentest';
import { Vulnerabilities } from '../pages/Vulnerabilities';
import { Reports } from '../pages/Reports';
import { Cases } from '../pages/Cases';
import { Tasks } from '../pages/Tasks';
import { TeamManagement } from '../pages/TeamManagement';
import { AuditLogs } from '../pages/AuditLogs';
import { Settings } from '../pages/Settings';
import { LoginPage } from '../legacy/features/auth/pages/LoginPage';
import { RegisterPage } from '../legacy/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '../legacy/features/auth/pages/ForgotPasswordPage';

const LoginWrapper = () => {
  const navigate = useNavigate();
  return <LoginPage onNavigate={(path) => {
    if (path === 'dashboard') navigate('/command-center');
    else if (path === 'register') navigate('/register');
    else if (path === 'forgot-password') navigate('/forgot-password');
    else navigate('/');
  }} />;
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <RegisterPage onNavigate={(path) => {
    if (path === 'dashboard') navigate('/command-center');
    else if (path === 'login') navigate('/login');
    else navigate('/');
  }} />;
};

const ForgotPasswordWrapper = () => {
  const navigate = useNavigate();
  return <ForgotPasswordPage onNavigate={(path) => {
    if (path === 'login') navigate('/login');
    else navigate('/');
  }} />;
};

// Placeholder components for routes
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex h-[50vh] items-center justify-center text-slate-400 border border-slate-800 rounded-xl bg-slate-900/20 border-dashed">
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm">هذه الصفحة ستأتي قريباً... (Coming Soon)</p>
    </div>
  </div>
);

const RouteErrorFallback = () => (
  <div className="flex h-screen items-center justify-center p-6 bg-[#030712] text-slate-200" dir="rtl">
    <div className="text-center space-y-4 max-w-md bg-slate-900/90 p-8 rounded-2xl border border-cyan-500/20 shadow-2xl">
      <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-100">نظام منصة Sniper AI Security</h2>
      <p className="text-sm text-slate-400 leading-relaxed">جاري تحميل مركز القيادة والأنظمة الشاملة...</p>
      <button 
        onClick={() => {
          try {
            localStorage.removeItem('sniper_logged_out');
          } catch {}
          window.location.href = '/command-center';
        }}
        className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-cyan-600/20"
      >
        الانتقال المباشر لمركز القيادة
      </button>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <ErrorBoundary>
        <LoginWrapper />
      </ErrorBoundary>
    )
  },
  {
    path: '/register',
    element: (
      <ErrorBoundary>
        <RegisterWrapper />
      </ErrorBoundary>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <ErrorBoundary>
        <ForgotPasswordWrapper />
      </ErrorBoundary>
    )
  },
  {
    path: '/',
    element: <AuthWrapper />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: '/',
        element: <EnterpriseLayout />,
        children: [
          { index: true, element: <Navigate to="/command-center" replace /> },
          
          // COMMAND CENTER
          { 
            path: 'command-center', 
            element: (
              <ErrorBoundary>
                <CommandCenter />
              </ErrorBoundary>
            )
          },
          { 
            path: 'projects', 
            element: (
              <ErrorBoundary>
                <AssetIntelligence />
              </ErrorBoundary>
            )
          },
          { 
            path: 'projects/:id', 
            element: (
              <ErrorBoundary>
                <AssetDetails />
              </ErrorBoundary>
            )
          },
          
          // SECURITY OPERATIONS
          { 
            path: 'scans', 
            element: (
              <ErrorBoundary>
                <AIPentest />
              </ErrorBoundary>
            )
          },
          { 
            path: 'vulnerabilities', 
            element: (
              <ErrorBoundary>
                <Vulnerabilities />
              </ErrorBoundary>
            )
          },
          { path: 'vulnerabilities/:id', element: <ComingSoon title="تفاصيل الثغرة" /> },
          { 
            path: 'remediations', 
            element: (
              <ErrorBoundary>
                <Tasks />
              </ErrorBoundary>
            )
          },
          { 
            path: 'bugbounty', 
            element: (
              <ErrorBoundary>
                <Cases />
              </ErrorBoundary>
            )
          },
          
          // COMING SOON
          { path: 'threat-intelligence', element: <ComingSoon title="استخبارات التهديدات" /> },
          { path: 'risk-analytics', element: <ComingSoon title="تحليلات المخاطر" /> },
          { path: 'compliance', element: <ComingSoon title="الامتثال والمعايير" /> },
          { path: 'integrations', element: <ComingSoon title="التكاملات والربط" /> },
          
          { 
            path: 'reports', 
            element: (
              <ErrorBoundary>
                <Reports />
              </ErrorBoundary>
            )
          },
          { path: 'reports/:id', element: <ComingSoon title="تفاصيل التقرير" /> },
          
          // ADMINISTRATION
          { 
            path: 'team', 
            element: (
              <ErrorBoundary>
                <AdminRouteGuard>
                  <TeamManagement />
                </AdminRouteGuard>
              </ErrorBoundary>
            )
          },
          { 
            path: 'audit-logs', 
            element: (
              <ErrorBoundary>
                <AdminRouteGuard>
                  <AuditLogs />
                </AdminRouteGuard>
              </ErrorBoundary>
            )
          },
          { 
            path: 'settings', 
            element: (
              <ErrorBoundary>
                <AdminRouteGuard>
                  <Settings />
                </AdminRouteGuard>
              </ErrorBoundary>
            )
          },
          
          { path: '*', element: <NotFound /> }
        ]
      }
    ]
  }
]);
