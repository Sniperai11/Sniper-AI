export interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline' | 'Warning' | 'Critical' | 'Verified' | 'Pending';
  riskScore: number;
  ip: string;
  url?: string;
  verificationToken?: string;
  verificationStatus?: 'Verified' | 'Pending';
  verifiedAt?: string;
  lastScanned?: string;
  owner?: string;
  tags: string[];
}

export interface Vulnerability {
  id: string;
  title: string;
  type?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cvss: number;
  cvssScore?: number;
  assetId?: string;
  targetId?: string;
  targetName?: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Discovered' | 'Verified' | 'Triaged' | 'Assigned' | 'Mitigated' | 'Accepted Risk' | 'False Positive' | 'Closed';
  location?: string;
  discoveredAt?: string;
  description?: string;
  impact?: string;
  remediation?: string;
  isFalsePositive?: boolean;
  complianceMapping?: {
    owasp: string;
    iso27001: string;
    pciDss: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'New' | 'Contained' | 'Eradicated' | 'Recovering' | 'Closed';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  assignee: string;
  time: string;
  alerts: number;
  owner?: string;
  linkedAssets?: string[];
  linkedVulnerabilities?: string[];
  mitreAttack?: string[];
  playbook?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Idle' | 'Error';
  tasksCompleted: number;
  lastActive: string;
  description?: string;
}

export interface Report {
  id: string;
  name?: string;
  projectId?: string;
  projectName?: string;
  type?: string;
  date?: string;
  generatedAt?: string;
  size?: string;
  downloadUrl?: string;
  riskScore?: number;
  totalVulnerabilities?: number;
  severityBreakdown?: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  executiveSummary?: string;
  compliancePercentage?: {
    owasp: number;
    iso27001: number;
    pciDss: number;
  };
  vulnerabilities?: Vulnerability[];
}

export interface ThreatIntelligence {
  id: string;
  type: string;
  indicator: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  detected: string;
  tags: string[];
}

export interface ComplianceFramework {
  name: string;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  score: number;
  controls: {
    passed: number;
    failed: number;
  };
  lastAudit: string;
}

export interface SystemStats {
  activeAssets: number;
  totalVulnerabilities: number;
  openIncidents: number;
  activeAgents: number;
  riskScore: number;
}

export interface RiskTrendEntry {
  name: string;
  critical: number;
  high: number;
  medium: number;
}

export interface AssetDistributionEntry {
  name: string;
  value: number;
  color: string;
}

export interface AlertEntry {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  asset: string;
  type: string;
  time: string;
  status: 'Open' | 'Investigating' | 'Remediated';
  risk: number;
}

