import crypto from "crypto";

export class CryptoUtils {
  public static sha256(data: string): string {
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  public static generateRandomToken(prefix: string = "token"): string {
    return `${prefix}-${crypto.randomBytes(16).toString("hex")}`;
  }

  public static generateVerificationHash(): string {
    return "ai-sec-audit-hash-" + crypto.randomBytes(6).toString("hex");
  }
}
