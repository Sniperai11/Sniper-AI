import { pgTable, serial, text, timestamp, integer, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const companies = pgTable("companies", {
  id: text("id").primaryKey(), // UUID or comp-1
  name: text("name").notNull(),
  ownerEmail: text("owner_email").notNull().unique(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").default("Viewer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(), // tm-1, tm-2...
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }).default("comp-1"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const subscription = pgTable("subscription", {
  id: serial("id").primaryKey(),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }).default("comp-1"),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  limits: jsonb("limits").notNull(), // maxProjects, maxTargetsPerProject, scansPerMonth...
  cost: integer("cost").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }).default("comp-1"),
  userId: text("user_id"),
  userEmail: text("user_email").notNull(),
  action: text("action").notNull(),
  details: text("details").notNull(),
  ipAddress: text("ip_address").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }).default("comp-1"),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const targets = pgTable("targets", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  verificationToken: text("verification_token").notNull(),
  verificationStatus: text("verification_status").notNull(), // Verified, Pending
  verificationStatusDetails: text("verification_status_details"),
  verifiedAt: timestamp("verified_at"),
  lastScanAt: timestamp("last_scan_at"),
  currentRiskScore: integer("current_risk_score"),
});

export const vulnerabilities = pgTable("vulnerabilities", {
  id: text("id").primaryKey(),
  targetId: text("target_id").references(() => targets.id, { onDelete: "cascade" }),
  targetName: text("target_name").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(), // Critical, High, Medium, Low
  cvssScore: real("cvss_score").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(),
  remediation: text("remediation").notNull(),
  isFalsePositive: boolean("is_false_positive").default(false),
  complianceMapping: jsonb("compliance_mapping").notNull(), // { owasp, iso27001, pciDss }
});

export const reportsHistory = pgTable("reports_history", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  projectName: text("project_name").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  riskScore: integer("risk_score").notNull(),
  totalVulnerabilities: integer("total_vulnerabilities").notNull(),
  severityBreakdown: jsonb("severity_breakdown").notNull(), // { Critical, High... }
  executiveSummary: text("executive_summary").notNull(),
  compliancePercentage: jsonb("compliance_percentage").notNull(), // { owasp, pciDss, iso27001 }
  vulnerabilities: jsonb("vulnerabilities").notNull(), // list of nested vulnerabilities
});

export const bugBountyPrograms = pgTable("bug_bounty_programs", {
  id: text("id").primaryKey(),
  targetName: text("target_name").notNull(),
  rewardRange: text("reward_range").notNull(),
  status: text("status").notNull(),
  severityMultiplier: text("severity_multiplier").notNull(),
  totalReports: integer("total_reports").notNull(),
  scope: text("scope").notNull(),
  outOfScope: text("out_of_scope").notNull(),
});

export const bugBountyLeaderboard = pgTable("bug_bounty_leaderboard", {
  rank: integer("rank").primaryKey(),
  name: text("name").notNull(),
  points: integer("points").notNull(),
  totalEarned: text("total_earned").notNull(),
  badges: jsonb("badges").notNull(),
});

export const bugBountySubmissions = pgTable("bug_bounty_submissions", {
  id: text("id").primaryKey(),
  targetName: text("target_name").notNull(),
  title: text("title").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  rewardAmount: text("reward_amount").notNull(),
  submittedBy: text("submitted_by").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  description: text("description").notNull(),
  poc: text("poc").notNull(),
});

export const activeScans = pgTable("active_scans", {
  id: text("id").primaryKey(),
  targetId: text("target_id").notNull(),
  targetName: text("target_name").notNull(),
  status: text("status").notNull(),
  progress: integer("progress").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  scannerLogs: jsonb("scanner_logs").notNull(), // array of strings
  vulnerabilitiesFoundCount: jsonb("vulnerabilities_found_count").notNull(), // json breakdown
});

export const remediations = pgTable("remediations", {
  id: text("id").primaryKey(), // pat-xxxx
  projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
  vulnerabilityId: text("vulnerability_id").references(() => vulnerabilities.id, { onDelete: "cascade" }),
  originalCodeSnippet: text("original_code_snippet").notNull(),
  patchedCodeSnippet: text("patched_code_snippet").notNull(),
  validationStatus: text("validation_status").notNull(), // Passed, Failed, Untested
  validationLogs: text("validation_logs").notNull(),
  pullRequestUrl: text("pull_request_url"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Relationships
export const projectsRelations = relations(projects, ({ many }) => ({
  targets: many(targets),
  reports: many(reportsHistory),
  remediations: many(remediations),
}));

export const targetsRelations = relations(targets, ({ one, many }) => ({
  project: one(projects, {
    fields: [targets.projectId],
    references: [projects.id],
  }),
  vulnerabilities: many(vulnerabilities),
}));

export const vulnerabilitiesRelations = relations(vulnerabilities, ({ one, many }) => ({
  target: one(targets, {
    fields: [vulnerabilities.targetId],
    references: [targets.id],
  }),
  remediations: many(remediations),
}));

export const remediationsRelations = relations(remediations, ({ one }) => ({
  project: one(projects, {
    fields: [remediations.projectId],
    references: [projects.id],
  }),
  vulnerability: one(vulnerabilities, {
    fields: [remediations.vulnerabilityId],
    references: [vulnerabilities.id],
  }),
}));
