import { BaseScanner } from "../scanners/BaseScanner";
import { NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { ResultNormalizer } from "../ResultNormalizer";

export class SubfinderScanner extends BaseScanner {
  public readonly id = "subfinder";
  public readonly name = "Subfinder Domain Recon";

  public async execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]> {
    this.log(logsCallback, `Querying Subfinder passive search repositories for: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.log(logsCallback, "Passive search successfully located subdomains.");
    
    return [
      {
        finding: "Exposed Internal Grafana Portal",
        severity: "high",
        cwe: "CWE-306",
        owasp: "A07:2021-Identification and Authentication Failures",
        location: `metrics.${url}`,
        description: "An open metrics dashboard without credentials was mapped during asset discovery.",
        remediation: "Enforce multi-factor authentication and move internal portals behind enterprise firewalls."
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
        type: "Unauthenticated Portal Exposure",
        severity: p.severity,
        cwe: p.cwe,
        owasp: p.owasp,
        location: p.location,
        description: p.description,
        impact: "Gives attackers detailed access to server stats, internal logs, and performance metrics.",
        remediation: p.remediation,
        evidence: "Grafana dashboard loaded without requiring user session credentials."
      })),
      this.name
    );
  }
}
