import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IUser } from "../types/user";
import { IAuditLog } from "../types/database";
import { DateUtils } from "../utils/date";
import { eq, desc, and } from "drizzle-orm";

export class UserRepository {
  private static activeUserId: string = "tm-admin-1";
  private static activeCompanyId: string = "comp-1";

  public static setActiveUserId(userId: string) {
    UserRepository.activeUserId = userId;
  }

  public static getActiveUserId(): string {
    return UserRepository.activeUserId;
  }

  public static setActiveCompanyId(companyId: string) {
    UserRepository.activeCompanyId = companyId;
  }

  public static getActiveCompanyId(): string {
    return UserRepository.activeCompanyId;
  }

  public async getCurrentUser(): Promise<IUser> {
    const found = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, UserRepository.activeUserId)).limit(1);
    if (found.length > 0) {
      if (found[0].companyId) {
        UserRepository.setActiveCompanyId(found[0].companyId);
      }
      return {
        id: found[0].id,
        name: found[0].name,
        email: found[0].email,
        role: found[0].role as any,
        joinedAt: DateUtils.toOptionalIsoString(found[0].joinedAt),
      };
    }

    const foundInCompany = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.companyId, UserRepository.activeCompanyId)).limit(1);
    if (foundInCompany.length > 0) {
      return {
        id: foundInCompany[0].id,
        name: foundInCompany[0].name,
        email: foundInCompany[0].email,
        role: foundInCompany[0].role as any,
        joinedAt: DateUtils.toOptionalIsoString(foundInCompany[0].joinedAt),
      };
    }

    // Default admin user fallback
    return {
      id: UserRepository.activeUserId || "tm-admin-1",
      name: "المسؤول الرئيسي (System Admin)",
      email: "alridwanykick@gmail.com",
      role: "Admin",
      joinedAt: "2026-07-28T09:00:00Z"
    };
  }

  public async getCompany(): Promise<any> {
    const comp = await db.select().from(schema.companies).where(eq(schema.companies.id, UserRepository.activeCompanyId)).limit(1);
    if (comp.length > 0) {
      return {
        id: comp[0].id,
        name: comp[0].name,
        ownerEmail: comp[0].ownerEmail,
        joinedAt: DateUtils.toOptionalIsoString(comp[0].joinedAt) || null,
      };
    }
    return {
      id: UserRepository.activeCompanyId,
      name: "منصة Sniper AI Security",
      ownerEmail: "alridwanykick@gmail.com",
      joinedAt: "2026-07-28T09:00:00Z"
    };
  }

  public async updateCompany(name: string, ownerEmail: string): Promise<any> {
    const comp = await db.select().from(schema.companies).where(eq(schema.companies.id, UserRepository.activeCompanyId)).limit(1);
    if (comp.length > 0) {
      await db.update(schema.companies)
        .set({ name, ownerEmail })
        .where(eq(schema.companies.id, comp[0].id));
    } else {
      await db.insert(schema.companies).values({
        id: UserRepository.activeCompanyId,
        name,
        ownerEmail,
        joinedAt: new Date()
      }).onConflictDoNothing();
    }
    return this.getCompany();
  }

  public async getSubscription(): Promise<any> {
    const sub = await db.select().from(schema.subscription).where(eq(schema.subscription.companyId, UserRepository.activeCompanyId)).limit(1);
    if (sub.length > 0) {
      return {
        ...sub[0],
        currentPeriodEnd: DateUtils.toOptionalIsoString(sub[0].currentPeriodEnd) || null,
      };
    }
    return {
      plan: "Professional",
      status: "active",
      currentPeriodEnd: "2026-08-18T09:30:00Z",
      limits: {
        maxProjects: 10,
        maxTargetsPerProject: 5,
        scansPerMonth: 50,
        scansRemainingThisMonth: 34,
        aiConsultationsPerMonth: 200,
        aiConsultationsRemaining: 167
      },
      cost: 149
    };
  }

  public async getTeamMembers(): Promise<IUser[]> {
    const members = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.companyId, UserRepository.activeCompanyId));
    if (members.length === 0) {
      // Fallback: fetch all if isolated company has no extra members yet
      const all = await db.select().from(schema.teamMembers);
      return all.map(m => ({
        id: m.id,
        companyId: m.companyId || undefined,
        name: m.name,
        email: m.email,
        password: (m as any).password,
        role: m.role as any,
        joinedAt: DateUtils.toOptionalIsoString(m.joinedAt),
      }));
    }
    return members.map(m => ({
      id: m.id,
      companyId: m.companyId || undefined,
      name: m.name,
      email: m.email,
      password: (m as any).password,
      role: m.role as any,
      joinedAt: DateUtils.toOptionalIsoString(m.joinedAt),
    }));
  }

  public async updateTeamMemberRole(memberId: string, newRole: "Admin" | "Security Analyst" | "Viewer"): Promise<IUser[]> {
    await db.update(schema.teamMembers)
      .set({ role: newRole })
      .where(and(eq(schema.teamMembers.id, memberId), eq(schema.teamMembers.companyId, UserRepository.activeCompanyId)));
    return this.getTeamMembers();
  }

  public async addTeamMember(newMember: IUser, companyId?: string): Promise<IUser[]> {
    const targetCompanyId = companyId || UserRepository.activeCompanyId;
    await db.insert(schema.teamMembers).values({
      id: newMember.id || `tm-${Date.now()}`,
      companyId: targetCompanyId,
      name: newMember.name || "عضو جديد",
      email: newMember.email,
      password: newMember.password,
      role: newMember.role,
      joinedAt: newMember.joinedAt ? new Date(newMember.joinedAt) : new Date(),
    } as any).onConflictDoNothing();

    // Also persist user account in cloud users table
    await db.insert(schema.users).values({
      uid: newMember.id || `uid-${Date.now()}`,
      email: newMember.email,
      name: newMember.name,
      role: newMember.role,
      companyId: targetCompanyId,
      createdAt: new Date(),
    }).onConflictDoNothing();

    return this.getTeamMembers();
  }

  public async deleteTeamMember(id: string): Promise<IUser[]> {
    await db.delete(schema.teamMembers).where(and(eq(schema.teamMembers.id, id), eq(schema.teamMembers.companyId, UserRepository.activeCompanyId)));
    return this.getTeamMembers();
  }

  public async getAuditLogs(): Promise<IAuditLog[]> {
    const logs = await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.companyId, UserRepository.activeCompanyId)).orderBy(desc(schema.auditLogs.timestamp));
    if (logs.length === 0) {
      const all = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.timestamp));
      return all.map(l => ({
        id: l.id,
        userId: l.userId || "anonymous",
        userEmail: l.userEmail,
        action: l.action,
        details: l.details,
        ipAddress: l.ipAddress,
        timestamp: DateUtils.toIsoString(l.timestamp),
      }));
    }
    return logs.map(l => ({
      id: l.id,
      userId: l.userId || "anonymous",
      userEmail: l.userEmail,
      action: l.action,
      details: l.details,
      ipAddress: l.ipAddress,
      timestamp: DateUtils.toIsoString(l.timestamp),
    }));
  }

  public async addAuditLog(log: IAuditLog): Promise<void> {
    await db.insert(schema.auditLogs).values({
      id: log.id || `log-${Date.now()}`,
      companyId: UserRepository.activeCompanyId,
      userId: log.userId || null,
      userEmail: log.userEmail,
      action: log.action,
      details: log.details,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
    });
  }

  public async updateSubscriptionPlan(plan: string, limits: any, cost: number): Promise<any> {
    const existing = await db.select().from(schema.subscription).where(eq(schema.subscription.companyId, UserRepository.activeCompanyId)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.subscription)
        .set({ plan, limits, cost })
        .where(eq(schema.subscription.id, existing[0].id));
    } else {
      await db.insert(schema.subscription).values({
        companyId: UserRepository.activeCompanyId,
        plan,
        limits,
        cost,
        status: "active",
      });
    }
    return this.getSubscription();
  }
}
export const userRepository = new UserRepository();

