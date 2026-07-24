import { create } from 'zustand';
import {
  UserProfile,
  UserMode,
  Project,
  Vulnerability,
  ActiveScan,
  AuditLog,
  ReportHistoryItem,
  SecurityReport,
  BugBountyProgram,
  BountyLeaderboardUser,
  BountySubmission
} from '../types';
import { usersApi } from '../services/api/usersApi';
import { projectsApi } from '../services/api/projectsApi';
import { scanApi } from '../services/api/scanApi';
import { reportApi } from '../services/api/reportApi';

import { useUIStore, ToastItem } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import { useProjectStore } from '../stores/projectStore';
import { useScanStore } from '../stores/scanStore';
import { useFindingStore } from '../stores/findingStore';
import { useReportStore } from '../stores/reportStore';
import { useChatStore, ChatMessage } from '../stores/chatStore';
import { useBugBountyStore } from '../stores/bugBountyStore';
import { useAuditStore } from '../stores/auditStore';

export type { ToastItem, ChatMessage };

export interface SecurityState {
  // Authentication & Session
  userProfile: UserProfile | null;
  userMode: UserMode;
  activeTab: string;
  
  // Platform Data
  projects: Project[];
  vulnerabilities: Vulnerability[];
  activeScans: ActiveScan[];
  auditLogs: AuditLog[];
  reportsHistory: ReportHistoryItem[];
  activeReport: SecurityReport | null;

  // Bug Bounty Data
  bbPrograms: BugBountyProgram[];
  bbLeaderboard: BountyLeaderboardUser[];
  bbSubmissions: BountySubmission[];
  bountyReportDraft: string | null;
  bountyReportLoading: boolean;

  // Chat Advisor
  chatMessages: ChatMessage[];
  isChatSending: boolean;

  // MFA & Security Settings
  twoFactorEnabled: boolean;
  twoFactorType: 'app' | 'sms';
  twoFactorPhone: string;

  // Global UI & Feedback
  isLoading: boolean;
  actionLoading: string | null;
  toasts: ToastItem[];

  // Actions
  setActiveTab: (tab: string) => void;
  setUserMode: (mode: UserMode) => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  fetchAllData: () => Promise<void>;
  
