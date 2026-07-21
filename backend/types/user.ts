export interface IUser {
  id?: string;
  name?: string;
  email: string;
  role: "Admin" | "Security Analyst" | "Viewer";
  joinedAt?: string;
}

export interface ICompany {
  name: string;
  ownerEmail: string;
  joinedAt: string;
}

export interface ISubscriptionLimits {
  maxProjects: number;
  maxTargetsPerProject: number;
  scansPerMonth: number;
  scansRemainingThisMonth: number;
  aiConsultationsPerMonth: number;
  aiConsultationsRemaining: number;
}

export interface ISubscription {
  plan: string;
  status: string;
  currentPeriodEnd: string;
  limits: ISubscriptionLimits;
  cost: number;
}
