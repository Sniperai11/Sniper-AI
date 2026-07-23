import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { eq, desc } from "drizzle-orm";

export interface IAutoRemediationResult {
  id: string;
  projectId: string | null;
  vulnerabilityId: string | null;
  originalCodeSnippet: string;
  patchedCodeSnippet: string;
  validationStatus: string;
  validationLogs: string;
  pullRequestUrl: string | null;
  generatedAt: string;
}

export class RemediationRepository {
  public async getRemediations(): Promise<IAutoRemediationResult[]> {
    const items = await db.select().from(schema.remediations).orderBy(desc(schema.remediations.generatedAt));
    return items.map(r => ({
      id: r.id,
      projectId: r.projectId,
      vulnerabilityId: r.vulnerabilityId,
      originalCodeSnippet: r.originalCodeSnippet,
      patchedCodeSnippet: r.patchedCodeSnippet,
      validationStatus: r.validationStatus,
      validationLogs: r.validationLogs,
      pullRequestUrl: r.pullRequestUrl,
      generatedAt: r.generatedAt ? r.generatedAt.toISOString() : new Date().toISOString(),
    }));
  }

  public async getRemediationsByProject(projectId: string): Promise<IAutoRemediationResult[]> {
    const items = await db.select()
      .from(schema.remediations)
      .where(eq(schema.remediations.projectId, projectId))
      .orderBy(desc(schema.remediations.generatedAt));
    return items.map(r => ({
      id: r.id,
      projectId: r.projectId,
      vulnerabilityId: r.vulnerabilityId,
      originalCodeSnippet: r.originalCodeSnippet,
      patchedCodeSnippet: r.patchedCodeSnippet,
      validationStatus: r.validationStatus,
      validationLogs: r.validationLogs,
      pullRequestUrl: r.pullRequestUrl,
      generatedAt: r.generatedAt ? r.generatedAt.toISOString() : new Date().toISOString(),
    }));
  }

  public async getRemediationByVulnerability(vulnId: string): Promise<IAutoRemediationResult | null> {
    const items = await db.select()
      .from(schema.remediations)
      .where(eq(schema.remediations.vulnerabilityId, vulnId))
      .limit(1);
    if (items.length === 0) return null;
    const r = items[0];
    return {
      id: r.id,
      projectId: r.projectId,
      vulnerabilityId: r.vulnerabilityId,
      originalCodeSnippet: r.originalCodeSnippet,
      patchedCodeSnippet: r.patchedCodeSnippet,
      validationStatus: r.validationStatus,
      validationLogs: r.validationLogs,
      pullRequestUrl: r.pullRequestUrl,
      generatedAt: r.generatedAt ? r.generatedAt.toISOString() : new Date().toISOString(),
    };
  }

  public async addRemediation(rem: IAutoRemediationResult): Promise<IAutoRemediationResult> {
    await db.insert(schema.remediations).values({
      id: rem.id,
      projectId: rem.projectId,
      vulnerabilityId: rem.vulnerabilityId,
      originalCodeSnippet: rem.originalCodeSnippet,
      patchedCodeSnippet: rem.patchedCodeSnippet,
      validationStatus: rem.validationStatus,
      validationLogs: rem.validationLogs,
      pullRequestUrl: rem.pullRequestUrl,
      generatedAt: rem.generatedAt ? new Date(rem.generatedAt) : new Date(),
    }).onConflictDoNothing();
    return rem;
  }
}

export const remediationRepository = new RemediationRepository();
