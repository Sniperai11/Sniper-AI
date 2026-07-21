import { IUser, ICompany, ISubscription } from "./user";
import { IProject } from "../models/Project";
import { ITarget } from "../models/Target";
import { IVulnerability } from "../models/Vulnerability";
import { IReport } from "../models/Report";
import { IScanJob } from "./scanner";
import { IBountyProgram, IBountyLeaderboardEntry, IBountySubmission } from "./scanner";

export interface IAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface IDatabase {
  company: ICompany;
  currentUser: IUser;
  teamMembers: IUser[];
  subscription: ISubscription;
  auditLogs: IAuditLog[];
  projects: IProject[];
  vulnerabilities: IVulnerability[];
  reportsHistory: IReport[];
  bugBountyPrograms: IBountyProgram[];
  bugBountyLeaderboard: IBountyLeaderboardEntry[];
  bugBountySubmissions: IBountySubmission[];
  activeScans: IScanJob[];
  saveDatabase(): void;
  loadDatabase(): void;
}
