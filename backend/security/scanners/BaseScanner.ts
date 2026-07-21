import { IScannerPlugin, NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { scannerConfig, ScannerConfig } from "../scanner.config";

export abstract class BaseScanner implements IScannerPlugin {
  public abstract readonly id: string;
  public abstract readonly name: string;
  protected config: ScannerConfig = scannerConfig;

  public async initialize(): Promise<void> {
    // Shared initialization logic (can be overridden)
    console.log(`[BaseScanner] Initialized plugin: ${this.name} (${this.id})`);
  }

  public validateTarget(url: string, type: string): boolean {
    if (!url) return false;
    try {
      // Basic validation: target must look like a hostname, IP address, or valid URL
      const hostRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?$/;
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      
      let isUrl = false;
      try {
        new URL(url);
        isUrl = true;
      } catch (e) {}

      return isUrl || hostRegex.test(url) || ipRegex.test(url);
    } catch {
      return false;
    }
  }

  public abstract execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]>;

  public abstract parseResults(rawResults: any[]): Promise<any[]>;

  public abstract normalize(parsedResults: any[]): Promise<NormalizedVuln[]>;

  public async cleanup(): Promise<void> {
    // Shared cleanup logic (can be overridden)
    console.log(`[BaseScanner] Cleaned up plugin: ${this.name} (${this.id})`);
  }

  protected log(logsCallback: (msg: string) => void, message: string) {
    const timestamp = new Date().toISOString();
    logsCallback(`[${timestamp}] [${this.name}] ${message}`);
  }
}
