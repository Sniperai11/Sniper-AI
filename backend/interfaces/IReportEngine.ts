import { IReport } from "../models/Report";

export interface IReportEngine {
  generateProjectReport(projectId: string): Promise<IReport>;
}
