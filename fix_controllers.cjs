const fs = require('fs');

const scanCode = `import { Response } from "express";
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
      const scanJobId = \`scan-\${Date.now()}\`;
      const newJob = {
        id: scanJobId,
        targetId: id,
        targetName: foundTarget.name,
        status: "Scanning" as const,
        progress: 10,
        startedAt: new Date().toISOString(),
        scannerLogs: [
          \`[\${new Date().toISOString()}] تم بدء تهيئة بيئة الفحص الأمني...\`,
          \`[\${new Date().toISOString()}] جاري الكشف عن نوع التطبيق وبدء تجميع المعلومات...\`
        ],
        vulnerabilitiesFoundCount: { Critical: 0, High: 0, Medium: 0, Low: 0 }
      };
      const scanJob = await this.scanRepo.addScanJob(newJob);
      const currentUser = await userRepository.getCurrentUser();
      await userRepository.addAuditLog({
        id: \`log-\${Date.now()}\`, userId: "tm-1", userEmail: currentUser.email,
        action: "بدء فحص أمني حقيقي", details: \`تم إطلاق فحص أمني للهدف: \${foundTarget.name}\`,
        ipAddress: CONSTANTS.DEFAULT_IP, timestamp: new Date().toISOString()
      });
      securityEngineService.runScan(id, scanJobId);
      return res.json(Formatter.success({ scanJob }, "تم إطلاق الفحص الأمني بالخلفية بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  public getScanById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const scans = await this.scanRepo.getActiveScans();
      const matched = scans.find(s => s.id === id);
      if (!matched) return res.status(404).json(Formatter.error("جلسة الفحص غير موجودة"));
      return res.json(Formatter.success(matched, "تم جلب تفاصيل جلسة الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public stopScan = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const scans = await this.scanRepo.getActiveScans();
      const matched = scans.find(s => s.id === id);
      if (matched) {
        matched.status = "Failed";
        matched.scannerLogs.push(\`[!] تم إيقاف جلسة الفحص بناءً على طلب المحلل الأمني.\`);
      }
      return res.json(Formatter.success(matched, "تم إيقاف جلسة الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}
export const scanController = new ScanController();
`;

const vulnCode = `import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { scanRepository, ScanRepository } from "../repositories/ScanRepository";
import { userRepository } from "../repositories/UserRepository";
import { aiEngineService } from "../services/aiEngine";
import { Formatter } from "../utils/formatter";
import { CONSTANTS } from "../config/constants";
import { Logger } from "../utils/logger";

export class VulnerabilityController {
  private scanRepo: ScanRepository;
  constructor(repo: ScanRepository = scanRepository) {
    this.scanRepo = repo;
  }

  public getVulnerabilities = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const vulnerabilities = await this.scanRepo.getVulnerabilities();
      return res.json(Formatter.success(vulnerabilities, "تم جلب الثغرات المكتشفة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public aiAnalyzeVulnerability = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const vuln = await this.scanRepo.getVulnerabilityById(id);
      if (!vuln) return res.status(404).json(Formatter.error("الثغرة غير موجودة"));
      const subscription = await userRepository.getSubscription();
      if (subscription.limits.aiConsultationsRemaining <= 0) {
        return res.status(403).json(Formatter.error("عذراً، انتهت استشارات الذكاء الاصطناعي."));
      }
      subscription.limits.aiConsultationsRemaining -= 1;
      let analysisText = "";
      try {
        analysisText = await aiEngineService.analyzeVulnerability(vuln);
      } catch (error: any) {
        Logger.error("Gemini API Error in analyzer, triggering smart local fallback:", error);
        analysisText = \`### تحليل ذكي افتراضي (AI Security Auditor)\\nتم العثور على ثغرة **\${vuln.title}**\`;
      }
      return res.json(Formatter.success({ aiAnalysis: analysisText, vulnerability: vuln }, "تم التحليل بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public toggleVulnerabilityFalsePositive = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const vuln = await this.scanRepo.getVulnerabilityById(id);
      if (!vuln) return res.status(404).json(Formatter.error("الثغرة غير موجودة"));
      vuln.isFalsePositive = !vuln.isFalsePositive;
      const currentUser = await userRepository.getCurrentUser();
      await userRepository.addAuditLog({
        id: \`log-\${Date.now()}\`, userId: "tm-1", userEmail: currentUser.email,
        action: "تعديل حالة الثغرة", details: \`تم تعديل حالة الثغرة "\${vuln.title}"\`,
        ipAddress: CONSTANTS.DEFAULT_IP, timestamp: new Date().toISOString()
      });
      return res.json(Formatter.success({ vulnerability: vuln }, "تم التعديل بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public getVulnerabilityById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const vuln = await this.scanRepo.getVulnerabilityById(id);
      if (!vuln) return res.status(404).json(Formatter.error("الثغرة الأمنية غير موجودة"));
      return res.json(Formatter.success(vuln, "تم جلب تفاصيل الثغرة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public updateVulnerabilityOwner = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { owner } = req.body;
      const vuln = await this.scanRepo.getVulnerabilityById(id);
      if (!vuln) return res.status(404).json(Formatter.error("الثغرة الأمنية غير موجودة"));
      (vuln as any).owner = owner || "SecOps Analyst";
      return res.json(Formatter.success(vuln, "تم تحديث المسؤول بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}
export const vulnerabilityController = new VulnerabilityController();
`;

const profileCode = `import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Formatter } from "../utils/formatter";

export class ScanProfileController {
  public getScanProfiles = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profiles = [
        { id: 'prof-owasp', name: 'OWASP Top 10', description: 'فحص شامل لثغرات OWASP العشر', type: 'Web' },
        { id: 'prof-full', name: 'فحص شامل (Full Scan)', description: 'فحص عميق لجميع المنافذ والخدمات', type: 'Network' },
        { id: 'prof-fast', name: 'فحص سريع (Fast Scan)', description: 'فحص سريع للمنافذ الشائعة والثغرات المعروفة', type: 'Network' },
        { id: 'prof-api', name: 'فحص واجهات برمجة التطبيقات (API)', description: 'فحص مخصص لثغرات الـ APIs', type: 'API' }
      ];
      return res.json(Formatter.success(profiles, "تم جلب ملفات الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}
export const scanProfileController = new ScanProfileController();
`;

fs.writeFileSync('backend/controllers/scanController.ts', scanCode);
fs.writeFileSync('backend/controllers/vulnerabilityController.ts', vulnCode);
fs.writeFileSync('backend/controllers/scanProfileController.ts', profileCode);
console.log("Fixed controllers");
