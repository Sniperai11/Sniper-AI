import { ApiError } from "./ApiError";

export class AuthenticationError extends ApiError {
  constructor(message: string = "فشلت عملية المصادقة أو لم يتم تسجيل الدخول.") {
    super(message, 401);
  }
}
