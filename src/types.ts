/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export * from './types/index';

export type LegacyUserRole = 'Admin' | 'Security Analyst' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: LegacyUserRole;
  joinedAt: string;
}

export type SecurityTargetType = 'Website' | 'API' | 'Mobile' | 'Source Code';

export type VerificationStatus = 'Pending' | 'Verified' | 'Failed';

export interface SecurityTarget {
  id: string;
  name: string;
  url: string;
  type: SecurityTargetType;
  verificationToken: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  lastScanAt?: string;
  currentRiskScore?: number; // 0 - 100
}

export interface SecurityProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  targets: SecurityTarget[];
}

export type LegacySeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface LegacyVulnerability {
  id: string;
  targetId: string;
  targetName: string;
  title: string;
  type: string;
  severity: LegacySeverityLevel;
  cvssScore: number;
  location: string;
  description: string;
  impact: string;
  remediation: string;
  isFalsePositive: boolean;
  complianceMapping: {
    owasp: string;
    iso27001: string;
    pciDss: string;
  };
}

export type ScanStatus = 'Idle' | 'Queued' | 'Scanning' | 'Analyzing' | 'Completed' | 'Failed';

export interface ScanJob {
  id: string;
  targetId: string;
  status: ScanStatus;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  scannerLogs: string[];
  vulnerabilitiesFoundCount: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export type SaaSPlan = 'Free' | 'Professional' | 'Enterprise';

export interface SaaSLimits {
  maxProjects: number;
  maxTargetsPerProject: number;
  scansPerMonth: number;
  scansRemainingThisMonth: number;
  aiConsultationsPerMonth: number;
  aiConsultationsRemaining: number;
}

export interface SaaSSubscription {
  plan: SaaSPlan;
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  limits: SaaSLimits;
  cost: number;
}
