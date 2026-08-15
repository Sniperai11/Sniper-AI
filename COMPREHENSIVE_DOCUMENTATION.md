# 📚 دليل التوثيق الشامل - منصة Sniper AI Security

**الإصدار:** 1.0.0 Production Release  
**آخر تحديث:** 2026-08-15  
**الحالة:** ✅ جاهز للإنتاج

---

## 📖 جدول المحتويات

1. [نظرة عامة على النظام](#نظرة-عامة)
2. [المعمارية والتصميم](#المعمارية)
3. [تثبيت وإعداد](#التثبيت)
4. [استخدام النظام](#الاستخدام)
5. [الأدوات والمسحات](#الأدوات)
6. [API Reference](#api)
7. [استكشاف الأخطاء](#الأخطاء)
8. [الأمان والامتثال](#الأمان)
9. [الأداء والتحسينات](#الأداء)

---

## 🎯 نظرة عامة على النظام {#نظرة-عامة}

### ما هي منصة Sniper AI؟

**Sniper AI Security** هي منصة متكاملة لاختبار الأمن السيبراني بالذكاء الاصطناعي تجمع بين:

- 🔬 **محركات فحص متقدمة:** Nmap, Nuclei, OWASP ZAP, SQLMap, Burp Suite
- 🤖 **ذكاء اصطناعي:** Google Gemini 3.5 Flash لتحليل متقدم للثغرات
- 📊 **تقارير شاملة:** تقارير تنفيذية وتفصيلية بمعايير OWASP/ISO/PCI
- 🔄 **ترميم ذاتي:** إصلاح تلقائي موجه للثغرات الشائعة
- 🌍 **دعم لغات:** واجهة عربية كاملة + إنجليزية

### الحالات الاستخدام الرئيسية

| الحالة | الوصف | المستخدمون |
|--------|-------|-----------|
| **اختبار الأمان الدوري** | فحص تطبيقات الويب والـ APIs بشكل منتظم | فريق DevOps/Security |
| **فحص التطبيقات الجديدة** | اختبار شامل قبل الإطلاق في الإنتاج | مطورون/QA |
| **فحص البنية التحتية** | مسح الأنفاق والخدمات المكتشفة | SecOps Engineers |
| **إدارة الثغرات** | تتبع وحل الثغرات المكتشفة | Security Managers |
| **التقارير والامتثال** | توليد تقارير الامتثال | Compliance Officers |

---

## 🏗️ المعمارية والتصميم {#المعمارية}

### معمارية النظام الكاملة

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Dashboard │ Projects │ Scans │ Vulnerabilities │ Reports  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Express.js)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ /api/projects │ /api/scans │ /api/vulnerabilities   │  │
│  │ /api/reports │ /api/auth │ /api/users              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────┐
│              Backend Services Layer (TypeScript)            │
│  ┌─────────────────────┬─────────────────────────────────┐ │
│  │ Security Engine     │ AI Engine (Gemini API)          │ │
│  │ - Scanner Manager   │ - Vulnerability Generation     │ │
│  │ - Scanner Plugins   │ - Threat Analysis              │ │
│  │ - Result Normalizer │ - Report Generation            │ │
│  │ - Self-Healing      │ - Chat Advisor                 │ │
│  └─────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────┐
│           Security Scanners (External Tools)                │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │   Nmap   │  Nuclei  │  OWASP   │ SQLMap   │  Nikto    │ │
│  │          │          │   ZAP    │          │           │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │ Subfinder│  Amass   │ WhatWeb  │  Trivy   │ Burp Suite│ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ⬇️
┌─────────────────────────────────────────────────────────────┐
│           Data & Storage Layer (Firebase/SQL)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Projects │ Targets │ Vulnerabilities │ Reports │ Logs │  │
│  │ Users │ Teams │ Subscriptions │ Audit Logs           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### تدفق الفحص الأمني (Scan Flow)

```
1️⃣ إطلاق المسح
   └─→ إنشاء Scan Job
   └─→ اختيار ملف الفحص (Quick/Standard/Deep)

2️⃣ الفحص الحي
   └─→ الاتصال بالهدف (HTTP/HTTPS)
   └─→ استخراج الترويسات والمعلومات

3️⃣ خط أنابيب الأدوات
   └─→ تشغيل الأدوات بالتوازي
   └─→ Nmap (مسح الأنفاق)
   └─→ Nuclei (فحص النماذج)
   └─→ OWASP ZAP (فحص الويب)
   └─→ SQLMap (اختبار SQL)
   └─→ ... أدوات أخرى

4️⃣ تطبيع النتائج
   └─→ تحويل إلى صيغة موحدة
   └─→ فلترة النتائج المكررة
   └─→ التحقق من الدليل (Evidence)

5️⃣ الإثراء بـ AI
   └─→ استدعاء Gemini API
   └─→ تحسين الأوصاف
   └─→ إضافة حلول برمجية
   └─→ ربط المعايير

6️⃣ حفظ النتائج
   └─→ تخزين الثغرات في قاعدة البيانات
   └─→ تحديث درجة المخاطر
   └─→ إنشاء التقارير

7️⃣ الانتهاء
   └─→ تحديث حالة الفحص
   └─→ إرسال إخطارات
```

---

## 🚀 التثبيت والإعداد {#التثبيت}

### المتطلبات الأساسية

```bash
# Node.js والحزم
- Node.js v18+ (أو Bun)
- npm أو yarn أو bun

# أدوات الفحص الخارجية
- Nmap 7.80+
- Nuclei v2.9+
- OWASP ZAP
- SQLMap 1.5+
- Nikto 2.1+
- Subfinder
- Amass
- WhatWeb
- Trivy

# البيانات والخدمات
- Firebase (Authentication + Realtime DB)
- Google Cloud (Gemini API)
- SQL Database (MySQL/PostgreSQL)
```

### خطوات التثبيت

#### 1. استنساخ المستودع

```bash
git clone https://github.com/Sniperai11/Sniper-AI.git
cd Sniper-AI
git checkout production-release-v1.0.0
```

#### 2. تثبيت الحزم

```bash
# استخدام npm
npm install

# أو استخدام bun (أسرع)
bun install
```

#### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

حرّر ملف `.env`:

```env
# ============ Gemini API ============
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash

# ============ Firebase ============
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# ============ Database ============
SQL_HOST=localhost
SQL_PORT=3306
SQL_DB_NAME=sniper_ai_production
SQL_USER=root
SQL_PASSWORD=secure_password

# ============ Application ============
APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000

# ============ Scanners ============
NUCLEI_ENABLED=true
NMAP_ENABLED=true
BURP_SUITE_ENABLED=false  # تفعيل إذا كان Burp مثبتاً
TRIVY_ENABLED=true

# ============ Burp Suite (اختياري) ============
BURP_API_URL=http://localhost:8080
BURP_API_KEY=your_burp_api_key

# ============ Logging ============
LOG_LEVEL=info
LOG_DIR=./logs
```

#### 4. تهيئة قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
mysql -u root -p < database/schema.sql

# تطبيق الهجرات
npm run migrate
```

#### 5. تثبيت أدوات الفحص

```bash
# Nuclei
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Nmap
sudo apt-get install nmap

# Subfinder
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest

# Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# الأدوات الأخرى
sudo apt-get install sqlmap nikto whatweb
```

#### 6. بدء التطبيق

```bash
# بيئة التطوير
npm run dev

# بيئة الإنتاج
npm run build
npm start

# استخدام Docker (اختياري)
docker-compose up -d
```

---

## 💻 استخدام النظام {#الاستخدام}

### واجهة المستخدم الرئيسية

#### 1. لوحة التحكم (Dashboard)

- عرض الإحصائيات العامة
- آخر المشاريع والفحوصات
- ملخص الثغرات حسب الشدة
- رسوم بيانية للمخاطر

**الوصول:** `https://your-domain.com/dashboard`

#### 2. المشاريع (Projects)

**إنشاء مشروع جديد:**

```
الخطوة 1: اضغط "إنشاء مشروع"
الخطوة 2: أدخل اسم ووصف المشروع
الخطوة 3: حدد فريق العمل
الخطوة 4: اضغط "حفظ"
```

**إضافة أهداف الفحص (Targets):**

```
الخطوة 1: افتح المشروع
الخطوة 2: اذهب إلى "الأهداف"
الخطوة 3: اضغط "إضافة هدف"
الخطوة 4: أدخل URL أو IP الهدف
الخطوة 5: حدد نوع الهدف (Website/API/Mobile)
الخطوة 6: اضغط "تحقق الملكية" ثم "حفظ"
```

#### 3. المسحات (Scans)

**بدء فحص جديد:**

```bash
# عبر الواجهة
1. افتح المشروع → الأهداف
2. اختر الهدف → "بدء فحص"
3. حدد نوع الفحص:
   - Quick (سريع - 5 دقائق)
   - Standard (معياري - 15 دقيقة)
   - Deep (عميق - 60 دقيقة)
4. اضغط "بدء"
```

**عبر API:**

```bash
curl -X POST https://your-domain.com/api/scans/start \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetId": "tgt-12345",
    "profile": "standard"
  }'
```

#### 4. الثغرات (Vulnerabilities)

**عرض الثغرات:**

```
1. اذهب إلى "الثغرات"
2. صفّ حسب: الشدة، النوع، المشروع
3. اضغط على الثغرة لعرض التفاصيل الكاملة
```

**تصنيفات الثغرات:**

- 🔴 **حرجة (Critical):** CVSS 9.0-10.0
- 🟠 **عالية (High):** CVSS 7.0-8.9
- 🟡 **متوسطة (Medium):** CVSS 4.0-6.9
- 🟢 **منخفضة (Low):** CVSS 0.1-3.9

#### 5. التقارير (Reports)

**إنشاء تقرير:**

```
1. اذهب إلى "التقارير"
2. اختر المشروع والفترة الزمنية
3. اختر نوع التقرير:
   - ملخص تنفيذي
   - تقرير تفصيلي
   - تقرير المخاطر
4. اضغط "إنشاء التقرير"
5. اختر الصيغة: PDF, HTML, Excel
```

---

## 🛠️ الأدوات والمسحات {#الأدوات}

### قائمة الأدوات المدمجة

#### 🔍 مسح الأنفاق والخدمات

| الأداة | الاستخدام | الخرج |
|--------|----------|-------|
| **Nmap** | مسح الأنفاق المفتوحة والخدمات | فتح المنافذ، الخدمات، إصدارات OS |
| **Subfinder** | تعداد النطاقات الفرعية | DNS subdomains |
| **Amass** | استكشاف DNS معمق | شبكة DNS، IP addresses |

#### 🎯 فحص تطبيقات الويب

| الأداة | الاستخدام | الخرج |
|--------|----------|-------|
| **OWASP ZAP** | فحص الويب الديناميكي | SQL Injection, XSS, etc. |
| **Nikto** | كشف مشاكل الخادم | Web Server Vulnerabilities |
| **WhatWeb** | تحديد التقنيات المستخدمة | CMS, Libraries, Frameworks |

#### 🔐 فحص الثغرات المعروفة

| الأداة | الاستخدام | الخرج |
|--------|----------|-------|
| **Nuclei** | فحص النماذج المتقدمة | CVEs, Misconfigurations |
| **SQLMap** | اختبار حقن SQL | SQL Injection Vulnerabilities |
| **Burp Suite** | فحص شامل احترافي | Advanced Web Vulnerabilities |

#### 📦 فحص التبعيات والصور

| الأداة | الاستخدام | الخرج |
|--------|----------|-------|
| **Trivy** | فحص الصور والـ filesystems | CVEs, Misconfigurations |

### ملفات الفحص (Scan Profiles)

#### Quick Profile (سريع)

```yaml
المدة: ~5 دقائق
الأدوات:
  - WhatWeb (تحديد التقنيات)
  - Nikto (مسح أساسي)
  - Nuclei (فحص النماذج الشهيرة)

الاستخدام: الفحص السريع للمشاريع الجديدة
```

#### Standard Profile (معياري)

```yaml
المدة: ~15 دقيقة
الأدوات:
  - Nmap (مسح الأنفاق)
  - Nuclei (فحص شامل)
  - Nikto (فحص الخادم)
  - WhatWeb (تحديد التقنيات)
  - Subfinder (استكشاف النطاقات)

الاستخدام: الفحص الدوري المعياري
```

#### Deep Profile (عميق)

```yaml
المدة: ~60 دقيقة
الأدوات:
  - Nmap (مسح شامل)
  - Nuclei (جميع النماذج)
  - OWASP ZAP (فحص ديناميكي)
  - SQLMap (اختبار SQL معمق)
  - Nikto (فحص شامل)
  - WhatWeb
  - Subfinder
  - Amass
  - Burp Suite (إذا كان متاحاً)

الاستخدام: الفحص الشامل قبل الإطلاق
```

---

## 📡 API Reference {#api}

### الأصول الأساسية (Base URL)

```
https://your-domain.com/api/v1
```

### المصادقة

جميع الطلبات تتطلب `Authorization` header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### المشاريع (Projects)

#### إنشاء مشروع

```bash
POST /projects
Content-Type: application/json

{
  "name": "اسم المشروع",
  "description": "وصف المشروع",
  "teamId": "team-123"
}

الاستجابة:
{
  "id": "proj-123",
  "name": "اسم المشروع",
  "createdAt": "2026-08-15T11:00:00Z"
}
```

#### الحصول على قائمة المشاريع

```bash
GET /projects?page=1&limit=10

الاستجابة:
{
  "data": [
    {
      "id": "proj-123",
      "name": "المشروع الأول",
      "targetCount": 5,
      "lastScanDate": "2026-08-15T10:00:00Z"
    }
  ],
  "pagination": { "total": 42, "page": 1 }
}
```

### الفحوصات (Scans)

#### بدء فحص جديد

```bash
POST /scans/start
Content-Type: application/json

{
  "targetId": "tgt-456",
  "profile": "standard"
}

الاستجابة:
{
  "scanId": "scan-789",
  "status": "initiated",
  "estimatedDuration": 900
}
```

#### الحصول على حالة الفحص

```bash
GET /scans/{scanId}

الاستجابة:
{
  "id": "scan-789",
  "status": "in_progress",
  "progress": 45,
  "vulnerabilitiesFound": 12,
  "startedAt": "2026-08-15T11:00:00Z"
}
```

#### إلغاء فحص

```bash
POST /scans/{scanId}/cancel

الاستجابة:
{
  "id": "scan-789",
  "status": "cancelled",
  "cancelledAt": "2026-08-15T11:15:00Z"
}
```

### الثغرات (Vulnerabilities)

#### الحصول على الثغرات

```bash
GET /vulnerabilities?severity=critical,high&verified=true

الاستجابة:
{
  "data": [
    {
      "id": "vuln-1",
      "title": "SQL Injection",
      "severity": "Critical",
      "cvssScore": 9.8,
      "location": "/api/login",
      "state": "open",
      "createdAt": "2026-08-15T11:00:00Z"
    }
  ]
}
```

#### الحصول على تفاصيل الثغرة

```bash
GET /vulnerabilities/{vulnId}

الاستجابة:
{
  "id": "vuln-1",
  "title": "SQL Injection",
  "type": "SQLi",
  "severity": "Critical",
  "cvssScore": 9.8,
  "location": "/api/login?user=",
  "description": "المعامل user معرض لحقن SQL...",
  "impact": "إمكانية الوصول الكامل لقاعدة البيانات",
  "remediation": "استخدام Parameterized Queries",
  "evidence": "curl -v 'http://target/api/login?user=admin'",
  "complianceMapping": {
    "owasp": "A03:2021-Injection",
    "iso27001": "A.14.2",
    "pciDss": "6.5.1"
  }
}
```

#### تحديث حالة الثغرة

```bash
PATCH /vulnerabilities/{vulnId}
Content-Type: application/json

{
  "state": "resolved",
  "resolution": "تم تطبيق الحل",
  "resolutionDate": "2026-08-15T12:00:00Z"
}

الاستجابة: HTTP 200 OK
```

### التقارير (Reports)

#### إنشاء تقرير

```bash
POST /reports/generate
Content-Type: application/json

{
  "projectId": "proj-123",
  "reportType": "executive_summary",
  "dateFrom": "2026-08-01",
  "dateTo": "2026-08-15",
  "format": "pdf"
}

الاستجابة:
{
  "id": "rep-123",
  "status": "generating",
  "estimatedReadyTime": "2026-08-15T12:15:00Z"
}
```

#### تحميل التقرير

```bash
GET /reports/{reportId}/download

الاستجابة: Binary PDF/Excel file
```

---

## 🔧 استكشاف الأخطاء {#الأخطاء}

### المشاكل الشائعة والحلول

#### 1. فشل الاتصال بـ Gemini API

**الخطأ:**
```
Error: GEMINI_API_KEY not configured or using dummy key
```

**الحل:**
```bash
# تحقق من متغير البيئة
echo $GEMINI_API_KEY

# إذا كان فارغاً، أضفه في .env
GEMINI_API_KEY=your_actual_key_here

# أعد تشغيل التطبيق
npm restart
```

#### 2. أداة الفحص غير مثبتة

**الخطأ:**
```
[Nmap] command not found
```

**الحل:**
```bash
# تثبيت الأداة المفقودة
sudo apt-get update
sudo apt-get install nmap

# تحقق من التثبيت
nmap --version
```

#### 3. مهلة زمنية للفحص

**الخطأ:**
```
Scan timeout after 600000ms
```

**الحل:**
```bash
# زيادة المهلة الزمنية في .env
SCANNER_GLOBAL_TIMEOUT=900000  # 15 دقيقة

# أو استخدم ملف فحص أسرع
profile: "quick"
```

#### 4. فشل الاتصال بـ Firebase

**الخطأ:**
```
Firebase initialization failed: Missing credentials
```

**الحل:**
```bash
# تحقق من ملف بيانات اعتماد Firebase
export GOOGLE_APPLICATION_CREDENTIALS=./firebase-creds.json

# تأكد من أن الملف يحتوي على JSON صحيح
cat firebase-creds.json | jq .
```

#### 5. خطأ في قاعدة البيانات

**الخطأ:**
```
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

**الحل:**
```bash
# تحقق من بيانات الاعتماد
mysql -u root -p -e "SELECT 1;"

# أعد تعيين كلمة المرور إذا لزم الأمر
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;

# حدّث .env
SQL_PASSWORD=new_password
```

### تصحيح الأخطاء المتقدم

#### تفعيل وضع التصحيح

```bash
# بيئة التطوير
DEBUG=sniper:* npm run dev

# بيئة الإنتاج
NODE_ENV=production LOG_LEVEL=debug npm start
```

#### عرض السجلات

```bash
# السجلات الحالية
tail -f ./logs/app.log

# السجلات الخاصة بالمسحات
tail -f ./logs/scanners/scan-*.log

# السجلات الخاصة بـ AI
tail -f ./logs/ai-engine.log
```

---

## 🔐 الأمان والامتثال {#الأمان}

### أفضل الممارسات الأمنية

#### 1. إدارة المفاتيح والبيانات الحساسة

✅ **افعل:**
```bash
# استخدم متغيرات البيئة فقط
export GEMINI_API_KEY=$(cat /secrets/gemini-key.txt)

# استخدم مديري السري (Secrets Managers)
# مثل: AWS Secrets Manager, HashiCorp Vault

# دوّر المفاتيح بانتظام
# جدول دوري: كل 90 يوم
```

❌ **لا تفعل:**
```bash
# لا تضع المفاتيح في الكود
const API_KEY = "sk-12345..."; // ❌

# لا تنسخ المفاتيح في السجلات
console.log("API Key:", apiKey); // ❌

# لا تشارك المفاتيح مباشرة
git add .env  // ❌
```

#### 2. التحكم بالوصول (RBAC)

```typescript
// إضافة أدوار وصلاحيات
export enum Role {
  Admin = 'admin',           // تحكم كامل
  SecurityManager = 'sec_manager', // إدارة الفحوصات
  Auditor = 'auditor',       // قراءة فقط
  Developer = 'developer'    // قراءة المشاريع الخاصة
}

// مثال: حماية المسار
app.post('/scans/start', requireRole('admin', 'sec_manager'), startScan);
```

#### 3. التحقق من المدخلات (Input Validation)

```typescript
// ✅ تحقق من جميع المدخلات
const schema = z.object({
  targetUrl: z.string().url(),
  profile: z.enum(['quick', 'standard', 'deep']),
  timeout: z.number().min(5000).max(600000)
});

const validated = schema.parse(userInput);
```

#### 4. تسجيل الأنشطة (Audit Logging)

```typescript
// ✅ سجّل جميع العمليات المهمة
await auditLog.create({
  userId: user.id,
  action: 'START_SCAN',
  targetId: targetId,
  timestamp: new Date(),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

### معايير الامتثال المدعومة

#### OWASP Top 10 2021

```
✅ A01:2021 - Broken Access Control
✅ A02:2021 - Cryptographic Failures
✅ A03:2021 - Injection
✅ A04:2021 - Insecure Design
✅ A05:2021 - Security Misconfiguration
✅ A06:2021 - Vulnerable and Outdated Components
✅ A07:2021 - Identification and Authentication Failures
✅ A08:2021 - Software and Data Integrity Failures
✅ A09:2021 - Security Logging and Monitoring Failures
✅ A10:2021 - Server-Side Request Forgery (SSRF)
```

#### ISO 27001:2022

```
✅ A.5 - Organizational Controls
✅ A.6 - People Controls
✅ A.7 - Physical Controls
✅ A.8 - Technical Controls (Cryptography, Access Control)
```

#### PCI DSS 4.0

```
✅ Requirement 1-3: Network Security
✅ Requirement 4-6: Data Protection & Secure Development
✅ Requirement 7-10: Access Control & Logging
✅ Requirement 11-12: Testing & Policy
```

---

## ⚡ الأداء والتحسينات {#الأداء}

### مقاييس الأداء

#### أوقات الاستجابة المتوقعة

| العملية | الوقت المتوقع | الحد الأقصى |
|---------|--------------|----------|
| تحميل لوحة التحكم | < 2 ثانية | 5 ثوان |
| جلب قائمة المشاريع | < 1 ثانية | 3 ثوان |
| بدء فحص سريع | < 5 دقائق | 10 دقائق |
| بدء فحص معياري | < 15 دقيقة | 30 دقيقة |
| بدء فحص عميق | < 60 دقيقة | 120 دقيقة |
| إنشاء تقرير | < 2 دقيقة | 5 دقائق |

### تحسينات الأداء

#### 1. تخزين مؤقت (Caching)

```typescript
// تفعيل الـ caching
SCANNER_CACHE_ENABLED=true
SCANNER_CACHE_TTL=3600  // 1 ساعة

// النتائج المخزنة مؤقتاً:
// - نتائج الفحص الحديثة
// - تحديد التقنيات (WhatWeb)
// - معلومات DNS
```

#### 2. معالجة متوازية (Parallelization)

```bash
# تشغيل الأدوات بالتوازي
MAX_CONCURRENT_SCANNERS=5

# تشغيل الخيوط بالتوازي
NUCLEI_THREADS=10
NMAP_THREADS=4
```

#### 3. تحسين قاعدة البيانات

```sql
-- إنشاء فهارس
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_projects_company ON projects(company_id);

-- الاستعلامات المحسّنة
SELECT * FROM vulnerabilities 
WHERE severity IN ('Critical', 'High')
  AND status = 'open'
  ORDER BY cvss_score DESC
LIMIT 100;
```

### مراقبة الأداء

#### أدوات المراقبة المقترحة

```bash
# PM2 (إدارة العمليات)
pm2 install pm2-auto-pull
pm2 monit

# Prometheus + Grafana (المقاييس)
npm install prom-client
# إنشاء dashboard لمراقبة الأداء

# ELK Stack (السجلات)
# ElasticSearch, Logstash, Kibana
```

#### النقاط الحرجة للمراقبة

```
1. استخدام الذاكرة (Memory)
   - الحد الأقصى الموصى به: 80%
   - إعادة التشغيل إذا تجاوزت: 90%

2. استخدام المعالج (CPU)
   - الحد الأقصى الموصى به: 70%
   - تقليل الخيوط إذا تجاوزت: 85%

3. وقت استجابة الفحص
   - تنبيه إذا تجاوزت المهلة الزمنية 10%

4. معدل الأخطاء (Error Rate)
   - تنبيه إذا تجاوزت 2%
```

---

## 📞 الدعم والمساعدة

### قنوات الدعم

| القناة | الوقت | الأولوية |
|--------|------|--------|
| البريد الإلكتروني | خلال 24 ساعة | متوسط |
| الدردشة الحية | خلال 2 ساعة | عالي |
| الهاتف | خلال الساعة | حرج |
| GitHub Issues | خلال 48 ساعة | متوسط |

### الموارد الإضافية

- 📖 [الوثائق الكاملة](https://docs.sniper-ai.security)
- 🎓 [دروس تعليمية](https://tutorials.sniper-ai.security)
- 🐛 [متتبع الأخطاء](https://github.com/Sniperai11/Sniper-AI/issues)
- 💬 [منتدى المجتمع](https://community.sniper-ai.security)

---

**آخر تحديث:** 2026-08-15  
**النسخة:** 1.0.0  
**الحالة:** ✅ جاهزة للإنتاج
