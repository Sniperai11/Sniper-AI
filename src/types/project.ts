export type TargetType = 'domain' | 'ip' | 'api' | 'cidr' | 'mobile_app';

export interface Target {
  id: string;
  projectId: string;
  name: string;
  url: string;
  type: TargetType;
  verified: boolean;
  verificationMethod?: 'dns_txt' | 'meta_tag' | 'file_upload' | 'bounty_proof';
  verificationToken?: string;
  verificationProofUrl?: string;
  bountyPlatform?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  companyId: string;
  createdAt: string;
  targets: Target[];
}

export interface ActiveScan {
  id: string;
  targetId: string;
  targetName: string;
  targetUrl: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  currentPhase: string;
  scannerType: string;
  startedAt: string;
  logs: string[];
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}
