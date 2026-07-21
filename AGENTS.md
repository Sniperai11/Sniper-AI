# Sniper AI Security — Development Constitution & Guidelines (دستور تطوير المنصة)

> **CRITICAL MANDATE (أمر بالغ الحساسية):**
> This file serves as the core instruction set for all AI agents working on the **Sniper AI Security Platform**. The twelve volumes of the engineering constitution (located in the `/docs` directory) are the absolute architectural, security, and design reference. Every modification, feature expansion, and code refactoring MUST strictly adhere to these volumes.
>
> إن هذا الملف بمثابة دستور العمل المعتمد والمستمر لجميع نماذج الذكاء الاصطناعي والمطورين الذين يعملون على منصة **Sniper AI Security**. المجلدات الاثني عشر للدستور الهندسي (المخزنة في مجلد `/docs`) تمثل المرجع النهائي للتصميم والهندسة والأمان. أي تعديل أو ميزة جديدة يجب أن تتطابق وتلتزم التزاماً كاملاً بهذه المعايير.

---

## 1. The Twelve Volumes of the Platform Constitution (المجلدات الاثني عشر للدستور)

All development tasks must read, understand, and apply the rules defined in these volumes:

1. **Volume I: Engineering Constitution & Core Values (`/docs/Volume_I_Engineering_Constitution.md`)**
   - General vision, typography, visual theme, design principles, and quality metrics.
2. **Volume II: Enterprise Architecture (`/docs/Volume_II_Enterprise_Architecture.md`)**
   - High-performance modular architecture, decoupling, and standard directory structure.
3. **Volume III: Backend Bible (`/docs/Volume_III_Backend_Bible.md`)**
   - Express server structure, middleware, API standard design, routing, and clean code conventions.
4. **Volume IV: Security & Pentest Engine (`/docs/Volume_IV_Security_Engine.md`)**
   - Scan modules, CLI orchestration (Nmap, Subfinder, etc.), sandboxing, and output parsing rules.
5. **Volume V: AI Security Engine (`/docs/Volume_V_AI_Engine.md`)**
   - Integration with Google `@google/genai` SDK (Gemini 3.5 Flash & 3.1 Pro), JSON Schema extraction, and prompt engineering rules.
6. **Volume VI: Database Architecture (`/docs/Volume_VI_PostgreSQL_Prisma.md`)**
   - PostgreSQL and Prisma ORM configurations, strict multi-tenancy isolation (`company_id`), indexing, and transaction management.
7. **Volume VII: Dashboard UI & User Experience (`/docs/Volume_VII_Dashboard_UI.md`)**
   - Front-end principles, Cosmic Dark theme, responsive design (Tailwind CSS), Lucide React icons, and real-time SSE progress updates.
8. **Volume VIII: Reporting Engine (`/docs/Volume_VIII_Reporting_Engine.md`)**
   - Generation of Executive and Technical PDF/HTML/JSON reports, Puppeteer & Handlebars rendering pipeline, and CVSS project risk scoring equation.
9. **Volume IX: Performance Optimization & Scalability (`/docs/Volume_IX_Performance_Optimization.md`)**
   - Redis/BullMQ job queues, background worker isolation, intelligent multi-level caching (TTL policies), and Node.js clustering.
10. **Volume X: Deployment, DevOps & Cloud Infrastructure (`/docs/Volume_X_Deployment_DevOps.md`)**
    - Dockerization (multi-stage builds), Google Cloud Run deployment with gVisor kernel sandboxing, and secure secrets management.
11. **Volume XI: Bug Bounty & Vulnerability Disclosure (`/docs/Volume_XI_Bug_Bounty_Disclosure.md`)**
    - CVD policies, automated duplicate detection, multi-signature payouts, KYC, and embargo constraints (90-day safe harbor).
12. **Volume XII: AI-Driven Auto-Remediation & Self-Healing (`/docs/Volume_XII_Auto_Remediation_Self_Healing.md`)**
    - Abstract Syntax Tree (AST) code manipulation, three-dimensional verification (Linter, Unit Tests, Security Re-scans), and sandboxed execution.

---

## 2. General Code Quality & Behavior Guidelines (إرشادات جودة الكود وسلوكه)

### 2.1 Backend Conventions
- **Server-Side Only Secrets:** Never expose API keys (including `GEMINI_API_KEY`) to the client-side. Make all AI calls on the server.
- **Strict Error Handling:** Use custom `AppError` and central Express error handler middlewares. Never leak system details to the end-user.
- **Port and Host:** Bind Express server to port `3000` and host `0.0.0.0` as required by the platform proxy.

### 2.2 Frontend Conventions
- **Design:** Cosmic Dark Slate theme. Responsive padding, tracking, and margins. Use custom Tailwind classes directly.
- **Icons:** All icons MUST be imported from `lucide-react`. Never create inline SVGs unless absolutely required for dynamic charts.
- **State & Sync:** Use Server-Sent Events (SSE) for real-time progress updates on scanning processes. Avoid aggressive polling.

---

*This constitution has been officially approved and locked. All future agents: read `/docs` before editing.*
