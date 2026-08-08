import { Logger } from "../utils/logger";
import { db } from "../../src/db/index";
import * as schema from "../../src/db/schema";
import { DateUtils } from "../utils/date";
import { IScanJob } from "../types/scanner";
import { IVulnerability } from "../models/Vulnerability";
import { IBountySubmission } from "../types/scanner";
import { eq, desc } from "drizzle-orm";

function makeArrayProxy(arr: string[], onMutation: () => void): string[] {
  return new Proxy(arr, {
    get(target, prop) {
      const val = Reflect.get(target, prop);
      if (typeof val === "function" && ["push", "pop", "shift", "unshift", "splice"].includes(prop as string)) {
        return function(...args: any[]) {
          const res = val.apply(target, args);
          onMutation();
          return res;
        };
      }
      return val;
    }
  });
}

function makeScanJobProxy(job: IScanJob): IScanJob {
  const save = async (targetJob: IScanJob) => {
    try {
      await db.update(schema.activeScans)
        .set({
          status: targetJob.status,
          progress: targetJob.progress,
          completedAt: targetJob.completedAt ? new Date(targetJob.completedAt) : null,
          scannerLogs: Array.from(targetJob.scannerLogs || []),
          vulnerabilitiesFoundCount: targetJob.vulnerabilitiesFoundCount,
        })
        .where(eq(schema.activeScans.id, targetJob.id));
    } catch (err) {
      Logger.error("Error persisting scan job update:", err);
    }
  };

  if (Array.isArray(job.scannerLogs)) {
    job.scannerLogs = makeArrayProxy(job.scannerLogs, () => save(job));
  }

  return new Proxy(job, {
    set(target, prop, value) {
      if (prop === "scannerLogs" && Array.isArray(value)) {
        value = makeArrayProxy(value, () => save(target));
      }
      const success = Reflect.set(target, prop, value);
      if (success && ["status", "progress", "completedAt", "scannerLogs", "vulnerabilitiesFoundCount"].includes(prop as string)) {
        save(target);
      }
      return success;
    }
  });
}

function makeVulnerabilityProxy(v: IVulnerability): IVulnerability {
  return new Proxy(v, {
    set(target, prop, value, receiver) {
      const success = Reflect.set(target, prop, value, receiver);
      if (success) {
        const updatePayload: any = {};
        if (prop === "isFalsePositive") updatePayload.isFalsePositive = value;
        if (prop === "state") updatePayload.state = value;
        if (prop === "owner") updatePayload.owner = value;
        if (prop === "remediation") updatePayload.remediation = value;
        if (prop === "description") updatePayload.description = value;

        if (Object.keys(updatePayload).length > 0) {
          Promise.resolve(
            db.update(schema.vulnerabilities)
              .set(updatePayload)
              .where(eq(schema.vulnerabilities.id, target.id))
          ).catch(err => Logger.error("Error updating vulnerability in DB:", err));
        }
      }
      return success;
    }
  });
}

export class ScanRepository {
  public async getActiveScans(): Promise<IScanJob[]> {
    const scans = await db.select().from(schema.activeScans);
    return scans.map(s => makeScanJobProxy({
      id: s.id,
      targetId: s.targetId,
      targetName: s.targetName,
      userId: s.userId || undefined,
      userEmail: s.userEmail || undefined,
      status: s.status as any,
      progress: s.progress,
      startedAt: DateUtils.toIsoString(s.startedAt),
      completedAt: DateUtils.toOptionalIsoString(s.completedAt),
      scannerLogs: s.scannerLogs as string[],
      vulnerabilitiesFoundCount: s.vulnerabilitiesFoundCount as any,
    }));
  }

