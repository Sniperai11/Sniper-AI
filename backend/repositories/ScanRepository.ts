import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IScanJob } from "../types/scanner";
import { IVulnerability } from "../models/Vulnerability";
import { IBountySubmission } from "../types/scanner";
import { eq, desc } from "drizzle-orm";

function makeScanJobProxy(job: IScanJob): IScanJob {
  const save = async (targetJob: IScanJob) => {
    try {
      await db.update(schema.activeScans)
        .set({
          status: targetJob.status,
          progress: targetJob.progress,
          completedAt: targetJob.completedAt ? new Date(targetJob.completedAt) : null,
          scannerLogs: targetJob.scannerLogs,
          vulnerabilitiesFoundCount: targetJob.vulnerabilitiesFoundCount,
        })
        .where(eq(schema.activeScans.id, targetJob.id));
    } catch (err) {
      console.error("Error persisting scan job update:", err);
    }
  };

  // Proxy the logs array to capture push and other operations
  const logsProxy = new Proxy(job.scannerLogs, {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (typeof val === "function" && ["push", "pop", "shift", "unshift", "splice"].includes(prop as string)) {
        return function(...args: any[]) {
          const res = val.apply(target, args);
          save(job);
          return res;
        };
      }
      return val;
    }
  });

  job.scannerLogs = logsProxy;

  return new Proxy(job, {
    set(target, prop, value, receiver) {
      const success = Reflect.set(target, prop, value, receiver);
      if (success && ["status", "progress", "completedAt", "vulnerabilitiesFoundCount"].includes(prop as string)) {
        if (prop === "scannerLogs" && Array.isArray(value)) {
          target.scannerLogs = new Proxy(value, {
            get(t, p, r) {
              const v = Reflect.get(t, p, r);
              if (typeof v === "function" && ["push", "pop", "shift", "unshift", "splice"].includes(p as string)) {
                return function(...args: any[]) {
                  const res = v.apply(t, args);
                  save(target);
                  return res;
                };
              }
              return v;
            }
          });
        }
        save(target);
      }
      return success;
    }
  });
}

function makeVulnerabilityProxy(v: IVulnerability): IVulnerability {
  return new Proxy(v, {
    set(target, prop, value, receiver) {
      const success = Reflect.set(target, prop, value, receiver);
      if (success && prop === "isFalsePositive") {
        db.update(schema.vulnerabilities)
          .set({ isFalsePositive: value })
          .where(eq(schema.vulnerabilities.id, target.id))
          .catch(err => console.error("Error updating vulnerability false positive status:", err));
      }
      return success;
    }
  });
}

export class ScanRepository {
  public async getActiveScans(): Promise<IScanJob[]> {
    const scans = await db.select().from(schema.activeScans);
    return scans.map(s => makeScanJobProxy({
      id: s.id,
      targetId: s.targetId,
      targetName: s.targetName,
      status: s.status as any,
      progress: s.progress,
      startedAt: s.startedAt ? s.startedAt.toISOString() : new Date().toISOString(),
      completedAt: s.completedAt ? s.completedAt.toISOString() : undefined,
      scannerLogs: s.scannerLogs as string[],
      vulnerabilitiesFoundCount: s.vulnerabilitiesFoundCount as any,
    }));
  }

  public async getScanJobById(jobId: string): Promise<IScanJob | null> {
    const found = await db.select().from(schema.activeScans).where(eq(schema.activeScans.id, jobId)).limit(1);
    if (found.length === 0) return null;
    const s = found[0];
    return makeScanJobProxy({
      id: s.id,
      targetId: s.targetId,
      targetName: s.targetName,
      status: s.status as any,
      progress: s.progress,
      startedAt: s.startedAt ? s.startedAt.toISOString() : new Date().toISOString(),
      completedAt: s.completedAt ? s.completedAt.toISOString() : undefined,
      scannerLogs: s.scannerLogs as string[],
      vulnerabilitiesFoundCount: s.vulnerabilitiesFoundCount as any,
    });
  }

  public async addScanJob(job: IScanJob): Promise<IScanJob> {
    await db.insert(schema.activeScans).values({
      id: job.id,
      targetId: job.targetId,
      targetName: job.targetName,
      status: job.status,
      progress: job.progress,
      startedAt: job.startedAt ? new Date(job.startedAt) : new Date(),
      completedAt: job.completedAt ? new Date(job.completedAt) : null,
      scannerLogs: job.scannerLogs,
      vulnerabilitiesFoundCount: job.vulnerabilitiesFoundCount,
    }).onConflictDoNothing();
    return makeScanJobProxy(job);
  }

  public async getVulnerabilities(): Promise<IVulnerability[]> {
    const vulns = await db.select().from(schema.vulnerabilities);
    return vulns.map(v => makeVulnerabilityProxy({
      id: v.id,
      targetId: v.targetId || undefined,
      targetName: v.targetName,
      title: v.title,
      type: v.type,
      severity: v.severity as any,
      cvssScore: v.cvssScore,
      location: v.location,
      description: v.description,
      impact: v.impact,
      remediation: v.remediation,
      isFalsePositive: v.isFalsePositive ?? false,
      complianceMapping: v.complianceMapping as any,
    }));
  }

