import { IScannerPlugin, NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { ScannerFactory } from "./ScannerFactory";
import { scannerConfig } from "../scanner.config";

export interface ScanResult {
  pluginId: string;
  pluginName: string;
  success: boolean;
  vulnerabilities: NormalizedVuln[];
  error?: string;
  durationMs: number;
}

export interface BulkScanOutput {
  target: string;
  success: boolean;
  timestamp: string;
  totalDurationMs: number;
  vulnerabilities: NormalizedVuln[];
  logs: string[];
  pluginSummaries: ScanResult[];
}

export class ScannerManager {
  private logs: string[] = [];

  private log(msg: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] [ScannerManager] ${msg}`);
    console.log(`[ScannerManager] ${msg}`);
  }

  /**
   * Run full scanning pipeline for a specific target with designated plugins or profile
   */
  public async executeScanPipeline(
    targetUrl: string,
    targetType: string,
    profileName: string,
    onLogUpdate?: (log: string) => void
  ): Promise<BulkScanOutput> {
    const startTime = Date.now();
    this.logs = [];
    this.log(`🚀 Starting execution pipeline for target: ${targetUrl} (Type: ${targetType}, Profile: ${profileName})`);

    const logWithCallback = (msg: string) => {
      this.log(msg);
      if (onLogUpdate) {
        onLogUpdate(msg);
      }
    };

    // Phase 1: Validate Target
    logWithCallback("🔍 Phase 1: Validating target format and compliance eligibility...");
    
    // Select relevant plugins
    const plugins = ScannerFactory.getPluginsForProfile(profileName);
    if (plugins.length === 0) {
      logWithCallback("⚠️ No plugins registered for this profile. Falling back to default scanners.");
    }
    
    const activePlugins = plugins.length > 0 ? plugins : ScannerFactory.getAllPlugins().slice(0, 2);
    
    // Validate target against at least one of the active plugins
    const isValid = activePlugins.some(p => p.validateTarget(targetUrl, targetType));
    if (!isValid) {
      const errMsg = `❌ Target validation failed: Target '${targetUrl}' does not match standard security patterns.`;
      logWithCallback(errMsg);
      return {
        target: targetUrl,
        success: false,
        timestamp: new Date().toISOString(),
        totalDurationMs: Date.now() - startTime,
        vulnerabilities: [],
        logs: this.logs,
        pluginSummaries: []
      };
    }
    logWithCallback(`✅ Target validation succeeded. Proceeding with ${activePlugins.length} security scanners.`);

    const pluginSummaries: ScanResult[] = [];
    let consolidatedVulns: NormalizedVuln[] = [];

    // Phase 2: Prepare & Initialize Scanners
    logWithCallback("⚙️ Phase 2: Preparing and initializing selected scanner plugins...");
    for (const plugin of activePlugins) {
      try {
        logWithCallback(`Initializing ${plugin.name}...`);
        await plugin.initialize();
      } catch (err: any) {
        logWithCallback(`❌ Failed to initialize ${plugin.name}: ${err.message}`);
      }
    }

    // Phase 3 & 4: Execute & Parse & Normalize (Running in restricted Parallel Jobs configuration)
    logWithCallback(`⚡ Phase 3-5: Executing scan jobs (Concurrency limit: ${scannerConfig.maxParallelJobs})...`);
    
    // We run sequentially or batch-wise depending on parallel jobs limit
    const batches: IScannerPlugin[][] = [];
    for (let i = 0; i < activePlugins.length; i += scannerConfig.maxParallelJobs) {
      batches.push(activePlugins.slice(i, i + scannerConfig.maxParallelJobs));
    }

    for (let b = 0; b < batches.length; b++) {
      const currentBatch = batches[b];
      logWithCallback(`Processing scan batch ${b + 1}/${batches.length}...`);
      
      const scanPromises = currentBatch.map(async (plugin) => {
        const pluginStartTime = Date.now();
        const localLogs: string[] = [];
        const localLogger = (m: string) => {
          localLogs.push(m);
          logWithCallback(m);
        };

        try {
          // Execution
          localLogger(`[${plugin.name}] Executing active scanner routines...`);
          const rawResults = await plugin.execute(targetUrl, targetType, localLogger);
          
          // Parsing
          localLogger(`[${plugin.name}] Parsing raw security payload results...`);
          const parsed = await plugin.parseResults(rawResults);
          
          // Normalization
          localLogger(`[${plugin.name}] Normalizing ${parsed.length} raw findings into CVE/OWASP-compliant data schema...`);
          const normalized = await plugin.normalize(parsed);
          
          const duration = Date.now() - pluginStartTime;
          localLogger(`[${plugin.name}] Scan completed successfully in ${(duration / 1000).toFixed(2)}s. Discovered ${normalized.length} compliant findings.`);
          
          return {
            pluginId: plugin.id,
            pluginName: plugin.name,
            success: true,
            vulnerabilities: normalized,
            durationMs: duration
          } as ScanResult;
        } catch (err: any) {
          const duration = Date.now() - pluginStartTime;
          localLogger(`❌ [${plugin.name}] Execution error: ${err.message}`);
          return {
            pluginId: plugin.id,
            pluginName: plugin.name,
            success: false,
            vulnerabilities: [],
            error: err.message,
            durationMs: duration
          } as ScanResult;
        } finally {
          try {
            await plugin.cleanup();
          } catch (cleanErr: any) {
            localLogger(`[${plugin.name}] Cleanup failed: ${cleanErr.message}`);
          }
        }
      });

      const batchResults = await Promise.all(scanPromises);
      for (const res of batchResults) {
        pluginSummaries.push(res);
        consolidatedVulns = consolidatedVulns.concat(res.vulnerabilities);
      }
    }

    const totalDuration = Date.now() - startTime;
    logWithCallback(`🏁 Enterprise Scanner pipeline finalized in ${(totalDuration / 1000).toFixed(2)}s. Total normalized findings: ${consolidatedVulns.length}`);

    return {
      target: targetUrl,
      success: true,
      timestamp: new Date().toISOString(),
      totalDurationMs: totalDuration,
      vulnerabilities: consolidatedVulns,
      logs: this.logs,
      pluginSummaries
    };
  }
}

export const scannerManager = new ScannerManager();
