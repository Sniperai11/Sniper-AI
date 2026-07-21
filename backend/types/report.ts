import { IVulnerability } from "../models/Vulnerability";

export interface ISeverityBreakdown {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}

export interface ICompliancePercentage {
  owasp: number;
  iso27001: number;
  pciDss: number;
}

export interface IReportData {
  id: string;
  projectId: string;
  projectName: string;
  generatedAt: string;
  riskScore: number;
  totalVulnerabilities: number;
  severityBreakdown: ISeverityBreakdown;
  executiveSummary: string;
  compliancePercentage: ICompliancePercentage;
  vulnerabilities: IVulnerability[];
}
