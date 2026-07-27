// User & Authentication Types
export type UserRole = 'admin' | 'pentester' | 'developer' | 'auditor' | 'viewer';
export type UserMode = 'pentester' | 'company';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt?: string;
}

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
  company?: {
    name?: string;
    ownerEmail?: string;
    joinedAt?: string;
  };
  subscription?: any;
  teamMembers?: TeamMember[];
}
