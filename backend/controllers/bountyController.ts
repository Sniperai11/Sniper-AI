import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { scanRepository, ScanRepository } from "../repositories/ScanRepository";
import { userRepository } from "../repositories/UserRepository";
import { aiEngineService } from "../services/aiEngine";
import { Formatter } from "../utils/formatter";
import { Validators } from "../utils/validators";
import { CONSTANTS } from "../config/constants";

export class BountyController {
  private scanRepo: ScanRepository;

  constructor(scanRepo: ScanRepository = scanRepository) {
    this.scanRepo = scanRepo;
  }

  /**
   * 1. Get Bug Bounty programs, leaderboard and submissions
   */
  public getBountyData = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const data = await this.scanRepo.getBountyData();
      return res.json(Formatter.success(data, "تم جلب بيانات برامج مكافآت الثغرات بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 2. Submit a discovered vulnerability to bug bounty programs
   */
  public submitBountyReport = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { targetName, title, severity, description, poc } = req.body;
      Validators.requireFields(req.body, ["targetName", "title", "severity", "description", "poc"]);

      const currentUser = await userRepository.getCurrentUser();

      const newSubmission = {
        id: `sub-${Date.now()}`,
        targetName: Validators.sanitizeString(targetName),
        title: Validators.sanitizeString(title),
        severity: Validators.sanitizeString(severity),
        status: "Under Review",
        rewardAmount: "$0 (قيد المراجعة)",
        submittedBy: currentUser.email,
        submittedAt: new Date().toISOString(),
        description: Validators.sanitizeString(description),
        poc: Validators.sanitizeString(poc)
      };

      const submission = await this.scanRepo.addBountySubmission(newSubmission);

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: "tm-1",
        userEmail: currentUser.email,
        action: "تقديم ثغرة مكافآت",
        details: `تم تقديم تقرير ثغرة جديدة ببرنامج المكافآت بعنوان: ${title}`,
        ipAddress: CONSTANTS.DEFAULT_IP,
        timestamp: new Date().toISOString()
      });

      const updatedSubmissions = (await this.scanRepo.getBountyData()).submissions;

      return res.json(Formatter.success({
        submission,
        submissions: updatedSubmissions
      }, "تم إرسال تقرير الثغرة بنجاح لمراجعتها من قبل المسؤولين"));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message));
    }
  };

  /**
   * 3. Administrative review of submitted bounty report (Admin only)
   */
  public reviewBountyReport = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, rewardAmount } = req.body;
      Validators.requireFields(req.body, ["status"]);

      const submission = await this.scanRepo.getBountySubmissionById(id);
      if (!submission) {
        return res.status(404).json(Formatter.error("التقرير غير موجود."));
      }

      await this.scanRepo.updateBountySubmission(id, {
        status,
        rewardAmount: rewardAmount || submission.rewardAmount
      });

      const currentUser = await userRepository.getCurrentUser();

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: "tm-1",
        userEmail: currentUser.email,
        action: "تحديث تقرير مكافأة",
        details: `تم تعديل حالة تقرير الثغرة ${submission.title} إلى ${status}`,
        ipAddress: CONSTANTS.DEFAULT_IP,
        timestamp: new Date().toISOString()
      });

      const updatedSubmissions = (await this.scanRepo.getBountyData()).submissions;

      return res.json(Formatter.success({
        submission,
        submissions: updatedSubmissions
      }, "تم تحديث ومراجعة تقرير المكافأة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 4. Generate dynamic AI Elite Bug Bounty Report templates
   */
  public aiGenerateBountyDraft = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, vulnType, severity, pocSteps, impact } = req.body;
      Validators.requireFields(req.body, ["title", "vulnType", "severity", "pocSteps", "impact"]);

      const draftText = await aiEngineService.generateBugBountyReport(title, vulnType, severity, pocSteps, impact);
      return res.json(Formatter.success({ report: draftText }, "تم توليد مسودة تقرير مكافآت الثغرات بالذكاء الاصطناعي بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message || "فشل الاتصال بـ Gemini لتوليد التقرير"));
    }
  };
}

export const bountyController = new BountyController();

// Export legacy functions for non-breaking backward compatibility
export const getBountyData = bountyController.getBountyData;
export const submitBountyReport = bountyController.submitBountyReport;
export const reviewBountyReport = bountyController.reviewBountyReport;
export const aiGenerateBountyDraft = bountyController.aiGenerateBountyDraft;
