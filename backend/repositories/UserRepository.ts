import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IUser } from "../types/user";
import { IAuditLog } from "../types/database";
import { eq, desc } from "drizzle-orm";

export class UserRepository {
  private static activeUserId: string = "tm-1";

  public static setActiveUserId(userId: string) {
    UserRepository.activeUserId = userId;
  }

  public static getActiveUserId(): string {
    return UserRepository.activeUserId;
  }

  public async getCurrentUser(): Promise<IUser> {
    const found = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, UserRepository.activeUserId)).limit(1);
    if (found.length > 0) {
      return {
        id: found[0].id,
        name: found[0].name,
        email: found[0].email,
        role: found[0].role as any,
        joinedAt: found[0].joinedAt ? found[0].joinedAt.toISOString() : undefined,
      };
    }
    // Default admin user fallback
    return {
      id: "tm-1",
      name: "إبراهيم العتيبي",
      email: "elhammoh2795@gmail.com",
      role: "Admin",
      joinedAt: "2026-01-10T12:00:00Z"
    };
  }

  public async getCompany(): Promise<any> {
    const comp = await db.select().from(schema.companies).limit(1);
    if (comp.length > 0) {
      return {
        name: comp[0].name,
        ownerEmail: comp[0].ownerEmail,
        joinedAt: comp[0].joinedAt ? comp[0].joinedAt.toISOString() : null,
      };
    }
    return {
      name: "شركة التقنية للحلول الرقمية (DigitalTech Solutions)",
      ownerEmail: "owner@digitaltech.sa",
      joinedAt: "2026-01-10T12:00:00Z"
    };
  }

  public async getSubscription(): Promise<any> {
    const sub = await db.select().from(schema.subscription).limit(1);
    if (sub.length > 0) {
      return {
        ...sub[0],
        currentPeriodEnd: sub[0].currentPeriodEnd ? sub[0].currentPeriodEnd.toISOString() : null,
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
    const members = await db.select().from(schema.teamMembers);
    return members.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      role: m.role as any,
      joinedAt: m.joinedAt ? m.joinedAt.toISOString() : undefined,
    }));
  }

  public async updateTeamMemberRole(memberId: string, newRole: "Admin" | "Security Analyst" | "Viewer"): Promise<IUser[]> {
    await db.update(schema.teamMembers)
      .set({ role: newRole })
      .where(eq(schema.teamMembers.id, memberId));
    return this.getTeamMembers();
  }

  public async addTeamMember(newMember: IUser): Promise<IUser[]> {
    await db.insert(schema.teamMembers).values({
      id: newMember.id || `tm-${Date.now()}`,
      name: newMember.name || "عضو جديد",
      email: newMember.email,
      role: newMember.role,
      joinedAt: newMember.joinedAt ? new Date(newMember.joinedAt) : new Date(),
    }).onConflictDoNothing();
    return this.getTeamMembers();
  }

  public async deleteTeamMember(id: string): Promise<IUser[]> {
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
    return this.getTeamMembers();
  }

  public async getAuditLogs(): Promise<IAuditLog[]> {
    const logs = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.timestamp));
    return logs.map(l => ({
      id: l.id,
      userId: l.userId || "anonymous",
      userEmail: l.userEmail,
      action: l.action,
      details: l.details,
      ipAddress: l.ipAddress,
      timestamp: l.timestamp ? l.timestamp.toISOString() : new Date().toISOString(),
    }));
  }

  public async addAuditLog(log: IAuditLog): Promise<void> {
    await db.insert(schema.auditLogs).values({
      id: log.id || `log-${Date.now()}`,
      userId: log.userId || null,
      userEmail: log.userEmail,
      action: log.action,
      details: log.details,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
    });
  }

  public async updateSubscriptionPlan(plan: string, limits: any, cost: number): Promise<any> {
    const existing = await db.select().from(schema.subscription).limit(1);
    if (existing.length > 0) {
      await db.update(schema.subscription)
        .set({ plan, limits, cost })
        .where(eq(schema.subscription.id, existing[0].id));
    } else {
      await db.insert(schema.subscription).values({
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

