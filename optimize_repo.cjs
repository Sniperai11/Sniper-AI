const fs = require('fs');
let code = fs.readFileSync('backend/repositories/ScanRepository.ts', 'utf8');

code = code.replace(
  /for \(const v of vulns\) \{[\s\S]*?await db\.insert\(schema\.vulnerabilities\)[\s\S]*?\.onConflictDoNothing\(\);\s*\}/,
  `if (vulns.length === 0) return;
    const valuesToInsert = vulns.map(v => ({
      id: v.id,
      targetId: v.targetId || null,
      targetName: v.targetName,
      title: v.title,
      type: v.type,
      severity: v.severity,
      cvssScore: v.cvssScore,
      location: v.location,
      description: v.description,
      impact: v.impact,
      remediation: v.remediation,
      isFalsePositive: v.isFalsePositive || false,
      complianceMapping: v.complianceMapping,
    }));
    await db.insert(schema.vulnerabilities).values(valuesToInsert).onConflictDoNothing();`
);

fs.writeFileSync('backend/repositories/ScanRepository.ts', code);
console.log("Optimized ScanRepository");
