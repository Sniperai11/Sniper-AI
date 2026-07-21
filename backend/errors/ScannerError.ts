import { ApiError } from "./ApiError";

export class ScannerError extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 502, errors);
  }
}
