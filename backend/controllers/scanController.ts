import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { scanRepository, ScanRepository } from "../repositories/ScanRepository";
import { projectRepository } from "../repositories/ProjectRepository";
import { userRepository } from "../repositories/UserRepository";
import { securityEngineService } from "../services/securityEngine";
import { Formatter } from "../utils/formatter";
import { CONSTANTS } from "../config/constants";
import { Logger } from "../utils/logger";

export class ScanController {
  private scanRepo: ScanRepository;
  constructor(repo: ScanRepository = scanRepository) {
    this.scanRepo = repo;
  }

  public getActiveScans = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const scans = await this.scanRepo.getActiveScans();
      return res.json(Formatter.success(scans, "تم جلب الجلسات النشطة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public startTargetScan = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id || req.body.targetId;
      const foundTarget = await projectRepository.findTargetById(id);
      if (!foundTarget) {
        return res.status(404).json(Formatter.error("الهدف غير موجود"));
      }
      if (foundTarget.verificationStatus !== "Verified") {
        return res.status(400).json(Formatter.error("لا يمكن فحص الهدف دون إكمال عملية التحقق من الملكية أولاً."));
      }
      const subscription = await userRepository.getSubscription();
      if (subscription.limits.scansRemainingThisMonth <= 0) {
        return res.status(403).json(Formatter.error("لقد استنفدت الرصيد المتاح من عمليات الفحص الشهري."));
      }
      subscription.limits.scansRemainingThisMonth -= 1;
      const currentUser = await userRepository.getCurrentUser();
      const scanJobId = `scan-${Date.now()}`;
      const newJob = {
        id: scanJobId,
        targetId: foundTarget.id,
        targetName: foundTarget.name,
        userId: currentUser.id || "usr-1",
        userEmail: currentUser.email || "user@company.com",
        status: "Scanning" as const,
        progress: 10,
        startedAt: new Date().toISOString(),
        scannerLogs: [
          `[${new Date().toISOString()}] تم بدء تهيئة بيئة الفحص الأمني للهدف: ${foundTarget.name}...`,
          `[${new Date().toISOString()}] ربط الفحص بحساب المستخدم المعتمد: ${currentUser.email}`,
          `[${new Date().toISOString()}] جاري الكشف عن نوع التطبيق وبدء تجميع المعلومات...`
        ],
        vulnerabilitiesFoundCount: { Critical: 0, High: 0, Medium: 0, Low: 0 }
      };
      const scanJob = await this.scanRepo.addScanJob(newJob);
      await userRepository.addAuditLog({
        id: `log-${Date.now()}`, userId: currentUser.id || "tm-1", userEmail: currentUser.email,
        action: "بدء فحص أمني حقيقي", details: `تم إطلاق فحص أمني للهدف: ${foundTarget.name} بواسطة ${currentUser.email}`,
        ipAddress: CONSTANTS.DEFAULT_IP, timestamp: new Date().toISOString()
      });
      securityEngineService.runScan(foundTarget.id, scanJobId);
      return res.json(Formatter.success({ scanJob }, "تم إطلاق الفحص الأمني بالخلفية بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  public getScanById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const cleanId = id.split(" ")[0];
      const scans = await this.scanRepo.getActiveScans();
      const matched = scans.find(s => s.id === id || s.id === cleanId);
      if (!matched) return res.status(404).json(Formatter.error("جلسة الفحص غير موجودة"));
      
      const allVulns = await this.scanRepo.getVulnerabilities();
      const targetVulns = allVulns.filter(v => 
        (matched.targetId && (v.targetId === matched.targetId || v.targetId === matched.targetName)) || 
        (matched.targetName && (v.targetName === matched.targetName || v.targetName === matched.targetId))
      );

      return res.json(Formatter.success({
        ...matched,
        vulnerabilities: targetVulns
      }, "تم جلب تفاصيل جلسة الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public stopScan = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const cleanId = id.split(" ")[0];
      const scans = await this.scanRepo.getActiveScans();
      const matched = scans.find(s => s.id === id || s.id === cleanId);
      if (matched) {
        matched.status = "Failed";
        matched.progress = 100;
        matched.scannerLogs.push(`[!] تم إيقاف جلسة الفحص بناءً على طلب المحلل الأمني.`);
      }
      return res.json(Formatter.success(matched, "تم إيقاف جلسة الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}
export const scanController = new ScanController();
