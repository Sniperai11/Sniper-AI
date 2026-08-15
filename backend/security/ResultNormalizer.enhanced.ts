import { Logger } from '../utils/logger';
import { NormalizedVuln } from '../interfaces/IScannerPlugin';

/**
 * Enhanced Result Normalizer
 * ✅ Validates vulnerabilities before normalization
 * ❌ Rejects findings without evidence (no false positives)
 * 🔍 Enriches with compliance mappings
 */
export class ResultNormalizerEnhanced {
  /**
   * Normalize and validate scanner findings
   * Only accepts findings with actual evidence
   */
  static normalizeAndValidate(findings: any[]): NormalizedVuln[] {
    if (!findings || findings.length === 0) {
      return [];
    }

    const validated: NormalizedVuln[] = [];

    for (const finding of findings) {
      // ✅ Step 1: Validate that finding has evidence
      if (!this.hasValidEvidence(finding)) {
        Logger.warn(`[ResultNormalizer] Rejected finding without evidence: ${finding.title || 'Unknown'}`);
        continue;
      }

      // ✅ Step 2: Normalize the finding
      const normalized = this.normalize(finding);

      // ✅ Step 3: Add compliance mappings
      normalized.complianceMapping = this.mapToCompliance(normalized.type, normalized.severity);

      // ✅ Step 4: Add metadata
      normalized.validated = true;
      normalized.validatedAt = new Date().toISOString();

      validated.push(normalized);
    }

    Logger.info(`[ResultNormalizer] Validated ${validated.length}/${findings.length} findings`);
    return validated;
  }

  /**
   * Check if finding has valid evidence
   */
  private static hasValidEvidence(finding: any): boolean {
    const hasEvidenceField = !!(finding.evidence || finding.curl_command || finding.response || finding.request);
    const hasLocation = !!finding.location;
    const hasTitle = !!finding.title;
    const hasSeverity = !!finding.severity;

    if (!hasEvidenceField) {
      Logger.debug(`[ResultNormalizer] No evidence field found`);
      return false;
    }

    if (!hasLocation || !hasTitle || !hasSeverity) {
      Logger.debug(`[ResultNormalizer] Missing required fields: location=${hasLocation}, title=${hasTitle}, severity=${hasSeverity}`);
      return false;
    }

    return true;
  }

  /**
   * Normalize finding to standard format
   */
  private static normalize(finding: any): NormalizedVuln {
    return {
      title: finding.title || finding.name || 'Unknown Vulnerability',
      type: finding.type || 'Security Issue',
      severity: this.normalizeSeverity(finding.severity),
      cvssScore: this.normalizeCvss(finding.cvssScore, finding.severity),
      location: finding.location || finding.url || 'Unknown',
      description: finding.description || finding.description_text || '',
      impact: finding.impact || finding.business_impact || '',
      remediation: finding.remediation || finding.solution || '',
      evidence: finding.evidence || finding.curl_command || finding.response || finding.request || '',
      cwe: finding.cwe || finding.cwes?.join(', ') || '',
      owasp: finding.owasp || '',
      source: finding.source || finding.scanner || 'Unknown',
      scannerTool: finding.scannerTool || finding.tool || 'Unknown',
      timestamp: finding.timestamp || new Date().toISOString(),
      discoveredAt: finding.discoveredAt || new Date().toISOString(),
      verified: finding.verified || false,
      falsePositive: finding.falsePositive || false,
      priority: this.calculatePriority(finding.severity, finding.cvssScore)
    };
  }

  /**
   * Normalize severity to standard levels
   */
  private static normalizeSeverity(severity: any): 'Critical' | 'High' | 'Medium' | 'Low' {
    if (!severity) return 'Medium';

    const sev = String(severity).toLowerCase();

    if (sev.includes('crit')) return 'Critical';
    if (sev.includes('high')) return 'High';
    if (sev.includes('med')) return 'Medium';
    if (sev.includes('low')) return 'Low';

    return 'Medium';
  }

  /**
   * Normalize and validate CVSS score
   */
  private static normalizeCvss(cvss: any, severity: any): number {
    if (cvss !== undefined && cvss !== null) {
      const score = Number(cvss);
      if (!isNaN(score) && score >= 0 && score <= 10) {
        return score;
      }
    }

    // Fallback to severity-based estimation
    const sev = this.normalizeSeverity(severity);
    const estimateMap: Record<string, number> = {
      'Critical': 9.0,
      'High': 7.5,
      'Medium': 5.5,
      'Low': 2.5
    };

    return estimateMap[sev] || 5.0;
  }

