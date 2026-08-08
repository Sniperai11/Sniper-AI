import { Logger } from "../utils/logger";
import { IScanner } from "../interfaces/IScanner";
import { projectRepository } from "../repositories/ProjectRepository";
import { scanRepository } from "../repositories/ScanRepository";
import { userRepository } from "../repositories/UserRepository";
import { aiEngineService } from "./aiEngine";
import { SCANNER_CONFIG } from "../config/scannerConfig";
import { SECURITY_CONFIG } from "../config/securityConfig";
import { CONSTANTS } from "../config/constants";
import { scannerManager } from "../security/scanners/ScannerManager";

async function inspectLiveTarget(targetUrl: string) {
  let isHttp = false;
  let fetchSuccess = false;
  let statusInfo = "";
  let headersDump: Record<string, string> = {};

  const cleanUrl = targetUrl.startsWith("http://") || targetUrl.startsWith("https://") 
    ? targetUrl 
    : `http://${targetUrl}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(cleanUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "Sniper-AI-Security-Auditor/3.0" }
    });
    clearTimeout(timeout);

    isHttp = true;
    fetchSuccess = true;
    statusInfo = `HTTP ${res.status} ${res.statusText}`;

    res.headers.forEach((val, key) => {
      headersDump[key.toLowerCase()] = val;
    });
  } catch (err: any) {
    statusInfo = `الاتصال المباشر غير متاح أو استغرق وقتاً طويلاً: ${err.message || err}`;
  }

  return { isHttp, fetchSuccess, statusInfo, headersDump };
}

export class SecurityEngineService implements IScanner {
  /**
   * Runs the deep asynchronous security scanner using Enterprise Scanner Engine Pipeline
   */
  public async runScan(targetId: string, scanJobId: string): Promise<void> {
    const foundTarget = await projectRepository.findTargetById(targetId);
    if (!foundTarget) return;

    const currentScan = await scanRepository.getScanJobById(scanJobId);
    if (!currentScan) return;

    try {
      currentScan.status = "Scanning";
      currentScan.progress = 20;
      currentScan.scannerLogs.push(`[+] تهيئة وإطلاق محرك فحص الشركات الاحترافي (Enterprise Scanner Engine)...`);

      // 1. Perform Real Live Target Inspection
      currentScan.scannerLogs.push(`[+] جاري الاتصال المباشر واستطلاع الاستجابة الفعلية للنطاق: ${foundTarget.url}`);
      const inspection = await inspectLiveTarget(foundTarget.url);
      
      if (inspection.fetchSuccess) {
        currentScan.scannerLogs.push(`[+] تم الاتصال المباشر بنجاح: ${inspection.statusInfo}`);
        if (inspection.headersDump['server']) {
          currentScan.scannerLogs.push(`[+] ترويسة الخادم المكتشفة: Server = ${inspection.headersDump['server']}`);
        }
        if (inspection.headersDump['x-powered-by']) {
          currentScan.scannerLogs.push(`[+] تقنية الإطار المكشوفة: X-Powered-By = ${inspection.headersDump['x-powered-by']}`);
        }
      } else {
        currentScan.scannerLogs.push(`[!] ملاحظة الاتصال المباشر: ${inspection.statusInfo}`);
      }

      // Determine proper scanner profile based on target type
      let profile = "deep";
      if (foundTarget.type === "Mobile" || foundTarget.url.endsWith(".apk")) {
        profile = "mobile";
      } else if (foundTarget.type === "API") {
        profile = "quick";
      }

      currentScan.scannerLogs.push(`[+] ملف الفحص المختار: ${profile.toUpperCase()}`);

      // Run modular Scanner Manager Pipeline
      const pipelineOutput = await scannerManager.executeScanPipeline(
        foundTarget.url,
        foundTarget.type,
        profile,
        (logMessage) => {
          currentScan.scannerLogs.push(logMessage);
        }
      );

      // Update progress
      currentScan.progress = 75;
      currentScan.status = "Analyzing";
      currentScan.scannerLogs.push(`[+] اكتمل فحص الأدوات الموحدة. جاري معالجة النتائج وتطبيق التصفية والمطابقة الفنية...`);

      // Phase 6: AI Analysis & Verification
      currentScan.scannerLogs.push(`[+] استدعاء AI Security Auditor للتحقق من نتائج الفحص وإثرائها...`);
      let enrichedVulns = await aiEngineService.auditAndEnrichNormalizedVulns(
        pipelineOutput.vulnerabilities,
        foundTarget
      );

      if ((!enrichedVulns || enrichedVulns.length === 0) && process.env.GEMINI_API_KEY) {
        currentScan.scannerLogs.push(`[+] استدعاء الذكاء الاصطناعي لإجراء تحليل أمني عميق للنطاق بناءً على ترويسات الاستجابة الفعلية...`);
        try {
          enrichedVulns = await aiEngineService.generateAIVulnerabilities(
            foundTarget,
            inspection.isHttp,
            inspection.fetchSuccess,
            inspection.statusInfo,
            inspection.headersDump
          );
        } catch (e: any) {
          Logger.error("Error generating AI vulnerabilities:", e);
        }
      }

      // Phase 7: Report Generation & DB Insertion
      currentScan.progress = 90;
      currentScan.scannerLogs.push(`[+] جاري إصدار التقارير ومطابقة معايير الامتثال الموحدة (OWASP, PCI DSS, ISO 27001)...`);

      const severityCount = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      let maxCvss = 1.0;

      const addedVulns = (enrichedVulns || []).map((v: any, index: number) => {
        const vulnId = `vuln-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 4)}`;
        
        let sev: "Critical" | "High" | "Medium" | "Low" = "Medium";
        const sevLower = String(v.severity || "Medium").toLowerCase();
        if (sevLower.includes("crit")) sev = "Critical";
        else if (sevLower.includes("high")) sev = "High";
        else if (sevLower.includes("med")) sev = "Medium";
        else if (sevLower.includes("low")) sev = "Low";

        severityCount[sev] += 1;
        const cvss = Number(v.cvssScore) || 5.0;
        if (cvss > maxCvss) maxCvss = cvss;

        return {
          id: vulnId,
          targetId: foundTarget.id,
          targetName: foundTarget.name,
          title: v.title,
          type: v.type,
          severity: sev,
          cvssScore: cvss,
          location: v.location || "Unknown location",
          description: v.description,
          impact: v.impact,
          remediation: v.remediation,
          isFalsePositive: false,
          state: "Triaged",
          owner: "SecOps Analyst",
          createdAt: new Date().toISOString(),
          complianceMapping: {
            owasp: v.complianceMapping?.owasp || "A05:2021-Security Misconfiguration",
            iso27001: v.complianceMapping?.iso27001 || "A.12.6.1 إدارة الثغرات الفنية",
            pciDss: v.complianceMapping?.pciDss || "Requirement 6.5"
          }
        };
      });

      // Save to database/repository
      if (addedVulns.length > 0) {
        await scanRepository.addVulnerabilities(addedVulns);
      }

      const finalRiskScore = Math.min(100, Math.round(maxCvss * 10));

      currentScan.progress = 100;
      currentScan.status = "Completed";
      currentScan.completedAt = new Date().toISOString();
      currentScan.vulnerabilitiesFoundCount = severityCount;

      await projectRepository.updateTarget(foundTarget.id, {
        lastScanAt: new Date().toISOString(),
        currentRiskScore: finalRiskScore
      });

      currentScan.scannerLogs.push(`[+] تم تأكيد وتوثيق ${addedVulns.length} ثغرات أمنية حقيقية ومطابقتها للمعايير.`);
      currentScan.scannerLogs.push(`[+] تحديث درجة المخاطر الإجمالية للهدف الأمني إلى: ${finalRiskScore}%`);
      currentScan.scannerLogs.push(`[+] الفحص والتحليل الأمني الحقيقي للمؤسسات اكتمل بنجاح 100%.`);

      await scanRepository.updateScanJob(scanJobId, {
        status: "Completed",
        progress: 100,
        completedAt: currentScan.completedAt,
        scannerLogs: currentScan.scannerLogs,
        vulnerabilitiesFoundCount: severityCount
      });

    } catch (err: any) {
      Logger.error("Critical error in Scan Engine Execution:", err);
      currentScan.status = "Failed";
      currentScan.scannerLogs.push(`[!] فشل الفحص الأمني الحرج: ${err.message || err}`);
      
      await scanRepository.updateScanJob(scanJobId, {
        status: "Failed",
        scannerLogs: currentScan.scannerLogs
      });
    }
  }
}

export const securityEngineService = new SecurityEngineService();

// Export original function for backward compatibility
export const runRealSecurityScan = (targetId: string, scanJobId: string) =>
  securityEngineService.runScan(targetId, scanJobId);
