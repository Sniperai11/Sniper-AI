import { Logger } from "../utils/logger";
import path from "path";
import fs from "fs";

export const INITIAL_COMPANY = {
  name: "منصة Sniper AI Security",
  ownerEmail: "alridwanykick@gmail.com",
  joinedAt: "2026-07-28T09:00:00Z"
};

export const currentUser = {
  email: "alridwanykick@gmail.com",
  role: "Admin" as const
};

export let teamMembers = [
  { id: "tm-admin-1", companyId: "comp-1", name: "المسؤول الرئيسي (System Admin)", email: "alridwanykick@gmail.com", password: "R00t@2025", role: "Admin", joinedAt: "2026-07-28T09:00:00Z" }
];

export let subscription = {
  plan: "Professional",
  status: "active",
  currentPeriodEnd: "2026-12-31T23:59:59Z",
  limits: {
    maxProjects: 50,
    maxTargetsPerProject: 20,
    scansPerMonth: 100,
    scansRemainingThisMonth: 100,
    aiConsultationsPerMonth: 500,
    aiConsultationsRemaining: 500
  },
  cost: 149 // $149/mo
};

export let auditLogs: any[] = [];

export let projects: any[] = [];

export let vulnerabilities: any[] = [];

export let activeScans: any[] = [];

export let reportsHistory: any[] = [];

export let bugBountyPrograms: any[] = [];

export let bugBountyLeaderboard: any[] = [];

export let bugBountySubmissions: any[] = [];

const DB_FILE = path.join(process.cwd(), "database.json");

export function saveDatabase() {
  try {
    const data = {
      teamMembers,
      subscription,
      auditLogs,
      projects,
      vulnerabilities,
      reportsHistory,
      bugBountyPrograms,
      bugBountyLeaderboard,
      bugBountySubmissions
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    Logger.error("Error saving database to file:", error);
  }
}

export function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const rawData = fs.readFileSync(DB_FILE, "utf8");
      const parsed = JSON.parse(rawData);
      if (parsed.teamMembers) teamMembers.splice(0, teamMembers.length, ...parsed.teamMembers);
      if (parsed.subscription) Object.assign(subscription, parsed.subscription);
      if (parsed.auditLogs) auditLogs.splice(0, auditLogs.length, ...parsed.auditLogs);
      if (parsed.projects) projects.splice(0, projects.length, ...parsed.projects);
      if (parsed.vulnerabilities) vulnerabilities.splice(0, vulnerabilities.length, ...parsed.vulnerabilities);
      if (parsed.reportsHistory) reportsHistory.splice(0, reportsHistory.length, ...parsed.reportsHistory);
      if (parsed.bugBountyPrograms) bugBountyPrograms.splice(0, bugBountyPrograms.length, ...parsed.bugBountyPrograms);
      if (parsed.bugBountyLeaderboard) bugBountyLeaderboard.splice(0, bugBountyLeaderboard.length, ...parsed.bugBountyLeaderboard);
      if (parsed.bugBountySubmissions) bugBountySubmissions.splice(0, bugBountySubmissions.length, ...parsed.bugBountySubmissions);
      Logger.info("Database successfully loaded from file system.");
    } catch (error) {
      Logger.error("Error loading database file, using seed data:", error);
    }
  } else {
    saveDatabase();
  }
}

// Initial load
loadDatabase();

// Centralized DB exports to make it easy to import and mutate
export const db = {
  get company() { return INITIAL_COMPANY; },
  get currentUser() { return currentUser; },
  get teamMembers() { return teamMembers; },
  get subscription() { return subscription; },
  get auditLogs() { return auditLogs; },
  get projects() { return projects; },
  get vulnerabilities() { return vulnerabilities; },
  set vulnerabilities(val) { vulnerabilities = val; },
  get reportsHistory() { return reportsHistory; },
  get bugBountyPrograms() { return bugBountyPrograms; },
  get bugBountyLeaderboard() { return bugBountyLeaderboard; },
  get bugBountySubmissions() { return bugBountySubmissions; },
  get activeScans() { return activeScans; },
  saveDatabase,
  loadDatabase
};
