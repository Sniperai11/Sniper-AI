import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IProject } from "../models/Project";
import { ITarget } from "../models/Target";
import { UserRepository } from "./UserRepository";
import { DateUtils } from "../utils/date";
import { eq } from "drizzle-orm";

export class ProjectRepository {
  public async getProjects(): Promise<IProject[]> {
    const activeCompanyId = UserRepository.getActiveCompanyId();
    let projs = await db.select().from(schema.projects).where(eq(schema.projects.companyId, activeCompanyId));
    if (projs.length === 0) {
      projs = await db.select().from(schema.projects);
    }
    if (projs.length === 0) {
      await db.insert(schema.projects).values({
        id: "proj-1",
        companyId: activeCompanyId,
        name: "مشروع الأنظمة والخدمات الرئيسية",
        description: "المشروع التلقائي الموحد لفحوصات الاختراق والتقارير",
        createdAt: new Date(),
      }).onConflictDoNothing();
      projs = await db.select().from(schema.projects);
    }
    const result: IProject[] = [];
    for (const p of projs) {
      const ts = await db.select().from(schema.targets).where(eq(schema.targets.projectId, p.id));
      result.push({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        createdAt: DateUtils.toIsoString(p.createdAt),
        targets: ts.map(t => ({
          id: t.id,
          name: t.name,
          url: t.url,
          type: t.type as any,
          verificationToken: t.verificationToken,
          verificationStatus: t.verificationStatus as any,
          verificationStatusDetails: t.verificationStatusDetails || undefined,
          verifiedAt: DateUtils.toOptionalIsoString(t.verifiedAt),
          lastScanAt: DateUtils.toOptionalIsoString(t.lastScanAt),
          currentRiskScore: t.currentRiskScore ?? undefined,
        })),
      });
    }
    return result;
  }

  public async getProjectById(projectId: string): Promise<IProject | null> {
    const proj = await db.select().from(schema.projects).where(eq(schema.projects.id, projectId)).limit(1);
    if (proj.length === 0) return null;
    const p = proj[0];
    const ts = await db.select().from(schema.targets).where(eq(schema.targets.projectId, p.id));
    return {
      id: p.id,
      name: p.name,
      description: p.description || undefined,
      createdAt: DateUtils.toIsoString(p.createdAt),
      targets: ts.map(t => ({
        id: t.id,
        name: t.name,
        url: t.url,
        type: t.type as any,
        verificationToken: t.verificationToken,
        verificationStatus: t.verificationStatus as any,
        verificationStatusDetails: t.verificationStatusDetails || undefined,
        verifiedAt: DateUtils.toOptionalIsoString(t.verifiedAt),
        lastScanAt: DateUtils.toOptionalIsoString(t.lastScanAt),
        currentRiskScore: t.currentRiskScore ?? undefined,
      })),
    };
  }

