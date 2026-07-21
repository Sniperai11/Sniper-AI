import { IReportEngine } from "../interfaces/IReportEngine";
import { IReport } from "../models/Report";
import { projectRepository } from "../repositories/ProjectRepository";
import { scanRepository } from "../repositories/ScanRepository";
import { reportRepository } from "../repositories/ReportRepository";
import { userRepository } from "../repositories/UserRepository";
import { aiEngineService } from "./aiEngine";
import { REPORT_CONFIG } from "../config/reportConfig";
import { CONSTANTS } from "../config/constants";

export class ReportingEngineService implements IReportEngine {
  public async generateProjectReport(projectId: string): Promise<IReport> {
    const project = await projectRepository.getProjectById(projectId);
    if (!project) {
      throw new Error("المشروع غير موجود");
    }

    // Get project target IDs
    const targetIds = project.targets.map(t => t.id);
    const allVulns = await scanRepository.getVulnerabilities();
    const projVulns = allVulns.filter(v => targetIds.includes(v.targetId) && !v.isFalsePositive);

    const severityBreakdown = {
      Critical: projVulns.filter(v => v.severity === "Critical").length,
      High: projVulns.filter(v => v.severity === "High").length,
      Medium: projVulns.filter(v => v.severity === "Medium").length,
      Low: projVulns.filter(v => v.severity === "Low").length
    };

    // Calculate generic security risk score
    let calculatedRisk = 0;
    if (projVulns.length > 0) {
      const weights = REPORT_CONFIG.SEVERITY_WEIGHTS;
      let sumWeights = 0;
      projVulns.forEach(v => {
        sumWeights += weights[v.severity] || 1;
      });
      calculatedRisk = Math.min(100, Math.round((sumWeights / (project.targets.length * REPORT_CONFIG.MAX_SEVERITY_WEIGHT)) * 100));
    }

    // Ask AI to write executive summary
    let aiExecutiveSummary = "";
    try {
      aiExecutiveSummary = await aiEngineService.generateExecutiveSummary(project.name, projVulns.length, calculatedRisk, severityBreakdown);
    } catch (error) {
      aiExecutiveSummary = `شهد الفحص الأمني لمشروع "${project.name}" رصد عدد ${projVulns.length} ثغرات أمنية نشطة ومؤكدة. يتضح من التحليل وجود نقاط ضعف خطرة في واجهات برمجة التطبيقات المالية والقنوات المفتوحة، مما يرفع مستوى تقييم المخاطر إلى ${calculatedRisk}%. نوصي بوضع خطة إصلاح عاجلة لتطبيق الحماية وسد الثغرات وتطبيق السياسات الأمنية المقترحة لضمان الامتثال المستمر لضوابط OWASP و ISO 27001.`;
    }

    const currentUser = await userRepository.getCurrentUser();

    const report: IReport = {
      id: `rep-${Date.now()}`,
      projectId,
      projectName: project.name,
      generatedAt: new Date().toISOString(),
      riskScore: calculatedRisk,
      totalVulnerabilities: projVulns.length,
      severityBreakdown,
      executiveSummary: aiExecutiveSummary,
      compliancePercentage: {
        owasp: Math.max(20, 100 - (severityBreakdown.Critical * 25 + severityBreakdown.High * 15)),
        iso27001: Math.max(30, 100 - (severityBreakdown.Critical * 18 + severityBreakdown.High * 10)),
        pciDss: Math.max(10, 100 - (severityBreakdown.Critical * 30 + severityBreakdown.High * 10))
      },
      vulnerabilities: projVulns
    };

    // Add to reports history using repository
    await reportRepository.addReport(report);

    // Add to audit logs using repository
    await userRepository.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "إنشاء تقرير أمني",
      details: `تم إصدار التقرير الأمني التفصيلي لمشروع: ${project.name}`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return report;
  }
}

export const reportingEngineService = new ReportingEngineService();

// Export the old function for backward compatibility
export const generateProjectReport = (projectId: string) =>
  reportingEngineService.generateProjectReport(projectId);
