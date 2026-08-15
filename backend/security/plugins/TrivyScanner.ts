import { exec } from 'child_process';
import { promisify } from 'util';
import { BaseScanner } from '../scanners/BaseScanner';
import { NormalizedVuln } from '../../interfaces/IScannerPlugin';
import { Logger } from '../../utils/logger';

const execAsync = promisify(exec);

export interface TrivyVulnerability {
  VulnerabilityID: string;
  Title: string;
  Description: string;
  Severity: string;
  InstalledVersion: string;
  FixedVersion: string;
  PkgName: string;
  PrimaryURL: string;
  CweIDs: string[];
  References: string[];
  LastModifiedDate: string;
}

export interface TrivyResult {
  Target: string;
  Type: string;
  Vulnerabilities: TrivyVulnerability[];
}

/**
 * Trivy Security Scanner Plugin
 * Scans container images, Git repositories, and file systems for vulnerabilities
 * Supports CVE detection, dependency scanning, misconfigurations
 */
export class TrivyScannerPlugin extends BaseScanner {
  private trivyBinary: string = 'trivy';
  private timeout: number = 120000; // 2 minutes

  constructor(trivyPath?: string) {
    super();
    if (trivyPath) {
      this.trivyBinary = trivyPath;
    }
  }

  /**
   * ✅ Scan a Docker container image
   */
  async scanImage(imageName: string, severity: string[] = ['CRITICAL', 'HIGH']): Promise<NormalizedVuln[]> {
    try {
      Logger.info(`[Trivy] Scanning container image: ${imageName}`);

      const cmd = `${this.trivyBinary} image \
        --severity ${severity.join(',')} \
        --format json \
        --exit-code 0 \
        ${imageName}`;

      const results = await this.executeCommand(cmd);
      const parsed = JSON.parse(results);

      return this.normalizeResults(parsed.Results || []);
    } catch (err: any) {
      Logger.error('[Trivy] Image scan failed:', err);
      return [];
    }
  }

  /**
   * ✅ Scan filesystem for vulnerabilities and misconfigurations
   */
  async scanFilesystem(path: string, severity: string[] = ['CRITICAL', 'HIGH']): Promise<NormalizedVuln[]> {
    try {
      Logger.info(`[Trivy] Scanning filesystem: ${path}`);

      const cmd = `${this.trivyBinary} fs \
        --severity ${severity.join(',')} \
        --format json \
        --exit-code 0 \
        ${path}`;

      const results = await this.executeCommand(cmd);
      const parsed = JSON.parse(results);

      return this.normalizeResults(parsed.Results || []);
    } catch (err: any) {
      Logger.error('[Trivy] Filesystem scan failed:', err);
      return [];
    }
  }

  /**
   * ✅ Scan Git repository for vulnerabilities
   */
  async scanRepository(repoPath: string, severity: string[] = ['CRITICAL', 'HIGH']): Promise<NormalizedVuln[]> {
    try {
      Logger.info(`[Trivy] Scanning Git repository: ${repoPath}`);

      const cmd = `${this.trivyBinary} repo \
        --severity ${severity.join(',')} \
        --format json \
        --exit-code 0 \
        ${repoPath}`;

      const results = await this.executeCommand(cmd);
      const parsed = JSON.parse(results);

      return this.normalizeResults(parsed.Results || []);
    } catch (err: any) {
      Logger.error('[Trivy] Repository scan failed:', err);
      return [];
    }
  }

  /**
   * ✅ Scan Kubernetes cluster for misconfigurations and vulnerabilities
   */
  async scanKubernetes(namespace?: string): Promise<NormalizedVuln[]> {
    try {
      Logger.info(`[Trivy] Scanning Kubernetes cluster`);

      let cmd = `${this.trivyBinary} kubernetes cluster --format json --exit-code 0`;

      if (namespace) {
        cmd += ` --namespace ${namespace}`;
      }

      const results = await this.executeCommand(cmd);
      const parsed = JSON.parse(results);

      return this.normalizeResults(parsed.Results || []);
    } catch (err: any) {
      Logger.error('[Trivy] Kubernetes scan failed:', err);
      return [];
    }
  }

