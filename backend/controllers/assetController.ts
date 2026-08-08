import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Formatter } from "../utils/formatter";
import { scanRepository } from "../repositories/ScanRepository";

export class AssetController {
  public getAssets = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { projectId } = req.query;
      const assets = await scanRepository.getAssets(projectId as string);
      return res.json(Formatter.success(assets, "تم جلب الأصول بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public createAsset = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, type, projectId } = req.body;
      if (!name) {
        return res.status(400).json(Formatter.error("اسم الأصل مطلوب"));
      }
      const asset = await scanRepository.createAsset({ name, type, projectId });
      return res.status(201).json(Formatter.success(asset, "تم إضافة الأصل بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}

export const assetController = new AssetController();
