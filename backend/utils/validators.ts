import { ValidationError } from "../errors/ValidationError";

export class Validators {
  public static validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  public static sanitizeString(input: string): string {
    if (!input) return "";
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  public static requireFields(body: any, fields: string[]): void {
    const missing: string[] = [];
    for (const field of fields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      throw new ValidationError(`حقول مطلوبة مفقودة: ${missing.join(", ")}`);
    }
  }
}
