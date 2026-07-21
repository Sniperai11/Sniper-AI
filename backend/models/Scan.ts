import { IScanJob } from "../types/scanner";

export class Scan implements IScanJob {
  id: string;
  targetId: string;
  targetName: string;
  status: "Scanning" | "Analyzing" | "Completed" | "Failed";
  progress: number;
  startedAt: string;
  completedAt?: string;
  scannerLogs: string[];
  vulnerabilitiesFoundCount: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };

  constructor(data: IScanJob) {
    this.id = data.id;
    this.targetId = data.targetId;
    this.targetName = data.targetName;
    this.status = data.status;
    this.progress = data.progress;
    this.startedAt = data.startedAt;
    this.completedAt = data.completedAt;
    this.scannerLogs = data.scannerLogs;
    this.vulnerabilitiesFoundCount = data.vulnerabilitiesFoundCount;
  }
}
