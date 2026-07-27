import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

// In-Memory Database Store for seamless development & fallback execution
const inMemoryStore: Record<string, any[]> = {
  teamMembers: [
    { id: "tm-1", companyId: "comp-1", name: "إبراهيم العتيبي", email: "elhammoh2795@gmail.com", role: "Admin", joinedAt: new Date("2026-01-10T12:00:00Z") },
    { id: "tm-2", companyId: "comp-1", name: "طارق الشمري", email: "hunter.tareq@security.sa", role: "Security Analyst", joinedAt: new Date("2026-01-12T12:00:00Z") },
    { id: "tm-3", companyId: "comp-1", name: "سارة خالد", email: "sara@company.sa", role: "Security Analyst", joinedAt: new Date("2026-01-15T12:00:00Z") },
  ],
  companies: [
    { id: "comp-1", name: "شركة قناص الأمن السيبراني", ownerEmail: "elhammoh2795@gmail.com", joinedAt: new Date("2026-01-10T12:00:00Z") }
  ],
  users: [
    { id: 1, uid: "usr-001", email: "elhammoh2795@gmail.com", name: "إبراهيم العتيبي", role: "Admin", createdAt: new Date("2026-01-10T12:00:00Z") },
    { id: 2, uid: "usr-002", email: "hunter.tareq@security.sa", name: "طارق الشمري", role: "Security Analyst", createdAt: new Date("2026-01-12T12:00:00Z") }
  ],
  subscription: [
    {
      id: 1,
      companyId: "comp-1",
      plan: "Enterprise",
      status: "active",
      currentPeriodEnd: new Date("2026-12-31"),
      cost: 599,
      limits: {
        maxProjects: 100,
        maxTargetsPerProject: 30,
        scansPerMonth: 500,
        scansRemainingThisMonth: 485,
        aiConsultationsPerMonth: 1000,
        aiConsultationsRemaining: 920
      }
    }
  ],
  auditLogs: [
    { id: "log-1", companyId: "comp-1", userId: "tm-1", userEmail: "elhammoh2795@gmail.com", action: "بدء النظام", details: "تم تشغيل منصة Sniper AI Security بنجاح", ipAddress: "127.0.0.1", timestamp: new Date() }
  ],
  projects: [
    { id: "proj-1", companyId: "comp-1", name: "مشروع البنية التحتية الرئيسية", description: "فحص الخوادم والنطاقات الحكومية والمؤسسية", createdAt: new Date("2026-01-10T12:00:00Z") }
  ],
  targets: [
    { id: "tar-1", projectId: "proj-1", name: "الموقع الرئيسي", url: "https://example.sa", type: "Website", verificationToken: "token-1", verificationStatus: "Verified", currentRiskScore: 25, verifiedAt: new Date() }
  ],
  activeScans: [
    { id: "scan-1", targetId: "tar-1", targetName: "الموقع الرئيسي", status: "Completed", progress: 100, startedAt: new Date(), scannerLogs: ["تم بدء الفحص", "اكتمل الفحص بنجاح"], vulnerabilitiesFoundCount: { Critical: 1, High: 2 } }
  ],
  vulnerabilities: [
    { id: "vuln-1", targetId: "tar-1", targetName: "الموقع الرئيسي", title: "SQL Injection في نموذج تسجيل الدخول", type: "SQLi", severity: "Critical", cvssScore: 9.8, location: "/api/login", description: "ثغرة تسمح بتخطي المصادقة", impact: "الوصول غير المصرح للبيانات", remediation: "استخدام Prepared Statements", isFalsePositive: false, complianceMapping: { owasp: "A03:2021-Injection", iso27001: "A.14.2", pciDss: "Req 6.5.1" } }
  ],
  reportsHistory: [],
  bugBountyPrograms: [
    { id: "bb-1", targetName: "تطبيق الهاتف الذكي", rewardRange: "$500 - $5,000", status: "Active", severityMultiplier: "1.5x", totalReports: 12, scope: "*.company.sa", outOfScope: "thirdparty.com" }
  ],
  bugBountyLeaderboard: [
    { rank: 1, name: "طارق الشمري", points: 1450, totalEarned: "$12,500", badges: ["Elite Hunter", "Top Reporter"] }
  ],
  bugBountySubmissions: [],
  remediations: []
};

function getTableKey(table: any): string {
  if (!table) return "unknown";
  if (table === schema.companies) return "companies";
  if (table === schema.users) return "users";
  if (table === schema.teamMembers) return "teamMembers";
  if (table === schema.subscription) return "subscription";
  if (table === schema.auditLogs) return "auditLogs";
  if (table === schema.projects) return "projects";
  if (table === schema.targets) return "targets";
  if (table === schema.vulnerabilities) return "vulnerabilities";
  if (table === schema.reportsHistory) return "reportsHistory";
  if (table === schema.bugBountyPrograms) return "bugBountyPrograms";
  if (table === schema.bugBountyLeaderboard) return "bugBountyLeaderboard";
  if (table === schema.bugBountySubmissions) return "bugBountySubmissions";
  if (table === schema.activeScans) return "activeScans";
  if (table === schema.remediations) return "remediations";
  
  if (typeof table === "string") return table;
  if (table.dbName) return table.dbName;
  return "unknown";
}

function extractWhereInfo(clause: any): { field?: string; value?: any } | null {
  if (!clause) return null;
  if (clause.left && clause.right !== undefined) {
    const field = clause.left.name || clause.left.fieldName || clause.left.key;
    return { field, value: clause.right };
  }
  return null;
}

