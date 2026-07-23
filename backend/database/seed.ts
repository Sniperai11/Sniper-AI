import { db } from "../../src/db/index.ts";
import * as schema from "../../src/db/schema.ts";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🌱 [Seed] Starting database seeding...");
  const dbFilePath = path.join(process.cwd(), "database.json");

  if (!fs.existsSync(dbFilePath)) {
    console.error("❌ [Seed] database.json not found in workspace root.");
    return;
  }

  const rawData = fs.readFileSync(dbFilePath, "utf8");
  const data = JSON.parse(rawData);

  // 0. Default Company
  console.log("[Seed] Inserting default company (comp-1)...");
  await db.insert(schema.companies).values({
    id: "comp-1",
    name: "شركة التقنية للحلول الرقمية (DigitalTech Solutions)",
    ownerEmail: "owner@digitaltech.sa",
    joinedAt: new Date("2026-01-10T12:00:00Z"),
  }).onConflictDoNothing();

  // 1. Team Members
  if (data.teamMembers && data.teamMembers.length > 0) {
    console.log(`[Seed] Inserting ${data.teamMembers.length} team members...`);
    for (const member of data.teamMembers) {
      await db.insert(schema.teamMembers).values({
        id: member.id,
        companyId: "comp-1",
        name: member.name,
        email: member.email,
        role: member.role,
        joinedAt: member.joinedAt ? new Date(member.joinedAt) : new Date(),
      }).onConflictDoNothing();
    }
  }

  // 2. Subscription
  if (data.subscription) {
    console.log("[Seed] Inserting subscription settings...");
    await db.insert(schema.subscription).values({
      companyId: "comp-1",
      plan: data.subscription.plan,
      status: data.subscription.status,
      currentPeriodEnd: data.subscription.currentPeriodEnd ? new Date(data.subscription.currentPeriodEnd) : null,
      limits: data.subscription.limits,
      cost: data.subscription.cost,
    }).onConflictDoNothing();
  }

  // 3. Audit Logs
  if (data.auditLogs && data.auditLogs.length > 0) {
    console.log(`[Seed] Inserting ${data.auditLogs.length} audit logs...`);
    for (const log of data.auditLogs) {
      await db.insert(schema.auditLogs).values({
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
  }

  // 4. Projects & Targets
  if (data.projects && data.projects.length > 0) {
    console.log(`[Seed] Inserting ${data.projects.length} projects and their targets...`);
    for (const project of data.projects) {
      // Insert project
      await db.insert(schema.projects).values({
        id: project.id,
        companyId: "comp-1",
        name: project.name,
        description: project.description,
        createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
      }).onConflictDoNothing();

      // Insert targets for this project
      if (project.targets && project.targets.length > 0) {
        for (const target of project.targets) {
          await db.insert(schema.targets).values({
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
  }

  // 5. Vulnerabilities
  if (data.vulnerabilities && data.vulnerabilities.length > 0) {
    console.log(`[Seed] Inserting ${data.vulnerabilities.length} vulnerabilities...`);
    for (const vuln of data.vulnerabilities) {
      await db.insert(schema.vulnerabilities).values({
        id: vuln.id,
        targetId: vuln.targetId,
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
  }

  // 6. Reports History
  if (data.reportsHistory && data.reportsHistory.length > 0) {
    console.log(`[Seed] Inserting ${data.reportsHistory.length} reports history...`);
    for (const report of data.reportsHistory) {
      await db.insert(schema.reportsHistory).values({
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
  }

  // 7. Bug Bounty Programs
  if (data.bugBountyPrograms && data.bugBountyPrograms.length > 0) {
    console.log(`[Seed] Inserting ${data.bugBountyPrograms.length} bug bounty programs...`);
    for (const prog of data.bugBountyPrograms) {
      await db.insert(schema.bugBountyPrograms).values({
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
  }

  // 8. Bug Bounty Leaderboard
  if (data.bugBountyLeaderboard && data.bugBountyLeaderboard.length > 0) {
    console.log(`[Seed] Inserting ${data.bugBountyLeaderboard.length} bug bounty leaderboard entries...`);
    for (const entry of data.bugBountyLeaderboard) {
      await db.insert(schema.bugBountyLeaderboard).values({
        rank: entry.rank,
        name: entry.name,
        points: entry.points,
        totalEarned: entry.totalEarned,
        badges: entry.badges,
      }).onConflictDoNothing();
    }
  }

  // 9. Bug Bounty Submissions
  if (data.bugBountySubmissions && data.bugBountySubmissions.length > 0) {
    console.log(`[Seed] Inserting ${data.bugBountySubmissions.length} bug bounty submissions...`);
    for (const sub of data.bugBountySubmissions) {
      await db.insert(schema.bugBountySubmissions).values({
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
  }

  console.log("🎉 [Seed] Seeding completed successfully!");
}

main().catch((err) => {
  console.error("❌ [Seed] Error running seed script:", err);
  process.exit(1);
});