  public async getVulnerabilityById(vulnId: string): Promise<IVulnerability | null> {
    const v = await db.select().from(schema.vulnerabilities).where(eq(schema.vulnerabilities.id, vulnId)).limit(1);
    if (v.length === 0) return null;
    const vuln = v[0];
    return makeVulnerabilityProxy({
      id: vuln.id,
      targetId: vuln.targetId || undefined,
      targetName: vuln.targetName,
      title: vuln.title,
      type: vuln.type,
      severity: vuln.severity as any,
      cvssScore: vuln.cvssScore,
      location: vuln.location,
      description: vuln.description,
      impact: vuln.impact,
      remediation: vuln.remediation,
      isFalsePositive: vuln.isFalsePositive ?? false,
      complianceMapping: vuln.complianceMapping as any,
    });
  }

  public async addVulnerabilities(vulns: IVulnerability[]): Promise<void> {
    for (const v of vulns) {
      await db.insert(schema.vulnerabilities).values({
        id: v.id,
        targetId: v.targetId || null,
        targetName: v.targetName,
        title: v.title,
        type: v.type,
        severity: v.severity,
        cvssScore: v.cvssScore,
        location: v.location,
        description: v.description,
        impact: v.impact,
        remediation: v.remediation,
        isFalsePositive: v.isFalsePositive || false,
        complianceMapping: v.complianceMapping,
      }).onConflictDoNothing();
    }
  }

  public async getBountyData(): Promise<any> {
    const programs = await db.select().from(schema.bugBountyPrograms);
    const leaderboard = await db.select().from(schema.bugBountyLeaderboard).orderBy(schema.bugBountyLeaderboard.rank);
    const submissions = await db.select().from(schema.bugBountySubmissions).orderBy(desc(schema.bugBountySubmissions.submittedAt));
    return {
      programs,
      leaderboard: leaderboard.map(l => ({
        rank: l.rank,
        name: l.name,
        points: l.points,
        totalEarned: l.totalEarned,
        badges: l.badges as string[],
      })),
      submissions: submissions.map(s => ({
        id: s.id,
        targetName: s.targetName,
        title: s.title,
        severity: s.severity,
        status: s.status,
        rewardAmount: s.rewardAmount,
        submittedBy: s.submittedBy,
        submittedAt: s.submittedAt ? s.submittedAt.toISOString() : new Date().toISOString(),
        description: s.description,
        poc: s.poc,
      })),
    };
  }

  public async addBountySubmission(submission: IBountySubmission): Promise<IBountySubmission> {
    await db.insert(schema.bugBountySubmissions).values({
      id: submission.id,
      targetName: submission.targetName,
      title: submission.title,
      severity: submission.severity,
      status: submission.status,
      rewardAmount: submission.rewardAmount,
      submittedBy: submission.submittedBy,
      submittedAt: submission.submittedAt ? new Date(submission.submittedAt) : new Date(),
      description: submission.description,
      poc: submission.poc,
    }).onConflictDoNothing();
    return submission;
  }

  public async getBountySubmissionById(subId: string): Promise<IBountySubmission | null> {
    const found = await db.select().from(schema.bugBountySubmissions).where(eq(schema.bugBountySubmissions.id, subId)).limit(1);
    if (found.length === 0) return null;
    const s = found[0];
    return {
      id: s.id,
      targetName: s.targetName,
      title: s.title,
      severity: s.severity,
      status: s.status,
      rewardAmount: s.rewardAmount,
      submittedBy: s.submittedBy,
      submittedAt: s.submittedAt ? s.submittedAt.toISOString() : new Date().toISOString(),
      description: s.description,
      poc: s.poc,
    };
  }

  public async updateBountySubmission(subId: string, updates: Partial<IBountySubmission>): Promise<IBountySubmission | null> {
    const mappedUpdates: any = {};
    if (updates.targetName !== undefined) mappedUpdates.targetName = updates.targetName;
    if (updates.title !== undefined) mappedUpdates.title = updates.title;
    if (updates.severity !== undefined) mappedUpdates.severity = updates.severity;
    if (updates.status !== undefined) mappedUpdates.status = updates.status;
    if (updates.rewardAmount !== undefined) mappedUpdates.rewardAmount = updates.rewardAmount;
    if (updates.submittedBy !== undefined) mappedUpdates.submittedBy = updates.submittedBy;
    if (updates.submittedAt !== undefined) mappedUpdates.submittedAt = updates.submittedAt ? new Date(updates.submittedAt) : null;
    if (updates.description !== undefined) mappedUpdates.description = updates.description;
    if (updates.poc !== undefined) mappedUpdates.poc = updates.poc;

    await db.update(schema.bugBountySubmissions)
      .set(mappedUpdates)
      .where(eq(schema.bugBountySubmissions.id, subId));

    return this.getBountySubmissionById(subId);
  }
}
export const scanRepository = new ScanRepository();

