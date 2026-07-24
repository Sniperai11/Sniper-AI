import { BugBountyProgram, BountyLeaderboardUser, BountySubmission } from '../../types';

export interface BountySlice {
  bbPrograms: BugBountyProgram[];
  bbLeaderboard: BountyLeaderboardUser[];
  bbSubmissions: BountySubmission[];
  bountyReportDraft: string | null;
  bountyReportLoading: boolean;
  setBbData: (data: { programs?: BugBountyProgram[]; leaderboard?: BountyLeaderboardUser[]; submissions?: BountySubmission[] }) => void;
  setBountyReportDraft: (draft: string | null) => void;
  setBountyReportLoading: (loading: boolean) => void;
}
