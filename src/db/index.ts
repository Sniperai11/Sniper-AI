import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

const DB_FILE = path.join(process.cwd(), "database.json");

// In-Memory Database Store with JSON disk persistence
const inMemoryStore: Record<string, any[]> = {
  teamMembers: [
    { id: "tm-admin-1", companyId: "comp-1", name: "المسؤول الرئيسي (System Admin)", email: "alridwanykick@gmail.com", password: "R00t@2025", role: "Admin", joinedAt: new Date("2026-07-28T09:00:00Z") }
  ],
  companies: [
    { id: "comp-1", name: "منصة Sniper AI Security", ownerEmail: "alridwanykick@gmail.com", joinedAt: new Date("2026-07-28T09:00:00Z") }
  ],
  users: [
    { id: 1, uid: "usr-admin-1", email: "alridwanykick@gmail.com", name: "المسؤول الرئيسي (System Admin)", role: "Admin", createdAt: new Date("2026-07-28T09:00:00Z") }
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
        scansRemainingThisMonth: 500,
        aiConsultationsPerMonth: 1000,
        aiConsultationsRemaining: 1000
      }
    }
  ],
  auditLogs: [],
  projects: [
    {
      id: "proj-1",
      companyId: "comp-1",
      name: "مشروع النطاقات الرئيسية (Core Infrastructure)",
      description: "فحص البنية التحتية الرئيسية للمؤسسة والبوابات الإلكترونية.",
      createdAt: new Date("2026-01-15T08:00:00Z")
    },
    {
      id: "proj-2",
      companyId: "comp-1",
      name: "مشروع تطبيقات الجوال (Mobile Apps Fleet)",
      description: "فحص تطبيقات iOS & Android وواجهات API المرتبطة بها.",
      createdAt: new Date("2026-02-01T10:00:00Z")
    }
  ],
  targets: [
    {
      id: "tgt-1",
      projectId: "proj-1",
      name: "البوابة الرئيسية (Main Gateway)",
      url: "https://portal.sniper-sec.local",
      type: "Web App",
      verificationStatus: "Verified",
      verifiedAt: new Date("2026-01-16T10:00:00Z"),
      lastScanAt: new Date("2026-08-01T14:30:00Z"),
      currentRiskScore: 68
    },
    {
      id: "tgt-2",
      projectId: "proj-1",
      name: "سيرفر الهوية والتوثيق (Auth Server)",
      url: "https://auth.sniper-sec.local",
      type: "API",
      verificationStatus: "Verified",
      verifiedAt: new Date("2026-01-16T11:00:00Z"),
      lastScanAt: new Date("2026-08-02T09:15:00Z"),
      currentRiskScore: 42
    },
    {
      id: "tgt-3",
      projectId: "proj-2",
      name: "تطبيق العملاء (Mobile Client API)",
      url: "https://api.app.sniper-sec.local",
      type: "API",
      verificationStatus: "Verified",
      verifiedAt: new Date("2026-02-02T12:00:00Z"),
      lastScanAt: new Date("2026-08-03T16:00:00Z"),
      currentRiskScore: 25
    }
  ],
  assets: [
    { id: "asset-tgt-1", projectId: "proj-1", name: "البوابة الرئيسية (Main Gateway)", type: "Web App", createdAt: new Date() },
    { id: "asset-tgt-2", projectId: "proj-1", name: "سيرفر الهوية والتوثيق (Auth Server)", type: "API", createdAt: new Date() },
    { id: "asset-tgt-3", projectId: "proj-2", name: "تطبيق العملاء (Mobile Client API)", type: "API", createdAt: new Date() }
  ],
  activeScans: [],
  vulnerabilities: [
    {
      id: "vuln-1",
      targetId: "tgt-1",
      targetName: "البوابة الرئيسية (Main Gateway)",
      title: "ثغرة الحقن بأسئلة الاستعلام (SQL Injection in Search)",
      type: "SQL Injection",
      severity: "Critical",
      cvssScore: 9.8,
      location: "/api/search?q=",
      description: "تسمح هذه الثغرة للمهاجم بتنفيذ الاستعلامات المباشرة على قاعدة البيانات واستخراج البيانات الحساسة.",
      impact: "تسريب بيانات المستخدمين وتجاوز التوثيق.",
      remediation: "استخدام الاستعلامات المحضرة (Parameterized Queries) وتعقيم المدخلات.",
      isFalsePositive: false,
      complianceMapping: ["OWASP A03:2021", "NCA-ECC:2020"]
    },
    {
      id: "vuln-2",
      targetId: "tgt-2",
      targetName: "سيرفر الهوية والتوثيق (Auth Server)",
      title: "ضعف تشفير رموز التوثيق (JWT Broken Signature Verification)",
      type: "Broken Auth",
      severity: "High",
      cvssScore: 8.1,
      location: "/api/auth/verify",
      description: "عدم التحقق المناسب من توقيع JWT مما يسمح بتغيير الصلاحيات إلى مدير النظام.",
      impact: "تجاوز التوثيق والوصول إلى صلاحيات المدير.",
      remediation: "فرض التحقق المباشر من التوقيع باستخدام مفتاح سري قوي وعدم قبول خوارزمية 'none'.",
      isFalsePositive: false,
      complianceMapping: ["OWASP A07:2021"]
    }
  ],
  reportsHistory: [],
  reportFiles: [],
  bugBountyPrograms: [],
  bugBountyLeaderboard: [],
  bugBountySubmissions: [],
  remediations: [],
  scanProfiles: [
    {
      id: "profile-deep",
      name: "الفحص الهيكلي الشامل (Deep Security Audit)",
      description: "فحص شامل يغطي Nmap, Subfinder, OWASP ZAP, Nuclei وتحديد الأخطاء البرمجية الهيكلية.",
      engine: "Enterprise Multi-Engine Pipeline",
      configuration: { depth: "full", timeout: 300, threads: 10, checkSsl: true },
      severityPolicy: "Strict",
      enabled: true
    },
    {
      id: "profile-quick",
      name: "الفحص السريع للثغرات (Quick Vulnerability Scan)",
      description: "استطلاع سريع للمنافذ والخدمات النشطة دون إجهاد السيرفر.",
      engine: "Fast Port & Header Recon",
      configuration: { depth: "quick", timeout: 60, threads: 5, checkSsl: false },
      severityPolicy: "Standard",
      enabled: true
    },
    {
      id: "profile-mobile",
      name: "فحص تطبيقات الجوال (Mobile Security Audit)",
      description: "تحليل الأذونات والترخيص وعناوين IP المسربة وتطبيق OWASP Mobile Top 10.",
      engine: "ApkScanner Engine",
      configuration: { depth: "mobile", timeout: 180, threads: 4, decompile: true },
      severityPolicy: "Strict",
      enabled: true
    },
    {
      id: "profile-api",
      name: "فحص واجهات البرمجة (API Security Audit)",
      description: "فحص ثغرات REST & GraphQL ونقاط النهاية BOLA/IDOR وامتثال OWASP API Top 10.",
      engine: "Zap & Nuclei API Modules",
      configuration: { depth: "api", timeout: 200, threads: 8 },
      severityPolicy: "Standard",
      enabled: true
    }
  ],
  notifications: [
    {
      id: "notif-1",
      title: "اكتشاف ثغرة حرجة جديدة",
      message: "تم الكشف عن ثغرة SQL Injection حرجة في خادم البوابة الرئيسية.",
      severity: "Critical",
      status: "Unread",
      read: false
    },
    {
      id: "notif-2",
      title: "اكتمال الفحص الشامل",
      message: "تمت بنجاح عملية الفحص الدوري لنطاقات الشركة وتحديث درجة المخاطر.",
      severity: "Info",
      status: "Read",
      read: true
    }
  ],
  aiConsultations: []
};

