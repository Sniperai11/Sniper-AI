# Domain Reconciliation & Architecture Alignment Report
**Sniper AI Security Platform — Phase 3.4A Architecture Reconciliation**

This report documents the architectural alignment between the frontend domain models and the existing backend source of truth.

---

## 1. Domain Mismatch Report

| Frontend Concept | Backend Entity | Status | Alignment Strategy |
| :--- | :--- | :--- | :--- |
| **Asset** | `Target` | Matched | Mapped `Asset` to `Target` model (`name`, `url`, `type`, `verificationStatus`, `verifiedAt`). |
| **Pentest Mission** | `Scan` | Matched | Mapped `Pentest Mission` execution to `Scan` jobs (`targetId`, `status`, `progress`, `findingsCount`). |
| **Finding** | `Vulnerability` | Matched | Mapped `Finding` directly to `Vulnerability` (`cvssScore`, `severity`, `isFalsePositive`, `complianceMapping`). |
| **Security Report** | `Report` | Matched | Mapped `Security Report` to `Report` entity (`projectId`, `riskScore`, `compliancePercentage`, `vulnerabilities`). |
| **Activity Timeline** | `AuditLog` / `Notification` | Matched | Mapped timeline items to `AuditLog` records and user `Notification` events. |
| **Incident** | *Future Capability* | Isolated | Frontend SOC `Incident` workflow isolated behind `IncidentWorkflow` interface. Falls back safely until backend incident orchestrator is released. |
| **Case** | *Future Capability* | Isolated | Frontend `Case` management isolated behind `CaseWorkflow` interface. Mapped to Project/Target groupings. |
| **Task** | *Future Capability* | Isolated | Frontend `Task` workflow isolated behind `TaskWorkflow` interface. Mapped to vulnerability remediation tasks. |
| **AI Agent** | *Future Capability* | Isolated | Frontend `AI Agent` panel isolated behind `AgentWorkflow` interface and backed by `/api/chat` advisor endpoint. |

---

## 2. Frontend Components Affected

- **`src/pages/CommandCenter.tsx`**: Updated to fetch live system statistics and vulnerability trends directly from backend endpoints (`/api/vulnerabilities`, `/api/projects`, `/api/user/profile`).
- **`src/pages/AttackSurface.tsx`**: Connected target creation and asset sync with `/api/projects/:id/targets/add` and `/api/vulnerabilities`.
- **`src/pages/AssetDetails.tsx`**: Synced asset details with `Target` and linked `Vulnerability` entities.
- **`src/pages/VulnerabilityMatrix.tsx`**: Integrated state transitions, false positive toggling, and AI analysis with `/api/vulnerabilities/:id/ai-analyze` and `/api/vulnerabilities/:id/toggle-false-positive`.
- **`src/pages/PentestConsole.tsx`**: Integrated live scan job tracking with `/api/scans` and `/api/targets/:id/scan`.
- **`src/pages/BugBounty.tsx`**: Synchronized target verification, report drafting, submission, and admin review with `/api/bugbounty/*`.
- **`src/pages/Reports.tsx`**: Connected executive/technical report generation with `/api/projects/:projectId/report` and `/api/reports/history`.
- **`src/pages/Remediation.tsx`**: Linked self-healing AST remediation code fixes with `/api/remediations` and `/api/vulnerabilities/:id/remediate`.

---

## 3. Mapping Strategy

1. **Backend Source of Truth**: All data models in `src/types/models.ts` strictly conform to the backend Prisma/Mongoose model definitions (`User`, `Project`, `Target`, `Scan`, `Vulnerability`, `Report`, `AuditLog`, `Subscription`).
2. **Standard API Envelope**: Frontend API client (`src/api/client.ts`) handles the `IApiResponse<T>` wrapper uniformly, unwrapping data payloads seamlessly.
3. **Graceful Fallbacks for Extended Workflows**: For SOC workflows (Incidents, Cases, Tasks) not yet backed by dedicated database tables, client services fall back gracefully to local state while remaining ready for API endpoints.

---

## 4. Files Modified & Synchronized

- `src/types/models.ts`
- `src/api/services/commandCenter.ts`
- `src/api/services/assets.ts`
- `src/api/services/vulnerabilities.ts`
- `src/api/services/incidents.ts`
- `src/api/services/cases.ts`
- `src/api/services/tasks.ts`
- `src/hooks/api/useAssets.ts`
- `src/hooks/api/useVulnerabilities.ts`
- `src/hooks/api/useIncidents.ts`
- `src/hooks/api/useCases.ts`
- `src/hooks/api/useTasks.ts`
- `docs/BACKEND_FRONTEND_MAPPING.md`
- `docs/DOMAIN_RECONCILIATION.md`

---

## 5. Features Ready for Production

- ✅ **Authentication & Session Management**: Login, Register, Profile, Token Refresh (`/api/auth/*`, `/api/user/*`).
- ✅ **Project & Target Asset Discovery**: Project creation, target addition, asset verification (`/api/projects/*`, `/api/targets/*`).
- ✅ **Security Scanning & Orchestration**: Scanner triggering, active scan status polling (`/api/scans`, `/api/targets/:id/scan`).
- ✅ **Vulnerability Lifecycle & AI Analysis**: Vulnerability matrix, AI root cause analysis, false-positive toggling (`/api/vulnerabilities/*`).
- ✅ **Reporting Engine**: Executive and technical report generation and history (`/api/reports/*`).
- ✅ **Bug Bounty Portal**: Program targets, vulnerability submission, automated draft generation, admin payouts (`/api/bugbounty/*`).
- ✅ **AI Security Chat Advisor**: Real-time AI threat conversation (`/api/chat`).
- ✅ **Auto-Remediation Engine**: Automated AST patch generation and verification (`/api/remediations`, `/api/vulnerabilities/:id/remediate`).

---

## 6. Features Waiting for Dedicated Backend Support

- ⏳ **Native Incident Table**: Mapped through `IncidentWorkflow` interface; backed by `Vulnerability` & `Scan` alerts until dedicated `/api/incidents` database table is added in future backend release.
- ⏳ **Case Management System**: Mapped through `CaseWorkflow` interface; linked to Projects & Targets.
- ⏳ **Task Tracking System**: Mapped through `TaskWorkflow` interface; linked to Vulnerability remediation steps.
