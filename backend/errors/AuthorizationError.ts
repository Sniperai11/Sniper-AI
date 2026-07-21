import { ApiError } from "./ApiError";

export class AuthorizationError extends ApiError {
  constructor(message: string = "ليس لديك الصلاحيات الكافية لإجراء هذه العملية.") {
    super(message, 403);
  }
}