export function saveInMemoryStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryStore, null, 2), "utf8");
  } catch (err) {
    console.error("❌ [DB Persistence] Error writing database.json:", err);
  }
}

export function loadInMemoryStore() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const rawData = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(rawData);
      if (typeof parsed === "object" && parsed !== null) {
        for (const key of Object.keys(parsed)) {
          if (Array.isArray(parsed[key]) && parsed[key].length > 0) {
            inMemoryStore[key] = parsed[key];
          }
        }
        console.log("📂 [DB Persistence] Database restored from database.json");
        return;
      }
    }
  } catch (err) {
    console.error("❌ [DB Persistence] Failed to load database.json:", err);
  }
  saveInMemoryStore();
}

// Auto load store on initialization
loadInMemoryStore();

function getTableKey(table: any): string {
  if (!table) return "unknown";
  if (table === schema.companies) return "companies";
  if (table === schema.users) return "users";
  if (table === schema.teamMembers) return "teamMembers";
  if (table === schema.subscription) return "subscription";
  if (table === schema.auditLogs) return "auditLogs";
  if (table === schema.projects) return "projects";
  if (table === schema.targets) return "targets";
  if (table === schema.assets) return "assets";
  if (table === schema.vulnerabilities) return "vulnerabilities";
  if (table === schema.reportsHistory) return "reportsHistory";
  if (table === schema.reportFiles) return "reportFiles";
  if (table === schema.bugBountyPrograms) return "bugBountyPrograms";
  if (table === schema.bugBountyLeaderboard) return "bugBountyLeaderboard";
  if (table === schema.bugBountySubmissions) return "bugBountySubmissions";
  if (table === schema.activeScans) return "activeScans";
  if (table === schema.remediations) return "remediations";
  if (table === schema.scanProfiles) return "scanProfiles";
  if (table === schema.notifications) return "notifications";
  if (table === schema.aiConsultations) return "aiConsultations";
  
  if (typeof table === "string") return table;
  if (table.dbName) return table.dbName;
  return "unknown";
}

function extractWhereInfo(clause: any): { field?: string; value?: any } | null {
  if (!clause) return null;
  let field = clause.left?.name || clause.left?.fieldName || clause.left?.key || clause.field?.name || clause.field;
  let value = clause.right !== undefined ? clause.right : clause.value;

  if (value !== undefined && value !== null && typeof value === "object") {
    if ("value" in value) {
      value = value.value;
    } else if ("param" in value) {
      value = value.param;
    }
  }

  if (field && value !== undefined) {
    return { field, value };
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
  saveInMemoryStore();
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
  saveInMemoryStore();
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
  saveInMemoryStore();
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


