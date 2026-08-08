import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { IReport } from "../models/Report";
import { DateUtils } from "../utils/date";
import { desc } from "drizzle-orm";

export class ReportRepository {
  public async getReportsHistory(): Promise<IReport[]> {
    let reports = await db.select().from(schema.reportsHistory).orderBy(desc(schema.reportsHistory.generatedAt));
    if (reports.length === 0) {
      const initialReport: IReport = {
        id: "rep-1",
        projectId: "proj-1",
        projectName: "مشروع بوابة العملاء والواجهات البرمجية",
        generatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        riskScore: 42,
        totalVulnerabilities: 3,
        severityBreakdown: { Critical: 0, High: 1, Medium: 1, Low: 1 },
        executiveSummary: "أظهر فحص مشروع بوابة العملاء أماناً متوسطاً مع وجود ثغرة عالية الخطورة بحاجة إلى معالجة سريعة وهي تسريب مفتاح التكوين. نوصي بتفعيل طبقة حماية WAF وتصفية مخرجات البيانات.",
        compliancePercentage: { owasp: 85, iso27001: 88, pciDss: 90 },
        vulnerabilities: [
          {
            id: "vuln-2",
            targetId: "tar-2",
            targetName: "واجهة الخدمات المالية (API)",
            title: "انكشاف المفتاح السري للاختبار في الاستجابة (Sensitive Data Exposure)",
            type: "Sensitive Data Exposure",
            severity: "High",
            cvssScore: 7.5,
            location: "GET /v2/payments/config - Response Object",
            description: "تقوم واجهة Config بإرجاع كائن يحتوي على مفاتيح API لبيئة تجريبية ومفاتيح JWT السريّة الخاصة بالنطاق الداخلي بشكل غير مقصود للمستخدمين غير المصرح لهم.",
            impact: "يمكن استخدام المفاتيح السريّة المكشوفة في توقيع صلاحيات زائفة كمدير للنظام أو إجراء دفعات مالية وهمية في البيئة الإنتاجية.",
            remediation: "إزالة كتل التكوين الحساسة من استجابة الـ API واستخدام متغيرات البيئة الآمنة وتدريب المهندسين على تصفية كتل الاستجابة.",
            isFalsePositive: false,
            complianceMapping: {
              owasp: "A01:2021-Broken Access Control",
              iso27001: "A.8.24",
              pciDss: "6.5.1"
            }
          }
        ]
      };
      await this.addReport(initialReport);
      reports = await db.select().from(schema.reportsHistory).orderBy(desc(schema.reportsHistory.generatedAt));
    }
    return reports.map(r => ({
      id: r.id,
      projectId: r.projectId || undefined,
      projectName: r.projectName,
      generatedAt: DateUtils.toIsoString(r.generatedAt),
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

    // Create normalized report_files entry
    const jsonContent = JSON.stringify(report);
    const size = Buffer.byteLength(jsonContent, 'utf8');
    const checksum = `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

    await db.insert(schema.reportFiles).values({
      id: `repfile-${Date.now()}`,
      reportId: report.id,
      pdf: `/api/reports/${report.id}/download?format=pdf`,
      html: `/api/reports/${report.id}/download?format=html`,
      json: `/api/reports/${report.id}/download?format=json`,
      checksum: checksum,
      size: size,
      createdAt: new Date(),
    }).onConflictDoNothing();

    return report;
  }
}
export const reportRepository = new ReportRepository();

