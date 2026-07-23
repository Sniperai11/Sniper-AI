import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { userService, UserService } from "../services/UserService";
import { Formatter } from "../utils/formatter";
import { Validators } from "../utils/validators";
import { UserRepository, userRepository } from "../repositories/UserRepository";

export class UserController {
  private userService: UserService;

  constructor(userSvc: UserService = userService) {
    this.userService = userSvc;
  }

  /**
   * 1. Retrieve current user, company, subscription and team list
   */
  public getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const data = await this.userService.getProfile();
      return res.json(Formatter.success(data, "تم جلب بيانات الملف الشخصي بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 2. Update a team member's role (Admin only)
   */
  public updateTeamRole = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { memberId, newRole } = req.body;
      Validators.requireFields(req.body, ["memberId", "newRole"]);
      
      const teamMembers = await this.userService.updateTeamRole(memberId, newRole);
      return res.json(Formatter.success({ teamMembers }, "تم تحديث رتبة العضو بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 3. Invite a new team member (Admin only)
   */
  public addTeamMember = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, email, role } = req.body;
      Validators.requireFields(req.body, ["name", "email"]);

      if (!Validators.validateEmail(email)) {
        return res.status(400).json(Formatter.error("البريد الإلكتروني المدخل غير صالح."));
      }

      const sanitizedName = Validators.sanitizeString(name);
      const teamMembers = await this.userService.addTeamMember(sanitizedName, email, role);
      return res.json(Formatter.success({ teamMembers }, "تمت إضافة العضو وإرسال الدعوة بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 4. Remove a team member (Admin only)
   */
  public deleteTeamMember = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const teamMembers = await this.userService.deleteTeamMember(id);
      return res.json(Formatter.success({ teamMembers }, "تم حذف العضو من الفريق بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 5. Fetch all security audit logs
   */
  public getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const auditLogs = await this.userService.getAuditLogs();
      return res.json(Formatter.success(auditLogs, "تم جلب سجل التدقيق الأمني بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 6. Audit logs clearing integrity event (Admin only)
   */
  public clearAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const auditLogs = await this.userService.clearAuditLogs();
      return res.json(Formatter.success({ auditLogs }, "تم تسجيل طلب مسح السجل وحفظ نزاهة البيانات السيبرانية."));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 7. SaaS subscription tier upgrade simulation
   */
  public upgradeSubscription = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { newPlan } = req.body;
      Validators.requireFields(req.body, ["newPlan"]);

      const subscription = await this.userService.upgradeSubscription(newPlan);
      return res.json(Formatter.success({ subscription }, `تمت ترقية باقة الاشتراك بنجاح إلى: ${newPlan}`));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 8. Switch the active session user
   */
  public switchUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId } = req.body;
      Validators.requireFields(req.body, ["userId"]);

      UserRepository.setActiveUserId(userId);
      const data = await this.userService.getProfile();

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: userId,
        userEmail: data.user.email,
        action: "تغيير جلسة المستخدم",
        details: `تم تبديل الجلسة النشطة بنجاح إلى المستخدم: ${data.user.name} (${data.user.role})`,
        ipAddress: "127.0.0.1",
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success(data, `تم تغيير المستخدم النشط للجلسة بنجاح إلى: ${data.user.name}`));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message));
    }
  };
}

export const userController = new UserController();

// Export legacy functions for non-breaking backward compatibility
export const getProfile = userController.getProfile;
export const updateTeamRole = userController.updateTeamRole;
export const addTeamMember = userController.addTeamMember;
export const deleteTeamMember = userController.deleteTeamMember;
export const getAuditLogs = userController.getAuditLogs;
export const clearAuditLogs = userController.clearAuditLogs;
export const upgradeSubscription = userController.upgradeSubscription;
export const switchUser = userController.switchUser;
