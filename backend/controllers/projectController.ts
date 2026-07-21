import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { projectService, ProjectService } from "../services/ProjectService";
import { Formatter } from "../utils/formatter";
import { Validators } from "../utils/validators";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectSvc: ProjectService = projectService) {
    this.projectService = projectSvc;
  }

  /**
   * 1. Retrieve all projects
   */
  public getProjects = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const projects = await this.projectService.getProjects();
      return res.json(Formatter.success(projects, "تم جلب المشاريع بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  /**
   * 2. Create a new security project scope
   */
  public createProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, description } = req.body;
      Validators.requireFields(req.body, ["name"]);

      const sanitizedName = Validators.sanitizeString(name);
      const sanitizedDesc = description ? Validators.sanitizeString(description) : undefined;

      const project = await this.projectService.createProject(sanitizedName, sanitizedDesc);
      return res.json(Formatter.success(project, "تم إنشاء المشروع بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 3. Add a vulnerability audit target to a project
   */
  public addTargetToProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, url, type } = req.body;
      Validators.requireFields(req.body, ["name", "url", "type"]);

      const sanitizedName = Validators.sanitizeString(name);
      const sanitizedUrl = Validators.sanitizeString(url);

      const target = await this.projectService.addTargetToProject(id, sanitizedName, sanitizedUrl, type);
      return res.json(Formatter.success(target, "تم إضافة الهدف للمشروع بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 4. Verify ownership of the target domain/app
   */
  public verifyTargetOwnership = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const target = await this.projectService.verifyTargetOwnership(id);
      return res.json(Formatter.success({ target }, "تم التحقق من ملكية الهدف بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * 5. Verify target bypass for Bounty scope (safe-harbor validation)
   */
  public verifyBountyTarget = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const target = await this.projectService.verifyBountyTarget(id);
      return res.json(Formatter.success({ target }, "تم ترخيص وتأكيد صلاحيات فحص الهدف الخارجي بنجاح"));
    } catch (error: any) {
      const status = error.statusCode || 400;
      return res.status(status).json(Formatter.error(error.message));
    }
  };
}

export const projectController = new ProjectController();

// Export legacy functions for non-breaking backward compatibility
export const getProjects = projectController.getProjects;
export const createProject = projectController.createProject;
export const addTargetToProject = projectController.addTargetToProject;
export const verifyTargetOwnership = projectController.verifyTargetOwnership;
export const verifyBountyTarget = projectController.verifyBountyTarget;
