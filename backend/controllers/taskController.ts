import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { scanRepository } from "../repositories/ScanRepository";
import { remediationRepository } from "../repositories/RemediationRepository";
import { selfHealingService } from "../services/selfHealingService";
import { userRepository } from "../repositories/UserRepository";
import { Formatter } from "../utils/formatter";
import { Logger } from "../utils/logger";
import { CONSTANTS } from "../config/constants";

interface CustomTask {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done" | "Overdue" | "Blocked";
  assignee: string;
  linkedEntity?: string;
  dueDate: string;
  createdAt: string;
  severity?: string;
  description?: string;
  remediation?: string;
  location?: string;
  targetName?: string;
}

// In-memory store for custom created/updated tasks overriding or supplementing vulnerabilities
const customTasksStore: Map<string, Partial<CustomTask>> = new Map();

export class TaskController {
  /**
   * Get all tasks generated from active scan vulnerabilities & remediations
   */
  public getTasks = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const vulns = await scanRepository.getVulnerabilities();
      const remediations = await remediationRepository.getRemediations();
      
      const tasks: CustomTask[] = [];

      // 1. Generate tasks from scan vulnerabilities
      for (const v of vulns) {
        if (v.isFalsePositive) continue;

        const taskId = `TSK-${v.id}`;
        const customOverride = customTasksStore.get(taskId) || customTasksStore.get(v.id);

        let status: CustomTask["status"] = "To Do";
        if (v.state === "Resolved" || v.state === "Closed" || v.state === "Mitigated") {
          status = "Done";
        } else if (v.state === "In Progress" || v.state === "Assigned" || v.state === "Triaged") {
          status = "In Progress";
        }

        // Calculate due date based on severity
        const createdTime = new Date(v.createdAt || Date.now()).getTime();
        let daysToFix = 7;
        if (v.severity === "Critical") daysToFix = 2;
        else if (v.severity === "High") daysToFix = 4;
        else if (v.severity === "Medium") daysToFix = 7;
        else daysToFix = 14;

        const dueDate = new Date(createdTime + daysToFix * 86400000).toISOString();

        // Check if overdue
        if (status !== "Done" && new Date(dueDate).getTime() < Date.now()) {
          status = "Overdue";
        }

        const taskItem: CustomTask = {
          id: taskId,
          title: `معالجة ثغرة: ${v.title}`,
          status: customOverride?.status || status,
          assignee: customOverride?.assignee || v.owner || "فريق الهندسة البرمجية",
          linkedEntity: v.id,
          dueDate: customOverride?.dueDate || dueDate,
          createdAt: v.createdAt || new Date().toISOString(),
          severity: v.severity,
          description: v.description,
          remediation: v.remediation,
          location: v.location,
          targetName: v.targetName
        };

        tasks.push(taskItem);
      }

      // 2. Add custom user created tasks
      for (const [id, custom] of customTasksStore.entries()) {
        if (!id.startsWith("TSK-vuln-") && custom.title) {
          tasks.push({
            id: custom.id || id,
            title: custom.title,
            status: custom.status || "To Do",
            assignee: custom.assignee || "مطور الأنظمة",
            linkedEntity: custom.linkedEntity,
            dueDate: custom.dueDate || new Date(Date.now() + 86400000 * 5).toISOString(),
            createdAt: custom.createdAt || new Date().toISOString(),
            severity: custom.severity || "Medium",
            description: custom.description || "مهمة معالجة أمنية مخصصة",
            remediation: custom.remediation || "تطوير حماية كود المصدر"
          });
        }
      }

