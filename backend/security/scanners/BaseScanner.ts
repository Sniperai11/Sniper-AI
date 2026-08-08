import { Logger } from "../../utils/logger";
import { IScannerPlugin, NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { scannerConfig, ScannerConfig } from "../scanner.config";

export abstract class BaseScanner implements IScannerPlugin {
  public abstract readonly id: string;
  public abstract readonly name: string;
  protected config: ScannerConfig = scannerConfig;

  public async initialize(): Promise<void> {
    // Shared initialization logic (can be overridden)
    Logger.info(`[BaseScanner] Initialized plugin: ${this.name} (${this.id})`);
  }

  public validateTarget(url: string, type: string): boolean {
    if (!url || typeof url !== "string") return false;
    const cleanUrl = url.trim();
    if (cleanUrl.length === 0) return false;
    
    // Accept valid URLs, hostnames, IPs, localhost, ports, or target identifiers
    return true;
  }

  public abstract execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]>;

  public abstract parseResults(rawResults: any[]): Promise<any[]>;

  public abstract normalize(parsedResults: any[]): Promise<NormalizedVuln[]>;

  public async cleanup(): Promise<void> {
    // Shared cleanup logic (can be overridden)
    Logger.info(`[BaseScanner] Cleaned up plugin: ${this.name} (${this.id})`);
  }

  protected log(logsCallback: (msg: string) => void, message: string) {
    const timestamp = new Date().toISOString();
    logsCallback(`[${timestamp}] [${this.name}] ${message}`);
  }
}
