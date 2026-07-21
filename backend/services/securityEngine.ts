import { IScanner } from "../interfaces/IScanner";
import { projectRepository } from "../repositories/ProjectRepository";
import { scanRepository } from "../repositories/ScanRepository";
import { userRepository } from "../repositories/UserRepository";
import { aiEngineService } from "./aiEngine";
import { SCANNER_CONFIG } from "../config/scannerConfig";
import { SECURITY_CONFIG } from "../config/securityConfig";
import { CONSTANTS } from "../config/constants";
import { scannerManager } from "../security/scanners/ScannerManager";

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

      // Determine proper scanner profile based on target type
      let profile = "deep";
      if (foundTarget.type === "Mobile" || foundTarget.url.endsWith(".apk")) {
        profile = "mobile";
      } else if (foundTarget.type === "API") {
        profile = "quick";
      }

      currentScan.scannerLogs.push(`[+] ملف الفحص المختار: ${profile.toUpperCase()}`);

      // Run modular Scanner Manager Pipeline (covers Validate, Prepare, Execute, Parse, Normalize)
      const pipelineOutput = await scannerManager.executeScanPipeline(
        foundTarget.url,
        foundTarget.type,
        profile,
        (logMessage) => {
          currentScan.scannerLogs.push(logMessage);
        }
      );

      if (!pipelineOutput.success) {
        throw new Error("فشل فحص الهدف الأمني في مرحلة التحقق أو التنفيذ الأولي.");
      }

      // Update progress
      currentScan.progress = 75;
      currentScan.status = "Analyzing";
      currentScan.scannerLogs.push(`[+] اكتمل فحص الأدوات الموحدة. جاري معالجة النتائج وتطبيق التصفية والمطابقة الفنية...`);

      // Phase 6: AI Analysis & Verification (Feeding ONLY clean normalized vulnerability records from ResultNormalizer)
      currentScan.scannerLogs.push(`[+] استدعاء AI Security Auditor للتحقق من نتائج Result Normalizer وإثرائها...`);
      const enrichedVulns = await aiEngineService.auditAndEnrichNormalizedVulns(
        pipelineOutput.vulnerabilities,
        foundTarget
      );

      // Phase 7: Report Generation & DB Insertion
      currentScan.progress = 90;
      currentScan.scannerLogs.push(`[+] جاري إصدار التقارير ومطابقة معايير الامتثال الموحدة (OWASP, PCI DSS, ISO 27001)...`);

      const severityCount = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      let maxCvss = 1.0;

      const addedVulns = enrichedVulns.map((v: any, index: number) => {
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

    } catch (err: any) {
      console.error("Critical error in Scan Engine Execution:", err);
      currentScan.status = "Failed";
      currentScan.scannerLogs.push(`[!] فشل الفحص الأمني الحرج: ${err.message || err}`);
    }
  }
}

export const securityEngineService = new SecurityEngineService();

// Export original function for backward compatibility
export const runRealSecurityScan = (targetId: string, scanJobId: string) =>
  securityEngineService.runScan(targetId, scanJobId);