  /**
   * ✅ Overridden scan method - defaults to filesystem scan
   */
  async scan(target: string): Promise<NormalizedVuln[]> {
    // Try to detect if it's an image, repo, or filesystem path
    if (target.includes(':') && !target.includes('/')) {
      // Looks like a Docker image tag
      return this.scanImage(target);
    } else if (target.startsWith('http') && target.includes('github')) {
      // Looks like a Git repository
      return this.scanRepository(target);
    } else {
      // Treat as filesystem path
      return this.scanFilesystem(target);
    }
  }

  /**
   * Normalize Trivy results to standard vulnerability format
   */
  private normalizeResults(results: TrivyResult[]): NormalizedVuln[] {
    const normalized: NormalizedVuln[] = [];

    for (const result of results) {
      if (!result.Vulnerabilities || result.Vulnerabilities.length === 0) {
        continue;
      }

      for (const vuln of result.Vulnerabilities) {
        normalized.push({
          title: `${vuln.VulnerabilityID}: ${vuln.Title}`,
          type: 'Dependency Vulnerability / Misconfiguration',
          severity: this.mapTrivySeverity(vuln.Severity),
          cvssScore: this.estimateCvssFromSeverity(vuln.Severity),
          location: `${result.Target}/${vuln.PkgName}:${vuln.InstalledVersion}`,
          description: vuln.Description || `CVE in package ${vuln.PkgName}`,
          impact: `Affected Package: ${vuln.PkgName}\nInstalled Version: ${vuln.InstalledVersion}`,
          remediation: vuln.FixedVersion
            ? `Update ${vuln.PkgName} to version ${vuln.FixedVersion} or later`
            : 'No fix available yet. Monitor for updates.',
          evidence: [
            `CVE ID: ${vuln.VulnerabilityID}`,
            `Primary URL: ${vuln.PrimaryURL}`,
            `Last Modified: ${vuln.LastModifiedDate}`,
            ...vuln.References
          ].join('\n'),
          cwe: vuln.CweIDs?.join(', ') || '',
          owasp: 'A06:2021-Vulnerable and Outdated Components',
          source: 'Trivy',
          scannerTool: 'Trivy',
          timestamp: new Date().toISOString()
        });
      }
    }

    return normalized;
  }

  /**
   * Map Trivy severity to standard severity levels
   */
  private mapTrivySeverity(trivySeverity: string): 'Critical' | 'High' | 'Medium' | 'Low' {
    switch (trivySeverity.toUpperCase()) {
      case 'CRITICAL':
        return 'Critical';
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
      case 'UNKNOWN':
      default:
        return 'Low';
    }
  }

  /**
   * Estimate CVSS score from Trivy severity
   */
  private estimateCvssFromSeverity(severity: string): number {
    const cvssMap: Record<string, number> = {
      'CRITICAL': 9.0,
      'HIGH': 7.5,
      'MEDIUM': 5.5,
      'LOW': 2.5,
      'UNKNOWN': 0.0
    };
    return cvssMap[severity.toUpperCase()] || 5.0;
  }

  /**
   * Execute Trivy command
   */
  private async executeCommand(cmd: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(cmd, {
        timeout: this.timeout,
        maxBuffer: 1024 * 1024 * 50 // 50MB buffer
      });

      if (stderr) {
        Logger.warn('[Trivy] Command stderr:', stderr);
      }

      return stdout;
    } catch (err: any) {
      if (err.killed) {
        throw new Error(`[Trivy] Command timeout after ${this.timeout}ms`);
      }
      throw err;
    }
  }
}

export const trivyScanner = new TrivyScannerPlugin();
