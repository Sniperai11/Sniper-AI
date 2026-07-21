export class DateUtils {
  public static toIsoString(date: Date = new Date()): string {
    return date.toISOString();
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
