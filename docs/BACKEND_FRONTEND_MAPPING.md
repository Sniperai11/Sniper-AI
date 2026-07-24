# Backend-Frontend API Contract & Integration Mapping
**Sniper AI Security Platform — Phase 3.4A Integration Matrix**

This document establishes the definitive mapping between Frontend Modules, API Services, and Backend Endpoints across the Sniper AI Security Platform.

---

## 1. Authentication & User Profile Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useLogin()` / `authService.login` | `/api/auth/login` | `POST` | `{ email: string, mode?: "hunter" \| "admin" }` | `IApiResponse<UserProfile>` | Public |
| `useRegister()` / `authService.register` | `/api/auth/register` | `POST` | `{ name: string, email: string, companyName?: string, mode?: string, role?: string }` | `IApiResponse<UserProfile>` | Public |
| `useLogout()` / `authService.logout` | `/api/auth/logout` | `POST` | `{}` | `IApiResponse<null>` | Bearer Token |
| `useAuth()` / `authService.getMe` | `/api/auth/me` | `GET` | None | `IApiResponse<UserProfile>` | Bearer Token |
| `useForgotPassword()` | `/api/auth/forgot-password` | `POST` | `{ email: string }` | `IApiResponse<{ resetToken: string }>` | Public |
| `useResetPassword()` | `/api/auth/reset-password` | `POST` | `{ token: string, password: string }` | `IApiResponse<null>` | Token Parameter |
| `useProfile()` / `userService.getProfile` | `/api/user/profile` | `GET` | None | `IApiResponse<UserProfile>` | Bearer Token |
| `useSwitchUser()` | `/api/user/switch` | `POST` | `{ userId: string }` | `IApiResponse<UserProfile>` | Bearer Token |
| `useUpdateTeamRole()` | `/api/team/role` | `POST` | `{ memberId: string, newRole: string }` | `IApiResponse<{ teamMembers: TeamMember[] }>` | Admin Only |
| `useAddTeamMember()` | `/api/team/add` | `POST` | `{ name: string, email: string, role?: string }` | `IApiResponse<{ teamMembers: TeamMember[] }>` | Admin Only |
| `useDeleteTeamMember()` | `/api/team/:id` | `DELETE` | Path Param: `id` | `IApiResponse<{ teamMembers: TeamMember[] }>` | Admin Only |
| `useUpgradeSubscription()` | `/api/subscription/upgrade` | `POST` | `{ newPlan: string }` | `IApiResponse<{ subscription: Subscription }>` | Bearer Token |
| `useAuditLogs()` | `/api/audit-logs` | `GET` | None | `IApiResponse<AuditLog[]>` | Bearer Token |
| `useClearAuditLogs()` | `/api/audit-logs/clear` | `POST` | `{}` | `IApiResponse<{ auditLogs: AuditLog[] }>` | Admin Only |

---

## 2. Command Center & Assets Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useProjects()` / `projectService.getProjects` | `/api/projects` | `GET` | None | `IApiResponse<Project[]>` | Bearer Token |
| `useCreateProject()` | `/api/projects/create` | `POST` | `{ name: string, description?: string }` | `IApiResponse<Project>` | Bearer Token |
| `useAddTarget()` | `/api/projects/:id/targets/add` | `POST` | `{ name: string, url: string, type: string }` | `IApiResponse<Target>` | Bearer Token |
| `useVerifyTarget()` | `/api/targets/:id/verify` | `POST` | Path Param: `id` | `IApiResponse<{ target: Target }>` | Bearer Token |
| `useVerifyBountyTarget()` | `/api/targets/:id/verify-bounty` | `POST` | Path Param: `id` | `IApiResponse<{ target: Target }>` | Bearer Token |

---