  /**
   * Calculate priority based on severity and CVSS
   */
  private static calculatePriority(severity: any, cvss: any): number {
    const sev = this.normalizeSeverity(severity);
    const score = this.normalizeCvss(cvss, severity);

    // Priority: 1 (highest) to 5 (lowest)
    const severityPriority: Record<string, number> = {
      'Critical': 1,
      'High': 2,
      'Medium': 3,
      'Low': 4
    };

    let priority = severityPriority[sev] || 3;

    // Adjust by CVSS score
    if (score >= 9.0) priority = 1;
    else if (score >= 7.0) priority = Math.min(2, priority);
    else if (score >= 4.0) priority = Math.min(3, priority);

    return priority;
  }

  /**
   * Map vulnerability type to compliance standards
   */
  private static mapToCompliance(type: string, severity: string): any {
    const typeMap: Record<string, any> = {
      'SQL Injection': {
        owasp: 'A03:2021-Injection',
        iso27001: 'A.14.2.1 Secure development policy',
        pciDss: '6.5.1',
        cwe: 'CWE-89'
      },
      'Cross-Site Scripting': {
        owasp: 'A03:2021-Injection',
        iso27001: 'A.12.6 Management of technical vulnerabilities',
        pciDss: '6.5.7',
        cwe: 'CWE-79'
      },
      'Broken Authentication': {
        owasp: 'A07:2021-Identification and Authentication Failures',
        iso27001: 'A.9.2 User access management',
        pciDss: '6.5.10',
        cwe: 'CWE-287'
      },
      'Sensitive Data Exposure': {
        owasp: 'A02:2021-Cryptographic Failures',
        iso27001: 'A.10.1 Cryptography',
        pciDss: '3.2',
        cwe: 'CWE-200'
      },
      'Security Misconfiguration': {
        owasp: 'A05:2021-Security Misconfiguration',
        iso27001: 'A.12.1 Configuration management',
        pciDss: '2.1',
        cwe: 'CWE-16'
      },
      'Broken Access Control': {
        owasp: 'A01:2021-Broken Access Control',
        iso27001: 'A.9.4 Access control',
        pciDss: '7.1',
        cwe: 'CWE-284'
      },
      'Insecure Deserialization': {
        owasp: 'A08:2021-Software and Data Integrity Failures',
        iso27001: 'A.14.2 Software development',
        pciDss: '6.5.1',
        cwe: 'CWE-502'
      },
      'Using Components with Known Vulnerabilities': {
        owasp: 'A06:2021-Vulnerable and Outdated Components',
        iso27001: 'A.12.6 Management of technical vulnerabilities',
        pciDss: '6.2',
        cwe: 'CWE-1035'
      },
      'Insufficient Logging and Monitoring': {
        owasp: 'A09:2021-Security Logging and Monitoring Failures',
        iso27001: 'A.12.4 Logging',
        pciDss: '10.1',
        cwe: 'CWE-778'
      }
    };

    // Default compliance mapping
    const defaultMapping = {
      owasp: 'A05:2021-Security Misconfiguration',
      iso27001: 'A.12.6.1 Management of technical vulnerabilities',
      pciDss: '6.5',
      cwe: ''
    };

    return typeMap[type] || defaultMapping;
  }

  /**
   * Batch normalize multiple findings
   */
  static normalizeBatch(findings: any[][]): NormalizedVuln[] {
    const all: any[] = [];

    for (const batch of findings) {
      all.push(...batch);
    }

    return this.normalizeAndValidate(all);
  }

  /**
   * Get statistics on normalized findings
   */
  static getStatistics(findings: NormalizedVuln[]): any {
    const stats = {
      total: findings.length,
      bySeverity: {
        Critical: 0,
        High: 0,
        Medium: 0,
        Low: 0
      },
      byType: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      averageCvss: 0,
      verified: 0,
      falsePositives: 0
    };

    let totalCvss = 0;

    for (const finding of findings) {
      stats.bySeverity[finding.severity]++;
      stats.byType[finding.type] = (stats.byType[finding.type] || 0) + 1;
      stats.bySource[finding.source] = (stats.bySource[finding.source] || 0) + 1;

      totalCvss += finding.cvssScore;

      if (finding.verified) stats.verified++;
      if (finding.falsePositive) stats.falsePositives++;
    }

    if (findings.length > 0) {
      stats.averageCvss = Number((totalCvss / findings.length).toFixed(2));
    }

    return stats;
  }
}

export const resultNormalizerEnhanced = ResultNormalizerEnhanced;
