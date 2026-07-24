import { useBugBountyStore } from '../../../stores/bugBountyStore';
import { useUIStore } from '../../../stores/uiStore';

export const useBugBounty = () => {
  const bbPrograms = useBugBountyStore((state) => state.bbPrograms);
  const bbLeaderboard = useBugBountyStore((state) => state.bbLeaderboard);
  const bbSubmissions = useBugBountyStore((state) => state.bbSubmissions);
  const bountyReportDraft = useBugBountyStore((state) => state.bountyReportDraft);
  const bountyReportLoading = useBugBountyStore((state) => state.bountyReportLoading);
  const actionLoading = useUIStore((state) => state.actionLoading);

  const submitBountyReport = useBugBountyStore((state) => state.submitBountyReport);
  const reviewBountyReport = useBugBountyStore((state) => state.reviewBountyReport);
  const generateBountyDraft = useBugBountyStore((state) => state.generateBountyDraft);

  return {
    bbPrograms,
    bbLeaderboard,
    bbSubmissions,
    bountyReportDraft,
    bountyReportLoading,
    actionLoading,
    submitBountyReport,
    reviewBountyReport,
    generateBountyDraft,
  };
};