      return res.json(Formatter.success(tasks, "تم جلب جميع مهام المعالجة المرتبطة بالفحص والذكاء الاصطناعي بنجاح"));
    } catch (error: any) {
      Logger.error("Error fetching tasks:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل جلب قائمة المهام"));
    }
  };

  /**
   * Create a new custom task
   */
  public createTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, assignee, dueDate, linkedEntity, status, severity, description } = req.body;
      const taskId = `TSK-REM-${Math.floor(100 + Math.random() * 900)}`;

      const newTask: CustomTask = {
        id: taskId,
        title: title || "مهمة معالجة أمنية جديدة",
        status: status || "To Do",
        assignee: assignee || "فريق الأمان السيبراني",
        linkedEntity,
        dueDate: dueDate || new Date(Date.now() + 86400000 * 5).toISOString(),
        createdAt: new Date().toISOString(),
        severity: severity || "Medium",
        description: description || "مهمة معالجة تم إنشاؤها يدوياً"
      };

      customTasksStore.set(taskId, newTask);

      const currentUser = await userRepository.getCurrentUser();
      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: currentUser.id || "tm-1",
        userEmail: currentUser.email,
        action: "إنشاء مهمة معالجة جديدة",
        details: `تم إنشاء المهمة: ${newTask.title}`,
        ipAddress: CONSTANTS.DEFAULT_IP,
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success(newTask, "تم إنشاء المهمة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message || "فشل إنشاء المهمة"));
    }
  };

  /**
   * Update task status & sync with linked vulnerability state
   */
  public updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, assignee, dueDate } = req.body;

      let vulnId = id.replace("TSK-", "");
      let vuln = await scanRepository.getVulnerabilityById(vulnId);

      if (!vuln && id.includes("vuln-")) {
        vulnId = id.substring(id.indexOf("vuln-"));
        vuln = await scanRepository.getVulnerabilityById(vulnId);
      }

      // Update custom task store
      const existing = customTasksStore.get(id) || {};
      customTasksStore.set(id, {
        ...existing,
        id,
        status: status || existing.status,
        assignee: assignee || existing.assignee,
        dueDate: dueDate || existing.dueDate
      });

      // Synchronize linked vulnerability state in DB
      if (vuln) {
        if (status === "Done") {
          vuln.state = "Resolved";
        } else if (status === "In Progress") {
          vuln.state = "In Progress";
        } else if (status === "To Do") {
          vuln.state = "Triaged";
        }
        if (assignee) {
          vuln.owner = assignee;
        }
      }

      const currentUser = await userRepository.getCurrentUser();
      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: currentUser.id || "tm-1",
        userEmail: currentUser.email,
        action: "تحديث حالة مهمة المعالجة",
        details: `تحديث المهمة ${id} إلى حالة: ${status}`,
        ipAddress: CONSTANTS.DEFAULT_IP,
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success({ id, status, assignee }, "تم تحديث حالة المهمة ومزامنتها مع الثغرة بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message || "فشل تحديث المهمة"));
    }
  };

  /**
   * AI Self-Healing directly from Task execution
   */
  public executeAITaskRemediation = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      let vulnId = id.replace("TSK-", "");

      let vuln = await scanRepository.getVulnerabilityById(vulnId);
      if (!vuln && id.includes("vuln-")) {
        vulnId = id.substring(id.indexOf("vuln-"));
        vuln = await scanRepository.getVulnerabilityById(vulnId);
      }

      if (!vuln) {
        // Fallback to first available active vulnerability
        const vulns = await scanRepository.getVulnerabilities();
        vuln = vulns.find(v => !v.isFalsePositive) || vulns[0];
        vulnId = vuln ? vuln.id : "vuln-1";
      }

      const result = await selfHealingService.performSelfHealing(vulnId);

      // Mark task as Done and vuln as Resolved
      if (vuln) {
        vuln.state = "Resolved";
      }
      customTasksStore.set(id, {
        ...(customTasksStore.get(id) || {}),
        id,
        status: "Done"
      });

      return res.json(Formatter.success(result, "تم تطبيق الشفاء الذاتي والترميم التلقائي بالذكاء الاصطناعي بنجاح"));
    } catch (error: any) {
      Logger.error("Error executing task AI remediation:", error);
      return res.status(500).json(Formatter.error(error.message || "فشل تنفيذ المعالجة التلقائية بالذكاء الاصطناعي"));
    }
  };
}

export const taskController = new TaskController();
