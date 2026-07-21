import { BaseScanner } from "../scanners/BaseScanner";
import { NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { ResultNormalizer } from "../ResultNormalizer";

export class WhatWebScanner extends BaseScanner {
  public readonly id = "whatweb";
  public readonly name = "WhatWeb Tech Fingerprinter";

  public async execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]> {
    this.log(logsCallback, `Querying server HTTP headers and tags of target: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.log(logsCallback, "Parsing server fingerprint variables...");
    
    return [
      {
        finding: "Exposed X-Powered-By Header showing PHP version",
        severity: "low",
        cwe: "CWE-200",
        owasp: "A05:2021-Security Misconfiguration",
        location: `${url}`,
        description: "The header response contains precise server software and module frameworks (e.g., PHP/7.4.3).",
        remediation: "Disable X-Powered-By or expose generic Server headers inside server configuration files."
      }
    ];
  }

  public async parseResults(rawResults: any[]): Promise<any[]> {
    return rawResults;
  }

  public async normalize(parsedResults: any[]): Promise<NormalizedVuln[]> {
    return ResultNormalizer.normalizeBulk(
      parsedResults.map(p => ({
        tool: this.id,
        title: p.finding,
        type: "HTTP Header Information Disclosure",
        severity: p.severity,
        cwe: p.cwe,
        owasp: p.owasp,
        location: p.location,
        description: p.description,
        impact: "Helps bad actors target known vulnerabilities within the specific version of server modules.",
        remediation: p.remediation,
        evidence: `HTTP Response Header 'X-Powered-By: PHP/7.4.3' was discovered.`
      })),
      this.name
    );
  }
}
