export class Helpers {
  public static generateId(prefix: string = "id"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static safeJsonParse<T = any>(str: string, fallback: T): T {
    try {
      return JSON.parse(str) as T;
    } catch {
      return fallback;
    }
  }
}
