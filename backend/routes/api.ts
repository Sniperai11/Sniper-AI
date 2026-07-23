import { Router } from "express";
import { attachUser, requireAdmin } from "../middleware/auth";

import * as userController from "../controllers/userController";
import { authController } from "../controllers/authController";
import * as projectController from "../controllers/projectController";
import * as scanController from "../controllers/scanController";
import * as reportController from "../controllers/reportController";
import * as bountyController from "../controllers/bountyController";
import * as chatController from "../controllers/chatController";
import * as remediationController from "../controllers/remediationController";

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
router.post("/projects/create", projectController.createProject);
router.post("/projects/:id/targets/add", projectController.addTargetToProject);
router.post("/targets/:id/verify", projectController.verifyTargetOwnership);
router.post("/targets/:id/verify-bounty", projectController.verifyBountyTarget);

/* -------------------------------------------------------------------------- */
/*                             SECURITY SCAN ENGINE MAP                       */
/* -------------------------------------------------------------------------- */
router.get("/scans", scanController.getActiveScans);
router.post("/targets/:id/scan", scanController.startTargetScan);
router.get("/vulnerabilities", scanController.getVulnerabilities);
router.post("/vulnerabilities/:id/ai-analyze", scanController.aiAnalyzeVulnerability);
router.post("/vulnerabilities/:id/toggle-false-positive", scanController.toggleVulnerabilityFalsePositive);

/* -------------------------------------------------------------------------- */
/*                             COMPREHENSIVE REPORTS MAP                      */
/* -------------------------------------------------------------------------- */
router.get("/projects/:projectId/report", reportController.createReport);
router.get("/reports/history", reportController.getReportsHistory);

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

/* -------------------------------------------------------------------------- */
/*                        AUTO REMEDIATION & SELF HEALING MAP                 */
/* -------------------------------------------------------------------------- */
router.get("/remediations", remediationController.getRemediations);
router.post("/vulnerabilities/:id/remediate", requireAdmin, remediationController.performRemediation);

export default router;
