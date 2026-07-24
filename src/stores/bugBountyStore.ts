import { create } from 'zustand';
import { BugBountyProgram, BountyLeaderboardUser, BountySubmission } from '../types';
import { reportApi } from '../services/api/reportApi';
import { useUIStore } from './uiStore';

export interface BugBountyState {
  bbPrograms: BugBountyProgram[];
  bbLeaderboard: BountyLeaderboardUser[];
  bbSubmissions: BountySubmission[];
  bountyReportDraft: string | null;
  bountyReportLoading: boolean;

  setBountyData: (data: { programs?: BugBountyProgram[]; leaderboard?: BountyLeaderboardUser[]; submissions?: BountySubmission[] }) => void;
  submitBountyReport: (payload: any) => Promise<void>;
  reviewBountyReport: (submissionId: string, status: string, points?: number, reward?: number) => Promise<void>;
  generateBountyDraft: (payload: any) => Promise<void>;
}

export const useBugBountyStore = create<BugBountyState>((set, get) => ({
  bbPrograms: [],
  bbLeaderboard: [],
  bbSubmissions: [],
  bountyReportDraft: null,
  bountyReportLoading: false,

  setBountyData: (data) => set({
    bbPrograms: Array.isArray(data.programs) ? data.programs : [],
    bbLeaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : [],
    bbSubmissions: Array.isArray(data.submissions) ? data.submissions : []
  }),

  submitBountyReport: async (payload) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading('submitBounty');
    try {
      await reportApi.submitBountyReport(payload);
      addToast('تم إرسال بلاغ الثغرة الفني بنجاح صوناً للخصوصية والأمن المالي للشركاء.', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشل إرسال البلاغ', 'error');
    } finally {
      setActionLoading(null);
    }
  },

  reviewBountyReport: async (submissionId, status, points = 0, reward = 0) => {
    const { setActionLoading, addToast } = useUIStore.getState();
    setActionLoading(`review-${submissionId}`);
    try {
      await reportApi.reviewBountyReport(submissionId, status, points, reward);
      addToast('تم تحديث ومراجعة البلاغ الأمني وحساب المكافآت بنجاح.', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشلت مراجعة البلاغ', 'error');
    } finally {
      setActionLoading(null);
    }
  },

  generateBountyDraft: async (payload) => {
    const { addToast } = useUIStore.getState();
    set({ bountyReportLoading: true });
    try {
      const res = await reportApi.aiGenerateBountyDraft(payload);
      set({ bountyReportDraft: res.success ? res.data?.report : null });
      addToast('تمت صياغة تقرير الثغرة الاحترافي بالذكاء الاصطناعي بنجاح!', 'success');
    } catch (err: any) {
      addToast(err.message || 'فشلت صياغة التقرير بالذكاء الاصطناعي', 'error');
    } finally {
      set({ bountyReportLoading: false });
    }
  }
}));
