import { IChatMessage, IAIVulnerabilityTemplate } from "../types/ai";

export interface IAIEngine {
  generateAIVulnerabilities(target: any, isHttp: boolean, fetchSuccess: boolean, statusInfo: string, headersDump: any): Promise<IAIVulnerabilityTemplate[]>;
  analyzeVulnerability(vuln: any): Promise<string>;
  chatWithAdvisor(messages: IChatMessage[]): Promise<string>;
  generateExecutiveSummary(projectName: string, totalVulns: number, calculatedRisk: number, severityBreakdown: any): Promise<string>;
  generateBugBountyReport(title: string, vulnType: string, severity: string, pocSteps: string, impact: string): Promise<string>;
}
