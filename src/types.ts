/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Security Analyst' | 'Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export type TargetType = 'Website' | 'API' | 'Mobile' | 'Source Code';

export type VerificationStatus = 'Pending' | 'Verified' | 'Failed';

export interface SecurityTarget {
  id: string;
  name: string;
  url: string;
  type: TargetType;
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

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Vulnerability {
  id: string;
  targetId: string;
  targetName: string;
  title: string;
  type: string; // e.g., "SQL Injection", "XSS", "Insecure Direct Object Reference"
  severity: SeverityLevel;
  cvssScore: number; // 0.0 - 10.0
  location: string; // e.g., "GET /api/users", "src/auth.ts:24"
  description: string;
  impact: string;
  remediation: string;
  isFalsePositive: boolean;
  complianceMapping: {
    owasp: string; // e.g., "A01:2021-Broken Access Control"
    iso27001: string; // e.g., "A.12.6.1 Management of technical vulnerabilities"
    pciDss: string; // e.g., "Requirement 6.5"
  };
}

export type ScanStatus = 'Idle' | 'Queued' | 'Scanning' | 'Analyzing' | 'Completed' | 'Failed';

export interface ScanJob {
  id: string;
  targetId: string;
  status: ScanStatus;
  progress: number; // 0 to 100
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

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
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

export interface SecurityReport {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  riskScore: number;
  totalVulnerabilities: number;
  severityBreakdown: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  executiveSummary: string;
  compliancePercentage: {
    owasp: number;
    iso27001: number;
    pciDss: number;
  };
}
