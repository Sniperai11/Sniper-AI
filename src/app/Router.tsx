import React from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { EnterpriseLayout } from '../components/layouts/EnterpriseLayout';
import { AuthWrapper } from '../components/layouts/AuthWrapper';
import { ErrorBoundary } from '../components/layouts/ErrorBoundary';
import { NotFound } from '../pages/NotFound';

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
    errorElement: <ErrorBoundary><NotFound /></ErrorBoundary>,
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
                <TeamManagement />
              </ErrorBoundary>
            )
          },
          { 
            path: 'audit-logs', 
            element: (
              <ErrorBoundary>
                <AuditLogs />
              </ErrorBoundary>
            )
          },
          { 
            path: 'settings', 
            element: (
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            )
          },
          
          { path: '*', element: <NotFound /> }
        ]
      }
    ]
  }
]);
