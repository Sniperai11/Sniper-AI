# Sniper AI Security Platform — Backend Architecture

## Overview
This document outlines the Enterprise Production-ready backend architecture for the Sniper AI Security Platform. The platform runs on Node.js + Express, integrated with Vite in development and compiled to a standalone production app using esbuild.

## Folder Structure
- \`/backend/config\` — Environment and initialization
- \`/backend/controllers\` — Split business logic controllers (Standard REST)
- \`/backend/database\` — Drizzle ORM, schema, and seed logic
- \`/backend/interfaces\` & \`/backend/types\` — TypeScript definitions
- \`/backend/middleware\` — Auth, logging, and security middleware
- \`/backend/repositories\` — Data access layer
- \`/backend/routes\` — Express API routing
- \`/backend/security\` — Threat intelligence & scanning modules
- \`/backend/services\` — Heavy lifting business logic (AI Engine, Project handling)
- \`/backend/utils\` — Shared helpers (Formatter, Logger, Validators)

## Route Map & Versioning
The platform exposes standard endpoints under \`/api\` and \`/api/v1\` for backward compatibility.
- **Auth**: \`/auth/login\`, \`/auth/register\`
- **User/Team**: \`/user/profile\`, \`/team/role\`
- **Projects**: \`/projects\` (Creates projects), \`/projects/:id/targets\`
- **Scans**: \`/scans\`, \`/scans/profiles\`, \`/scans/:id\`
- **Vulnerabilities**: \`/vulnerabilities\`, \`/vulnerabilities/:id/ai-analyze\`
- **Bounty**: \`/bugbounty/data\`, \`/bugbounty/submit\`

## Controller Map
- **ProjectController**: Manages projects and audit targets.
- **ScanController**: Orchestrates active scanning sessions.
- **VulnerabilityController**: Manages vulnerabilities, toggles, and AI Analysis.
- **ScanProfileController**: Handles scan profile rulesets.
- **RemediationController**: Self-healing and auto-patching engine.
- **AuthController**: Manages sessions.

## Repository Map
All database calls are consolidated in:
- \`ScanRepository\` (optimized bulk operations)
- \`ProjectRepository\`
- \`UserRepository\`
- \`RemediationRepository\`

## Authentication & Authorization Flow
1. \`attachUser\` middleware intercepts the request.
2. If token exists, extracts user and team scopes.
3. \`requireAdmin\` checks RBAC for sensitive mutations.
4. Repositories automatically enforce company-specific isolation boundaries.
