import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseScanner } from '../scanners/BaseScanner';
import { NormalizedVuln } from '../../interfaces/IScannerPlugin';
import { Logger } from '../../utils/logger';

const execAsync = promisify(exec);

export interface BurpIssue {
  issue_type: string;
  name: string;
  confidence: string;
  severity: string;
  url: string;
  description: string;
  remediation: string;
  evidence: string;
  request: string;
  response: string;
}

/**
 * Burp Suite Scanner Plugin
 * Integrates with Burp Suite Community/Pro via REST API
 * Provides advanced web application security testing
 */
export class BurpSuiteScannerPlugin extends BaseScanner {
  private burpApiUrl: string;
  private burpApiKey?: string;
  private timeout: number = 60000; // 60 seconds

  constructor(burpUrl: string = 'http://localhost:8080', apiKey?: string) {
    super();
    this.burpApiUrl = burpUrl;
    this.burpApiKey = apiKey;
  }

  /**
   * ✅ Scan target URL using Burp Suite API
   */
  async scan(target: string): Promise<NormalizedVuln[]> {
    try {
      Logger.info(`[Burp Suite] Starting scan on ${target}`);

      // Step 1: Check if Burp is running
      const isRunning = await this.checkBurpStatus();
      if (!isRunning) {
        Logger.warn('[Burp Suite] Burp Suite is not running. Skipping scan.');
        return [];
      }

      // Step 2: Start active scan
      const scanId = await this.startActiveScan(target);
      if (!scanId) return [];

      // Step 3: Wait for scan to complete
      await this.waitForScanCompletion(scanId);

      // Step 4: Retrieve results
      const issues = await this.getIssues(scanId);

      // Step 5: Normalize results
      return this.normalizeIssues(issues, target);
    } catch (err: any) {
      Logger.error('[Burp Suite] Scan failed:', err);
      return [];
    }
  }

