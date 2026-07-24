# Phase 3.1: Production Readiness Check Report

## 1. Environment Validation
- Created `src/api/config/env.ts`.
- Validates all required `VITE_*` variables (`VITE_API_URL`, `VITE_WS_URL`, `VITE_APP_ENV`).
- Fails fast by throwing an error and logging to the console if critical variables are missing at runtime.

## 2. API Client Architecture
- Added `timeout: 15000` to the Axios `apiClient` instance.
- Supports native `AbortController` cancellation by passing signal configs into Axios.
- Upgraded the interceptor structure to handle `InternalAxiosRequestConfig` strictly to resolve typing issues.
- Implemented queueing for parallel requests that hit a 401, pausing them until the refresh finishes.

## 3. Token Management
- Extended `TokenManager` to handle `refreshToken` alongside `accessToken`.
- Implemented automatic token refresh inside the `apiClient` interceptor:
  - If a 401 occurs, requests are queued while the refresh hits `/auth/refresh`.
  - If the refresh succeeds, tokens are updated and queued requests are replayed.
  - If the refresh fails, `clearToken()` is called, the queue is rejected, and a global `auth:unauthorized` event triggers a logout.

## 4. React Query Standard
- Configured `src/api/queryClient.ts` globally:
  - Enabled `refetchOnWindowFocus: true` for automatic background data freshness.
  - Set `staleTime: 1000 * 60 * 5` (5 minutes) for optimal caching performance.
  - Implemented an automatic retry policy exclusively for safe network/server errors (status >= 500). 4xx errors (e.g. 401, 403, 404) are NOT retried.
  - Integrated `QueryCache` and `MutationCache` global onError handlers that log directly to the centralized logger.

## 5. Centralized Logging
- Created `src/api/utils/logger.ts`.
- Controls log levels based on `env.APP_ENV`. In `production`, `debug` and `info` logs are suppressed.
- Redacts or truncates overly long payload parameters and explicitly redacts `Bearer` tokens from logs.
- Centralized `console.info/warn/error/debug` behavior.

## 6. Security
- API client automatically filters logs to avoid token spillage.
- Added a security warning interceptor that alerts if an outgoing request's URL does not match the configured `env.API_URL` prefix (preventing rogue external requests).
- Secrets are explicitly scoped out of the bundle (only `VITE_` exposed).
