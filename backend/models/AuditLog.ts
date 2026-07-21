import { IAuditLog } from "../types/database";

export class AuditLog implements IAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;

  constructor(data: IAuditLog) {
    this.id = data.id;
    this.userId = data.userId;
    this.userEmail = data.userEmail;
    this.action = data.action;
    this.details = data.details;
    this.ipAddress = data.ipAddress;
    this.timestamp = data.timestamp;
  }
}
