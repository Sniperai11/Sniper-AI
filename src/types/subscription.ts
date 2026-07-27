export type SubscriptionPlanType = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface SubscriptionPlan {
  id: SubscriptionPlanType;
  name: string;
  priceMonthly: number;
  maxProjects: number;
  maxTargets: number;
  scansPerMonth: number;
  aiRemediationEnabled: boolean;
  dedicatedSla: boolean;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
}
