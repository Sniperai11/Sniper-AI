import { Project } from '../../types';

export interface ProjectSlice {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}
