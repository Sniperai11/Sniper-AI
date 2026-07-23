import { Vulnerability } from './finding';

export interface SecurityReport {
  id: string;
  projectId: string;
  projectName: string;
  companyName: string;
  logoUrl?: string;
  generatedAt: string;
  execSummary: string;
  riskScore: number;
  totalVulnerabilities: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  vulnerabilities: Vulnerability[];
  reportPrefix?: string;
  sha256Signature?: string;
}

export interface ReportHistoryItem {
  id: string;
  title: string;
  date: string;
  riskScore: number;
  vulnerabilitiesCount: number;
  pdfUrl?: string;
}
