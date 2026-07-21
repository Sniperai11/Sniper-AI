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
      const { projectId } = req.params;
      const report = await reportingEngineService.generateProjectReport(projectId);
      return res.json(Formatter.success(report, "تم إصدار وتوليد التقرير الأمني التفصيلي بنجاح"));
    } catch (error: any) {
      console.error("Error generating report:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل توليد التقرير الأمني"));
    }
  };
}

export const reportController = new ReportController();

// Export legacy functions for non-breaking backward compatibility
export const getReportsHistory = reportController.getReportsHistory;
export const createReport = reportController.createReport;
