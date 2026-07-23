import React, { Suspense, lazy } from 'react';
import { useSecurityStore } from '../store/useSecurityStore';
import { Skeleton } from '../shared/components/Skeleton';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading feature modules for optimal code splitting & performance
const DashboardPage = lazy(() => import('../features/dashboard').then(m => ({ default: m.DashboardPage })));
const ProjectsPage = lazy(() => import('../features/projects').then(m => ({ default: m.ProjectsPage })));
const VulnerabilitiesPage = lazy(() => import('../features/vulnerabilities').then(m => ({ default: m.VulnerabilitiesPage })));
const ReportsPage = lazy(() => import('../features/reports').then(m => ({ default: m.ReportsPage })));
const ChatPage = lazy(() => import('../features/chat').then(m => ({ default: m.ChatPage })));
const SubscriptionPage = lazy(() => import('../features/subscription').then(m => ({ default: m.SubscriptionPage })));
const BugBountyPage = lazy(() => import('../features/bugBounty').then(m => ({ default: m.BugBountyPage })));
const ConstitutionPage = lazy(() => import('../features/constitution').then(m => ({ default: m.ConstitutionPage })));
const CompliancePage = lazy(() => import('../features/compliance').then(m => ({ default: m.CompliancePage })));

// Auth Pages
const LoginPage = lazy(() => import('../features/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../features/auth').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../features/auth').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../features/auth').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('../features/auth').then(m => ({ default: m.VerifyEmailPage })));

interface AppRouterProps {
  onOpenSelfHealing: (findingId: string) => void;
  onOpenAddProject: () => void;
  onOpenAddTarget: () => void;
  onVerifyOwnership: (target: any) => void;
  onOpenTerminal: (scanJobId: string) => void;
  onDisableMfa: () => void;
  onOpenMfaSetup: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  onOpenSelfHealing,
  onOpenAddProject,
  onOpenAddTarget,
  onVerifyOwnership,
  onOpenTerminal,
  onDisableMfa,
  onOpenMfaSetup,
}) => {
  const {
    activeTab,
    userProfile,
    userMode,
    projects,
    vulnerabilities,
    activeScans,
    auditLogs,
    reportsHistory,
    activeReport,
    chatMessages,
    isChatSending,
    bbPrograms,
    bbLeaderboard,
    bbSubmissions,
    bountyReportDraft,
    bountyReportLoading,
    twoFactorEnabled,
    twoFactorType,
    twoFactorPhone,
    actionLoading,
    triggerScan,
    createProject,
    addTargetToProject,
    generateReport,
    sendChatMessage,
    upgradeSubscription,
    clearAuditLogs,
    submitBountyReport,
    reviewBountyReport,
    generateBountyDraft,
  } = useSecurityStore();

  const renderFallback = (
    <div className="p-8 space-y-6">
      <Skeleton height={180} className="w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </div>
      <Skeleton height={300} className="w-full" />
    </div>
  );

  return (
    <Suspense fallback={renderFallback}>
      {/* A. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <ProtectedRoute>
          <DashboardPage
            userProfile={userProfile}
            userMode={userMode}
            projects={projects}
            vulnerabilities={vulnerabilities}
            activeScans={activeScans}
            auditLogs={auditLogs}
            onTriggerScan={triggerScan}
            onOpenSelfHealing={onOpenSelfHealing}
            onOpenAddProject={onOpenAddProject}
            onOpenAddTarget={onOpenAddTarget}
            onVerifyOwnership={onVerifyOwnership}
            onOpenTerminal={onOpenTerminal}
          />
        </ProtectedRoute>
      )}

      {/* B. PROJECTS VIEW */}
      {activeTab === 'projects' && (
        <ProtectedRoute>
          <ProjectsPage
            projects={projects}
            activeScans={activeScans}
            actionLoading={actionLoading}
            onAddProject={createProject}
            onAddTarget={addTargetToProject}
            onTriggerScan={triggerScan}
            onVerifyOwnership={onVerifyOwnership}
            onVerifyBountyTarget={async (targetId, proofUrl) => {
              // verify bounty logic
            }}
          />
        </ProtectedRoute>
      )}

      {/* C. VULNERABILITIES VIEW */}
      {activeTab === 'vulnerabilities' && (
        <ProtectedRoute>
          <VulnerabilitiesPage
            vulnerabilities={vulnerabilities}
            userProfile={userProfile}
            actionLoading={actionLoading}
            onOpenSelfHealing={onOpenSelfHealing}
          />
        </ProtectedRoute>
      )}

      {/* D. REPORTS VIEW */}
      {activeTab === 'reports' && (
        <ProtectedRoute>
          <ReportsPage
            vulnerabilities={vulnerabilities}
            userProfile={userProfile}
            actionLoading={actionLoading}
            projects={projects}
            reportsHistory={reportsHistory}
            onCreateReport={generateReport}
            activeReport={activeReport}
          />
        </ProtectedRoute>
      )}

      {/* E. CHAT VIEW */}
      {activeTab === 'chat' && (
        <ProtectedRoute>
          <ChatPage
            userProfile={userProfile}
            chatMessages={chatMessages}
            onSendMessage={sendChatMessage}
            isChatSending={isChatSending}
          />
        </ProtectedRoute>
      )}

      {/* F. SUBSCRIPTION VIEW */}
      {activeTab === 'subscription' && (
        <ProtectedRoute>
          <SubscriptionPage
            userProfile={userProfile}
            actionLoading={actionLoading}
            onUpgradeSubscription={upgradeSubscription}
            twoFactorEnabled={twoFactorEnabled}
            twoFactorType={twoFactorType}
            twoFactorPhone={twoFactorPhone}
            onDisableMfa={onDisableMfa}
            onOpenMfaSetup={onOpenMfaSetup}
            auditLogs={auditLogs}
            onClearAuditLogs={clearAuditLogs}
          />
        </ProtectedRoute>
      )}

      {/* G. BUG BOUNTY VIEW */}
      {activeTab === 'bugbounty' && (
        <ProtectedRoute>
          <BugBountyPage
            bbPrograms={bbPrograms}
            bbLeaderboard={bbLeaderboard}
            bbSubmissions={bbSubmissions}
            userProfile={userProfile}
            actionLoading={actionLoading}
            onSubmitBountyReport={submitBountyReport}
            onReviewBountyReport={reviewBountyReport}
            onGenerateBountyDraft={generateBountyDraft}
            bountyReportDraft={bountyReportDraft}
            bountyReportLoading={bountyReportLoading}
          />
        </ProtectedRoute>
      )}

      {/* H. CONSTITUTION VIEW */}
      {activeTab === 'constitution' && (
        <ConstitutionPage userProfile={userProfile} />
      )}

      {/* I. COMPLIANCE VIEW */}
      {activeTab === 'compliance' && (
        <CompliancePage userProfile={userProfile} vulnerabilities={vulnerabilities} />
      )}

      {/* AUTH ROUTES */}
      {activeTab === 'login' && (
        <LoginPage />
      )}

      {activeTab === 'register' && (
        <RegisterPage />
      )}

      {activeTab === 'forgot-password' && (
        <ForgotPasswordPage />
      )}

      {activeTab === 'reset-password' && (
        <ResetPasswordPage />
      )}

      {activeTab === 'verify-email' && (
        <VerifyEmailPage />
      )}
    </Suspense>
  );
};
