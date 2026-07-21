import { ApiError } from "./ApiError";

export class DatabaseError extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 500, errors);
  }
}
