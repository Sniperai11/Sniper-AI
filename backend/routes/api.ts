import { Router } from "express";
import { attachUser, requireAdmin } from "../middleware/auth";

import * as userController from "../controllers/userController";
import { authController } from "../controllers/authController";
import * as projectController from "../controllers/projectController";
import { scanController } from "../controllers/scanController";
import { vulnerabilityController } from "../controllers/vulnerabilityController";
import { scanProfileController } from "../controllers/scanProfileController";
import * as reportController from "../controllers/reportController";
import * as bountyController from "../controllers/bountyController";
import * as chatController from "../controllers/chatController";
import * as remediationController from "../controllers/remediationController";
import { taskController } from "../controllers/taskController";
import { commandCenterController } from "../controllers/commandCenterController";
import { assetController } from "../controllers/assetController";
import { notificationController } from "../controllers/notificationController";

const router = Router();

// Ensure active user details are attached to all requests
router.use(attachUser);

/* -------------------------------------------------------------------------- */
/*                            AUTHENTICATION & SESSIONS                      */
/* -------------------------------------------------------------------------- */
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/logout", authController.logout);
router.get("/auth/me", authController.getMe);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);
router.post("/auth/refresh", authController.refresh);

/* -------------------------------------------------------------------------- */
/*                            COMMAND CENTER MAP                              */
/* -------------------------------------------------------------------------- */
router.get("/command-center/stats", commandCenterController.getStats);
router.get("/command-center/trend", commandCenterController.getTrend);
router.get("/command-center/distribution", commandCenterController.getDistribution);
router.get("/command-center/alerts", commandCenterController.getAlerts);

/* -------------------------------------------------------------------------- */
/*                                USER & TEAM ROUTE MAP                        */
/* -------------------------------------------------------------------------- */
router.get("/user/profile", userController.getProfile);
router.post("/user/switch", userController.switchUser);
router.post("/team/role", requireAdmin, userController.updateTeamRole);
router.post("/team/add", requireAdmin, userController.addTeamMember);
router.delete("/team/:id", requireAdmin, userController.deleteTeamMember);
router.post("/subscription/upgrade", userController.upgradeSubscription);

/* -------------------------------------------------------------------------- */
/*                               AUDIT LOGS ROUTE MAP                         */
/* -------------------------------------------------------------------------- */
router.get("/audit-logs", userController.getAuditLogs);
router.post("/audit-logs/clear", requireAdmin, userController.clearAuditLogs);

/* -------------------------------------------------------------------------- */
/*                             PROJECTS & TARGETS MAP                         */
/* -------------------------------------------------------------------------- */
router.get("/projects", projectController.getProjects);
router.post("/projects", projectController.createProject); // Standard REST
router.post("/projects/create", projectController.createProject); // Legacy compatibility
router.post("/projects/:id/targets", projectController.addTargetToProject); // Standard REST
router.post("/projects/:id/targets/add", projectController.addTargetToProject); // Legacy compatibility
router.post("/targets/:id/verify", projectController.verifyTargetOwnership);
router.post("/targets/:id/verify-bounty", projectController.verifyBountyTarget);

/* -------------------------------------------------------------------------- */
/*                             SECURITY SCAN ENGINE MAP                       */
/* -------------------------------------------------------------------------- */
router.get("/scans", scanController.getActiveScans);
router.get("/scans/profiles", scanProfileController.getScanProfiles);
router.get("/scan-profiles", scanProfileController.getScanProfiles);
router.post("/scan-profiles", requireAdmin, scanProfileController.createScanProfile);
router.get("/assets", assetController.getAssets);
router.post("/assets", assetController.createAsset);
router.get("/notifications", notificationController.getNotifications);
router.post("/notifications/:id/read", notificationController.markAsRead);
router.post("/scans", scanController.startTargetScan);
router.get("/scans/:id", scanController.getScanById);
router.post("/scans/:id/stop", scanController.stopScan);
router.post("/targets/:id/scan", scanController.startTargetScan);
router.get("/vulnerabilities", vulnerabilityController.getVulnerabilities);
router.get("/vulnerabilities/:id", vulnerabilityController.getVulnerabilityById);
router.patch("/vulnerabilities/:id/owner", vulnerabilityController.updateVulnerabilityOwner);
router.patch("/vulnerabilities/:id/state", vulnerabilityController.updateVulnerabilityState);
router.post("/vulnerabilities/:id/state", vulnerabilityController.updateVulnerabilityState);
router.post("/vulnerabilities/:id/ai-analyze", vulnerabilityController.aiAnalyzeVulnerability);
router.post("/vulnerabilities/:id/toggle-false-positive", vulnerabilityController.toggleVulnerabilityFalsePositive);

/* -------------------------------------------------------------------------- */
/*                             COMPREHENSIVE REPORTS MAP                      */
/* -------------------------------------------------------------------------- */
router.get("/projects/:projectId/report", reportController.createReport);
router.post("/projects/:projectId/report", reportController.createReport);
router.post("/reports/generate", reportController.createReport);
router.get("/reports/history", reportController.getReportsHistory);
router.get("/reports/:id/download", reportController.downloadReport);

/* -------------------------------------------------------------------------- */
/*                            BUG BOUNTY PROGRAMS MAP                        */
/* -------------------------------------------------------------------------- */
router.get("/bugbounty/data", bountyController.getBountyData);
router.post("/bugbounty/submit", bountyController.submitBountyReport);
router.post("/bugbounty/submissions/:id/review", requireAdmin, bountyController.reviewBountyReport);
router.post("/bugbounty/generate-report", bountyController.aiGenerateBountyDraft);

/* -------------------------------------------------------------------------- */
/*                               AI CHATBOT ADVISOR                           */
/* -------------------------------------------------------------------------- */
router.post("/chat", chatController.sendMessageToAdvisor);
router.get("/ai-consultations", chatController.getConsultations);

/* -------------------------------------------------------------------------- */
/*                        AUTO REMEDIATION & SELF HEALING MAP                 */
/* -------------------------------------------------------------------------- */
router.get("/remediations", remediationController.getRemediations);
router.post("/remediations/bulk", requireAdmin, remediationController.performBulkRemediation);
router.post("/vulnerabilities/:id/remediate", requireAdmin, remediationController.performRemediation);

/* -------------------------------------------------------------------------- */
/*                            SECURITY TASKS MAP                              */
/* -------------------------------------------------------------------------- */
router.get("/tasks", taskController.getTasks);
router.post("/tasks", taskController.createTask);
router.patch("/tasks/:id", taskController.updateTaskStatus);
router.post("/tasks/:id/status", taskController.updateTaskStatus);
router.post("/tasks/:id/ai-remediate", taskController.executeAITaskRemediation);

export default router;