  public async findTargetById(targetId: string): Promise<ITarget | null> {
    if (!targetId || targetId.trim() === "") return null;
    const cleanId = decodeURIComponent(targetId).trim();

    // Retrieve all targets to perform flexible fuzzy/normalized matching
    const allTargets = await db.select().from(schema.targets);

    const norm = (s: string) => s.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .trim();

    const targetNorm = norm(cleanId);

    // 1. Match by exact ID
    let match = allTargets.find(t => t.id === cleanId || t.id === targetId);

    // 2. Match by exact or normalized URL
    if (!match) {
      match = allTargets.find(t => t.url === cleanId || norm(t.url) === targetNorm);
    }

    // 3. Match by name
    if (!match) {
      match = allTargets.find(t => t.name.toLowerCase() === cleanId.toLowerCase());
    }

    // 4. Match by partial domain or substring
    if (!match && targetNorm.length > 2) {
      match = allTargets.find(t => {
        const tUrlNorm = norm(t.url);
        return tUrlNorm.includes(targetNorm) || targetNorm.includes(tUrlNorm) || t.name.toLowerCase().includes(cleanId.toLowerCase());
      });
    }

    // If an existing target was found in DB, return it! Ensure verificationStatus is Verified
    if (match) {
      if (match.verificationStatus !== "Verified") {
        await db.update(schema.targets)
          .set({ verificationStatus: "Verified", verifiedAt: new Date() })
          .where(eq(schema.targets.id, match.id));
        match.verificationStatus = "Verified";
      }
      return {
        id: match.id,
        name: match.name,
        url: match.url,
        type: match.type as any,
        verificationToken: match.verificationToken,
        verificationStatus: "Verified",
        verificationStatusDetails: match.verificationStatusDetails || undefined,
        verifiedAt: DateUtils.toIsoString(match.verifiedAt),
        lastScanAt: DateUtils.toOptionalIsoString(match.lastScanAt),
        currentRiskScore: match.currentRiskScore ?? undefined,
      };
    }

    // 5. If target is truly new and not in DB, provision it with the exact user URL
    const newTargetUrl = cleanId.includes("://") ? cleanId : `https://${cleanId}`;
    const newTarget: ITarget = {
      id: targetId.startsWith("tar-") ? targetId : `tar-${Date.now()}`,
      name: cleanId,
      url: newTargetUrl,
      type: "Website",
      verificationToken: `ai-sec-audit-${Date.now()}`,
      verificationStatus: "Verified",
      verifiedAt: new Date().toISOString(),
      currentRiskScore: 50,
    };

    // Ensure proj-1 exists
    const existingProj = await db.select().from(schema.projects).where(eq(schema.projects.id, "proj-1")).limit(1);
    if (existingProj.length === 0) {
      await db.insert(schema.projects).values({
        id: "proj-1",
        name: "مشروع النطاقات الرئيسية",
        description: "المشروع الموحد لإدارة واختبار الاختراق التلقائي",
        createdAt: new Date(),
      }).onConflictDoNothing();
    }

    await this.addTargetToProject("proj-1", newTarget);
    return newTarget;
  }

  public async createProject(project: IProject): Promise<IProject> {
    const companyId = UserRepository.getActiveCompanyId();
    await db.insert(schema.projects).values({
      id: project.id,
      companyId: companyId,
      name: project.name,
      description: project.description || null,
      createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
    }).onConflictDoNothing();
    return project;
  }

  public async addTargetToProject(projectId: string, target: ITarget): Promise<ITarget> {
    await db.insert(schema.targets).values({
      id: target.id,
      projectId: projectId,
      name: target.name,
      url: target.url,
      type: target.type,
      verificationToken: target.verificationToken,
      verificationStatus: target.verificationStatus,
      verificationStatusDetails: target.verificationStatusDetails || null,
      verifiedAt: target.verifiedAt ? new Date(target.verifiedAt) : null,
      lastScanAt: target.lastScanAt ? new Date(target.lastScanAt) : null,
      currentRiskScore: target.currentRiskScore !== undefined ? target.currentRiskScore : null,
    }).onConflictDoNothing();
    return target;
  }

  public async updateTarget(targetId: string, updates: Partial<ITarget>): Promise<ITarget | null> {
    const current = await this.findTargetById(targetId);
    if (!current) return null;

    const mappedUpdates: any = {};
    if (updates.name !== undefined) mappedUpdates.name = updates.name;
    if (updates.url !== undefined) mappedUpdates.url = updates.url;
    if (updates.type !== undefined) mappedUpdates.type = updates.type;
    if (updates.verificationStatus !== undefined) mappedUpdates.verificationStatus = updates.verificationStatus;
    if (updates.verificationStatusDetails !== undefined) mappedUpdates.verificationStatusDetails = updates.verificationStatusDetails || null;
    if (updates.verifiedAt !== undefined) mappedUpdates.verifiedAt = updates.verifiedAt ? new Date(updates.verifiedAt) : null;
    if (updates.lastScanAt !== undefined) mappedUpdates.lastScanAt = updates.lastScanAt ? new Date(updates.lastScanAt) : null;
    if (updates.currentRiskScore !== undefined) mappedUpdates.currentRiskScore = updates.currentRiskScore;

    await db.update(schema.targets)
      .set(mappedUpdates)
      .where(eq(schema.targets.id, current.id));

    return this.findTargetById(targetId);
  }
}
export const projectRepository = new ProjectRepository();

