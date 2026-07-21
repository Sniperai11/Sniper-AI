export interface IChatMessage {
  role: "user" | "assistant" | "model";
  text: string;
}

export interface IAIVulnerabilityTemplate {
  title: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvssScore: number;
  location: string;
  description: string;
  impact: string;
  remediation: string;
  complianceMapping: {
    owasp: string;
    iso27001: string;
    pciDss: string;
  };
}
