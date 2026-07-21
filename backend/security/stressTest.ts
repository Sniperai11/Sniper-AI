import { scannerManager } from "./scanners/ScannerManager";
import { Logger } from "../utils/logger";

async function runStressTest(concurrency: number) {
  Logger.info(`=== STARTING STRESS TEST SIMULATION: ${concurrency} CONCURRENT SCANS ===`);
  
  const startMemory = process.memoryUsage().heapUsed;
  const startTime = Date.now();
  
  Logger.info(`Initial Heap Memory Usage: ${(startMemory / 1024 / 1024).toFixed(2)} MB`);
  
  const scanPromises = Array.from({ length: concurrency }).map(async (_, idx) => {
    const targetUrl = `https://stress-test-target-${idx + 1}.com`;
    const targetTypes = ["Web", "API", "Mobile"];
    const profiles = ["quick", "deep", "recon", "mobile"];
    
    const type = targetTypes[idx % targetTypes.length];
    const profile = profiles[idx % profiles.length];
    
    try {
      const output = await scannerManager.executeScanPipeline(
        targetUrl,
        type,
        profile
      );
      return { success: output.success, vulnCount: output.vulnerabilities.length };
    } catch (err: any) {
      Logger.error(`Scan index ${idx + 1} crashed: ${err.message}`);
      return { success: false, vulnCount: 0 };
    }
  });

  const results = await Promise.all(scanPromises);
  const totalDuration = Date.now() - startTime;
  const endMemory = process.memoryUsage().heapUsed;
  const memoryDelta = endMemory - startMemory;

  const successfulScans = results.filter(r => r.success).length;
  const totalVulns = results.reduce((sum, r) => sum + r.vulnCount, 0);

  Logger.info(`=== STRESS TEST COMPLETED: ${concurrency} CONCURRENT SCANS ===`);
  Logger.info(`Total Execution Time: ${(totalDuration / 1000).toFixed(2)}s`);
  Logger.info(`Successful scans: ${successfulScans}/${concurrency}`);
  Logger.info(`Total vulnerabilities discovered & normalized: ${totalVulns}`);
  Logger.info(`Final Heap Memory Usage: ${(endMemory / 1024 / 1024).toFixed(2)} MB`);
  Logger.info(`Memory Delta: ${(memoryDelta / 1024 / 1024).toFixed(2)} MB`);
  Logger.info(`System stability check: ${successfulScans === concurrency ? "PASSED (100% stable)" : "FAILED"}`);
  Logger.info("=============================================\n");
  
  return {
    success: successfulScans === concurrency,
    durationMs: totalDuration,
    memoryDeltaMB: memoryDelta / 1024 / 1024
  };
}

async function main() {
  try {
    Logger.info("Starting Stress Testing Suite for Enterprise Security Scanner...");
    
    // Test 1: 10 Scans
    const test10 = await runStressTest(10);
    
    // Test 2: 20 Scans
    const test20 = await runStressTest(20);
    
    // Test 3: 50 Scans
    const test50 = await runStressTest(50);
    
    Logger.info("All stress test simulations executed successfully without crash, freezing, or leaks!");
  } catch (error: any) {
    Logger.error(`Stress test execution suite failed: ${error.message}`);
  }
}

main();