## 3. Vulnerabilities & Scans Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useVulnerabilities()` / `vulnerabilitiesService.getVulnerabilities` | `/api/vulnerabilities` | `GET` | Optional Query: `search`, `severity`, `state` | `IApiResponse<Vulnerability[]>` | Bearer Token |
| `useVulnerabilityById()` | `/api/vulnerabilities/:id` | `GET` | Path Param: `id` | `IApiResponse<Vulnerability>` | Bearer Token |
| `useAiAnalyzeVulnerability()` | `/api/vulnerabilities/:id/ai-analyze` | `POST` | Path Param: `id` | `IApiResponse<{ aiAnalysis: string, vulnerability: Vulnerability }>` | Bearer Token |
| `useToggleFalsePositive()` | `/api/vulnerabilities/:id/toggle-false-positive` | `POST` | Path Param: `id` | `IApiResponse<{ vulnerability: Vulnerability }>` | Analyst/Admin |
| `useActiveScans()` | `/api/scans` | `GET` | None | `IApiResponse<ScanJob[]>` | Bearer Token |
| `useStartScan()` | `/api/targets/:id/scan` | `POST` | Path Param: `id` | `IApiResponse<{ scanJob: ScanJob }>` | Bearer Token |

---

## 4. Incidents & AI Chat Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useIncidents()` / `incidentsService.getIncidents` | `/api/incidents` | `GET` | Optional Query: `search`, `severity`, `state` | `IApiResponse<Incident[]>` | Bearer Token |
| `useChatWithAdvisor()` | `/api/chat` | `POST` | `{ messages: Array<{ role: "user" \| "model", text: string }> }` | `IApiResponse<{ reply: string }>` | Bearer Token |

---

## 5. Reports & Remediation Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useReportsHistory()` | `/api/reports/history` | `GET` | None | `IApiResponse<Report[]>` | Bearer Token |
| `useGenerateReport()` | `/api/projects/:projectId/report` | `GET` | Path Param: `projectId` | `IApiResponse<Report>` | Bearer Token |
| `useRemediations()` | `/api/remediations` | `GET` | None | `IApiResponse<RemediationRecord[]>` | Bearer Token |
| `usePerformRemediation()` | `/api/vulnerabilities/:id/remediate` | `POST` | Path Param: `id`, Body: `{ vulnerableCode?: string }` | `IApiResponse<RemediationResult>` | Admin Only |

---

## 6. Bug Bounty Module

| Frontend Service / Hook | Backend Endpoint | HTTP Method | Request Schema | Response Schema | Auth Requirements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `useBountyData()` | `/api/bugbounty/data` | `GET` | None | `IApiResponse<BountyData>` | Bearer Token |
| `useSubmitBounty()` | `/api/bugbounty/submit` | `POST` | `{ targetName, title, severity, description, poc }` | `IApiResponse<{ submission: BountySubmission, submissions: BountySubmission[] }>` | Bearer Token |
| `useReviewBounty()` | `/api/bugbounty/submissions/:id/review` | `POST` | `{ status: string, rewardAmount?: string }` | `IApiResponse<{ submission: BountySubmission, submissions: BountySubmission[] }>` | Admin Only |
| `useGenerateBountyDraft()` | `/api/bugbounty/generate-report` | `POST` | `{ title, vulnType, severity, pocSteps, impact }` | `IApiResponse<{ report: string }>` | Bearer Token |

---

## 7. Realtime Connection & SSE Mapping

| Communication Type | Backend Provider / Endpoint | Event Name / Topic | Frontend Receiver Hook / Bus |
| :--- | :--- | :--- | :--- |
| Server-Sent Events (SSE) / Polling Fallback | `/api/scans` / Active Scanner Jobs | `scanProgress` / `scannerLogs` | `useScanSSE` / `useActiveScans` (1.5s refresh during active scans) |
| Event Bus | In-Memory / Client Event Emitter | `workflow:updated` | `useWorkflowEventBus` |

---

## 8. Data Envelope Handling Rule

All API endpoints return data formatted in the `IApiResponse<T>` envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": [],
  "timestamp": "2026-07-24T09:00:00.000Z"
}
```

The frontend client in `src/api/client.ts` automatically extracts `response.data.data` when `response.data.success === true`.
