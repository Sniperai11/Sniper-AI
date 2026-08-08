export class DateUtils {
  public static toIsoString(val?: any): string {
    if (!val) return new Date().toISOString();
    if (typeof val === "string") return val;
    if (val instanceof Date) return val.toISOString();
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  public static toOptionalIsoString(val?: any): string | undefined {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (val instanceof Date) return val.toISOString();
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    } catch {
      return undefined;
    }
  }

  public static formatDateArabic(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  }

  public static isExpired(dateStr: string): boolean {
    try {
      const date = new Date(dateStr);
      return date.getTime() < Date.now();
    } catch {
      return false;
    }
  }
}

