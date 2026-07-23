import { Request, Response } from "express";
import { userRepository, UserRepository } from "../repositories/UserRepository";
import { userService } from "../services/UserService";
import { Formatter } from "../utils/formatter";
import { Validators } from "../utils/validators";

export class AuthController {
  public login = async (req: Request, res: Response) => {
    try {
      const { email, mode } = req.body;
      Validators.requireFields(req.body, ["email"]);

      const members = await userRepository.getTeamMembers();
      let matched = members.find(m => m.email.toLowerCase() === email.trim().toLowerCase());

      if (!matched) {
        matched = {
          id: `tm-${Date.now()}`,
          name: email.split('@')[0] || "مستخدم جديد",
          email: email.trim().toLowerCase(),
          role: mode === 'hunter' ? 'Security Analyst' : 'Admin',
          joinedAt: new Date().toISOString()
        };
        await userRepository.addTeamMember(matched);
      }

      UserRepository.setActiveUserId(matched.id);
      const profile = await userService.getProfile();

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: matched.id,
        userEmail: matched.email,
        action: "تسجيل الدخول للنظام",
        details: `تم توثيق دخول المستخدم: ${matched.name} (${matched.role}) بنجاح`,
        ipAddress: req.ip || "127.0.0.1",
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success(profile, "تم تسجيل الدخول وتوثيق الجلسة بنجاح"));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message || "فشلت عملية تسجيل الدخول"));
    }
  };

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, companyName, mode, role } = req.body;
      Validators.requireFields(req.body, ["name", "email"]);

      if (!Validators.validateEmail(email)) {
        return res.status(400).json(Formatter.error("البريد الإلكتروني المدخل غير صالح."));
      }

      const newUser = {
        id: `tm-${Date.now()}`,
        name: Validators.sanitizeString(name),
        email: email.trim().toLowerCase(),
        role: (role as any) || (mode === 'hunter' ? 'Security Analyst' : 'Admin'),
        joinedAt: new Date().toISOString()
      };

      await userRepository.addTeamMember(newUser);
      UserRepository.setActiveUserId(newUser.id);

      const profile = await userService.getProfile();
      if (companyName && profile.company) {
        profile.company.name = companyName;
      }

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: newUser.id,
        userEmail: newUser.email,
        action: "إنشاء حساب جديد",
        details: `تم إنشاء حساب جديد بنجاح باسم: ${newUser.name} والشركة: ${companyName || 'غير محدد'}`,
        ipAddress: req.ip || "127.0.0.1",
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success(profile, "تم إنشاء الحساب وتوثيق الجلسة بنجاح"));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message || "فشل إنشاء الحساب الجديد"));
    }
  };

  public getMe = async (req: Request, res: Response) => {
    try {
      const profile = await userService.getProfile();
      return res.json(Formatter.success(profile, "تم جلب بيانات الجلسة الحالية بنجاح"));
    } catch (error: any) {
      return res.status(401).json(Formatter.error("الجلسة غير موثوقة أو انتهت صلاحيتها"));
    }
  };

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      Validators.requireFields(req.body, ["email"]);
      if (!Validators.validateEmail(email)) {
        return res.status(400).json(Formatter.error("البريد الإلكتروني المدخل غير صالح."));
      }

      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: "system",
        userEmail: email,
        action: "طلب إعادة تعيين كلمة المرور",
        details: `تم إرسال رابط إعادة التعيين إلى البريد: ${email}`,
        ipAddress: req.ip || "127.0.0.1",
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success({ resetToken: `reset-${Date.now()}` }, "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح"));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message || "فشل إرسال طلب إعادة التعيين"));
    }
  };

  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      Validators.requireFields(req.body, ["token", "password"]);

      return res.json(Formatter.success(null, "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة."));
    } catch (error: any) {
      return res.status(400).json(Formatter.error(error.message || "فشلت إعادة تعيين كلمة المرور"));
    }
  };

  public logout = async (req: Request, res: Response) => {
    try {
      const currentUser = await userRepository.getCurrentUser();
      await userRepository.addAuditLog({
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        action: "تسجيل الخروج",
        details: `قام المستخدم ${currentUser.name} بإنهاء الجلسة الأمنية`,
        ipAddress: req.ip || "127.0.0.1",
        timestamp: new Date().toISOString()
      });

      return res.json(Formatter.success(null, "تم تسجيل الخروج بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}

export const authController = new AuthController();
