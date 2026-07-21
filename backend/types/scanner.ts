export type TargetType = "Website" | "API" | "Mobile" | "Source Code";
export type VerificationStatus = "Verified" | "Pending";

export interface IScanJob {
  id: string;
  targetId: string;
  targetName: string;
  status: "Scanning" | "Analyzing" | "Completed" | "Failed";
  progress: number;
  startedAt: string;
  completedAt?: string;
  scannerLogs: string[];
  vulnerabilitiesFoundCount: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export interface IBountyProgram {
  id: string;
  targetName: string;
  rewardRange: string;
  status: string;
  severityMultiplier: string;
  totalReports: number;
  scope: string;
  outOfScope: string;
}

export interface IBountyLeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  totalEarned: string;
  badges: string[];
}

export interface IBountySubmission {
  id: string;
  targetName: string;
  title: string;
  severity: string;
  status: string;
  rewardAmount: string;
  submittedBy: string;
  submittedAt: string;
  description: string;
  poc: string;
}
