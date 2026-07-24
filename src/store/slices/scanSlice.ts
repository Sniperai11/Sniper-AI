import { Vulnerability, ActiveScan, AuditLog } from '../../types';

export interface ScanSlice {
  vulnerabilities: Vulnerability[];
  activeScans: ActiveScan[];
  auditLogs: AuditLog[];
  setVulnerabilities: (vulns: Vulnerability[]) => void;
  setActiveScans: (scans: ActiveScan[]) => void;
  setAuditLogs: (logs: AuditLog[]) => void;
}
