// User & Authentication Types
export type UserRole = 'admin' | 'pentester' | 'developer' | 'auditor' | 'viewer';
export type UserMode = 'pentester' | 'company';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  companyId: string;
  role: UserRole;
  mode: UserMode;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  avatarUrl?: string;
  permissions: string[];
  user?: {
    id?: string;
    name?: string;
    email?: string;
    role?: any;
    joinedAt?: string;
  };
  company?: any;
  subscription?: any;
  teamMembers?: any[];
}