  // Auth Actions
  login: (email: string, password?: string, mode?: string) => Promise<void>;
  register: (payload: { name: string; email: string; companyName?: string; password?: string; mode?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  
  // Domain Actions
  triggerScan: (targetId: string, scannerType?: string) => Promise<void>;
  performSelfHealing: (vulnId: string) => Promise<void>;
  createProject: (name: string, description: string) => Promise<void>;
  addTargetToProject: (projectId: string, name: string, url: string, type: any, bountyPlatform?: string) => Promise<void>;
  generateReport: (projectId: string, logo?: string, prefix?: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  upgradeSubscription: (planName: string) => Promise<void>;
  clearAuditLogs: () => Promise<void>;
  submitBountyReport: (payload: any) => Promise<void>;
  reviewBountyReport: (submissionId: string, status: string, points?: number, reward?: number) => Promise<void>;
  generateBountyDraft: (payload: any) => Promise<void>;
}

export const useSecurityStore = create<SecurityState>((set, get) => ({
  // State getters delegated / mirrored from sub-stores for full backwards compatibility
  get userProfile() { return useAuthStore.getState().userProfile; },
  get userMode() { return useUIStore.getState().userMode; },
  get activeTab() { return useUIStore.getState().activeTab; },

  get projects() { return useProjectStore.getState().projects; },
  get vulnerabilities() { return useFindingStore.getState().vulnerabilities; },
  get activeScans() { return useScanStore.getState().activeScans; },
  get auditLogs() { return useAuditStore.getState().auditLogs; },
  get reportsHistory() { return useReportStore.getState().reportsHistory; },
  get activeReport() { return useReportStore.getState().activeReport; },

  get bbPrograms() { return useBugBountyStore.getState().bbPrograms; },
  get bbLeaderboard() { return useBugBountyStore.getState().bbLeaderboard; },
  get bbSubmissions() { return useBugBountyStore.getState().bbSubmissions; },
  get bountyReportDraft() { return useBugBountyStore.getState().bountyReportDraft; },
  get bountyReportLoading() { return useBugBountyStore.getState().bountyReportLoading; },

  get chatMessages() { return useChatStore.getState().chatMessages; },
  get isChatSending() { return useChatStore.getState().isChatSending; },

  get twoFactorEnabled() { return useAuthStore.getState().twoFactorEnabled; },
  get twoFactorType() { return useAuthStore.getState().twoFactorType; },
  get twoFactorPhone() { return useAuthStore.getState().twoFactorPhone; },

  get isLoading() { return useUIStore.getState().isLoading; },
  get actionLoading() { return useUIStore.getState().actionLoading; },
  get toasts() { return useUIStore.getState().toasts; },

  setActiveTab: (tab) => useUIStore.getState().setActiveTab(tab),
  setUserMode: (mode) => useUIStore.getState().setUserMode(mode),

  addToast: (message, type) => useUIStore.getState().addToast(message, type),
  removeToast: (id) => useUIStore.getState().removeToast(id),

  fetchAllData: async () => {
    useUIStore.getState().setIsLoading(true);
    try {
      const [profileRes, projRes, vulnRes, scanRes, logRes, reportHistRes, bountyRes] = await Promise.all([
        usersApi.getProfile().catch(() => null),
        projectsApi.getProjects().catch(() => ({ data: [] })),
        scanApi.getVulnerabilities().catch(() => []),
        scanApi.getActiveScans().catch(() => []),
        usersApi.getAuditLogs().catch(() => []),
        reportApi.getReportsHistory().catch(() => []),
        reportApi.getBountyData().catch(() => ({ data: { programs: [], leaderboard: [], submissions: [] } })),
      ]);

      const bbData = (bountyRes as any)?.data || bountyRes || {};

      const rawProfile = profileRes?.data || profileRes;
      const baseProfile = (rawProfile && (rawProfile.user || rawProfile.id)) ? rawProfile : {};
      
      const user = baseProfile.user || {
        id: baseProfile.id || 'tm-1',
        name: baseProfile.name || 'المشرف الأمني الرئيسي',
        email: baseProfile.email || 'ciso@company.sa',
        role: baseProfile.role || 'admin',
        joinedAt: new Date().toISOString()
      };

      const validProfile: any = {
        id: user.id || 'usr_001',
        name: user.name || 'المشرف الأمني الرئيسي',
        email: user.email || 'ciso@company.sa',
        companyName: baseProfile.company?.name || baseProfile.companyName || 'شركة أرامكو السعودية للأمن الرقمي',
        companyId: baseProfile.companyId || 'comp_saudi_001',
        role: String(user.role || baseProfile.role || 'admin').toLowerCase(),
        mode: baseProfile.mode || 'company',
        plan: baseProfile.subscription?.plan || baseProfile.plan || 'ENTERPRISE',
        permissions: Array.isArray(baseProfile.permissions) ? baseProfile.permissions : ['ALL_ACCESS', 'SCAN_EXECUTE', 'SELF_HEALING', 'BOUNTY_REVIEW'],
        user,
        company: baseProfile.company || {
          name: 'شركة أرامكو السعودية للأمن الرقمي',
          ownerEmail: user.email || 'ciso@company.sa',
          joinedAt: new Date().toISOString()
        },
        subscription: baseProfile.subscription || {
          plan: 'Enterprise',
          cost: 599,
          status: 'Active',
          currentPeriodEnd: '2026-12-31',
          limits: {
            maxProjects: 100,
            maxTargetsPerProject: 30,
            scansPerMonth: 500,
            scansRemainingThisMonth: 485,
            aiConsultationsPerMonth: 1000,
            aiConsultationsRemaining: 920
          }
        },
        teamMembers: Array.isArray(baseProfile.teamMembers) ? baseProfile.teamMembers : [
          {
            id: user.id || 'tm-1',
            name: user.name || 'المشرف الأمني الرئيسي',
            email: user.email || 'ciso@company.sa',
            role: user.role || 'Admin',
            joinedAt: new Date().toISOString()
          }
        ]
      };

      const extractArray = (res: any) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        return [];
      };

      useAuthStore.getState().setUserProfile(validProfile);
      useProjectStore.getState().setProjects(extractArray(projRes));
      useFindingStore.getState().setVulnerabilities(extractArray(vulnRes));
      useScanStore.getState().setActiveScans(extractArray(scanRes));
      useAuditStore.getState().setAuditLogs(extractArray(logRes));
      useReportStore.getState().setReportsHistory(extractArray(reportHistRes));
      useBugBountyStore.getState().setBountyData(bbData);

      // Trigger re-render for subscribers listening to root store
      set({ ...useSecurityStore.getState() });
    } catch (err: any) {
      console.error('Error fetching security data:', err);
    } finally {
      useUIStore.getState().setIsLoading(false);
      set({ ...useSecurityStore.getState() });
    }
  },

  login: async (email, password, mode) => {
    await useAuthStore.getState().login(email, password, mode);
    await get().fetchAllData();
  },

  register: async (payload) => {
    await useAuthStore.getState().register(payload);
    await get().fetchAllData();
  },

  logout: async () => {
    await useAuthStore.getState().logout();
    set({ ...useSecurityStore.getState() });
  },

  triggerScan: async (targetId, scannerType) => {
    await useScanStore.getState().triggerScan(targetId, scannerType);
    await get().fetchAllData();
  },

  performSelfHealing: async (vulnId) => {
    await useFindingStore.getState().performSelfHealing(vulnId);
    await get().fetchAllData();
  },

  createProject: async (name, description) => {
    await useProjectStore.getState().createProject(name, description);
    await get().fetchAllData();
  },

  addTargetToProject: async (projectId, name, url, type, bountyPlatform) => {
    await useProjectStore.getState().addTargetToProject(projectId, name, url, type, bountyPlatform);
    await get().fetchAllData();
  },

  generateReport: async (projectId, logo, prefix) => {
    await useReportStore.getState().generateReport(projectId, logo, prefix);
    await get().fetchAllData();
  },

  sendChatMessage: async (message) => {
    await useChatStore.getState().sendChatMessage(message);
    set({ ...useSecurityStore.getState() });
  },

  upgradeSubscription: async (planName) => {
    await useAuthStore.getState().upgradeSubscription(planName);
    await get().fetchAllData();
  },

  clearAuditLogs: async () => {
    await useAuditStore.getState().clearAuditLogs();
    await get().fetchAllData();
  },

  submitBountyReport: async (payload) => {
    await useBugBountyStore.getState().submitBountyReport(payload);
    await get().fetchAllData();
  },

  reviewBountyReport: async (submissionId, status, points, reward) => {
    await useBugBountyStore.getState().reviewBountyReport(submissionId, status, points, reward);
    await get().fetchAllData();
  },

  generateBountyDraft: async (payload) => {
    await useBugBountyStore.getState().generateBountyDraft(payload);
    set({ ...useSecurityStore.getState() });
  }
}));
