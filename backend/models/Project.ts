import { ITarget } from "./Target";

export interface IProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  targets: ITarget[];
}

export class Project implements IProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  targets: ITarget[];

  constructor(data: IProject) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.targets = data.targets;
  }
}
