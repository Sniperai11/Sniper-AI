export interface BugBountyProgram {
  id: string;
  title: string;
  companyName: string;
  scopeUrl: string;
  rewardRange: string;
  rewardPool: number;
  totalPaid: number;
  activeResearchers: number;
  status: 'active' | 'paused' | 'closed';
}

export interface BountyLeaderboardUser {
  rank: number;
  name: string;
  points: number;
  bountiesCount: number;
  earnedRewards: number;
  badge?: string;
}

export interface BountySubmission {
  id: string;
  programId: string;
  programTitle: string;
  researcherName: string;
  vulnerabilityTitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'PAID';
  rewardAmount?: number;
  pointsAwarded?: number;
  submittedAt: string;
  proofUrl?: string;
  reportMarkdown?: string;
}