  public async getScanJobById(jobId: string): Promise<IScanJob | null> {
    const found = await db.select().from(schema.activeScans).where(eq(schema.activeScans.id, jobId)).limit(1);
    if (found.length === 0) return null;
    const s = found[0];
    return makeScanJobProxy({
      id: s.id,
      targetId: s.targetId,
      targetName: s.targetName,
      userId: s.userId || undefined,
      userEmail: s.userEmail || undefined,
      status: s.status as any,
      progress: s.progress,
      startedAt: DateUtils.toIsoString(s.startedAt),
      completedAt: DateUtils.toOptionalIsoString(s.completedAt),
      scannerLogs: s.scannerLogs as string[],
      vulnerabilitiesFoundCount: s.vulnerabilitiesFoundCount as any,
    });
  }

  public async addScanJob(job: IScanJob): Promise<IScanJob> {
    await db.insert(schema.activeScans).values({
      id: job.id,
      targetId: job.targetId,
      targetName: job.targetName,
      userId: job.userId || null,
      userEmail: job.userEmail || null,
      status: job.status,
      progress: job.progress,
      startedAt: job.startedAt ? new Date(job.startedAt) : new Date(),
      completedAt: job.completedAt ? new Date(job.completedAt) : null,
      scannerLogs: job.scannerLogs,
      vulnerabilitiesFoundCount: job.vulnerabilitiesFoundCount,
    }).onConflictDoNothing();
    return makeScanJobProxy(job);
  }

  public async getVulnerabilities(): Promise<IVulnerability[]> {
    let vulns = await db.select().from(schema.vulnerabilities);
    if (vulns.length < 4) {
      const defaultVulns: IVulnerability[] = [
        {
          id: "vuln-1",
          targetId: "tar-1",
          targetName: "الموقع الرئيسي (Frontend)",
          title: "حقن لغة الاستعلامات البنائية SQL (SQL Injection) في حقل المستفيد",
          type: "SQLi",
          severity: "Critical",
          cvssScore: 9.8,
          location: "/api/login",
          description: "تسمح المعلمة المستلمة بإدخال تعبيرات SQL برمجية دون تنظيف كافٍ للمدخلات. نجح الفاحص في استرجاع أسماء الجداول وقراءة تفاصيل الحسابات السرية لعملاء آخرين.",
          impact: "الوصول الكامل وغير المصرح به لقاعدة البيانات الرئيسية وإمكانية استخراج البيانات وحذف البيانات.",
          remediation: "تحديث كافة الاستعلامات إلى Parameterized Queries وإيقاف الدمج النصي المباشر.",
          isFalsePositive: false,
          complianceMapping: { owasp: "A03:2021-Injection", iso27001: "A.14.2", pciDss: "Req 6.5.1" }
        },
        {
          id: "vuln-2",
          targetId: "tar-2",
          targetName: "واجهة الخدمات المالية (API)",
          title: "انكشاف المفتاح السري للاختبار في الاستجابة (Sensitive Data Exposure)",
          type: "Sensitive Data Exposure",
          severity: "High",
          cvssScore: 7.5,
          location: "GET /v2/payments/config",
          description: "تقوم واجهة Config بإرجاع كائن يحتوي على مفاتيح API لبيئة تجريبية ومفاتيح JWT السريّة الخاصة بالنطاق الداخلي بشكل غير مقصود للمستخدمين غير المصرح لهم.",
          impact: "تسريب مفاتيح تشفير داخلية يسمح بتزوير صلاحيات المستخدمين والمسؤولين.",
          remediation: "إزالة كتل التكوين الحساسة من استجابة الـ API واستخدام متغيرات البيئة الآمنة .env.",
          isFalsePositive: false,
          complianceMapping: { owasp: "A01:2021-Broken Access Control", iso27001: "A.8.24", pciDss: "Req 6.5.1" }
        },
        {
          id: "vuln-3",
          targetId: "tar-1",
          targetName: "البوابة الرئيسية للعملاء",
          title: "ثغرة البرمجة العابرة للمواقع (Stored XSS) في حقل الاسم المستعار",
          type: "XSS",
          severity: "Medium",
          cvssScore: 6.1,
          location: "/profile/nickname",
          description: "يتم حفظ اسم العميل المستعار دون تشفير وسوم HTML أو JavaScript، ليتم عرضه لاحقاً في لوحة التحكم الإدارية لشركة الدعم الفني مما يؤدي لتنفيذ التعليمات فور تحميل الصفحة.",
          impact: "سرقة الكوكيز وجلسات عمل مدراء النظام وممثلي الدعم الفني.",
          remediation: "تطهير جميع المدخلات باستخدام DOMPurify وتأمين تشفير المخرجات Output Encoding.",
          isFalsePositive: false,
          complianceMapping: { owasp: "A03:2021-Injection", iso27001: "A.12.6", pciDss: "Req 6.5.7" }
        },
        {
          id: "vuln-4",
          targetId: "tar-1",
          targetName: "البوابة الرئيسية للعملاء",
          title: "انكشاف معلومات الخادم والمكتبة المستعملة (Server Header Disclosure)",
          type: "Information Disclosure",
          severity: "Low",
          cvssScore: 3.2,
          location: "Server Response Headers",
          description: "يعود الخادم بالترويسة Server: Apache/2.4.41 (Ubuntu) والترويسة X-Powered-By: PHP/7.4.3، مما يساعد المهاجمين على استهداف إصدارات النظام المحددة مباشرة.",
          impact: "مساعدة المهاجمين في الاستطلاع المباشر ومعرفة ثغرات الإصدارات المستخدمة.",
          remediation: "إيقاف إرسال ترويسات Server و X-Powered-By في إعدادات Nginx / Apache.",
          isFalsePositive: false,
          complianceMapping: { owasp: "A05:2021-Security Misconfiguration", iso27001: "A.12.1", pciDss: "Req 2.2" }
        }
      ];
      await this.addVulnerabilities(defaultVulns);
      vulns = await db.select().from(schema.vulnerabilities);
    }
    return vulns.map(v => makeVulnerabilityProxy({
      id: v.id,
      targetId: v.targetId || undefined,
      targetName: v.targetName,
      title: v.title,
      type: v.type,
      severity: v.severity as any,
      cvssScore: v.cvssScore,
      location: v.location,
      description: v.description,
      impact: v.impact,
      remediation: v.remediation,
      isFalsePositive: v.isFalsePositive ?? false,
      complianceMapping: v.complianceMapping as any,
      state: v.state || "Triaged",
      owner: v.owner || "SecOps Analyst",
      createdAt: DateUtils.toIsoString(v.createdAt)
    }));
  }

