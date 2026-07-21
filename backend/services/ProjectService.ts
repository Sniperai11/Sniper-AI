import { IProjectService } from "../interfaces/IProjectService";
import { IProject } from "../models/Project";
import { ITarget } from "../models/Target";
import { projectRepository, ProjectRepository } from "../repositories/ProjectRepository";
import { userRepository, UserRepository } from "../repositories/UserRepository";
import { CONSTANTS } from "../config/constants";

export class ProjectService implements IProjectService {
  private projectRepo: ProjectRepository;
  private userRepo: UserRepository;

  constructor(projectRepo: ProjectRepository = projectRepository, userRepo: UserRepository = userRepository) {
    this.projectRepo = projectRepo;
    this.userRepo = userRepo;
  }

  public async getProjects(): Promise<IProject[]> {
    return this.projectRepo.getProjects();
  }

  public async createProject(name: string, description?: string): Promise<IProject> {
    const subscription = await this.userRepo.getSubscription();
    const projects = await this.projectRepo.getProjects();

    if (projects.length >= subscription.limits.maxProjects) {
      throw new Error("لقد وصلت للحد الأقصى للمشاريع المسموحة في خطتك الحالية. يرجى الترقية إلى باقة Enterprise.");
    }

    const newProj: IProject = {
      id: `proj-${Date.now()}`,
      name,
      description: description || "لا يوجد وصف للمشروع",
      createdAt: new Date().toISOString(),
      targets: []
    };

    const project = await this.projectRepo.createProject(newProj);
    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "إنشاء مشروع",
      details: `تم إنشاء مشروع أمني جديد: ${name}`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return project;
  }

  public async addTargetToProject(projectId: string, name: string, url: string, type: string): Promise<ITarget> {
    const project = await this.projectRepo.getProjectById(projectId);
    if (!project) throw new Error("المشروع غير موجود");

    const subscription = await this.userRepo.getSubscription();
    if (project.targets.length >= subscription.limits.maxTargetsPerProject) {
      throw new Error("لقد تجاوزت الحد الأقصى للأهداف لكل مشروع في خطتك الحالية.");
    }

    const randomToken = "ai-sec-audit-hash-" + Math.random().toString(36).substring(2, 12);

    const newTarget: ITarget = {
      id: `tar-${Date.now()}`,
      name,
      url,
      type: type as any,
      verificationToken: randomToken,
      verificationStatus: "Pending",
    };

    const target = await this.projectRepo.addTargetToProject(projectId, newTarget);
    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "إضافة هدف أمني",
      details: `تم إضافة هدف الفحص: ${name} (${url}) تحت مشروع ${project.name}`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return target;
  }

  public async verifyTargetOwnership(targetId: string): Promise<ITarget> {
    const updated = await this.projectRepo.updateTarget(targetId, {
      verificationStatus: "Verified",
      verifiedAt: new Date().toISOString(),
      currentRiskScore: 0
    });

    if (!updated) throw new Error("الهدف الأمني غير موجود");

    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "تحقق الملكية",
      details: `تم تأكيد ملكية الهدف الأمني ${updated.name} (${updated.url}) بنجاح`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return updated;
  }

  public async verifyBountyTarget(targetId: string): Promise<ITarget> {
    const updated = await this.projectRepo.updateTarget(targetId, {
      verificationStatus: "Verified",
      verifiedAt: new Date().toISOString(),
      currentRiskScore: 0
    });

    if (!updated) throw new Error("الهدف الأمني غير موجود");

    const currentUser = await this.userRepo.getCurrentUser();

    await this.userRepo.addAuditLog({
      id: `log-${Date.now()}`,
      userId: "tm-1",
      userEmail: currentUser.email,
      action: "ترخيص الهدف الخارجي",
      details: `تم ترخيص الهدف الخارجي ${updated.name} (${updated.url}) كبرنامج ثغرات مستقل (Bounty Safe-Harbor)`,
      ipAddress: CONSTANTS.DEFAULT_IP,
      timestamp: new Date().toISOString()
    });

    return updated;
  }
}

export const projectService = new ProjectService();
