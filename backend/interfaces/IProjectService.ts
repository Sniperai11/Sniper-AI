import { IProject } from "../models/Project";
import { ITarget } from "../models/Target";

export interface IProjectService {
  getProjects(): Promise<IProject[]>;
  createProject(name: string, description?: string): Promise<IProject>;
  addTargetToProject(projectId: string, name: string, url: string, type: string): Promise<ITarget>;
  verifyTargetOwnership(targetId: string): Promise<ITarget>;
  verifyBountyTarget(targetId: string): Promise<ITarget>;
}
