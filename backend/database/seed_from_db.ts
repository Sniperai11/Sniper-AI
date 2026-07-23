import { db as pgDb } from "../../src/db/index.ts";
import * as schema from "../../src/db/schema.ts";
import { db as legacyDb } from "./db.ts";

async function main() {
  console.log("🌱 [Seed] Starting database migration & seeding from legacy memory store...");

  // 0. Insert default company
  console.log("[Seed] Inserting default company (comp-1)...");
  await pgDb.insert(schema.companies).values({
    id: "comp-1",
    name: "شركة التقنية للحلول الرقمية (DigitalTech Solutions)",
    ownerEmail: "owner@digitaltech.sa",
    joinedAt: new Date("2026-01-10T12:00:00Z"),
  }).onConflictDoNothing();

  // 1. Team Members
  const teamMembers = legacyDb.teamMembers;
  console.log(`[Seed] Inserting ${teamMembers.length} team members...`);
  for (const member of teamMembers) {
    await pgDb.insert(schema.teamMembers).values({
      id: member.id,
      companyId: "comp-1",
      name: member.name,
      email: member.email,
      role: member.role,
      joinedAt: member.joinedAt ? new Date(member.joinedAt) : new Date(),
    }).onConflictDoNothing();
  }

  // 2. Subscription
  const sub = legacyDb.subscription;
  console.log("[Seed] Inserting subscription settings...");
  await pgDb.insert(schema.subscription).values({
    id: 1,
    companyId: "comp-1",
    plan: sub.plan,
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd) : null,
    limits: sub.limits,
    cost: sub.cost,
  }).onConflictDoNothing();

  // 3. Audit Logs
  const auditLogs = legacyDb.auditLogs;
  console.log(`[Seed] Inserting ${auditLogs.length} audit logs...`);
  for (const log of auditLogs) {
    await pgDb.insert(schema.auditLogs).values({
      id: log.id,
      companyId: "comp-1",
      userId: log.userId,
      userEmail: log.userEmail,
      action: log.action,
      details: log.details,
      ipAddress: log.ipAddress,
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
    }).onConflictDoNothing();
  }

  // 4. Projects & Targets
  const projects = legacyDb.projects;
  console.log(`[Seed] Inserting ${projects.length} projects and nested targets...`);
  for (const project of projects) {
    await pgDb.insert(schema.projects).values({
      id: project.id,
      companyId: "comp-1",
      name: project.name,
      description: project.description || null,
      createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
    }).onConflictDoNothing();

    if (project.targets && project.targets.length > 0) {
      for (const target of project.targets) {
        await pgDb.insert(schema.targets).values({
          id: target.id,
          projectId: project.id,
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
      }
    }
  }

  // 5. Vulnerabilities
  const vulnerabilities = legacyDb.vulnerabilities;
  console.log(`[Seed] Inserting ${vulnerabilities.length} vulnerabilities...`);
  for (const vuln of vulnerabilities) {
    await pgDb.insert(schema.vulnerabilities).values({
      id: vuln.id,
      targetId: vuln.targetId || null,
      targetName: vuln.targetName,
      title: vuln.title,
      type: vuln.type,
      severity: vuln.severity,
      cvssScore: vuln.cvssScore,
      location: vuln.location,
      description: vuln.description,
      impact: vuln.impact,
      remediation: vuln.remediation,
      isFalsePositive: vuln.isFalsePositive || false,
      complianceMapping: vuln.complianceMapping,
    }).onConflictDoNothing();
  }

  // 6. Reports History
  const reportsHistory = legacyDb.reportsHistory;
  console.log(`[Seed] Inserting ${reportsHistory.length} reports history...`);
  for (const report of reportsHistory) {
    await pgDb.insert(schema.reportsHistory).values({
      id: report.id,
      projectId: report.projectId,
      projectName: report.projectName,
      generatedAt: report.generatedAt ? new Date(report.generatedAt) : new Date(),
      riskScore: report.riskScore,
      totalVulnerabilities: report.totalVulnerabilities,
      severityBreakdown: report.severityBreakdown,
      executiveSummary: report.executiveSummary,
      compliancePercentage: report.compliancePercentage,
      vulnerabilities: report.vulnerabilities,
    }).onConflictDoNothing();
  }

  // 7. Bug Bounty Programs
  const bugBountyPrograms = legacyDb.bugBountyPrograms;
  console.log(`[Seed] Inserting ${bugBountyPrograms.length} bug bounty programs...`);
  for (const prog of bugBountyPrograms) {
    await pgDb.insert(schema.bugBountyPrograms).values({
      id: prog.id,
      targetName: prog.targetName,
      rewardRange: prog.rewardRange,
      status: prog.status,
      severityMultiplier: prog.severityMultiplier,
      totalReports: prog.totalReports,
      scope: prog.scope,
      outOfScope: prog.outOfScope,
    }).onConflictDoNothing();
  }

  // 8. Bug Bounty Leaderboard
  const bugBountyLeaderboard = legacyDb.bugBountyLeaderboard;
  console.log(`[Seed] Inserting ${bugBountyLeaderboard.length} leaderboard entries...`);
  for (const entry of bugBountyLeaderboard) {
    await pgDb.insert(schema.bugBountyLeaderboard).values({
      rank: entry.rank,
      name: entry.name,
      points: entry.points,
      totalEarned: entry.totalEarned,
      badges: entry.badges,
    }).onConflictDoNothing();
  }

  // 9. Bug Bounty Submissions
  const bugBountySubmissions = legacyDb.bugBountySubmissions;
  console.log(`[Seed] Inserting ${bugBountySubmissions.length} bug bounty submissions...`);
  for (const sub of bugBountySubmissions) {
    await pgDb.insert(schema.bugBountySubmissions).values({
      id: sub.id,
      targetName: sub.targetName,
      title: sub.title,
      severity: sub.severity,
      status: sub.status,
      rewardAmount: sub.rewardAmount,
      submittedBy: sub.submittedBy,
      submittedAt: sub.submittedAt ? new Date(sub.submittedAt) : new Date(),
      description: sub.description,
      poc: sub.poc,
    }).onConflictDoNothing();
  }

  console.log("🎉 [Seed] Seeding and migration completed successfully!");
}

main().catch((err) => {
  console.error("❌ [Seed] Migration script failed:", err);
  process.exit(1);
});
