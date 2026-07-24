export type VulnerabilityState = 'Discovered' | 'Verified' | 'Triaged' | 'Assigned' | 'In Progress' | 'Mitigated' | 'Resolved' | 'Accepted Risk' | 'False Positive' | 'Closed';

export interface VulnerabilityWorkflow {
  id: string;
  title: string;
  state: VulnerabilityState;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvss: number;
  epss?: number;
  cwe?: string;
  cve?: string;
  affectedAssets: string[];
  owner?: string;
  description: string;
  aiAnalysis: {
    summary: string;
    recommendation: string;
    rootCause: string;
    remediation: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type IncidentState = 'New' | 'Investigating' | 'Contained' | 'Eradicated' | 'Recovering' | 'Resolved' | 'Closed';

export interface IncidentWorkflow {
  id: string;
  title: string;
  state: IncidentState;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  owner?: string;
  linkedAssets: string[];
  linkedVulnerabilities: string[];
  mitreAttack: string[];
  playbook: string;
  aiAnalysis: {
    executiveSummary: string;
    nextAction: string;
    riskPrediction: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type AssetCategory = 'Infrastructure' | 'Security' | 'Data Storage' | 'Application' | 'Network' | 'Cloud';

export interface AssetWorkflow {
  id: string;
  name: string;
  type: string;
  category: AssetCategory;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  tags: string[];
  owner: string;
  lastSeen: string;
  ipAddress?: string;
  environment?: string;
}

export type CaseStatus = 'Open' | 'In Progress' | 'Planning' | 'Under Review' | 'Closed';

export interface CaseWorkflow {
  id: string;
  title: string;
  status: CaseStatus;
  leadAnalyst: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Overdue' | 'Blocked';

export interface TaskWorkflow {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  linkedEntity?: string;
  dueDate: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
}
