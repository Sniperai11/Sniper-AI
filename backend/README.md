# البنية الهندسية الخلفية الاحترافية (Enterprise Backend Foundation)

مرحباً بك في وثيقة البنية الهندسية الخلفية للمنصة الأمنية الذكية. تم تصميم وهيكلة الكود البرمجي هنا باستخدام مبادئ **Clean Architecture** و **SOLID** ليكون قابلاً للتوسع ومستعداً للربط مع قواعد البيانات السحابية الكبرى والـ ORM مثل Prisma و PostgreSQL.

---

## 1. هيكل المجلدات (Folder Structure)

تم تنظيم المشروع في طبقات تفصل المسؤوليات تماماً عن بعضها:

```text
backend/
├── config/              # الإعدادات والثوابت وصلاحيات النظام والمطابقة الأمنية
│   ├── env.ts
│   ├── constants.ts
│   ├── permissions.ts
│   ├── scannerConfig.ts
│   ├── reportConfig.ts
│   └── securityConfig.ts
├── controllers/         # معالجة طلبات الـ HTTP والتواصل مع الواجهات
│   ├── userController.ts
│   ├── projectController.ts
│   ├── scanController.ts
│   ├── reportController.ts
│   ├── bountyController.ts
│   └── chatController.ts
├── errors/              # معالجة الاستثناءات والأخطاء المخصصة بمستويات هندسية
│   ├── ApiError.ts
│   ├── ValidationError.ts
│   ├── AuthenticationError.ts
│   ├── AuthorizationError.ts
│   ├── ScannerError.ts
│   ├── AIError.ts
│   └── DatabaseError.ts
├── interfaces/          # واجهات الخدمات والمستودعات لفرض مبدأ الـ DI
│   ├── IScanner.ts
│   ├── IAIEngine.ts
│   ├── IReportEngine.ts
│   ├── IRepository.ts
│   ├── IUserService.ts
│   └── IProjectService.ts
├── models/              # نماذج البيانات البرمجية وهياكل الكيانات (Domain Entities)
│   ├── User.ts
│   ├── Project.ts
│   ├── Target.ts
│   ├── Scan.ts
│   ├── Vulnerability.ts
│   ├── Report.ts
│   ├── Subscription.ts
│   ├── Notification.ts
│   └── AuditLog.ts
├── repositories/        # فصل كامل للاستعلام والتخزين (Data Access Object Pattern)
│   ├── UserRepository.ts
│   ├── ProjectRepository.ts
│   ├── ScanRepository.ts
│   └── ReportRepository.ts
├── routes/              # خرائط وموجهات واجهات البرمجة (Express API Routes)
│   └── api.ts
├── services/            # المنطق البرمجي للأعمال وحقن الاعتمادات (Business Logic)
│   ├── UserService.ts
│   ├── ProjectService.ts
│   ├── securityEngine.ts
│   ├── reportingEngine.ts
│   └── aiEngine.ts
├── types/               # تعريفات ومصفوفات TypeScript الصارمة لتجنب استخدام any
│   ├── api.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── scanner.ts
│   ├── report.ts
│   ├── ai.ts
│   └── user.ts
└── utils/               # أدوات مساعدة وأنظمة تحقق وتنسيق الاستجابة والـ Logging
    ├── logger.ts
    ├── validators.ts
    ├── helpers.ts
    ├── formatter.ts
    ├── date.ts
    └── crypto.ts
```

---

## 2. تدفق البيانات (Data Flow)

يتبع النظام تدفقاً أحادي الاتجاه متسلسلاً لضمان عدم وجود تداخل في المسؤوليات (Separation of Concerns):

```text
[العميل / Client Dashboard]
        │ (طلب HTTP Request)
        ▼
[Express Routes (api.ts)]
        │ (توجيه وتطبيق Middleware التحقق والتفويض)
        ▼
[Controllers (e.g., ScanController)] ───► [Validators & Sanitizers]
        │ (استدعاء الخدمة المحقونة)
        ▼
[Services (e.g., ProjectService)]  ◄───► [Enterprise AI Engines / External APIs]
        │ (استعلام / تخزين البيانات)
        ▼
[Repositories (UserRepository)]
        │ (الوصول المباشر للبيانات)
        ▼
[Database System (In-Memory File DB / Prisma SQL)]
```

---

## 3. تدفق الخدمة (Service Flow)

عند تشغيل فحص أمني:
1. يرسل الـ `ScanController` طلباً لبدء فحص هدف معين.
2. تتحقق الخدمة `ProjectService` من ملكية الهدف والاشتراك.
3. يقوم الـ `securityEngine` بإطلاق الفحص بشكل غير متزامن (Asynchronous background thread).
4. يجمع الـ `securityEngine` البيانات ثم يمررها لـ `aiEngine` (المعتمد على Gemini 3.5 Flash) لتوليد الثغرات.
5. يحفظ الـ `ScanRepository` الثغرات في قاعدة البيانات ويحدث المخاطر.

---

## 4. تدفق واجهة برمجة التطبيقات (API Flow)

جميع الاستجابات المرجعة من الخادم تخضع للتنسيق الموحد التالي لتسهيل الاندماج مع واجهة المستخدم (Response Format Consistency):

### استجابة ناجحة (Success Response):
```json
{
  "success": true,
  "message": "تم جلب بيانات الملف الشخصي بنجاح",
  "data": {
    "user": { "email": "elhammoh2795@gmail.com", "role": "Admin" },
    "subscription": { "plan": "Professional" }
  },
  "errors": [],
  "timestamp": "2026-07-20T12:00:00.000Z"
}
```

### استجابة خطأ (Error Response):
```json
{
  "success": false,
  "message": "حقول مطلوبة مفقودة: name",
  "data": null,
  "errors": ["ValidationError: name property is required"],
  "timestamp": "2026-07-20T12:00:00.000Z"
}
```

---
تم استكمال البنية الهندسية بنجاح 100% لتكون جاهزة للمرحلة التالية من الانتقال لـ SQL وقواعد البيانات الكبرى.
