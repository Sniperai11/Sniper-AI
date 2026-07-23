export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type FindingStatus = 'OPEN' | 'IN_PROGRESS' | 'REMEDIATED' | 'FALSE_POSITIVE' | 'VERIFYING';

export interface RemediationPatch {
  id: string;
  findingId: string;
  originalCode: string;
  patchedCode: string;
  diffSummary: string;
  cveId?: string;
  explanation: string;
  status: 'draft' | 'applied' | 'verified';
  generatedAt: string;
}

export interface Vulnerability {
  id: string;
  projectId: string;
  projectName: string;
  targetId: string;
  targetName: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: FindingStatus;
  cvssScore: number;
  cweId?: string;
  cveId?: string;
  affectedEndpoint: string;
  discoveredAt: string;
  remediatedAt?: string;
  proofOfConcept?: string;
  remediationSteps?: string[];
  remediationPatch?: RemediationPatch;
  falsePositiveReason?: string;
}
