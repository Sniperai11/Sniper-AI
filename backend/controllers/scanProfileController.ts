import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Formatter } from "../utils/formatter";
import { scanRepository } from "../repositories/ScanRepository";

export class ScanProfileController {
  public getScanProfiles = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profiles = await scanRepository.getScanProfiles();
      return res.json(Formatter.success(profiles, "تم جلب ملفات الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public createScanProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, description, engine, configuration, severityPolicy, enabled } = req.body;
      if (!name || !engine) {
        return res.status(400).json(Formatter.error("اسم الملف ومحرك الفحص مطلوبان"));
      }
      const newProfile = await scanRepository.createScanProfile({
        name,
        description,
        engine,
        configuration: configuration || {},
        severityPolicy,
        enabled
      });
      return res.status(201).json(Formatter.success(newProfile, "تم إنشاء ملف الفحص بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}
export const scanProfileController = new ScanProfileController();
