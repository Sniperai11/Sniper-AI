import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { EnterpriseLayout } from '../components/layouts/EnterpriseLayout';
import { AuthWrapper } from '../components/layouts/AuthWrapper';
import { ErrorBoundary } from '../components/layouts/ErrorBoundary';
import { NotFound } from '../pages/NotFound';

// Lazy loaded pages
const CommandCenter = lazy(() => import('../pages/CommandCenter').then(m => ({ default: m.CommandCenter })));
const AttackSurface = lazy(() => import('../pages/AttackSurface').then(m => ({ default: m.AttackSurface })));

const AssetIntelligence = lazy(() => import('../pages/AssetIntelligence').then(m => ({ default: m.AssetIntelligence })));
const AssetDetails = lazy(() => import('../pages/AssetDetails').then(m => ({ default: m.AssetDetails })));
const AIPentest = lazy(() => import('../pages/AIPentest').then(m => ({ default: m.AIPentest })));
const Vulnerabilities = lazy(() => import('../pages/Vulnerabilities').then(m => ({ default: m.Vulnerabilities })));
const AIAgents = lazy(() => import('../pages/AIAgents').then(m => ({ default: m.AIAgents })));
const ThreatIntelligence = lazy(() => import('../pages/ThreatIntelligence').then(m => ({ default: m.ThreatIntelligence })));
const Reports = lazy(() => import('../pages/Reports').then(m => ({ default: m.Reports })));
const Compliance = lazy(() => import('../pages/Compliance').then(m => ({ default: m.Compliance })));
const Incidents = lazy(() => import('../pages/Incidents').then(m => ({ default: m.Incidents })));
const Cases = lazy(() => import('../pages/Cases').then(m => ({ default: m.Cases })));
const Tasks = lazy(() => import('../pages/Tasks').then(m => ({ default: m.Tasks })));
const RiskAnalytics = lazy(() => import('../pages/RiskAnalytics').then(m => ({ default: m.RiskAnalytics })));

// Placeholder components for routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-[50vh] items-center justify-center text-slate-400 border border-slate-800 rounded-xl bg-slate-900/20 border-dashed">
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm">This module is being migrated to the new enterprise architecture.</p>
    </div>
  </div>
);

const FallbackLoader = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
      <div className="text-sm text-slate-500 animate-pulse">Loading Module...</div>
    </div>
  </div>
);

export const router = createBrowserRouter([
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
                <Suspense fallback={<FallbackLoader />}>
                  <CommandCenter />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'attack-surface', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <AttackSurface />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'assets', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <AssetIntelligence />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'assets/:id', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <AssetDetails />
                </Suspense>
              </ErrorBoundary>
            )
          },
          
          // SECURITY OPERATIONS
          { 
            path: 'ai-pentest', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <AIPentest />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'vulnerabilities', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Vulnerabilities />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { path: 'vulnerabilities/:id', element: <Placeholder title="Vulnerability Details" /> },
          { 
            path: 'threat-intelligence', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <ThreatIntelligence />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'incidents', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Incidents />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'cases', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Cases />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'tasks', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Tasks />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'ai-security-agents', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <AIAgents />
                </Suspense>
              </ErrorBoundary>
            )
          },
          
          // RISK MANAGEMENT
          { 
            path: 'risk-analytics', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <RiskAnalytics />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'compliance', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Compliance />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { 
            path: 'reports', 
            element: (
              <ErrorBoundary>
                <Suspense fallback={<FallbackLoader />}>
                  <Reports />
                </Suspense>
              </ErrorBoundary>
            )
          },
          { path: 'reports/:id', element: <Placeholder title="Report Details" /> },
          
          // ADMINISTRATION
          { path: 'team', element: <Placeholder title="Team Management" /> },
          { path: 'integrations', element: <Placeholder title="Integrations" /> },
          { path: 'audit-logs', element: <Placeholder title="Audit Logs" /> },
          { path: 'settings', element: <Placeholder title="Settings" /> },
          
          { path: '*', element: <NotFound /> }
        ]
      }
    ]
  }
]);
