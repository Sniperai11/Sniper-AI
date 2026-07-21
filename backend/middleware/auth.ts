import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/UserRepository";
import { Formatter } from "../utils/formatter";
import { hasPermission, Role } from "../config/permissions";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Attaches the current active user to the request context
 */
export async function attachUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await userRepository.getCurrentUser();
    req.user = user;
    next();
  } catch (error) {
    next();
  }
}

/**
 * Restricts access to Administrators only
 */
export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const user = req.user || (await userRepository.getCurrentUser());
  if (user.role !== "Admin") {
    return res.status(403).json(Formatter.error("عذراً، هذه العملية تتطلب صلاحيات مدير النظام (Admin) فقط."));
  }
  next();
}

/**
 * Custom permission checker middleware
 */
export function requirePermission(action: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user || (await userRepository.getCurrentUser());
    const role: Role = user.role;
    
    if (!hasPermission(role, action)) {
      return res.status(403).json(Formatter.error(`عذراً، لا تمتلك الصلاحيات الكافية (${action}) لإتمام هذا الإجراء.`));
    }
    next();
  };
}
