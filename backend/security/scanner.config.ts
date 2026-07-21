export interface ScannerConfig {
  timeoutMs: number;
  maxRetries: number;
  maxParallelJobs: number;
  maxTargetsPerScan: number;
  rateLimitMs: number;
  userAgent: string;
  customHeaders: Record<string, string>;
  dnsSettings: {
    useSystemDns: boolean;
    customServers: string[];
  };
}

export const scannerConfig: ScannerConfig = {
  timeoutMs: 300000, // 5 minutes
  maxRetries: 3,
  maxParallelJobs: 4,
  maxTargetsPerScan: 10,
  rateLimitMs: 1000,
  userAgent: "SniperAI-Security-Scanner/1.7 (Enterprise Compliance Tool; Security Audit)",
  customHeaders: {
    "X-Sniper-Scan-Auth": "Authorized-Audit-In-Progress-Compliance",
    "Accept": "application/json, text/html, */*"
  },
  dnsSettings: {
    useSystemDns: true,
    customServers: ["8.8.8.8", "1.1.1.1"]
  }
};
