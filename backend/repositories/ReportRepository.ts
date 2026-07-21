import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IReport } from "../models/Report";
import { desc } from "drizzle-orm";

export class ReportRepository {
  public async getReportsHistory(): Promise<IReport[]> {
    const reports = await db.select().from(schema.reportsHistory).orderBy(desc(schema.reportsHistory.generatedAt));
    return reports.map(r => ({
      id: r.id,
      projectId: r.projectId || undefined,
      projectName: r.projectName,
      generatedAt: r.generatedAt ? r.generatedAt.toISOString() : new Date().toISOString(),
      riskScore: r.riskScore,
      totalVulnerabilities: r.totalVulnerabilities,
      severityBreakdown: r.severityBreakdown as any,
      executiveSummary: r.executiveSummary,
      compliancePercentage: r.compliancePercentage as any,
      vulnerabilities: r.vulnerabilities as any,
    }));
  }

  public async addReport(report: IReport): Promise<IReport> {
    await db.insert(schema.reportsHistory).values({
      id: report.id,
      projectId: report.projectId || null,
      projectName: report.projectName,
      generatedAt: report.generatedAt ? new Date(report.generatedAt) : new Date(),
      riskScore: report.riskScore,
      totalVulnerabilities: report.totalVulnerabilities,
      severityBreakdown: report.severityBreakdown,
      executiveSummary: report.executiveSummary,
      compliancePercentage: report.compliancePercentage,
      vulnerabilities: report.vulnerabilities,
    }).onConflictDoNothing();
    return report;
  }
}
export const reportRepository = new ReportRepository();