function filterRows(rows: any[], whereClause: any): any[] {
  if (!whereClause) return rows;
  const info = extractWhereInfo(whereClause);
  if (!info || !info.field) return rows;

  const targetKey = info.field;
  const targetVal = info.value;

  return rows.filter((r) => {
    let rVal = r[targetKey];
    if (rVal === undefined) {
      const camelKey = targetKey.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      rVal = r[camelKey];
    }
    if (rVal === undefined) return false;

    if (typeof rVal === "string" && typeof targetVal === "string") {
      return rVal.toLowerCase() === targetVal.toLowerCase();
    }
    return rVal == targetVal;
  });
}

function insertRows(tableName: string, values: any) {
  if (!inMemoryStore[tableName]) inMemoryStore[tableName] = [];
  const valArray = Array.isArray(values) ? values : [values];
  for (const item of valArray) {
    const exists = inMemoryStore[tableName].some(
      (r) => (item.id && r.id === item.id) || (item.email && r.email && r.email.toLowerCase() === item.email.toLowerCase())
    );
    if (!exists) {
      inMemoryStore[tableName].push({ ...item });
    } else {
      const index = inMemoryStore[tableName].findIndex(
        (r) => (item.id && r.id === item.id) || (item.email && r.email && r.email.toLowerCase() === item.email.toLowerCase())
      );
      if (index !== -1) {
        inMemoryStore[tableName][index] = { ...inMemoryStore[tableName][index], ...item };
      }
    }
  }
}

function updateRows(tableName: string, setValues: any, whereClause: any) {
  if (!inMemoryStore[tableName]) return;
  const info = extractWhereInfo(whereClause);
  inMemoryStore[tableName] = inMemoryStore[tableName].map((r) => {
    let match = true;
    if (info && info.field) {
      const targetKey = info.field;
      const targetVal = info.value;
      let rVal = r[targetKey];
      if (rVal === undefined) {
        const camelKey = targetKey.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
        rVal = r[camelKey];
      }
      match = (rVal == targetVal);
    }
    if (match) {
      return { ...r, ...setValues };
    }
    return r;
  });
}

function deleteRows(tableName: string, whereClause: any) {
  if (!inMemoryStore[tableName]) return;
  const info = extractWhereInfo(whereClause);
  if (!info || !info.field) return;
  const targetKey = info.field;
  const targetVal = info.value;
  inMemoryStore[tableName] = inMemoryStore[tableName].filter((r) => {
    let rVal = r[targetKey];
    if (rVal === undefined) {
      const camelKey = targetKey.replace(/_([a-z])/g, (_, g) => g.toUpperCase());
      rVal = r[camelKey];
    }
    return rVal != targetVal;
  });
}

function createQueryChain(operation: "select" | "insert" | "update" | "delete", initialData?: any) {
  let targetTable: any = null;
  let whereClause: any = null;
  let limitNum: number | undefined = undefined;
  let orderClause: any = null;
  let insertValues: any = initialData || null;
  let updateValues: any = null;

  const chain: any = {
    from(table: any) {
      targetTable = table;
      return chain;
    },
    where(clause: any) {
      whereClause = clause;
      return chain;
    },
    limit(num: number) {
      limitNum = num;
      return chain;
    },
    orderBy(clause: any) {
      orderClause = clause;
      return chain;
    },
    values(vals: any) {
      insertValues = vals;
      return chain;
    },
    set(vals: any) {
      updateValues = vals;
      return chain;
    },
    onConflictDoNothing() {
      return chain;
    },
    then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
      try {
        const tableKey = getTableKey(targetTable);
        if (operation === "select") {
          let rows = [...(inMemoryStore[tableKey] || [])];
          rows = filterRows(rows, whereClause);
          if (limitNum !== undefined) {
            rows = rows.slice(0, limitNum);
          }
          return Promise.resolve(rows).then(onfulfilled, onrejected);
        } else if (operation === "insert") {
          insertRows(tableKey, insertValues);
          return Promise.resolve(insertValues).then(onfulfilled, onrejected);
        } else if (operation === "update") {
          updateRows(tableKey, updateValues, whereClause);
          return Promise.resolve().then(onfulfilled, onrejected);
        } else if (operation === "delete") {
          deleteRows(tableKey, whereClause);
          return Promise.resolve().then(onfulfilled, onrejected);
        }
        return Promise.resolve([]).then(onfulfilled, onrejected);
      } catch (err) {
        return Promise.reject(err).catch(onrejected);
      }
    }
  };

  return chain;
}

const isPostgresConfigured = false;

export const createPool = (): pg.Pool => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST || "localhost",
      user: process.env.SQL_USER || "postgres",
      password: process.env.SQL_PASSWORD || "",
      database: process.env.SQL_DB_NAME || "sniper_db",
      max: 10,
      connectionTimeoutMillis: 2000,
    });

    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

const mockDb: any = {
  select: () => createQueryChain("select"),
  insert: (table: any) => {
    const chain = createQueryChain("insert");
    chain.from(table);
    return chain;
  },
  update: (table: any) => {
    const chain = createQueryChain("update");
    chain.from(table);
    return chain;
  },
  delete: (table: any) => {
    const chain = createQueryChain("delete");
    chain.from(table);
    return chain;
  }
};

let realDb: any = null;
if (isPostgresConfigured) {
  try {
    const pool = createPool();
    realDb = drizzle(pool, { schema });
  } catch (e) {
    console.warn("Postgres pool creation failed, using in-memory store.");
  }
}

export const db: any = isPostgresConfigured && realDb ? realDb : mockDb;

