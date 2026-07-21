import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IProject } from "../models/Project";
import { ITarget } from "../models/Target";
import { eq } from "drizzle-orm";

export class ProjectRepository {
  public async getProjects(): Promise<IProject[]> {
    const projs = await db.select().from(schema.projects);
    const result: IProject[] = [];
    for (const p of projs) {
      const ts = await db.select().from(schema.targets).where(eq(schema.targets.projectId, p.id));
      result.push({
        id: p.id,
        name: p.name,
        description: p.description || undefined,
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        targets: ts.map(t => ({
          id: t.id,
          name: t.name,
          url: t.url,
          type: t.type as any,
          verificationToken: t.verificationToken,
          verificationStatus: t.verificationStatus as any,
          verificationStatusDetails: t.verificationStatusDetails || undefined,
          verifiedAt: t.verifiedAt ? t.verifiedAt.toISOString() : undefined,
          lastScanAt: t.lastScanAt ? t.lastScanAt.toISOString() : undefined,
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
      createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
      targets: ts.map(t => ({
        id: t.id,
        name: t.name,
        url: t.url,
        type: t.type as any,
        verificationToken: t.verificationToken,
        verificationStatus: t.verificationStatus as any,
        verificationStatusDetails: t.verificationStatusDetails || undefined,
        verifiedAt: t.verifiedAt ? t.verifiedAt.toISOString() : undefined,
        lastScanAt: t.lastScanAt ? t.lastScanAt.toISOString() : undefined,
        currentRiskScore: t.currentRiskScore ?? undefined,
      })),
    };
  }

  public async findTargetById(targetId: string): Promise<ITarget | null> {
    const t = await db.select().from(schema.targets).where(eq(schema.targets.id, targetId)).limit(1);
    if (t.length === 0) return null;
    const target = t[0];
    return {
      id: target.id,
      name: target.name,
      url: target.url,
      type: target.type as any,
      verificationToken: target.verificationToken,
      verificationStatus: target.verificationStatus as any,
      verificationStatusDetails: target.verificationStatusDetails || undefined,
      verifiedAt: target.verifiedAt ? target.verifiedAt.toISOString() : undefined,
      lastScanAt: target.lastScanAt ? target.lastScanAt.toISOString() : undefined,
      currentRiskScore: target.currentRiskScore ?? undefined,
    };
  }

  public async createProject(project: IProject): Promise<IProject> {
    await db.insert(schema.projects).values({
      id: project.id,
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
      .where(eq(schema.targets.id, targetId));

    return this.findTargetById(targetId);
  }
}
export const projectRepository = new ProjectRepository();

