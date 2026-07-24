# Sniper AI Security - Frontend API Contracts

This document defines the standard API contracts and data models used by the frontend to communicate with the backend services.

## Base Configuration
- **Base URL:** Defined via `VITE_API_URL` environment variable. Default: `/api`.
- **Authentication:** All protected routes require a Bearer token in the `Authorization` header.

## Standard API Response Format (Envelope)
All responses from the backend should adhere to this envelope format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;        // Indicates if the operation was successful
  message: string;        // Human-readable message
  data: T;                // The requested data payload (null if error)
  errors?: string[];      // List of error messages if success is false
  timestamp?: string;     // ISO timestamp of the response
}
```

## Global Error Handling
The frontend `apiClient` intercepts the following standard HTTP errors:
- **401 Unauthorized:** Triggers token refresh flow. If refresh fails, user is logged out.
- **403 Forbidden:** User lacks permissions. Triggers an access denied event.
- **404 Not Found:** Handled globally or locally depending on context.
- **500+ Server Errors:** Handled by global toast/notification.

---

## Module: Command Center

### Get System Stats
- **Endpoint:** `GET /system-stats`
- **Method:** `GET`
- **Response:** `ApiResponse<SystemStats>`
```typescript
interface SystemStats {
  activeAssets: number;
  totalVulnerabilities: number;
  openIncidents: number;
  activeAgents: number;
  riskScore: number;
}
```

### Get Risk Trend
- **Endpoint:** `GET /risk-trend`
- **Method:** `GET`
- **Response:** `ApiResponse<RiskTrendEntry[]>`
```typescript
interface RiskTrendEntry {
  name: string;
  critical: number;
  high: number;
  medium: number;
}
```

### Get Asset Distribution
- **Endpoint:** `GET /asset-distribution`
- **Method:** `GET`
- **Response:** `ApiResponse<AssetDistributionEntry[]>`
```typescript
interface AssetDistributionEntry {
  name: string;
  value: number;
  color: string;
}
```

### Get Recent Alerts
- **Endpoint:** `GET /recent-alerts`
- **Method:** `GET`
- **Response:** `ApiResponse<AlertEntry[]>`
```typescript
interface AlertEntry {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  asset: string;
  type: string;
  time: string;
  status: 'Open' | 'Investigating' | 'Remediated';
  risk: number;
}
```
