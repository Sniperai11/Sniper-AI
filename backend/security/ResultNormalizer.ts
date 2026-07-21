import { NormalizedVuln } from "../interfaces/IScannerPlugin";

export class ResultNormalizer {
  /**
   * Safe normalization utility to clean and unify any arbitrary vulnerabilities.
   */
  public static normalizeGeneric(rawVuln: any, fallbackToolName: string): NormalizedVuln {
    const severityMap: Record<string, "Critical" | "High" | "Medium" | "Low"> = {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      info: "Low",
    };

    let severity: "Critical" | "High" | "Medium" | "Low" = "Low";
    const rawSeverity = String(rawVuln.severity || rawVuln.risk || "Low").toLowerCase();
    
    if (rawSeverity.includes("critical") || rawSeverity === "p1") {
      severity = "Critical";
    } else if (rawSeverity.includes("high") || rawSeverity === "p2") {
      severity = "High";
    } else if (rawSeverity.includes("medium") || rawSeverity === "p3" || rawSeverity.includes("moderate")) {
      severity = "Medium";
    } else if (rawSeverity.includes("low") || rawSeverity === "p4" || rawSeverity.includes("info")) {
      severity = "Low";
    }

    const cvssScore = Number(rawVuln.cvssScore || rawVuln.cvss) || (
      severity === "Critical" ? 9.5 :
      severity === "High" ? 8.0 :
      severity === "Medium" ? 5.5 : 2.5
    );

    return {
      tool: rawVuln.tool || fallbackToolName,
      title: rawVuln.title || rawVuln.name || "ثغرة أمنية غير مصنفة",
      type: rawVuln.type || rawVuln.category || "General Security issue",
      severity,
      cvssScore,
      cwe: rawVuln.cwe || undefined,
      owasp: rawVuln.owasp || undefined,
      location: rawVuln.location || rawVuln.url || rawVuln.target || "Unknown Target Path",
      description: rawVuln.description || rawVuln.desc || "لم يتم توفير وصف لهذه الثغرة من أداة الفحص.",
      impact: rawVuln.impact || "قد يؤثر هذا على سرية أو سلامة أو توافر المورد المستهدف.",
      remediation: rawVuln.remediation || rawVuln.fix || "الرجاء مراجعة أفضل الممارسات وتحديث الأنظمة المتأثرة.",
      evidence: rawVuln.evidence || rawVuln.payload || undefined,
      references: Array.isArray(rawVuln.references) ? rawVuln.references : (rawVuln.references ? [rawVuln.references] : [])
    };
  }

  /**
   * Bulk normalize a list of raw items using custom rules.
   */
  public static normalizeBulk(rawVulns: any[], fallbackToolName: string): NormalizedVuln[] {
    return rawVulns.map(v => this.normalizeGeneric(v, fallbackToolName));
  }
}
