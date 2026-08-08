import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Formatter } from "../utils/formatter";
import { scanRepository } from "../repositories/ScanRepository";

export class NotificationController {
  public getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const notifs = await scanRepository.getNotifications();
      return res.json(Formatter.success(notifs, "تم جلب التنبيهات بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };

  public markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await scanRepository.markNotificationRead(id);
      return res.json(Formatter.success(null, "تم تحديث حالة التنبيه"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}

export const notificationController = new NotificationController();