  public async getVulnerabilityById(vulnId: string): Promise<IVulnerability | null> {
    const v = await db.select().from(schema.vulnerabilities).where(eq(schema.vulnerabilities.id, vulnId)).limit(1);
    if (v.length === 0) return null;
    const vuln = v[0];
    return makeVulnerabilityProxy({
      id: vuln.id,
      targetId: vuln.targetId || undefined,
      targetName: vuln.targetName,
      title: vuln.title,
      type: vuln.type,
      severity: vuln.severity as any,
      cvssScore: vuln.cvssScore,
      location: vuln.location,
      description: vuln.description,
      impact: vuln.impact,
      remediation: vuln.remediation,
      isFalsePositive: vuln.isFalsePositive ?? false,
      complianceMapping: vuln.complianceMapping as any,
      state: vuln.state || "Triaged",
      owner: vuln.owner || "SecOps Analyst",
      createdAt: DateUtils.toIsoString(vuln.createdAt)
    });
  }

  public async addVulnerabilities(vulns: IVulnerability[]): Promise<void> {
    if (vulns.length === 0) return;
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
      state: (v as any).state || "Triaged",
      owner: (v as any).owner || "SecOps Analyst",
      createdAt: v.createdAt ? new Date(v.createdAt) : new Date()
    }));
    await db.insert(schema.vulnerabilities).values(valuesToInsert).onConflictDoNothing();
  }

  public async updateScanJob(jobId: string, updates: Partial<IScanJob>): Promise<void> {
    try {
      const setValues: any = {};
      if (updates.status !== undefined) setValues.status = updates.status;
      if (updates.progress !== undefined) setValues.progress = updates.progress;
      if (updates.completedAt !== undefined) setValues.completedAt = updates.completedAt ? new Date(updates.completedAt) : null;
      if (updates.scannerLogs !== undefined) setValues.scannerLogs = Array.from(updates.scannerLogs || []);
      if (updates.vulnerabilitiesFoundCount !== undefined) setValues.vulnerabilitiesFoundCount = updates.vulnerabilitiesFoundCount;

      await db.update(schema.activeScans)
        .set(setValues)
        .where(eq(schema.activeScans.id, jobId));
    } catch (err) {
      Logger.error("Error in updateScanJob:", err);
    }
  }

  public async getScanProfiles(): Promise<any[]> {
    const profiles = await db.select().from(schema.scanProfiles);
    if (profiles.length === 0) {
      return [
        { id: 'profile-deep', name: 'الفحص الهيكلي الشامل (Deep Security Audit)', description: 'فحص شامل يغطي Nmap, Subfinder, OWASP ZAP, Nuclei وتحديد الأخطاء البرمجية الهيكلية.', engine: 'Enterprise Engine', enabled: true },
        { id: 'profile-quick', name: 'الفحص السريع للثغرات (Quick Vulnerability Scan)', description: 'استطلاع سريع للمنافذ والخدمات النشطة دون إجهاد السيرفر.', engine: 'Fast Recon', enabled: true },
        { id: 'profile-mobile', name: 'فحص تطبيقات الجوال (Mobile Security Audit)', description: 'تحليل الأذونات والترخيص وعناوين IP المسربة وتطبيق OWASP Mobile Top 10.', engine: 'ApkScanner Engine', enabled: true },
        { id: 'profile-api', name: 'فحص واجهات البرمجة (API Security Audit)', description: 'فحص ثغرات REST & GraphQL ونقاط النهاية BOLA/IDOR وامتثال OWASP API Top 10.', engine: 'Zap & Nuclei API Modules', enabled: true }
      ];
    }
    return profiles;
  }

  public async createScanProfile(profile: any): Promise<any> {
    await db.insert(schema.scanProfiles).values({
      id: profile.id || `profile-${Date.now()}`,
      name: profile.name,
      description: profile.description || "",
      engine: profile.engine || "Standard Engine",
      configuration: profile.configuration || {},
      severityPolicy: profile.severityPolicy || "Standard",
      enabled: profile.enabled !== undefined ? profile.enabled : true,
    }).onConflictDoNothing();
    return profile;
  }

  public async getAssets(projectId?: string): Promise<any[]> {
    if (projectId) {
      return await db.select().from(schema.assets).where(eq(schema.assets.projectId, projectId));
    }
    return await db.select().from(schema.assets);
  }

  public async createAsset(asset: any): Promise<any> {
    const newAsset = {
      id: asset.id || `asset-${Date.now()}`,
      projectId: asset.projectId,
      name: asset.name,
      type: asset.type || "Server",
      createdAt: new Date(),
    };
    await db.insert(schema.assets).values(newAsset).onConflictDoNothing();
    return newAsset;
  }

  public async getNotifications(): Promise<any[]> {
    return await db.select().from(schema.notifications).orderBy(desc(schema.notifications.createdAt));
  }

  public async markNotificationRead(id: string): Promise<void> {
    await db.update(schema.notifications)
      .set({ read: true, status: "Read" })
      .where(eq(schema.notifications.id, id));
  }

  public async saveAIConsultation(consultation: any): Promise<any> {
    const item = {
      id: consultation.id || `consult-${Date.now()}`,
      prompt: consultation.prompt,
      response: consultation.response,
      model: consultation.model || "gemini-3.5-flash",
      tokens: consultation.tokens || 0,
      latency: consultation.latency || 0,
      user: consultation.user || "Security Analyst",
      vulnerability: consultation.vulnerability || null,
      createdAt: new Date(),
    };
    await db.insert(schema.aiConsultations).values(item).onConflictDoNothing();
    return item;
  }

  public async getAIConsultations(): Promise<any[]> {
    return await db.select().from(schema.aiConsultations).orderBy(desc(schema.aiConsultations.createdAt));
  }

  public async getBountyData(): Promise<any> {
    const programs = await db.select().from(schema.bugBountyPrograms);
    const leaderboard = await db.select().from(schema.bugBountyLeaderboard).orderBy(schema.bugBountyLeaderboard.rank);
    const submissions = await db.select().from(schema.bugBountySubmissions).orderBy(desc(schema.bugBountySubmissions.submittedAt));
    return {
      programs,
      leaderboard: leaderboard.map(l => ({
        rank: l.rank,
        name: l.name,
        points: l.points,
        totalEarned: l.totalEarned,
        badges: l.badges as string[],
      })),
      submissions: submissions.map(s => ({
        id: s.id,
        targetName: s.targetName,
        title: s.title,
        severity: s.severity,
        status: s.status,
        rewardAmount: s.rewardAmount,
        submittedBy: s.submittedBy,
        submittedAt: DateUtils.toIsoString(s.submittedAt),
        description: s.description,
        poc: s.poc,
      })),
    };
  }

  public async addBountySubmission(submission: IBountySubmission): Promise<IBountySubmission> {
    await db.insert(schema.bugBountySubmissions).values({
      id: submission.id,
      targetName: submission.targetName,
      title: submission.title,
      severity: submission.severity,
      status: submission.status,
      rewardAmount: submission.rewardAmount,
      submittedBy: submission.submittedBy,
      submittedAt: submission.submittedAt ? new Date(submission.submittedAt) : new Date(),
      description: submission.description,
      poc: submission.poc,
    }).onConflictDoNothing();
    return submission;
  }

  public async getBountySubmissionById(subId: string): Promise<IBountySubmission | null> {
    const found = await db.select().from(schema.bugBountySubmissions).where(eq(schema.bugBountySubmissions.id, subId)).limit(1);
    if (found.length === 0) return null;
    const s = found[0];
    return {
      id: s.id,
      targetName: s.targetName,
      title: s.title,
      severity: s.severity,
      status: s.status,
      rewardAmount: s.rewardAmount,
      submittedBy: s.submittedBy,
      submittedAt: DateUtils.toIsoString(s.submittedAt),
      description: s.description,
      poc: s.poc,
    };
  }

  public async updateBountySubmission(subId: string, updates: Partial<IBountySubmission>): Promise<IBountySubmission | null> {
    const mappedUpdates: any = {};
    if (updates.targetName !== undefined) mappedUpdates.targetName = updates.targetName;
    if (updates.title !== undefined) mappedUpdates.title = updates.title;
    if (updates.severity !== undefined) mappedUpdates.severity = updates.severity;
    if (updates.status !== undefined) mappedUpdates.status = updates.status;
    if (updates.rewardAmount !== undefined) mappedUpdates.rewardAmount = updates.rewardAmount;
    if (updates.submittedBy !== undefined) mappedUpdates.submittedBy = updates.submittedBy;
    if (updates.submittedAt !== undefined) mappedUpdates.submittedAt = updates.submittedAt ? new Date(updates.submittedAt) : null;
    if (updates.description !== undefined) mappedUpdates.description = updates.description;
    if (updates.poc !== undefined) mappedUpdates.poc = updates.poc;

    await db.update(schema.bugBountySubmissions)
      .set(mappedUpdates)
      .where(eq(schema.bugBountySubmissions.id, subId));

    return this.getBountySubmissionById(subId);
  }
}
export const scanRepository = new ScanRepository();

