import { ApiError } from "./ApiError";

export class ValidationError extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 400, errors);
  }
}
