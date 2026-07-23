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
import { reportApi, chatApi } from '../services/api/reportApi';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SecurityState {
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
  
  // Specific Domain Actions
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
  userProfile: null,
  userMode: 'company',
  activeTab: 'dashboard',

  projects: [],
  vulnerabilities: [],
  activeScans: [],
  auditLogs: [],
  reportsHistory: [],
  activeReport: null,

  bbPrograms: [],
  bbLeaderboard: [],
  bbSubmissions: [],
  bountyReportDraft: null,
  bountyReportLoading: false,

  chatMessages: [
    {
      sender: 'assistant',
      text: 'مرحباً بك في مستشار الأمن السيبراني الذكي لمنصة Sniper AI Security. كيف يمكنني مساعدتك في تدقيق الأكواد أو تقييم الثغرات الآن؟',
      timestamp: new Date().toISOString()
    }
  ],
  isChatSending: false,

  twoFactorEnabled: true,
  twoFactorType: 'app',
  twoFactorPhone: '+966501234567',

  isLoading: false,
  actionLoading: null,
  toasts: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setUserMode: (mode) => set({ userMode: mode }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  fetchAllData: async () => {
    set({ isLoading: true });
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
        permissions: baseProfile.permissions || ['ALL_ACCESS', 'SCAN_EXECUTE', 'SELF_HEALING', 'BOUNTY_REVIEW'],
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
        teamMembers: baseProfile.teamMembers || [
          {
            id: user.id || 'tm-1',
            name: user.name || 'المشرف الأمني الرئيسي',
            email: user.email || 'ciso@company.sa',
            role: user.role || 'Admin',
            joinedAt: new Date().toISOString()
          }
        ]
      };

      set({
        userProfile: validProfile,
        projects: Array.isArray((projRes as any)?.data) ? (projRes as any).data : (Array.isArray(projRes) ? projRes : []),
        vulnerabilities: Array.isArray((vulnRes as any)?.data) ? (vulnRes as any).data : (Array.isArray(vulnRes) ? vulnRes : []),
        activeScans: Array.isArray((scanRes as any)?.data) ? (scanRes as any).data : (Array.isArray(scanRes) ? scanRes : []),
        auditLogs: Array.isArray((logRes as any)?.data) ? (logRes as any).data : (Array.isArray(logRes) ? logRes : []),
        reportsHistory: Array.isArray((reportHistRes as any)?.data) ? (reportHistRes as any).data : (Array.isArray(reportHistRes) ? reportHistRes : []),
        bbPrograms: bbData.programs || [],
        bbLeaderboard: bbData.leaderboard || [],
        bbSubmissions: bbData.submissions || [],
        isLoading: false
      });
    } catch (err: any) {
      console.error('Error fetching security data:', err);
      set({ isLoading: false });
    }
  },

  login: async (email, password, mode) => {
    set({ actionLoading: 'auth_login' });
    try {
      const res = await usersApi.login(email, password, mode);
      get().addToast('تم تسجيل الدخول وتوثيق الجلسة بنجاح!', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشلت عملية تسجيل الدخول', 'error');
      throw err;
    } finally {
      set({ actionLoading: null });
    }
  },

  register: async ({ name, email, companyName, password, mode, role }) => {
    set({ actionLoading: 'auth_register' });
    try {
      const res = await usersApi.register(name, email, companyName, password, mode, role);
      get().addToast('تم إنشاء الحساب وتوثيق الجلسة بنجاح!', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل إنشاء الحساب الجديد', 'error');
      throw err;
    } finally {
      set({ actionLoading: null });
    }
  },

  logout: async () => {
    set({ actionLoading: 'auth_logout' });
    try {
      await usersApi.logout();
      set({ userProfile: null });
      get().addToast('تم تسجيل الخروج بنجاح.', 'info');
    } catch (err: any) {
      set({ userProfile: null });
      get().addToast('تم إنهاء الجلسة.', 'info');
    } finally {
      set({ actionLoading: null });
    }
  },

  triggerScan: async (targetId, scannerType) => {
    set({ actionLoading: `scan-${targetId}` });
    try {
      await scanApi.startTargetScan(targetId, { scanType: scannerType || 'FULL' });
      get().addToast('تم إطلاق فحص الأمان المتطور وحصل الاتصال بمحركات المسح المباشرة.', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل إطلاق الفحص الأمني', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  performSelfHealing: async (vulnId) => {
    set({ actionLoading: `healing-${vulnId}` });
    try {
      await scanApi.performRemediation(vulnId);
      get().addToast('تم تطبيق الشفاء الذاتي والأمان التلقائي وتصحيح الكود المصدر بنجاح!', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشلت عملية الترميم التلقائي', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  createProject: async (name, description) => {
    set({ actionLoading: 'createProject' });
    try {
      const created = await projectsApi.createProject(name, description);
      get().addToast(`تم إنشاء المشروع "${created.name}" بنجاح.`, 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل إنشاء المشروع', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  addTargetToProject: async (projectId, name, url, type, bountyPlatform) => {
    set({ actionLoading: 'addTarget' });
    try {
      const added = await projectsApi.addTargetToProject(projectId, name, url, type, bountyPlatform);
      get().addToast(`تم إضافة الهدف "${added.name}" وهو الآن في انتظار تأكيد الملكية.`, 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل إضافة الهدف', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  generateReport: async (projectId, logo, prefix) => {
    set({ actionLoading: 'generating_report' });
    try {
      const report = await reportApi.createReport(projectId, logo, prefix);
      set({ activeReport: report });
      get().addToast('تم توليد التقرير الأمني المعتمد للشركة بنجاح!', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل توليد التقرير الأمني', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  sendChatMessage: async (message) => {
    const currentMessages = get().chatMessages;
    set({
      isChatSending: true,
      chatMessages: [
        ...currentMessages,
        { sender: 'user', text: message, timestamp: new Date().toISOString() }
      ]
    });

    try {
      const answer = await chatApi.sendMessageToAdvisor(message, currentMessages);
      const reply = answer.data?.reply || answer.message || 'تم استلام الاستفسار وسيتم التدقيق السيبراني.';
      set((state) => ({
        chatMessages: [
          ...state.chatMessages,
          { sender: 'assistant', text: reply, timestamp: new Date().toISOString() }
        ]
      }));
    } catch (err: any) {
      get().addToast(err.message || 'فشل الاتصال بالمستشار السيبراني', 'error');
    } finally {
      set({ isChatSending: false });
    }
  },

  upgradeSubscription: async (planName) => {
    set({ actionLoading: 'upgradeSubscription' });
    try {
      await usersApi.upgradeSubscription(planName);
      get().addToast(`تم ترقية الاشتراك بنجاح إلى باقة ${planName}!`, 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشلت عملية ترقية الاشتراك', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  clearAuditLogs: async () => {
    try {
      await usersApi.clearAuditLogs();
      get().addToast('تم تصفير سجلات التدقيق بنجاح.', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل تصفير السجلات', 'error');
    }
  },

  submitBountyReport: async (payload) => {
    set({ actionLoading: 'submitBounty' });
    try {
      await reportApi.submitBountyReport(payload);
      get().addToast('تم إرسال بلاغ الثغرة الفني بنجاح صوناً للخصوصية والأمن المالي للشركاء.', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشل إرسال البلاغ', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  reviewBountyReport: async (submissionId, status, points = 0, reward = 0) => {
    set({ actionLoading: `review-${submissionId}` });
    try {
      await reportApi.reviewBountyReport(submissionId, status, points, reward);
      get().addToast('تم تحديث ومراجعة البلاغ الأمني وحساب المكافآت بنجاح.', 'success');
      await get().fetchAllData();
    } catch (err: any) {
      get().addToast(err.message || 'فشلت مراجعة البلاغ', 'error');
    } finally {
      set({ actionLoading: null });
    }
  },

  generateBountyDraft: async (payload) => {
    set({ bountyReportLoading: true });
    try {
      const res = await reportApi.aiGenerateBountyDraft(payload);
      set({ bountyReportDraft: res.success ? res.data?.report : null });
      get().addToast('تمت صياغة تقرير الثغرة الاحترافي بالذكاء الاصطناعي بنجاح!', 'success');
    } catch (err: any) {
      get().addToast(err.message || 'فشلت صياغة التقرير بالذكاء الاصطناعي', 'error');
    } finally {
      set({ bountyReportLoading: false });
    }
  }
}));
