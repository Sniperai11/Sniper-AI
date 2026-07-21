import { IUserService } from "../interfaces/IUserService";
import { IUser, ISubscription } from "../types/user";
import { IAuditLog } from "../types/database";
import { userRepository, UserRepository } from "../repositories/UserRepository";
import { CONSTANTS } from "../config/constants";

export class UserService implements IUserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository = userRepository) {
    this.userRepo = userRepo;
  }

  public async getProfile(): Promise<{ user: IUser; company: any; subscription: ISubscription; teamMembers: IUser[] }> {
    const user = await this.userRepo.getCurrentUser();
    const company = await this.userRepo.getCompany();
    const subscription = await this.userRepo.getSubscription();
    const teamMembers = await this.userRepo.getTeamMembers();
    return { user, company, subscription, teamMembers };
  }

  public async updateTeamRole(memberId: string, newRole: "Admin" | "Security Analyst" | "Viewer"): Promise<IUser[]> {
    const team = await this.userRepo.updateTeamMemberRole(memberId, newRole);
    const currentUser = await this.userRepo.getCurrentUser();
    
    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "تعديل صلاحيات",
      details: `تم تعديل صلاحية العضو المعني إلى ${newRole}`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return team;
  }

  public async addTeamMember(name: string, email: string, role: string): Promise<IUser[]> {
    const newMember: IUser = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role: role as any || "Viewer",
      joinedAt: new Date().toISOString()
    };

    const team = await this.userRepo.addTeamMember(newMember);
    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "دعوة عضو جديد",
      details: `تمت دعوة ${name} برتبة ${role} للمنصة`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return team;
  }

  public async deleteTeamMember(id: string): Promise<IUser[]> {
    const team = await this.userRepo.deleteTeamMember(id);
    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "حذف عضو",
      details: `تم إزالة العضو من فريق العمل`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return team;
  }

  public async getAuditLogs(): Promise<IAuditLog[]> {
    return this.userRepo.getAuditLogs();
  }

  public async clearAuditLogs(): Promise<IAuditLog[]> {
    const currentUser = await this.userRepo.getCurrentUser();
    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "محاولة تنظيف السجل",
      details: "تم تسجيل محاولة لإعادة تعيين سجل التدقيق. لأسباب تتعلق بالامتثال الدولي والرقابة، يتم الاحتفاظ بكامل السجل التاريخي دون حذف.",
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });
    return this.userRepo.getAuditLogs();
  }

  public async upgradeSubscription(newPlan: string): Promise<ISubscription> {
    let updatedLimits = {
      maxProjects: 1,
      maxTargetsPerProject: 1,
      scansPerMonth: 5,
      scansRemainingThisMonth: 5,
      aiConsultationsPerMonth: 10,
      aiConsultationsRemaining: 10
    };
    let cost = 0;

    if (newPlan === "Professional") {
      updatedLimits = {
        maxProjects: 10,
        maxTargetsPerProject: 5,
        scansPerMonth: 50,
        scansRemainingThisMonth: 50,
        aiConsultationsPerMonth: 200,
        aiConsultationsRemaining: 200
      };
      cost = 149;
    } else if (newPlan === "Enterprise") {
      updatedLimits = {
        maxProjects: 100,
        maxTargetsPerProject: 30,
        scansPerMonth: 500,
        scansRemainingThisMonth: 500,
        aiConsultationsPerMonth: 1000,
        aiConsultationsRemaining: 1000
      };
      cost = 599;
    }

    const sub = await this.userRepo.updateSubscriptionPlan(newPlan, updatedLimits, cost);
    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "تعديل خطة الاشتراك",
      details: `تم تعديل خطة الاشتراك إلى: ${newPlan} (التكلفة: $${cost}/شهرياً)`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return sub;
  }
}

export const userService = new UserService();
