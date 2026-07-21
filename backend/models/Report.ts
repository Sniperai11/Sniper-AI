import { IReportData, ISeverityBreakdown, ICompliancePercentage } from "../types/report";
import { IVulnerability } from "./Vulnerability";

export interface IReport extends IReportData {}

export class Report implements IReport {
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

  constructor(data: IReportData) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.projectName = data.projectName;
    this.generatedAt = data.generatedAt;
    this.riskScore = data.riskScore;
    this.totalVulnerabilities = data.totalVulnerabilities;
    this.severityBreakdown = data.severityBreakdown;
    this.executiveSummary = data.executiveSummary;
    this.compliancePercentage = data.compliancePercentage;
    this.vulnerabilities = data.vulnerabilities;
  }
}