  /**
   * Check if Burp Suite is running and accessible
   */
  private async checkBurpStatus(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.burpApiUrl}/v2/burp/version`, {
        signal: controller.signal,
        headers: this.getHeaders()
      });

      clearTimeout(timeout);
      return response.ok;
    } catch (err) {
      return false;
    }
  }

  /**
   * Start an active scan on target URL
   */
  private async startActiveScan(target: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.burpApiUrl}/v2/burp/scanner/scans`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          url: target,
          crawl_scope: [
            {
              url: target
            }
          ],
          scan_configurations: [
            {
              name: 'Audit everything - thorough and time-consuming',
              id: 2
            }
          ]
        })
      });

      if (!response.ok) {
        Logger.error(`[Burp Suite] Failed to start scan: ${response.statusText}`);
        return null;
      }

      const data = await response.json() as any;
      return data.id;
    } catch (err: any) {
      Logger.error('[Burp Suite] Error starting scan:', err);
      return null;
    }
  }

  /**
   * Wait for Burp scan to complete
   */
  private async waitForScanCompletion(
    scanId: string,
    maxWaitTime: number = 300000 // 5 minutes
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await fetch(`${this.burpApiUrl}/v2/burp/scanner/scans/${scanId}`, {
          headers: this.getHeaders()
        });

        const data = await response.json() as any;

        if (data.scan_status === 'succeeded') {
          Logger.info(`[Burp Suite] Scan ${scanId} completed successfully`);
          return;
        }

        // Wait 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (err) {
        Logger.error('[Burp Suite] Error checking scan status:', err);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    Logger.warn(`[Burp Suite] Scan ${scanId} timeout after ${maxWaitTime}ms`);
  }

  /**
   * Retrieve issues found by the scan
   */
  private async getIssues(scanId: string): Promise<BurpIssue[]> {
    try {
      const response = await fetch(
        `${this.burpApiUrl}/v2/burp/scanner/scans/${scanId}/issues`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        Logger.error('[Burp Suite] Failed to retrieve issues');
        return [];
      }

      const data = await response.json() as any;
      return data.issues || [];
    } catch (err: any) {
      Logger.error('[Burp Suite] Error retrieving issues:', err);
      return [];
    }
  }

  /**
   * Normalize Burp issues to standard vulnerability format
   */
  private normalizeIssues(issues: BurpIssue[], target: string): NormalizedVuln[] {
    return issues
      .filter(issue => issue.severity !== 'Info') // Skip Info-level findings
      .map(issue => ({
        title: issue.name,
        type: this.mapIssueType(issue.issue_type),
        severity: this.mapBurpSeverity(issue.severity),
        cvssScore: this.estimateCvss(issue.severity),
        location: issue.url,
        description: `[Burp Suite] ${issue.description}`,
        impact: `Severity: ${issue.severity}\nConfidence: ${issue.confidence}`,
        remediation: issue.remediation || 'See Burp Suite report for detailed remediation steps',
        evidence: issue.request + '\n---\n' + issue.response,
        cwe: this.extractCWE(issue.description),
        owasp: this.mapToOWASP(issue.issue_type),
        source: 'BurpSuite',
        scannerTool: 'Burp Suite Community/Pro',
        timestamp: new Date().toISOString()
      }));
  }

  /**
   * Map Burp issue type to standard vulnerability type
   */
  private mapIssueType(issueType: string): string {
    const typeMap: Record<string, string> = {
      'SQL injection': 'SQL Injection',
      'Cross-site scripting': 'Cross-Site Scripting (XSS)',
      'Broken authentication': 'Broken Authentication',
      'Sensitive data exposure': 'Sensitive Data Exposure',
      'XML External Entities (XXE)': 'XXE Injection',
      'Broken access control': 'Broken Access Control',
      'Security misconfiguration': 'Security Misconfiguration',
      'Insecure deserialization': 'Insecure Deserialization',
      'Using components with known vulnerabilities': 'Using Components with Known Vulnerabilities',
      'Insufficient logging and monitoring': 'Insufficient Logging & Monitoring'
    };

    return typeMap[issueType] || issueType;
  }

  /**
   * Map Burp severity to standard severity levels
   */
  private mapBurpSeverity(burpSeverity: string): 'Critical' | 'High' | 'Medium' | 'Low' {
    switch (burpSeverity.toLowerCase()) {
      case 'high':
        return 'Critical';
      case 'medium':
        return 'High';
      case 'low':
        return 'Medium';
      case 'info':
        return 'Low';
      default:
        return 'Medium';
    }
  }

  /**
   * Estimate CVSS score from Burp severity
   */
  private estimateCvss(severity: string): number {
    const cvssMap: Record<string, number> = {
      'high': 9.0,
      'medium': 6.5,
      'low': 3.5,
      'info': 0.0
    };
    return cvssMap[severity.toLowerCase()] || 5.0;
  }

  /**
   * Extract CWE from issue description
   */
  private extractCWE(description: string): string {
    const cweMatch = description.match(/CWE-\d+/);
    return cweMatch ? cweMatch[0] : '';
  }

  /**
   * Map issue type to OWASP category
   */
  private mapToOWASP(issueType: string): string {
    const owaspMap: Record<string, string> = {
      'SQL injection': 'A03:2021-Injection',
      'Cross-site scripting': 'A03:2021-Injection',
      'Broken authentication': 'A07:2021-Identification and Authentication Failures',
      'Sensitive data exposure': 'A02:2021-Cryptographic Failures',
      'Security misconfiguration': 'A05:2021-Security Misconfiguration',
      'Broken access control': 'A01:2021-Broken Access Control'
    };
    return owaspMap[issueType] || 'A05:2021-Security Misconfiguration';
  }

  /**
   * Get request headers for Burp API
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.burpApiKey) {
      headers['Authorization'] = `Bearer ${this.burpApiKey}`;
    }

    return headers;
  }
}

export const burpSuiteScanner = new BurpSuiteScannerPlugin();
