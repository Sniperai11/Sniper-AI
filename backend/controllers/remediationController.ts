import { Logger } from "../utils/logger";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { selfHealingService } from "../services/selfHealingService";
import { remediationRepository } from "../repositories/RemediationRepository";
import { Formatter } from "../utils/formatter";

export class RemediationController {
  /**
   * Get all auto-remediations history
   */
  public getRemediations = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const results = await remediationRepository.getRemediations();
      return res.json(Formatter.success(results, "تم جلب سجل المعالجة والشفاء الذاتي بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message || "فشل جلب سجل المعالجة"));
    }
  };

  /**
   * Execute auto-remediation for a specific vulnerability
   */
  public performRemediation = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { vulnerableCode } = req.body;

      const result = await selfHealingService.performSelfHealing(id, vulnerableCode);
      return res.json(Formatter.success(result, "تم إتمام عملية الترميم والشفاء الذاتي بنجاح تام"));
    } catch (error: any) {
      Logger.error("Error performing remediation:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل إجراء المعالجة التلقائية للثغرة"));
    }
  };

  /**
   * Execute batch auto-remediation for multiple vulnerabilities
   */
  public performBulkRemediation = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { vulnerabilityIds } = req.body;
      if (!Array.isArray(vulnerabilityIds) || vulnerabilityIds.length === 0) {
        return res.status(400).json(Formatter.error("يرجى تحديد ثغرة واحدة على الأقل للمعالجة الجماعية"));
      }

      const promises = vulnerabilityIds.map(async (id) => {
        try {
          const result = await selfHealingService.performSelfHealing(id);
          return { id, status: "success", result };
        } catch (err: any) {
          return { id, status: "failed", error: err.message };
        }
      });
      
      const results = await Promise.all(promises);

      return res.json(Formatter.success(results, "تم تنفيذ المعالجة الجماعية بالشفاء الذاتي بنجاح"));
    } catch (error: any) {
      Logger.error("Error performing bulk remediation:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل تنفيذ المعالجة الجماعية"));
    }
  };
}

export const remediationController = new RemediationController();
export const getRemediations = remediationController.getRemediations;
export const performRemediation = remediationController.performRemediation;
export const performBulkRemediation = remediationController.performBulkRemediation;
