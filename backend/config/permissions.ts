export type Role = "Admin" | "Security Analyst" | "Viewer";

export const PERMISSIONS: Record<Role, string[]> = {
  Admin: [
    "view_dashboard",
    "edit_team_role",
    "invite_team_member",
    "delete_team_member",
    "clear_audit_logs",
    "upgrade_subscription",
    "create_project",
    "add_target",
    "verify_target",
    "run_scan",
    "view_vulnerabilities",
    "analyze_vulnerability",
    "toggle_false_positive",
    "generate_report",
    "chat_advisor",
    "review_bounty"
  ],
  "Security Analyst": [
    "view_dashboard",
    "view_vulnerabilities",
    "analyze_vulnerability",
    "toggle_false_positive",
    "run_scan",
    "generate_report",
    "chat_advisor"
  ],
  Viewer: [
    "view_dashboard",
    "view_vulnerabilities"
  ]
};

export function hasPermission(role: Role, action: string): boolean {
  return PERMISSIONS[role]?.includes(action) || false;
}
