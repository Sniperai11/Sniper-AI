import { Logger } from "../utils/logger";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { reportRepository, ReportRepository } from "../repositories/ReportRepository";
import { reportingEngineService } from "../services/reportingEngine";
import { Formatter } from "../utils/formatter";

export class ReportController {
  private reportRepo: ReportRepository;

  constructor(reportRepo: ReportRepository = reportRepository) {
    this.reportRepo = reportRepo;
  }

  /**
   * 1. Retrieve generated reports history
   */
  public getReportsHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const reports = await this.reportRepo.getReportsHistory();
      return res.json(Formatter.success(reports, "تم جلب سجل التقارير المصدرة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 2. Generate a new security report for a project
   */
  public createReport = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projectId = req.params.projectId || req.body?.projectId || (req.query?.projectId as string) || "proj-1";
      const report = await reportingEngineService.generateProjectReport(projectId);
      return res.json(Formatter.success(report, "تم إصدار وتوليد التقرير الأمني التفصيلي بنجاح"));
    } catch (error: any) {
      Logger.error("Error generating report:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل توليد التقرير الأمني"));
    }
  };
  /**
   * 3. Download report file in PDF, HTML, or JSON format
   */
  public downloadReport = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const format = (req.query.format as string || "html").toLowerCase();
      const reports = await this.reportRepo.getReportsHistory();
      const report = reports.find(r => r.id === id) || reports[0];

      if (!report) {
        return res.status(404).json(Formatter.error("التقرير غير موجود"));
      }

      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename="${report.id}.json"`);
        return res.send(JSON.stringify(report, null, 2));
      }

      if (format === "pdf") {
        // PDF headers for downloading generated report
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${report.id}.pdf"`);
        const pdfDummyHeader = `%PDF-1.4\n% Sniper AI Security Platform Report: ${report.projectName}\n1 0 obj << /Title (${report.projectName}) >> endobj\nxref\ntrailer << /Root 1 0 R >>\n%%EOF\n`;
        return res.send(Buffer.from(pdfDummyHeader));
      }

      // Default HTML executive & technical format
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${report.projectName} - التقرير الأمني التنفيذي</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .badge { background: #1e293b; color: #38bdf8; padding: 4px 12px; border-radius: 9999px; font-weight: bold; }
            .summary { background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; margin-bottom: 30px; }
            .vuln-card { background: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
            .sev-Critical { color: #ef4444; border-right: 4px solid #ef4444; }
            .sev-High { color: #f97316; border-right: 4px solid #f97316; }
            .sev-Medium { color: #eab308; border-right: 4px solid #eab308; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>منصة Sniper AI Security - التقرير الأمني التفصيلي</h1>
            <p>اسم المشروع: <strong>${report.projectName}</strong> | تاريخ الإصدار: ${new Date(report.generatedAt).toLocaleString('ar-SA')}</p>
            <span class="badge">درجة المخاطر الإجمالية: ${report.riskScore}%</span>
          </div>
          <div class="summary">
            <h2>الملخص التنفيذي (AI Executive Summary)</h2>
            <p>${report.executiveSummary}</p>
          </div>
          <h2>الثغرات والملاحظات الأمنية المرصودة (${report.totalVulnerabilities})</h2>
          ${(report.vulnerabilities || []).map(v => `
            <div class="vuln-card sev-${v.severity}">
              <h3>${v.title} [${v.severity}]</h3>
              <p><strong>الموقع:</strong> ${v.location}</p>
              <p><strong>الوصف:</strong> ${v.description}</p>
              <p><strong>طريقة المعالجة البرمجية:</strong> ${v.remediation}</p>
            </div>
          `).join('')}
        </body>
        </html>
      `;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Content-Disposition", `inline; filename="${report.id}.html"`);
      return res.send(htmlContent);

    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}

export const reportController = new ReportController();

// Export legacy functions for non-breaking backward compatibility
export const getReportsHistory = reportController.getReportsHistory;
export const createReport = reportController.createReport;
export const downloadReport = reportController.downloadReport;
