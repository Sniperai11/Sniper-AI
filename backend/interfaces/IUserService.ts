import { IUser, ISubscription } from "../types/user";
import { IAuditLog } from "../types/database";

export interface IUserService {
  getProfile(): Promise<{ user: IUser; company: any; subscription: ISubscription; teamMembers: IUser[] }>;
  updateTeamRole(memberId: string, newRole: string): Promise<IUser[]>;
  addTeamMember(name: string, email: string, role: string): Promise<IUser[]>;
  deleteTeamMember(id: string): Promise<IUser[]>;
  getAuditLogs(): Promise<IAuditLog[]>;
  clearAuditLogs(): Promise<IAuditLog[]>;
  upgradeSubscription(newPlan: string): Promise<ISubscription>;
}
