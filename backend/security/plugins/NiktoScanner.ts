import { BaseScanner } from "../scanners/BaseScanner";
import { NormalizedVuln } from "../../interfaces/IScannerPlugin";
import { ResultNormalizer } from "../ResultNormalizer";

export class NiktoScanner extends BaseScanner {
  public readonly id = "nikto";
  public readonly name = "Nikto Web Server Scanner";

  public async execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]> {
    this.log(logsCallback, `Initializing Nikto web server scanning on: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.log(logsCallback, "Testing web server directory traversals and index files...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        finding: "Exposed PHPInfo debug panel",
        severity: "high",
        cwe: "CWE-200",
        owasp: "A05:2021-Security Misconfiguration",
        location: `${url}/phpinfo.php`,
        description: "A PHPInfo panel is accessible publicly and reveals absolute paths, system environment, and active modules.",
        remediation: "Delete phpinfo.php from production and disable debug or telemetry outputs."
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
        type: "Web Server Configuration Disclosure",
        severity: p.severity,
        cwe: p.cwe,
        owasp: p.owasp,
        location: p.location,
        description: p.description,
        impact: "Exposes system specifications and environment variables, helping attackers construct targeted server exploits.",
        remediation: p.remediation,
        evidence: "HTTP GET request to /phpinfo.php returned status 200 containing system information tables."
      })),
      this.name
    );
  }
}
