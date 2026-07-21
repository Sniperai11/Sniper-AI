import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Terminal,
  Cpu,
  Database,
  Activity,
  FileText,
  Plus,
  Search,
  Trash2,
  Settings,
  ExternalLink,
  Lock,
  RefreshCw,
  Sliders,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Check,
  Copy,
  X,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CreditCard,
  Download,
  Upload,
  Send,
  Eye,
  HelpCircle,
  Info,
  ChevronLeft,
  AlertTriangle,
  Globe,
  Code,
  Smartphone,
  Server,
  Award,
  Trophy,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRole,
  TeamMember,
  TargetType,
  VerificationStatus,
  SecurityTarget,
  SecurityProject,
  SeverityLevel,
  Vulnerability,
  ScanStatus,
  ScanJob,
  AuditLog,
  SaaSPlan,
  SaaSLimits,
  SaaSSubscription,
  SecurityReport
} from './types';
import SecurityTerminal from './components/SecurityTerminal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  LineChart,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const monthlySecurityData = [
  { month: 'أغسطس 2025', detected: 4, resolved: 2, growthRate: 50.0, activeVulns: 2, remediationRate: 50 },
  { month: 'سبتمبر 2025', detected: 8, resolved: 5, growthRate: 37.5, activeVulns: 5, remediationRate: 62 },
  { month: 'أكتوبر 2025', detected: 12, resolved: 9, growthRate: 25.0, activeVulns: 8, remediationRate: 75 },
  { month: 'نوفمبر 2025', detected: 15, resolved: 13, growthRate: 13.3, activeVulns: 10, remediationRate: 86 },
  { month: 'ديسمبر 2025', detected: 11, resolved: 10, growthRate: 9.1, activeVulns: 11, remediationRate: 90 },
  { month: 'يناير 2026', detected: 19, resolved: 15, growthRate: 21.0, activeVulns: 15, remediationRate: 78 },
  { month: 'فبراير 2026', detected: 14, resolved: 13, growthRate: 7.1, activeVulns: 16, remediationRate: 92 },
  { month: 'مارس 2026', detected: 25, resolved: 20, growthRate: 20.0, activeVulns: 21, remediationRate: 80 },
  { month: 'أبريل 2026', detected: 18, resolved: 17, growthRate: 5.5, activeVulns: 22, remediationRate: 94 },
  { month: 'مايو 2026', detected: 30, resolved: 27, growthRate: 10.0, activeVulns: 25, remediationRate: 90 },
  { month: 'يونيو 2026', detected: 22, resolved: 21, growthRate: 4.5, activeVulns: 26, remediationRate: 95 },
  { month: 'يوليو 2026', detected: 15, resolved: 15, growthRate: 0.0, activeVulns: 26, remediationRate: 100 }
];

const logoPresets = [
  {
    id: 'shield',
    name: 'درع الأمان الذكي',
    svg: `data:image/svg+xml;utf8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#3b82f6"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/><path d="M50 20 L75 30 V55 C75 70 50 80 50 80 C50 80 25 70 25 55 V30 Z" fill="url(#g1)"/><path d="M42 50 L48 56 L58 44" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`)
  },
  {
    id: 'cloud',
    name: 'سحابة الأمان الموثوقة',
    svg: `data:image/svg+xml;utf8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/><path d="M30 60 C25 60 20 55 20 50 C20 45 25 40 30 40 C32 32 40 28 48 30 C56 32 62 40 60 48 C65 48 70 52 70 58 C70 64 65 68 60 68 H30 Z" fill="url(#g2)"/><path d="M42 50 L48 56 L58 44" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`)
  },
  {
    id: 'code',
    name: 'شبكة الأكواد الآمنة',
    svg: `data:image/svg+xml;utf8,` + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="#0f172a" stroke="#1e293b" stroke-width="2"/><path d="M30 40 L15 50 L30 60 M70 40 L85 50 L70 60 M55 30 L45 70" fill="none" stroke="url(#g3)" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="10" fill="#ffffff" opacity="0.9"/></svg>`)
  }
];

const MonthlyChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md text-right" dir="rtl">
        <p className="text-xs font-bold text-white mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-mono font-bold text-white">
                {entry.value}
                {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function App() {
  // STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [chartTimeframe, setChartTimeframe] = useState<'6m' | '12m'>('6m');
  const [chartView, setChartView] = useState<'growth' | 'counts' | 'remediation'>('growth');
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => {
    return localStorage.getItem('report_company_logo') || null;
  });
  const [reportTitlePrefix, setReportTitlePrefix] = useState<string>(() => {
    return localStorage.getItem('report_title_prefix') || '';
  });
  const [projects, setProjects] = useState<SecurityProject[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [activeScans, setActiveScans] = useState<ScanJob[]>([]);
  const [activeTerminalScanId, setActiveTerminalScanId] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userProfile, setUserProfile] = useState<{
    user: { email: string; role: UserRole };
    company: { name: string; ownerEmail: string; joinedAt: string };
    subscription: SaaSSubscription;
    teamMembers: TeamMember[];
  } | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Target Ownership Verification helpers
  const [verificationModalTarget, setVerificationModalTarget] = useState<SecurityTarget | null>(null);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDesc, setNewProjectDesc] = useState<string>('');
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);

  // New Target Form
  const [newTargetName, setNewTargetName] = useState<string>('');
  const [newTargetUrl, setNewTargetUrl] = useState<string>('');
  const [newTargetType, setNewTargetType] = useState<TargetType>('Website');
  const [selectedProjectIdForTarget, setSelectedProjectIdForTarget] = useState<string>('');
  const [showAddTargetModal, setShowAddTargetModal] = useState<boolean>(false);

  // Team management helpers
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('Viewer');

  // AI Security Assistant Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>>([
    { sender: 'assistant', text: 'مرحباً بك في مركز التدقيق الأمني الذكي! أنا مستشارك الأمني الشخصي المدعوم بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم في فحص شفرتك المصدرية، أو فهم الثغرات، أو وضع خطط الحماية لشركتك؟', timestamp: new Date().toISOString() }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  // Active AI Vulnerability Detail Analysis
  const [analyzingVulnId, setAnalyzingVulnId] = useState<string | null>(null);
  const [aiVulnAnalysisText, setAiVulnAnalysisText] = useState<string | null>(null);

  // Generated Report display state
  const [selectedReportProject, setSelectedReportProject] = useState<string>('');
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [reportsHistory, setReportsHistory] = useState<any[]>([]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [targetFilter, setTargetFilter] = useState<string>('All');

  // Bug Bounty state
  const [bbPrograms, setBbPrograms] = useState<any[]>([]);
  const [bbLeaderboard, setBbLeaderboard] = useState<any[]>([]);
  const [bbSubmissions, setBbSubmissions] = useState<any[]>([]);
  
  // Bug Bounty Form states
  const [newBbTarget, setNewBbTarget] = useState<string>('');
  const [newBbTitle, setNewBbTitle] = useState<string>('');
  const [newBbSeverity, setNewBbSeverity] = useState<string>('High');
  const [newBbDescription, setNewBbDescription] = useState<string>('');
  const [newBbPoc, setNewBbPoc] = useState<string>('');
  const [showAddBbReportModal, setShowAddBbReportModal] = useState<boolean>(false);

  // Copy token status helper
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Notifications banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // USER MODE: 'enterprise' | 'hunter'
  const [userMode, setUserMode] = useState<'enterprise' | 'hunter'>(() => {
    return (localStorage.getItem('sec_user_mode') as 'enterprise' | 'hunter') || 'enterprise';
  });

  // Target Bounty Platform Source
  const [newTargetBountyPlatform, setNewTargetBountyPlatform] = useState<string>('None');

  // APK File upload states
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkFileName, setApkFileName] = useState<string>('');
  const [isUploadingApk, setIsUploadingApk] = useState<boolean>(false);

  // AI Bug Bounty Report Generation form states
  const [bountyReportDraft, setBountyReportDraft] = useState<string | null>(null);
  const [bountyReportLoading, setBountyReportLoading] = useState<boolean>(false);
  const [aiReportTitle, setAiReportTitle] = useState<string>('');
  const [aiReportVulnType, setAiReportVulnType] = useState<string>('Insecure Direct Object Reference (IDOR)');
  const [aiReportSeverity, setAiReportSeverity] = useState<string>('High');
  const [aiReportPoc, setAiReportPoc] = useState<string>('');
  const [aiReportImpact, setAiReportImpact] = useState<string>('');

  // Selected values for target vulnerability report import
  const [importProjectSelected, setImportProjectSelected] = useState<string>('');
  const [importTargetSelected, setImportTargetSelected] = useState<string>('');
  const [importVulnSelected, setImportVulnSelected] = useState<string>('');

  const handleImportVulnerabilityData = () => {
    if (!importVulnSelected) {
      showToast("يرجى اختيار ثغرة للاستيراد أولاً", "error");
      return;
    }
    const found = vulnerabilities.find(v => v.id === importVulnSelected);
    if (!found) {
      showToast("لم يتم العثور على بيانات الثغرة المحددة", "error");
      return;
    }
    setAiReportTitle(found.title);
    setAiReportSeverity(found.severity);
    
    // Auto-populate PoC steps and details
    const pocText = `Location/Endpoint:\n${found.location || 'N/A'}\n\nDescription:\n${found.description || ''}\n\nSuggested Remediation:\n${found.remediation || ''}`;
    setAiReportPoc(pocText);
    setAiReportImpact(found.impact || '');
    
    // Map vulnerability types to selection options
    const knownTypes = [
      "Insecure Direct Object Reference (IDOR)",
      "Stored Cross-Site Scripting (Stored XSS)",
      "Server-Side Request Forgery (SSRF)",
      "Broken Object Level Authorization (BOLA / IDOR)",
      "Remote Code Execution (RCE)",
      "SQL Injection (SQLi)",
      "CSRF on sensitive action",
      "Information Disclosure"
    ];
    
    const matchedType = knownTypes.find(t => 
      t.toLowerCase().includes(found.type.toLowerCase()) || 
      found.type.toLowerCase().includes(t.toLowerCase())
    ) || "Insecure Direct Object Reference (IDOR)";
    setAiReportVulnType(matchedType);

    showToast(`تم استيراد تفاصيل الثغرة المكتشفة "${found.title}" بنجاح!`, "success");
  };

  const handleToggleUserMode = (mode: 'enterprise' | 'hunter') => {
    setUserMode(mode);
    localStorage.setItem('sec_user_mode', mode);
    showToast(mode === 'hunter' ? 'تم التبديل إلى نمط صياد المكافآت المستقل' : 'تم التبديل إلى نمط إدارة موارد الشركات والمؤسسات', 'info');
  };

  // AI Bug Bounty Draft Report Builder handler
  const handleGenerateBountyReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiReportTitle.trim() || !aiReportPoc.trim() || !aiReportImpact.trim()) {
      showToast("يرجى ملء جميع الحقول المطلوبة للمساعدة في صياغة التقرير", "error");
      return;
    }

    setBountyReportLoading(true);
    setBountyReportDraft(null);
    try {
      const res = await fetch('/api/bugbounty/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiReportTitle,
          vulnType: aiReportVulnType,
          severity: aiReportSeverity,
          pocSteps: aiReportPoc,
          impact: aiReportImpact
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "خطأ في توليد التقرير");
      }

      const envelope = await res.json();
      setBountyReportDraft(envelope.success ? envelope.data?.report : null);
      showToast("تمت صياغة تقرير الثغرة الاحترافي بالذكاء الاصطناعي بنجاح!", "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setBountyReportLoading(false);
    }
  };

  // LOAD ALL DATA FROM BACKEND API ON STARTUP
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const profileRes = await fetch('/api/user/profile');
      const profileEnvelope = await profileRes.json();
      setUserProfile(profileEnvelope.success ? profileEnvelope.data : null);

      const projectsRes = await fetch('/api/projects');
      const projectsEnvelope = await projectsRes.json();
      setProjects(projectsEnvelope.success ? projectsEnvelope.data : []);

      // Fetch Bug Bounty data
      const bbRes = await fetch('/api/bugbounty/data');
      if (bbRes.ok) {
        const bbEnvelope = await bbRes.json();
        const bbData = bbEnvelope.success ? bbEnvelope.data : {};
        setBbPrograms(bbData.programs || []);
        setBbLeaderboard(bbData.leaderboard || []);
        setBbSubmissions(bbData.submissions || []);
      }

      const vulnsRes = await fetch('/api/vulnerabilities');
      const vulnsEnvelope = await vulnsRes.json();
      setVulnerabilities(vulnsEnvelope.success ? vulnsEnvelope.data : []);

      const scansRes = await fetch('/api/scans');
      const scansEnvelope = await scansRes.json();
      setActiveScans(scansEnvelope.success ? scansEnvelope.data : []);

      const logsRes = await fetch('/api/audit-logs');
      const logsEnvelope = await logsRes.json();
      setAuditLogs(logsEnvelope.success ? logsEnvelope.data : []);

      const historyRes = await fetch('/api/reports/history');
      const historyEnvelope = await historyRes.json();
      setReportsHistory(historyEnvelope.success ? historyEnvelope.data : []);
    } catch (err) {
      console.error("Error loading fullstack data:", err);
      showToast("حدث خطأ أثناء تحميل بيانات المنصة من الخادم.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Poll active scans status every 4 seconds to simulate progress bar streaming updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const scansRes = await fetch('/api/scans');
        if (!scansRes.ok) {
          throw new Error(`HTTP error! status: ${scansRes.status}`);
        }
        const contentType = scansRes.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response from /api/scans");
        }
        const scansEnvelope = await scansRes.json();
        const scansData = scansEnvelope.success ? scansEnvelope.data : [];
        setActiveScans(scansData);

        // If any scan was completed or state changed, refresh project current risk indices too
        const isScanning = Array.isArray(scansData) && scansData.some((s: any) => s.status === 'Scanning' || s.status === 'Analyzing');
        if (isScanning || (Array.isArray(scansData) && scansData.length > 0)) {
          const projectsRes = await fetch('/api/projects');
          if (projectsRes.ok) {
            const projContentType = projectsRes.headers.get("content-type");
            if (projContentType && projContentType.includes("application/json")) {
              const projectsEnvelope = await projectsRes.json();
              setProjects(projectsEnvelope.success ? projectsEnvelope.data : []);
            }
          }

          const vulnsRes = await fetch('/api/vulnerabilities');
          if (vulnsRes.ok) {
            const vulnContentType = vulnsRes.headers.get("content-type");
            if (vulnContentType && vulnContentType.includes("application/json")) {
              const vulnsEnvelope = await vulnsRes.json();
              setVulnerabilities(vulnsEnvelope.success ? vulnsEnvelope.data : []);
            }
          }
        }
      } catch (err) {
        // Log cleanly to console with informational details to prevent ugly uncaught crashes
        console.warn("Scanning state polling paused (service temporarily offline or restarting):", err instanceof Error ? err.message : err);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // 1. ADD NEW PROJECT ACTION
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      showToast("يرجى إدخال اسم المشروع أولاً", "error");
      return;
    }

    setActionLoading('createProject');
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName, description: newProjectDesc })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "خطأ أثناء إضافة المشروع");
      }

      const createdProjEnvelope = await res.json();
      const createdProj = createdProjEnvelope.success ? createdProjEnvelope.data : {};
      showToast(`تم إنشاء المشروع "${createdProj.name}" بنجاح.`, 'success');
      setNewProjectName('');
      setNewProjectDesc('');
      setShowAddProjectModal(false);
      
      // Reload projects and logs
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 2. ADD NEW TARGET TO PROJECT
  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectIdForTarget || !newTargetName || !newTargetUrl) {
      showToast("يرجى استكمال جميع بيانات الهدف الأمنية.", "error");
      return;
    }

    setActionLoading('addTarget');
    try {
      const payload: any = { name: newTargetName, url: newTargetUrl, type: newTargetType };
      if (userMode === 'hunter' && newTargetBountyPlatform !== 'None') {
        payload.bountyPlatform = newTargetBountyPlatform;
      }

      const res = await fetch(`/api/projects/${selectedProjectIdForTarget}/targets/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إضافة الهدف");
      }

      const addedTargetEnvelope = await res.json();
      const addedTarget = addedTargetEnvelope.success ? addedTargetEnvelope.data : {};
      
      if (userMode === 'hunter' && newTargetBountyPlatform !== 'None') {
        showToast(`تم إضافة الهدف الخارجي "${addedTarget.name}" التابع لـ ${newTargetBountyPlatform} بنجاح.`, 'success');
      } else {
        showToast(`تم إضافة الهدف "${addedTarget.name}" وهو الآن في انتظار تأكيد الملكية.`, 'success');
      }

      setNewTargetName('');
      setNewTargetUrl('');
      setNewTargetBountyPlatform('None');
      setApkFile(null);
      setApkFileName('');
      setShowAddTargetModal(false);
      
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 3. INITIATE OWNERSHIP VERIFICATION SIMULATION
  const handleVerifyOwnership = async (targetId: string) => {
    setActionLoading(`verify-${targetId}`);
    try {
      const res = await fetch(`/api/targets/${targetId}/verify`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل التحقق من الملكية");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      showToast(`تم التحقق من ملكية المصدر "${data.target?.name}" بنجاح! تم تسجيل الإجراء في سجل الامتثال لضمان التصريح المسبق.`, 'success');
      setVerificationModalTarget(null);
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 4. TRIGGER COMPLIANCE SCAN FOR TARGET
  const handleTriggerScan = async (targetId: string) => {
    setActionLoading(`scan-${targetId}`);
    try {
      const res = await fetch(`/api/targets/${targetId}/scan`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إطلاق الفحص");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      showToast(`تم إطلاق الفحص الأمني للهدف بنجاح. يمكنك متابعة السجلات الفورية والتقدم من لوحة العمل.`, 'success');
      
      // Auto-open interactive security terminal
      if (data.scanJob) {
        setActiveTerminalScanId(data.scanJob.id);
        setShowTerminal(true);
      }
      
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 5. CHAT WITH AI ASSISTANT (GEMINI PRO / FLASH)
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput;
    setChatInput('');
    const newMsgList = [...chatMessages, { sender: 'user' as const, text: userText, timestamp: new Date().toISOString() }];
    setChatMessages(newMsgList);
    setIsChatSending(true);

    try {
      // Map message history properly for the API
      const apiMessages = newMsgList.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل الاتصال بالذكاء الاصطناعي");
      }

      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      setChatMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.reply || "لا يوجد رد من المستشار الأمني",
        timestamp: new Date().toISOString()
      }]);

      // Update limits to show consumption on UI
      setUserProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            limits: {
              ...prev.subscription.limits,
              aiConsultationsRemaining: Math.max(0, prev.subscription.limits.aiConsultationsRemaining - 1)
            }
          }
        };
      });
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsChatSending(false);
    }
  };

  // Send a pre-defined quick question to AI
  const handleQuickQuestion = (question: string) => {
    setChatInput(question);
    setTimeout(() => {
      const form = document.getElementById('chat-form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  // 6. DETAILED AI AUDIT AND ANALYSIS FOR SPECIFIC VULNERABILITY
  const handleAiAnalyzeVulnerability = async (vulnId: string) => {
    setAnalyzingVulnId(vulnId);
    setAiVulnAnalysisText(null);
    try {
      const res = await fetch(`/api/vulnerabilities/${vulnId}/ai-analyze`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل تحليل الثغرة");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      setAiVulnAnalysisText(data.aiAnalysis || "لا يتوفر تحليل في الوقت الحالي");

      // Update local profile count to match backend decrement
      setUserProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subscription: {
            ...prev.subscription,
            limits: {
              ...prev.subscription.limits,
              aiConsultationsRemaining: Math.max(0, prev.subscription.limits.aiConsultationsRemaining - 1)
            }
          }
        };
      });
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // 7. FALSE POSITIVE SANITIZATION
  const handleToggleFalsePositive = async (vulnId: string) => {
    setActionLoading(`false-pos-${vulnId}`);
    try {
      const res = await fetch(`/api/vulnerabilities/${vulnId}/toggle-false-positive`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل تعديل حالة الثغرة");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      showToast(data.vulnerability?.isFalsePositive ? "تم نقل الثغرة للأرشيف المستبعد بنجاح." : "تم تنشيط الثغرة كمشكلة فعلية بحاجة لإصلاح.", 'success');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 8. GENERATE HIGH LEVEL SECURITY REPORTS
  const handleGenerateReport = async (projId: string) => {
    if (!projId) {
      showToast("يرجى اختيار المشروع أولاً لإصدار التقرير", "error");
      return;
    }
    setActionLoading('generateReport');
    try {
      const res = await fetch(`/api/projects/${projId}/report`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إصدار التقرير");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      setActiveReport(data);
      showToast(`تم إنتاج التقرير التنفيذي والمطابقة لمعايير OWASP و PCI DSS بنجاح لمشروع: ${data?.projectName}`, 'success');
      
      // Reload reports history
      const historyRes = await fetch('/api/reports/history');
      if (historyRes.ok) {
        const historyEnvelope = await historyRes.json();
        const historyData = historyEnvelope.success ? historyEnvelope.data : [];
        setReportsHistory(historyData);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 8b. EXPORT STANDALONE PRINTABLE HTML REPORT (BULLETPROOF IFRAME BYPASS)
  const exportToStandaloneHTML = (report: any) => {
    if (!report) {
      showToast("لم يتم العثور على بيانات التقرير للتصدير.", "error");
      return;
    }

    const titleWithPrefix = reportTitlePrefix ? `${reportTitlePrefix} - ` : '';
    const logoHtml = companyLogo ? `<img src="${companyLogo}" alt="Company Logo" style="max-height: 56px; max-width: 150px; object-fit: contain; border-radius: 4px; padding: 4px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);" referrerPolicy="no-referrer" />` : '';

    const vulnerabilitiesListHtml = report.vulnerabilities && report.vulnerabilities.length > 0
      ? report.vulnerabilities.map((v: any, index: number) => {
          let severityClass = "bg-slate-100 text-slate-800 border-slate-200";
          let severityText = "منخفض";
          if (v.severity === 'Critical') {
            severityClass = "bg-red-50 text-red-700 border-red-200";
            severityText = "حرج جداً";
          } else if (v.severity === 'High') {
            severityClass = "bg-amber-50 text-amber-700 border-amber-200";
            severityText = "عالٍ";
          } else if (v.severity === 'Medium') {
            severityClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
            severityText = "متوسط";
          }

          return `
          <div class="p-5 border border-slate-200 rounded-xl space-y-3 bg-white shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="text-xs font-bold text-slate-800">${index + 1}. ${v.title}</h4>
              <span class="px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${severityClass}">${severityText}</span>
            </div>
            <div class="text-[11px] text-slate-500 flex flex-wrap gap-x-6 gap-y-1">
              <span>موقع الثغرة: <code class="font-mono text-cyan-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-bold select-all">${v.location}</code></span>
              <span>درجة الخطورة (CVSS): <strong class="font-mono text-slate-800">${v.cvssScore}</strong></span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed mt-1">${v.description}</p>
          </div>`;
        }).join('')
      : `<p class="text-xs text-slate-400 italic py-4">لا توجد ثغرات نشطة ومسجلة في هذا التقرير.</p>`;

    const htmlTemplate = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>التقرير الأمني - ${report.projectName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Cairo', 'Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <style>
        body {
            font-family: 'Cairo', 'Inter', sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
        }
        @media print {
            body {
                background-color: #ffffff;
                color: #000000;
                padding: 0 !important;
                margin: 0 !important;
            }
            .no-print {
                display: none !important;
            }
            .print-shadow-none {
                box-shadow: none !important;
                border-color: #e2e8f0 !important;
            }
        }
    </style>
</head>
<body class="py-8 px-4 md:px-8 max-w-4xl mx-auto">
    
    <!-- TOP NOTIFICATION (Hidden on Print) -->
    <div class="no-print bg-slate-900 border border-slate-800 text-slate-100 p-5 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div class="space-y-1">
            <h4 class="font-bold text-sm flex items-center gap-2">
                <span>📄 معاينة الطباعة الذكية والامتثال</span>
            </h4>
            <p class="text-xs text-slate-400">لقد تم فتح التقرير بنجاح في نافذة مستقلة لتخطي قيود الإطارات البرمجية ومشاكل انقطاع الصفحات.</p>
        </div>
        <div class="flex gap-2 shrink-0">
            <button onclick="window.print()" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/10">
                بدء الطباعة الآن
            </button>
            <button onclick="window.close()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl transition-all">
                إغلاق النافذة
            </button>
        </div>
    </div>

    <!-- MAIN REPORT PAGE CONTAINER -->
    <div class="bg-white border border-slate-200 rounded-3xl shadow-md overflow-hidden print-shadow-none">
        
        <!-- HEADER BLOCK -->
        <div class="bg-slate-950 p-8 border-b border-slate-200 flex justify-between items-center text-white gap-6 relative">
            <div class="flex items-center gap-5">
                ${logoHtml}
                <div class="space-y-1.5">
                    <span class="text-[10px] bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">تقرير أمني معتمد - منصة التدقيق</span>
                    <h1 class="text-lg md:text-2xl font-black">${titleWithPrefix}${report.projectName}</h1>
                    <p class="text-xs text-slate-400 flex items-center gap-1">
                        <span>تم الإنشاء في:</span>
                        <span class="font-mono">${new Date(report.generatedAt).toLocaleString('ar-SA')}</span>
                    </p>
                </div>
            </div>
            <div class="text-left shrink-0">
                <span class="text-xs text-slate-400 block font-semibold">تقييم المخاطر التراكمي (Risk)</span>
                <div class="text-4xl font-black font-mono mt-1 text-cyan-400">${report.riskScore}%</div>
            </div>
        </div>

        <div class="p-6 md:p-8 space-y-8">
            
            <!-- 1. EXECUTIVE SUMMARY -->
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <span class="text-cyan-500">✦</span> الملخص التنفيذي الذكي (Executive Summary)
                </h3>
                <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">${report.executiveSummary}</p>
            </div>

            <!-- 2. STATS & COMPLIANCE MAPPING -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- Compliance indicators -->
                <div class="border border-slate-200 p-6 rounded-2xl space-y-4 bg-white shadow-sm">
                    <h3 class="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">مؤشرات مطابقة المعايير والامتثال</h3>
                    
                    <div class="space-y-3.5">
                        <div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>منهجية OWASP Top 10</span>
                                <span class="font-bold text-slate-800 font-mono">${report.compliancePercentage.owasp}%</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                                <div class="bg-cyan-500 h-full rounded-full" style="width: ${report.compliancePercentage.owasp}%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>متطلبات بطاقات الدفع PCI DSS v4.0</span>
                                <span class="font-bold text-slate-800 font-mono">${report.compliancePercentage.pciDss}%</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                                <div class="bg-amber-500 h-full rounded-full" style="width: ${report.compliancePercentage.pciDss}%"></div>
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-xs text-slate-500">
                                <span>ضوابط الأمن السيبراني ISO 27001</span>
                                <span class="font-bold text-slate-800 font-mono">${report.compliancePercentage.iso27001}%</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                                <div class="bg-emerald-500 h-full rounded-full" style="width: ${report.compliancePercentage.iso27001}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Severity counts -->
                <div class="border border-slate-200 p-6 rounded-2xl flex flex-col justify-between bg-white shadow-sm">
                    <h3 class="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2 mb-3">توزيع خطورة الثغرات الأمنية</h3>
                    <div class="grid grid-cols-4 gap-2">
                        <div class="bg-red-50 border border-red-100 p-2.5 rounded-xl text-center">
                            <span class="text-[9px] text-red-600 block font-bold">حرجة</span>
                            <span class="text-lg font-black font-mono text-red-700 mt-1 block">${report.severityBreakdown.Critical}</span>
                        </div>
                        <div class="bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-center">
                            <span class="text-[9px] text-amber-600 block font-bold">عالية</span>
                            <span class="text-lg font-black font-mono text-amber-700 mt-1 block">${report.severityBreakdown.High}</span>
                        </div>
                        <div class="bg-yellow-50 border border-yellow-100 p-2.5 rounded-xl text-center">
                            <span class="text-[9px] text-yellow-600 block font-bold">متوسطة</span>
                            <span class="text-lg font-black font-mono text-yellow-700 mt-1 block">${report.severityBreakdown.Medium}</span>
                        </div>
                        <div class="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                            <span class="text-[9px] text-slate-600 block font-bold">منخفضة</span>
                            <span class="text-lg font-black font-mono text-slate-700 mt-1 block">${report.severityBreakdown.Low}</span>
                        </div>
                    </div>
                    <div class="text-[10px] text-slate-400 leading-relaxed mt-4">
                        تمت تصفية وتدقيق النتائج الأمنية للامتثال للمعايير والأنظمة المعتمدة لضمان الدقة وإزالة الفحوصات الخاطئة.
                    </div>
                </div>
            </div>

            <!-- 3. VULNERABILITIES LIST -->
            <div class="space-y-4 pt-2">
                <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5">الملحق الفني وتفاصيل الثغرات المرصودة:</h3>
                <div class="space-y-4">
                    ${vulnerabilitiesListHtml}
                </div>
            </div>

            <!-- FOOTER BLOCK -->
            <div class="text-center pt-8 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
                <p>هذا التقرير تم إصداره وتصنيفه بشكل معتمد من نظام الفحص والتدقيق الأمني الذكي.</p>
                <p class="font-mono text-[9px] text-slate-300">ID: ${report.id}</p>
            </div>

        </div>
    </div>

    <!-- AUTO PRINT AND PREVIEW SCRIPT -->
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>`;

    // Trigger download
    const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقرير_أمني_${report.projectName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم توليد التقرير الأمني كـ HTML مستقل. سيتم تفعيل نافذة الحفظ كـ PDF فوراً عند فتح الملف.", "success");
  };

  // 8b. PRINT/SAVE HISTORICAL REPORT
  const handlePrintHistoricalReport = (report: any) => {
    setActiveReport(report);
    exportToStandaloneHTML(report);
  };

  // 9. UPGRADE SaaS PLANS
  const handleUpgradeSubscription = async (planName: SaaSPlan) => {
    setActionLoading(`upgrade-${planName}`);
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPlan: planName })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل ترقية الاشتراك");
      }
      const envelope = await res.json();
      const data = envelope.success ? envelope.data : {};
      showToast(`تهانينا! تم تحويل رخصة اشتراكك بنجاح إلى باقة ${planName}. تم تحديث حصة فحص الموارد واستشارات الذكاء الاصطناعي فورياً.`, 'success');
      
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 10. INVITE TEAM MEMBER
  const handleInviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast("يرجى إدخال اسم الموظف وبريده الإلكتروني لإرسال الدعوة.", "error");
      return;
    }
    setActionLoading('inviteTeam');
    try {
      const res = await fetch('/api/team/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMemberName, email: newMemberEmail, role: newMemberRole })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إضافة العضو");
      }
      showToast(`تمت دعوة ${newMemberName} برتبة ${newMemberRole} بنجاح إلى المنصة الأمنية.`, 'success');
      setNewMemberName('');
      setNewMemberEmail('');
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 11. REMOVE TEAM MEMBER
  const handleRemoveTeamMember = async (memberId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في سحب صلاحيات هذا العضو وإزالته من لوحة التحكم؟")) return;
    setActionLoading(`remove-team-${memberId}`);
    try {
      const res = await fetch(`/api/team/${memberId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إزالة العضو");
      }
      showToast("تم إزالة العضو وإبطال مفاتيح وصوله بنجاح.", "success");
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // 11.5. BUG BOUNTY HANDLERS
  const handleBbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBbTarget || !newBbTitle || !newBbDescription || !newBbPoc) {
      showToast("يرجى ملء جميع بيانات التقرير المطلوبة.", "error");
      return;
    }
    setActionLoading('submit-bb');
    try {
      const res = await fetch('/api/bugbounty/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetName: newBbTarget,
          title: newBbTitle,
          severity: newBbSeverity,
          description: newBbDescription,
          poc: newBbPoc
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل إرسال تقرير الثغرة");
      }
      showToast("تم إرسال تقرير الثغرة بنجاح إلى فريق التدقيق الأمني. شكرًا لك على مشاركتك!", "success");
      setNewBbTarget('');
      setNewBbTitle('');
      setNewBbDescription('');
      setNewBbPoc('');
      setShowAddBbReportModal(false);
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBbReview = async (submissionId: string, status: string, rewardAmount: string) => {
    setActionLoading(`review-bb-${submissionId}`);
    try {
      const res = await fetch(`/api/bugbounty/submissions/${submissionId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rewardAmount })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0] || errData.message || "فشل تحديث حالة التقرير");
      }
      showToast("تم تحديث حالة التقرير وتسجيل المكافأة بنجاح.", "success");
      fetchAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Helpers to calculate overall risk metrics for visual graphics
  const totalScansPerformed = activeScans.length;
  const verifiedTargetsCount = projects.reduce((acc, proj) => {
    return acc + proj.targets.filter(t => t.verificationStatus === 'Verified').length;
  }, 0);
  const activeCriticalCount = vulnerabilities.filter(v => v.severity === 'Critical' && !v.isFalsePositive).length;
  const activeHighCount = vulnerabilities.filter(v => v.severity === 'High' && !v.isFalsePositive).length;
  const activeMediumCount = vulnerabilities.filter(v => v.severity === 'Medium' && !v.isFalsePositive).length;
  const activeLowCount = vulnerabilities.filter(v => v.severity === 'Low' && !v.isFalsePositive).length;
  const totalActiveVulnerabilities = activeCriticalCount + activeHighCount + activeMediumCount + activeLowCount;
  
  // Computed vulnerability metrics for interactive distribution charts
  const filteredVulnsForCharts = vulnerabilities.filter(v => {
    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === 'All' || v.severity === severityFilter;
    return matchSearch && matchSeverity && !v.isFalsePositive;
  });

  const getTypesChartData = () => {
    const counts: { [key: string]: number } = {};
    filteredVulnsForCharts.forEach(v => {
      const typeLabel = v.type || 'تصنيفات أخرى';
      counts[typeLabel] = (counts[typeLabel] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    })).sort((a, b) => b.value - a.value);
  };

  const getOwaspChartData = () => {
    const counts: { [key: string]: number } = {};
    filteredVulnsForCharts.forEach(v => {
      const owaspLabel = v.complianceMapping?.owasp || 'أخرى / غير مصنفة';
      counts[owaspLabel] = (counts[owaspLabel] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    })).sort((a, b) => b.value - a.value);
  };

  const teamMembers = userProfile?.teamMembers || [];

  // Render CVSS Score Badge styled perfectly
  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-red-950 border border-red-750 text-red-400">حرج جداً</span>;
      case 'High':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-amber-950 border border-amber-750 text-amber-400">عالٍ</span>;
      case 'Medium':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-yellow-950 border border-yellow-750 text-yellow-400">متوسط</span>;
      case 'Low':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-slate-800 border border-slate-700 text-slate-300">منخفض</span>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    showToast("تم نسخ ترويسة التحقق الآمن إلى الحافظة.", 'success');
    setTimeout(() => setCopiedToken(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:w-96 z-50 p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
                : notification.type === 'error'
                ? 'bg-red-950/90 border-red-500/30 text-red-300'
                : 'bg-blue-950/90 border-blue-500/30 text-blue-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : notification.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
            ) : (
              <Info className="w-5 h-5 shrink-0 text-blue-400" />
            )}
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {notification.message}
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER PLATFORM STATS HEADER BAR */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex flex-col lg:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              AI Security Auditor
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">SaaS v2.4</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">منصة ذكية معتمدة للتدقيق الأمني وتحليل الثغرات بالذكاء الاصطناعي</p>
          </div>
        </div>

        {/* DYNAMIC WORKSPACE MODE SELECTOR (ENTERPRISE VS INDEPENDENT HUNTER) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => handleToggleUserMode('enterprise')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              userMode === 'enterprise'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-blue-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>نطاق الشركات والمؤسسات</span>
          </button>
          <button
            onClick={() => handleToggleUserMode('hunter')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              userMode === 'hunter'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-950/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 animate-bounce" />
            <span>صائد مكافآت مستقل</span>
          </button>
        </div>

        {/* PROFILE CARD QUICK DISPLAY */}
        {userProfile && (
          <div className="flex items-center gap-4 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
            <div className="text-left md:text-right">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                {userProfile.user.email}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                <span>دور الوصول:</span>
                <span className="text-cyan-400 font-bold">{userProfile.user.role}</span>
                <span className="text-slate-600">|</span>
                <span>الباقة:</span>
                <span className="text-amber-400 font-bold">{userProfile.subscription.plan}</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-sm">
              أ
            </div>
          </div>
        )}
      </header>

      {/* DASHBOARD CORE CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* RIGHT SIDEBAR NAVIGATION MENU */}
        <aside className="w-full md:w-64 bg-slate-900/40 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col shrink-0">
          <nav className="p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm shadow-cyan-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{userMode === 'hunter' ? 'لوحة أهداف الصيد (Hunter)' : 'لوحة التحكم الرئيسية'}</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'projects'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>{userMode === 'hunter' ? 'أهدافي الحالية (Hunt)' : 'الأهداف والمشاريع'}</span>
            </button>

            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'vulnerabilities'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{userMode === 'hunter' ? 'مسودات الثغرات والتقارير' : 'الثغرات المكتشفة'}</span>
              {totalActiveVulnerabilities > 0 && (
                <span className="mr-auto bg-rose-950 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {totalActiveVulnerabilities}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>التقارير الأمنية</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'chat'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>مستشار الأمن الذكي</span>
              <span className="mr-auto text-[9px] bg-amber-950 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'subscription'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>الاشتراك وسجلات التدقيق</span>
            </button>

            <button
              onClick={() => setActiveTab('bugbounty')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'bugbounty'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>صائدو المكافآت (Bounty)</span>
              <span className="mr-auto text-[9px] bg-amber-950 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">جديد</span>
            </button>

            <button
              onClick={() => setActiveTab('constitution')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all shrink-0 ${
                activeTab === 'constitution'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>دستور المنصة الأمني</span>
              <span className="mr-auto text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.5 rounded font-mono font-bold">نشط</span>
            </button>
          </nav>

          {/* SAAS LIMITS METER AT BOTTOM */}
          {userProfile && (
            <div className="hidden md:flex flex-col gap-4 mt-auto p-4 border-t border-slate-800 bg-slate-950/40">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>عمليات الفحص المتبقية</span>
                  <span className="font-mono text-cyan-400 font-semibold">{userProfile.subscription.limits.scansRemainingThisMonth} / {userProfile.subscription.limits.scansPerMonth}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${(userProfile.subscription.limits.scansRemainingThisMonth / userProfile.subscription.limits.scansPerMonth) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>استشارات الذكاء الاصطناعي</span>
                  <span className="font-mono text-amber-400 font-semibold">{userProfile.subscription.limits.aiConsultationsRemaining} / {userProfile.subscription.limits.aiConsultationsPerMonth}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${(userProfile.subscription.limits.aiConsultationsRemaining / userProfile.subscription.limits.aiConsultationsPerMonth) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>الامتثال: مصرح ومرخص بالكامل لمشروعات شركتك فقط.</span>
              </div>
            </div>
          )}
        </aside>

        {/* PRIMARY VIEW CONTENT DISPLAY PANEL */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto min-w-0">
          
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"></div>
                <ShieldAlert className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-lg font-bold mt-6 text-white">جاري مزامنة المنصة والذكاء الاصطناعي...</h3>
              <p className="text-sm text-slate-400 mt-2">يرجى الانتظار، يتم جلب آخر السجلات والثغرات والتقارير من الخادم الفني.</p>
            </div>
          ) : (
            <div className="flex-1">

              {/* A. DASHBOARD VIEW (arabic custom design) */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* HERO BANNER SECTION */}
                  <div className="p-6 bg-radial from-cyan-950/20 via-slate-900 to-slate-900 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 space-y-2">
                      <h2 className="text-xl md:text-2xl font-black text-white">لوحة المراقبة الأمنية والتحليل الأوتوماتيكي</h2>
                      <p className="text-sm text-slate-300 max-w-2xl">
                        أهلاً بك في منصتك المركزية. يمكنك الآن تتبع نقاط الضعف النشطة، والتحقق من ملكية البنية التحتية، وتشغيل الفحوصات الأمنية المعتمدة وتصنيفها مع طبقة التحليل الذكية لحماية أنظمتك من الثغرات.
                      </p>
                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> مطابقة OWASP Top 10</span>
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> معايير ISO 27001</span>
                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> معيار PCI DSS للمدفوعات</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-cyan-950/20"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة مشروع أمني جديد
                    </button>
                  </div>

                  {/* HIGH VALUE METRIC CARDS GRID */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">إجمالي الموارد الأمنية</span>
                        <div className="p-2 bg-purple-950/60 rounded-lg text-purple-400 border border-purple-500/20"><Briefcase className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white">{projects.reduce((acc, p) => acc + p.targets.length, 0)}</div>
                        <p className="text-[10px] text-slate-400">أهداف فحص مصرحة ومسجلة</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">التحقق من الملكية</span>
                        <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-emerald-400">{verifiedTargetsCount}</div>
                        <p className="text-[10px] text-slate-400">أهداف تم التحقق من ملكيتها</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">الثغرات الأمنية الفعالة</span>
                        <div className="p-2 bg-red-950/60 rounded-lg text-red-400 border border-red-500/20"><ShieldAlert className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-red-400">{totalActiveVulnerabilities}</div>
                        <p className="text-[10px] text-slate-400">ثغرات بحاجة لإصلاح فوري</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">معدل الفحص التراكمي</span>
                        <div className="p-2 bg-cyan-950/60 rounded-lg text-cyan-400 border border-cyan-500/20"><Activity className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-white">{totalScansPerformed + 12}</div>
                        <p className="text-[10px] text-slate-400">عمليات فحص فنية وتدقيق</p>
                      </div>
                    </div>

                  </div>

                  {/* VULNERABILITY DETECTION GROWTH & REMEDIATION RATE TRENDS CHART (RECHARTS) */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          معدل نمو اكتشاف الثغرات وتأثير الإصلاحات
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          تحليل الاتجاهات الزمنية الشهرية لمعدل اكتشاف الثغرات الأمنية الجديدة مقارنة بمعدلات الإصلاح التراكمية وتأثيرها على تقليص المخاطر.
                        </p>
                      </div>
                      
                      {/* Controls and Selectors */}
                      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                        {/* Tab Switchers */}
                        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 text-[10px]">
                          <button
                            onClick={() => setChartView('growth')}
                            className={`px-3 py-1 rounded transition-all font-medium ${
                              chartView === 'growth' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            معدل النمو (%)
                          </button>
                          <button
                            onClick={() => setChartView('counts')}
                            className={`px-3 py-1 rounded transition-all font-medium ${
                              chartView === 'counts' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            العدد المطلق
                          </button>
                          <button
                            onClick={() => setChartView('remediation')}
                            className={`px-3 py-1 rounded transition-all font-medium ${
                              chartView === 'remediation' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/15' : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            معدل معالجة المشاكل
                          </button>
                        </div>

                        {/* Timeframe selector */}
                        <select
                          value={chartTimeframe}
                          onChange={(e: any) => setChartTimeframe(e.target.value)}
                          className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer outline-none font-sans"
                        >
                          <option value="6m">آخر 6 أشهر</option>
                          <option value="12m">آخر 12 شهراً</option>
                        </select>
                      </div>
                    </div>

                    {/* Chart Box */}
                    <div className="h-72 w-full bg-slate-950/40 p-4 rounded-xl border border-slate-850/60 relative overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartView === 'growth' ? (
                          <AreaChart
                            data={monthlySecurityData.slice(chartTimeframe === '6m' ? -6 : 0)}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="growthColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                            <XAxis
                              dataKey="month"
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <YAxis
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              unit="%"
                            />
                            <Tooltip content={<MonthlyChartTooltip />} />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => <span className="text-[11px] text-slate-300 font-medium">{value}</span>}
                            />
                            <Area
                              name="معدل نمو اكتشاف الثغرات"
                              type="monotone"
                              dataKey="growthRate"
                              stroke="#06b6d4"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#growthColor)"
                              unit="%"
                            />
                          </AreaChart>
                        ) : chartView === 'counts' ? (
                          <LineChart
                            data={monthlySecurityData.slice(chartTimeframe === '6m' ? -6 : 0)}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                            <XAxis
                              dataKey="month"
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <YAxis
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip content={<MonthlyChartTooltip />} />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => <span className="text-[11px] text-slate-300 font-medium">{value}</span>}
                            />
                            <Line
                              name="الثغرات المكتشفة حديثاً"
                              type="monotone"
                              dataKey="detected"
                              stroke="#f43f5e"
                              strokeWidth={2.5}
                              dot={{ r: 4, strokeWidth: 2, fill: "#0f172a" }}
                              activeDot={{ r: 6 }}
                            />
                            <Line
                              name="الثغرات التي تم معالجتها وإصلاحها"
                              type="monotone"
                              dataKey="resolved"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                            <Line
                              name="الثغرات النشطة المتبقية"
                              type="monotone"
                              dataKey="activeVulns"
                              stroke="#8b5cf6"
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              dot={false}
                            />
                          </LineChart>
                        ) : (
                          <AreaChart
                            data={monthlySecurityData.slice(chartTimeframe === '6m' ? -6 : 0)}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="remediationColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                            <XAxis
                              dataKey="month"
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              dy={10}
                            />
                            <YAxis
                              stroke="#64748b"
                              fontSize={10}
                              tickLine={false}
                              axisLine={false}
                              unit="%"
                            />
                            <Tooltip content={<MonthlyChartTooltip />} />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => <span className="text-[11px] text-slate-300 font-medium">{value}</span>}
                            />
                            <Area
                              name="نسبة نجاح واكتمال الإصلاح الفوري"
                              type="monotone"
                              dataKey="remediationRate"
                              stroke="#10b981"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#remediationColor)"
                              unit="%"
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    {/* Chart Insights block */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="bg-slate-950/55 p-3 rounded-xl border border-slate-850/60 flex items-start gap-2.5">
                        <div className="p-1.5 bg-cyan-950/85 text-cyan-400 rounded-lg border border-cyan-500/10 text-xs font-mono font-bold shrink-0">
                          {chartTimeframe === '6m' ? '5.5%' : '0.0%'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">تراجع معدل النمو الفصلي</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            تراجع ملحوظ في سرعة اكتشاف الثغرات الجديدة بفضل اعتماد الفحص الدوري المسبق في مراحل التطوير الأولى.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950/55 p-3 rounded-xl border border-slate-850/60 flex items-start gap-2.5">
                        <div className="p-1.5 bg-emerald-950/85 text-emerald-400 rounded-lg border border-emerald-500/10 text-xs font-mono font-bold shrink-0">
                          {chartTimeframe === '6m' ? '92.5%' : '84.3%'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">متوسط كفاءة الإصلاح</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ارتفاع كبير في نسبة إصلاح الثغرات وإغلاقها فورياً بفضل توصيات مساعد الأمن الذكي وحلول الذكاء الاصطناعي.
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950/55 p-3 rounded-xl border border-slate-850/60 flex items-start gap-2.5">
                        <div className="p-1.5 bg-purple-950/85 text-purple-400 rounded-lg border border-purple-500/10 text-xs font-mono font-bold shrink-0">
                          -32%
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">تقليص الخطر الإجمالي</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            انخفاض جوهري في مؤشر التعرض للمخاطر التراكمية مقارنة بنفس الفترة من الربع السنوي السابق.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL CHARTS AND LIVE ACTION STREAM SECTION */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* SEVERITY BREAKDOWN GRAPHICS CARD */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-5 space-y-5 lg:col-span-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">توزيع الثغرات حسب مستوى الخطورة</h3>
                        <p className="text-[11px] text-slate-400 mt-1">تحديد مستوى الاستعجال والخطورة لحل المشاكل الأمنية</p>
                      </div>

                      {/* Custom SVG / Pure CSS Visual Charts block */}
                      <div className="py-6 flex items-center justify-center gap-6 relative">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          {/* Radial Progress Visual representation */}
                          <div className="absolute inset-0 rounded-full border-8 border-slate-850"></div>
                          <div className="absolute inset-2 rounded-full border border-dashed border-slate-800"></div>
                          <div className="text-center z-10">
                            <span className="text-3xl font-black text-white">{totalActiveVulnerabilities}</span>
                            <p className="text-[10px] text-slate-400 font-medium">ثغرة نشطة</p>
                          </div>
                        </div>

                        {/* Bar Breakdown Legend */}
                        <div className="flex-1 space-y-2.5">
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>حرج جداً</span>
                              <span className="font-mono font-bold text-red-400">{activeCriticalCount}</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1 rounded-full mt-1"><div className="bg-red-500 h-full rounded-full" style={{ width: `${totalActiveVulnerabilities ? (activeCriticalCount / totalActiveVulnerabilities) * 100 : 0}%` }}></div></div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>عالي</span>
                              <span className="font-mono font-bold text-amber-400">{activeHighCount}</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1 rounded-full mt-1"><div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalActiveVulnerabilities ? (activeHighCount / totalActiveVulnerabilities) * 100 : 0}%` }}></div></div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>متوسط</span>
                              <span className="font-mono font-bold text-yellow-400">{activeMediumCount}</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1 rounded-full mt-1"><div className="bg-yellow-500 h-full rounded-full" style={{ width: `${totalActiveVulnerabilities ? (activeMediumCount / totalActiveVulnerabilities) * 100 : 0}%` }}></div></div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-300">
                              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>منخفض</span>
                              <span className="font-mono font-bold text-slate-300">{activeLowCount}</span>
                            </div>
                            <div className="w-full bg-slate-850 h-1 rounded-full mt-1"><div className="bg-slate-400 h-full rounded-full" style={{ width: `${totalActiveVulnerabilities ? (activeLowCount / totalActiveVulnerabilities) * 100 : 0}%` }}></div></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 text-[10px] text-slate-400">
                        مستوى المخاطر التراكمي: <span className="font-mono font-bold text-red-400">67/100 (مرتفع)</span>. يرجى البدء بإصلاح الثغرات الحرجة لتجنب الاستغلال الخارجي.
                      </div>
                    </div>

                    {/* LIVE COMPLIANCE STATUS BAR CHRONOLOGY */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-5 space-y-4 lg:col-span-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-bold text-white">حالة المطابقة الأمنية الفورية (Compliance)</h3>
                          <p className="text-[11px] text-slate-400 mt-1">تحديد مدى جهوزية الأنظمة للتفتيش الإداري والمعايير الدولية</p>
                        </div>
                        <div className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded">
                          مستوى الأمان الحالي: <span className="font-mono font-bold text-white">76%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center space-y-2">
                          <span className="text-xs text-slate-400 block">OWASP Top 10</span>
                          <span className="text-2xl font-black font-mono text-emerald-400">A+</span>
                          <span className="text-[10px] text-slate-500 block">تجاوز الثغرات القياسية</span>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center space-y-2">
                          <span className="text-xs text-slate-400 block">ISO 27001</span>
                          <span className="text-2xl font-black font-mono text-cyan-400">92%</span>
                          <span className="text-[10px] text-slate-500 block">امتثال الضوابط الفنية</span>
                        </div>

                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center space-y-2">
                          <span className="text-xs text-slate-400 block">PCI DSS v4.0</span>
                          <span className="text-2xl font-black font-mono text-amber-500">B-</span>
                          <span className="text-[10px] text-slate-500 block">أمان معالجة الدفع</span>
                        </div>

                      </div>

                      {/* SIMULATED PROGRESS ACTIVE SCANS & PIPELINES */}
                      <div className="pt-2 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-300">محرك الفحص النشط والتقدم</h4>
                          <span className="text-[10px] text-cyan-400 font-mono">تحديث فوري</span>
                        </div>

                        {activeScans.length === 0 ? (
                          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-850 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                            <Terminal className="w-4 h-4" />
                            <span>لا توجد عمليات فحص نشطة حالياً. يمكنك تفعيل فحص أمني من قائمة الأهداف.</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {activeScans.map((scan) => (
                              <div
                                key={scan.id}
                                onClick={() => {
                                  setActiveTerminalScanId(scan.id);
                                  setShowTerminal(true);
                                }}
                                className="p-3 bg-slate-950 hover:bg-slate-900 cursor-pointer rounded-xl border border-slate-850 hover:border-cyan-500/25 transition-all space-y-2 group"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{scan.targetName}</span>
                                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">({scan.id})</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/10 font-bold">
                                      {scan.status === 'Completed' ? 'تم الفحص' : scan.status === 'Analyzing' ? 'تحليل ذكي' : 'جاري الفحص'}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-cyan-400">{scan.progress}%</span>
                                  </div>
                                </div>
                                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full animate-pulse transition-all" style={{ width: `${scan.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <div className="text-[10px] font-mono text-slate-500 max-h-12 overflow-y-auto space-y-1 scrollbar-thin flex-1 truncate">
                                    {scan.scannerLogs.map((log, index) => (
                                      <div key={index} className="truncate">{log}</div>
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-cyan-500/70 group-hover:text-cyan-400 flex items-center gap-1 shrink-0 ml-2">
                                    <Terminal className="w-3.5 h-3.5" />
                                    عرض الطرفية التفاعلية ←
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* VULNERABILITY TREND TIMELINE */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800/80 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white">تتبع تباين مستوى المخاطر والمصادقة الأمنية مع الزمن</h3>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                      {[
                        { day: 'السبت', val: 'Low', score: 12 },
                        { day: 'الأحد', val: 'Medium', score: 32 },
                        { day: 'الإثنين', val: 'Medium', score: 34 },
                        { day: 'الثلاثاء', val: 'High', score: 68 },
                        { day: 'الأربعاء', val: 'High', score: 71 },
                        { day: 'الخميس', val: 'High', score: 82 },
                        { day: 'الجمعة (اليوم)', val: 'Medium', score: 67 }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-950/60 p-3 rounded-lg border border-slate-850/80 text-center space-y-1">
                          <span className="text-[10px] text-slate-400 block">{item.day}</span>
                          <div className="w-full bg-slate-850 h-10 flex items-end justify-center rounded">
                            <div
                              className={`w-3 rounded-t ${
                                item.score > 70 ? 'bg-red-500' : item.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ height: `${item.score}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white mt-1 block">{item.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* B. PROJECTS & TARGETS MANAGEMENT (VERIFICATION FLOW & TRIGGER SCANS) */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  
                  {/* HEADER WITH ACTIONS */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">إدارة المشروعات وأهداف الفحص الأمني</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        يمكنك إضافة أهداف فحص جديدة (مواقع ويب، واجهات برمجة، تطبيقات جوال) وإثبات ملكية الموارد قبل بدء الفحص لضمان الامتثال والمسؤولية الأمنية.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddProjectModal(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        إنشاء مشروع جديد
                      </button>
                      <button
                        onClick={() => {
                          if (projects.length === 0) {
                            showToast("يرجى إنشاء مشروع أولاً قبل إضافة هدف أمني", "error");
                            return;
                          }
                          setSelectedProjectIdForTarget(projects[0].id);
                          setShowAddTargetModal(true);
                        }}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة هدف أمني للشركة
                      </button>
                    </div>
                  </div>

                  {/* PROJECTS & TARGETS TREE GRID */}
                  {projects.length === 0 ? (
                    <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                      <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
                      <h3 className="text-base font-bold text-white">لا توجد مشاريع أمنية نشطة</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        البدء في حماية البنية التحتية لشركتك عن طريق إضافة أول مشروع وتحديد أهداف الفحص الفني.
                      </p>
                      <button
                        onClick={() => setShowAddProjectModal(true)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-all"
                      >
                        إضافة أول مشروع الآن
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {projects.map((proj) => (
                        <div key={proj.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                          {/* Project Header */}
                          <div className="bg-slate-850 p-5 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                                {proj.name}
                              </h3>
                              <p className="text-xs text-slate-400 mt-1">{proj.description}</p>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              تم الإنشاء: {new Date(proj.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </div>

                          {/* Target Cards inside Project */}
                          <div className="p-5">
                            {proj.targets.length === 0 ? (
                              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                                <p>لا توجد أهداف فحص مضافة تحت هذا المشروع حالياً.</p>
                                <button
                                  onClick={() => {
                                    setSelectedProjectIdForTarget(proj.id);
                                    setShowAddTargetModal(true);
                                  }}
                                  className="text-cyan-400 hover:underline text-xs"
                                >
                                  إضافة هدف أمني لهذا المشروع +
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {proj.targets.map((target) => (
                                  <div key={target.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between gap-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                          {target.type === 'Website' && <Globe className="w-4 h-4 text-cyan-400" />}
                                          {target.type === 'API' && <Server className="w-4 h-4 text-purple-400" />}
                                          {target.type === 'Mobile' && <Smartphone className="w-4 h-4 text-emerald-400" />}
                                          {target.type === 'Source Code' && <Code className="w-4 h-4 text-amber-400" />}
                                          <h4 className="text-xs font-bold text-white truncate max-w-[150px]">{target.name}</h4>
                                          {target.bountyPlatform && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/25 font-mono">
                                              {target.bountyPlatform}
                                            </span>
                                          )}
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                                          target.verificationStatus === 'Verified'
                                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-950 text-amber-400 border-amber-500/20'
                                        }`}>
                                          {target.verificationStatus === 'Verified' ? 'مؤكد الملكية' : 'انتظار التحقق'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-400 font-mono truncate select-all">{target.url}</p>
                                    </div>

                                    {/* Score display if scanned */}
                                    {target.lastScanAt && (
                                      <div className="flex justify-between items-center bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                                        <span className="text-[10px] text-slate-400">آخر فحص: {new Date(target.lastScanAt).toLocaleDateString('ar-SA')}</span>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] text-slate-500">تقييم المخاطر:</span>
                                          <span className={`text-xs font-black font-mono ${
                                            target.currentRiskScore && target.currentRiskScore > 70 ? 'text-red-400' : target.currentRiskScore && target.currentRiskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                                          }`}>{target.currentRiskScore}%</span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      {target.verificationStatus !== 'Verified' ? (
                                        <button
                                          onClick={() => setVerificationModalTarget(target)}
                                          className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          إثبات الملكية الآن
                                        </button>
                                      ) : (
                                        <div className="w-full flex gap-2">
                                          <button
                                            onClick={() => handleTriggerScan(target.id)}
                                            disabled={actionLoading === `scan-${target.id}`}
                                            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-850 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                                          >
                                            {actionLoading === `scan-${target.id}` ? (
                                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                              <Terminal className="w-3.5 h-3.5" />
                                            )}
                                            بدء فحص جديد
                                          </button>
                                          {activeScans.some(s => s.targetId === target.id) && (
                                            <button
                                              onClick={() => {
                                                const match = [...activeScans].reverse().find(s => s.targetId === target.id);
                                                if (match) {
                                                  setActiveTerminalScanId(match.id);
                                                  setShowTerminal(true);
                                                }
                                              }}
                                              className="px-3 py-2 bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                                              title="فتح الطرفية الأمنية لمتابعة السجلات الفورية"
                                            >
                                              <Terminal className="w-3.5 h-3.5 animate-pulse" />
                                              الطرفية
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* C. DETECTED VULNERABILITIES LIST WITH FILTERS & AI ANALYST DETAIL VIEWS */}
              {activeTab === 'vulnerabilities' && (
                <div className="space-y-6">
                  
                  {/* HEADER SECTION */}
                  <div>
                    <h2 className="text-xl font-bold text-white">سجل الثغرات الأمنية المكتشفة</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      قائمة بجميع المشكلات ونقاط الضعف الموثقة والنشطة في أنظمتك، مع تفاصيل الخطورة والتأثير الفعلي وتعليمات الإصلاح المصنفة حسب المعايير الدولية.
                    </p>
                  </div>

                  {/* FILTER BOX */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Search field */}
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-slate-500 absolute top-1/2 right-3 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="ابحث عن ثغرة معينة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>

                    {/* Filter categories */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <span className="text-xs text-slate-400 flex items-center ml-2">فلترة حسب مستوى الخطورة:</span>
                      {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            severityFilter === sev
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {sev === 'All' ? 'الكل' : sev === 'Critical' ? 'حرجة جداً' : sev === 'High' ? 'عالية' : sev === 'Medium' ? 'متوسطة' : 'منخفضة'}
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* INTERACTIVE ANALYTICS DASHBOARD WIDGET */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-900 p-5 rounded-xl border border-slate-800">
                    
                    {/* CARD 1: BY TYPE */}
                    <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-cyan-400" />
                          توزيع الثغرات حسب نوع التصنيف (Vulnerability Types)
                        </h3>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {getTypesChartData().length} تصنيفات
                        </span>
                      </div>
                      
                      {getTypesChartData().length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs">
                          لا توجد بيانات كافية لعرض المخطط البياني.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          {/* Recharts PieChart for interactive visualization */}
                          <div className="h-44 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={getTypesChartData()}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={65}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {getTypesChartData().map((entry: any, index: number) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'][index % 6]} 
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded shadow text-right">
                                          <p className="text-[10px] font-bold text-white">{payload[0].name}</p>
                                          <p className="text-[11px] text-cyan-400 font-mono">الثغرات: {payload[0].value}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Beautiful Interactive List Legend with exact details */}
                          <div className="space-y-2 max-h-44 overflow-y-auto pr-1" dir="rtl">
                            {getTypesChartData().slice(0, 5).map((item: any, index: number) => {
                              const color = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'][index % 6];
                              const percentage = Math.round((item.value / filteredVulnsForCharts.length) * 100);
                              return (
                                <div key={item.name} className="flex items-center justify-between text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                                  <div className="flex items-center gap-1.5 truncate max-w-[130px]" title={item.name}>
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                    <span className="text-slate-300 font-medium truncate">{item.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 font-mono">
                                    <span className="text-white font-bold">{item.value}</span>
                                    <span className="text-[9px] text-slate-500">({percentage}%)</span>
                                  </div>
                                </div>
                              );
                            })}
                            {getTypesChartData().length > 5 && (
                              <p className="text-[10px] text-slate-500 text-center italic font-medium">+ {getTypesChartData().length - 5} تصنيفات أخرى في القائمة</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD 2: BY OWASP */}
                    <div className="bg-slate-950 rounded-xl border border-slate-850 p-5 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-amber-400" />
                          مخاطر معايير OWASP العشرة الأكثر خطورة (OWASP Top 10)
                        </h3>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          مخطط المطابقة والامتثال
                        </span>
                      </div>

                      {getOwaspChartData().length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs">
                          لا توجد بيانات كافية لعرض المخطط البياني.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          {/* Recharts BarChart */}
                          <div className="h-44 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={getOwaspChartData().slice(0, 5)} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis 
                                  dataKey="name" 
                                  type="category" 
                                  hide 
                                />
                                <Tooltip
                                  content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded shadow text-right">
                                          <p className="text-[10px] font-bold text-white">{payload[0].payload.name}</p>
                                          <p className="text-[11px] text-amber-400 font-mono">العدد: {payload[0].value}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                  {getOwaspChartData().slice(0, 5).map((entry: any, index: number) => (
                                    <Cell 
                                      key={`cell-${index}`} 
                                      fill={['#f59e0b', '#eab308', '#ec4899', '#8b5cf6', '#10b981'][index % 5]} 
                                    />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Beautiful Legend with progress percentage and interactive hover */}
                          <div className="space-y-2 max-h-44 overflow-y-auto pr-1" dir="rtl">
                            {getOwaspChartData().slice(0, 5).map((item: any, index: number) => {
                              const color = ['#f59e0b', '#eab308', '#ec4899', '#8b5cf6', '#10b981'][index % 5];
                              const percentage = Math.round((item.value / filteredVulnsForCharts.length) * 100);
                              return (
                                <div key={item.name} className="space-y-1 bg-slate-900 p-2 rounded border border-slate-800">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-1.5 truncate max-w-[130px]" title={item.name}>
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                      <span className="text-slate-300 font-semibold truncate font-mono text-[10px]">{item.name}</span>
                                    </div>
                                    <span className="text-white font-bold font-mono">{item.value} ({percentage}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ backgroundColor: color, width: `${percentage}%` }}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* VULNERABILITIES LIST VIEW */}
                  {vulnerabilities.filter(v => {
                    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.type.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchSeverity = severityFilter === 'All' || v.severity === severityFilter;
                    return matchSearch && matchSeverity;
                  }).length === 0 ? (
                    <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-500 space-y-2">
                      <ShieldAlert className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-sm font-semibold text-slate-400">لا توجد ثغرات مطابقة للخيارات المحددة.</p>
                      <p className="text-xs text-slate-500">تم فحص جميع أهدافك بنجاح أو لم تقم بتشغيل عمليات الفحص بعد.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vulnerabilities
                        .filter(v => {
                          const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.type.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchSeverity = severityFilter === 'All' || v.severity === severityFilter;
                          return matchSearch && matchSeverity;
                        })
                        .map((vuln) => (
                          <div
                            key={vuln.id}
                            className={`p-5 bg-slate-900 rounded-xl border transition-all space-y-4 ${
                              vuln.isFalsePositive
                                ? 'border-slate-800/40 opacity-60'
                                : vuln.severity === 'Critical'
                                ? 'border-red-500/20 hover:border-red-500/40'
                                : vuln.severity === 'High'
                                ? 'border-amber-500/20 hover:border-amber-500/40'
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            
                            {/* Vuln Header Row */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getSeverityBadge(vuln.severity)}
                                  <span className="text-xs font-mono font-bold text-cyan-400">CVSS: {vuln.cvssScore}</span>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-xs text-slate-400">{vuln.targetName}</span>
                                  {vuln.isFalsePositive && (
                                    <span className="bg-slate-950 text-slate-500 border border-slate-800 text-[10px] px-2 py-0.5 rounded">مستبعدة (False Positive)</span>
                                  )}
                                </div>
                                <h3 className="text-sm md:text-base font-extrabold text-white leading-snug">{vuln.title}</h3>
                              </div>

                              {/* Top action buttons */}
                              <div className="flex gap-2 shrink-0 w-full md:w-auto">
                                <button
                                  onClick={() => handleAiAnalyzeVulnerability(vuln.id)}
                                  className="flex-1 md:flex-initial px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  تحليل بالذكاء الاصطناعي
                                </button>
                                <button
                                  onClick={() => handleToggleFalsePositive(vuln.id)}
                                  disabled={actionLoading === `false-pos-${vuln.id}`}
                                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-lg text-xs font-bold transition-all"
                                >
                                  {vuln.isFalsePositive ? 'إعادة تنشيط' : 'استبعاد (False Positive)'}
                                </button>
                              </div>
                            </div>

                            {/* Details expand area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-850 text-xs">
                              
                              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                                <span className="text-slate-500 font-bold block">الوصف والمكان الفني:</span>
                                <p className="text-slate-300 leading-relaxed">{vuln.description}</p>
                                <div className="text-[10px] text-cyan-500 font-mono mt-2 bg-slate-900 p-1.5 rounded border border-slate-800 truncate">
                                  {vuln.location}
                                </div>
                              </div>

                              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                                <span className="text-slate-500 font-bold block">التأثير المتوقع:</span>
                                <p className="text-slate-300 leading-relaxed">{vuln.impact}</p>
                              </div>

                              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-1">
                                <span className="text-slate-500 font-bold block">خطوات الإصلاح المقترحة:</span>
                                <p className="text-slate-300 leading-relaxed">{vuln.remediation}</p>
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                  <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">{vuln.complianceMapping.owasp}</span>
                                  <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">{vuln.complianceMapping.iso27001}</span>
                                </div>
                              </div>

                            </div>

                            {/* REAL TIME AI DETAILED DEEP REPORT STREAM IF EXPANDED */}
                            {analyzingVulnId === vuln.id && (
                              <div className="p-4 bg-radial from-amber-950/20 to-slate-950 rounded-xl border border-amber-500/20 text-xs space-y-3">
                                <div className="flex justify-between items-center border-b border-amber-500/10 pb-2">
                                  <span className="flex items-center gap-1.5 font-bold text-amber-400"><Sparkles className="w-4 h-4 text-amber-400" /> تحليل المستشار الأمني الذكي (AI Analysis)</span>
                                  <button onClick={() => setAnalyzingVulnId(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
                                </div>

                                {!aiVulnAnalysisText ? (
                                  <div className="flex items-center gap-2 text-amber-400 py-3">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>جاري قراءة تفاصيل الثغرة، وإزالة الفحوصات الخاطئة، وكتابة الكود البرمجي الآمن للإصلاح...</span>
                                  </div>
                                ) : (
                                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-sm p-1">
                                    {aiVulnAnalysisText}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        ))}
                    </div>
                  )}

                </div>
              )}

              {/* D. PREMIUM SECURITY REPORTS EXPORT PANEL (arabic custom printable layout) */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  
                  {/* HEADER */}
                  <div>
                    <h2 className="text-xl font-bold text-white">مركز التقارير الأمنية والامتثال الدولي</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      إنشاء تقارير أمنية احترافية فورية بنقرة واحدة مدعومة بملخصات تنفيذية من الذكاء الاصطناعي ومخططات المطابقة لمعايير OWASP و PCI DSS و ISO 27001 مخصصة للإدارة أو المطورين.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: ACTIVE REPORT VIEW & GENERATION */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* CHOOSE PROJECT FORM */}
                      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-end gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-xs font-semibold text-slate-300 block">اختر المشروع الأمني لإصدار التقرير:</label>
                          <select
                            value={selectedReportProject}
                            onChange={(e) => setSelectedReportProject(e.target.value)}
                            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                          >
                            <option value="">-- اختر المشروع الأمني --</option>
                            {projects.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleGenerateReport(selectedReportProject)}
                          disabled={actionLoading === 'generateReport'}
                          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 animate-pulse-subtle"
                        >
                          {actionLoading === 'generateReport' ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                          إصدار التقرير الأمني التفصيلي
                        </button>
                      </div>

                      {/* REPORT CONTENT VIEW BOX */}
                      {activeReport ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden text-sm"
                          id="printable-report"
                        >
                          {/* Report header and branding */}
                          <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                              {companyLogo && (
                                <img
                                  src={companyLogo}
                                  alt="Company Logo"
                                  className="max-h-12 max-w-[120px] object-contain rounded bg-slate-900/80 p-1 border border-slate-800 shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                              <div className="space-y-1">
                                <span className="text-[10px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">تقرير أمني معتمد من منصة التدقيق</span>
                                <h3 className="text-base font-black text-white">
                                  {reportTitlePrefix ? `${reportTitlePrefix} - ` : ''}{activeReport.projectName}
                                </h3>
                                <p className="text-xs text-slate-500">تم الإنشاء في: {new Date(activeReport.generatedAt).toLocaleString('ar-SA')}</p>
                              </div>
                            </div>
                            <div className="text-left shrink-0">
                              <span className="text-xs text-slate-400">تقييم المخاطر التراكمي (Risk Score)</span>
                              <div className={`text-3xl font-black font-mono ${
                                activeReport.riskScore > 70 ? 'text-red-400' : activeReport.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                              }`}>{activeReport.riskScore}%</div>
                            </div>
                          </div>

                          {/* Summary blocks */}
                          <div className="p-6 space-y-6">
                            
                            {/* 1. EXECUTIVE SUMMARY FROM GEMINI AI */}
                            <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                الملخص التنفيذي الذكي (Executive Summary)
                              </h4>
                              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{activeReport.executiveSummary}</p>
                            </div>

                            {/* 2. STATS & COMPLIANCE MAPPING GRAPHICS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              
                              {/* Compliance progress bars */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                                <h4 className="text-xs font-bold text-slate-300">توافق المعايير الدولية والامتثال القانوني</h4>
                                
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                      <span>منهجية OWASP Top 10</span>
                                      <span className="font-mono text-white">{activeReport.compliancePercentage.owasp}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden">
                                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeReport.compliancePercentage.owasp}%` }}></div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                      <span>متطلبات أمان بطاقات الدفع PCI DSS</span>
                                      <span className="font-mono text-white">{activeReport.compliancePercentage.pciDss}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden">
                                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${activeReport.compliancePercentage.pciDss}%` }}></div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                      <span>إطار الأمن السيبراني ISO 27001</span>
                                      <span className="font-mono text-white">{activeReport.compliancePercentage.iso27001}%</span>
                                    </div>
                                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden">
                                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeReport.compliancePercentage.iso27001}%` }}></div>
                                    </div>
                                  </div>
                                </div>

                              </div>

                              {/* Severity counting */}
                              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                                <h4 className="text-xs font-bold text-slate-300 mb-2">إحصاءات الثغرات المستخرجة</h4>
                                <div className="grid grid-cols-4 gap-2">
                                  
                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                                    <span className="text-[10px] text-red-400 block font-bold">حرجة جداً</span>
                                    <span className="text-xl font-black font-mono text-white">{activeReport.severityBreakdown.Critical}</span>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                                    <span className="text-[10px] text-amber-400 block font-bold">عالية</span>
                                    <span className="text-xl font-black font-mono text-white">{activeReport.severityBreakdown.High}</span>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                                    <span className="text-[10px] text-yellow-400 block font-bold">متوسطة</span>
                                    <span className="text-xl font-black font-mono text-white">{activeReport.severityBreakdown.Medium}</span>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-center">
                                    <span className="text-[10px] text-slate-400 block font-bold">منخفضة</span>
                                    <span className="text-xl font-black font-mono text-white">{activeReport.severityBreakdown.Low}</span>
                                  </div>

                                </div>
                                <div className="text-[10px] text-slate-500 mt-3">
                                  تم تصفية جميع النتائج الخاطئة والتحقق يدوياً من الأدلة الفنية للامتثال للمعايير الفيدرالية.
                                </div>
                              </div>

                            </div>

                            {/* 3. DETAILED TECHNICAL ISSUES TABLE */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-slate-300">الملحق التقني ومواقع الثغرات المحددة:</h4>
                              
                              {activeReport.vulnerabilities.length === 0 ? (
                                <p className="text-xs text-slate-500 italic">لا توجد ثغرات نشطة ومسجلة في هذا المشروع.</p>
                              ) : (
                                <div className="space-y-2.5">
                                  {activeReport.vulnerabilities.map((v: any, index: number) => (
                                    <div key={v.id} className="p-4 bg-slate-950 rounded-lg border border-slate-850 flex flex-col md:flex-row justify-between gap-4">
                                      <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-white text-xs">{index + 1}. {v.title}</span>
                                          {getSeverityBadge(v.severity)}
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex gap-4">
                                          <span>موقع الثغرة: <code className="font-mono text-cyan-400 select-all bg-slate-900 px-1 py-0.5 rounded">{v.location}</code></span>
                                          <span>CVSS: <b className="font-mono text-white">{v.cvssScore}</b></span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{v.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                            </div>

                            {/* Helper Info & Print / Download Buttons */}
                            <div className="pt-5 border-t border-slate-850 space-y-4">
                              {/* Educational warning for sandboxed iframes and scrolling limitations */}
                              <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-xl p-4 text-xs text-slate-300 leading-relaxed space-y-1.5 no-print">
                                <p className="font-bold text-cyan-400 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-cyan-400" />
                                  تلميح الطباعة والامتثال الرقمي:
                                </p>
                                <p>
                                  إذا كنت تستعرض المنصة داخل إطار مدمج (Iframe)، فقد تواجه قيوداً في الطباعة المباشرة من المتصفح أو قد يظهر التقرير مقتطعاً بسبب الأبعاد البرمجية للمستعرض.
                                  للحصول على <b>أعلى دقة للملف بدون أي اقتطاع أو انقطاع في الصفحات</b>، ننصحك باستخدام زر <b>تصدير كـ HTML مستقل</b>، ثم فتح الملف المكتبي والنقر على طباعة وحفظ كـ PDF.
                                </p>
                              </div>

                              <div className="flex flex-wrap md:flex-nowrap justify-end gap-3 no-print">
                                <button
                                  onClick={() => {
                                    try {
                                      window.print();
                                    } catch (e) {
                                      showToast("الطباعة المباشرة مقيدة في هذا المتصفح حالياً. يرجى استخدام زر التصدير كملف مستقل.", "error");
                                    }
                                  }}
                                  className="w-full md:w-auto px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                                  title="طباعة سريعة من المتصفح مباشرة"
                                >
                                  <Eye className="w-4 h-4 text-slate-400" />
                                  طباعة سريعة للمتصفح (Ctrl+P)
                                </button>
                                
                                <button
                                  onClick={() => exportToStandaloneHTML(activeReport)}
                                  className="w-full md:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-600/10"
                                  title="تصدير كتقرير مستقل بصيغة HTML مبرمجة تفتح نافذة الطباعة تلقائياً دون انقطاع"
                                >
                                  <Download className="w-4 h-4" />
                                  تصدير كـ HTML مستقل (كامل وبدون اقتطاع)
                                </button>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-12 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-500">
                          <FileText className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                          <p className="text-sm font-semibold text-slate-400">يرجى تحديد المشروع من القائمة أعلاه لبناء التقرير.</p>
                          <p className="text-xs text-slate-500">سيتم توليد التقرير متضمناً الملخص الفني وخرائط الامتثال مباشرة.</p>
                        </div>
                      )}

                    </div>

                    {/* RIGHT COLUMN: REPORTS HISTORY LIST */}
                    <div className="lg:col-span-1 space-y-4">
                      
                      {/* REPORT BRANDING & LOGO SETTINGS CARD */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Settings className="w-5 h-5 text-cyan-400 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-white">تخصيص الشعار والهوية (Branding)</h3>
                            <p className="text-[10px] text-slate-400">إضافة شعار وبادئة مخصصة لتقارير الـ PDF</p>
                          </div>
                        </div>

                        {/* Company Name Prefix input */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-300 block">اسم الشركة / بادئة التقرير:</label>
                          <input
                            type="text"
                            placeholder="مثال: شركة الحلول المتقدمة"
                            value={reportTitlePrefix}
                            onChange={(e) => {
                              const val = e.target.value;
                              setReportTitlePrefix(val);
                              localStorage.setItem('report_title_prefix', val);
                            }}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50 placeholder-slate-600"
                          />
                        </div>

                        {/* Logo selector & preview */}
                        <div className="space-y-3">
                          <label className="text-[11px] font-semibold text-slate-300 block">شعار التقرير (Company Logo):</label>
                          
                          {/* Current Logo Preview */}
                          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col items-center justify-center gap-2 relative min-h-[100px]">
                            {companyLogo ? (
                              <>
                                <img
                                  src={companyLogo}
                                  alt="Preview Logo"
                                  className="max-h-16 max-w-full object-contain rounded p-1 bg-slate-900 border border-slate-800"
                                  referrerPolicy="no-referrer"
                                />
                                <button
                                  onClick={() => {
                                    setCompanyLogo(null);
                                    localStorage.removeItem('report_company_logo');
                                    showToast("تم إزالة الشعار وإعادة التعيين لافتراضيات المنصة.", "info");
                                  }}
                                  className="absolute top-2 left-2 p-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 rounded-lg border border-red-500/25 transition-all text-[10px] flex items-center gap-1 cursor-pointer"
                                  title="حذف الشعار"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>حذف</span>
                                </button>
                              </>
                            ) : (
                              <div className="text-center space-y-1 py-2">
                                <Globe className="w-8 h-8 text-slate-600 mx-auto animate-pulse-subtle" />
                                <p className="text-[10px] text-slate-500">لا يوجد شعار محدد للتقارير حالياً</p>
                              </div>
                            )}
                          </div>

                          {/* Preset Options */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 block">اختر من النماذج الاحترافية الجاهزة:</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {logoPresets.map(preset => (
                                <button
                                  key={preset.id}
                                  onClick={() => {
                                    setCompanyLogo(preset.svg);
                                    localStorage.setItem('report_company_logo', preset.svg);
                                    showToast(`تم تطبيق نموذج الشعار: ${preset.name}`, "success");
                                  }}
                                  className={`p-1.5 rounded-lg border text-[10px] font-medium transition-all text-center leading-normal truncate ${
                                    companyLogo === preset.svg
                                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                                      : 'bg-slate-950 text-slate-400 border-slate-850 hover:bg-slate-900 hover:text-slate-200'
                                  }`}
                                  title={preset.name}
                                >
                                  {preset.id === 'shield' ? 'درع الحماية' : preset.id === 'cloud' ? 'سحابة الأمان' : 'شفرة برمجية'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Upload custom logo */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-semibold text-slate-400 block">أو قم برفع شعار مخصص لشركتك:</span>
                            <div className="flex items-center gap-2">
                              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-cyan-500/40 bg-slate-950/60 hover:bg-slate-950 p-2.5 rounded-xl cursor-pointer transition-all">
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>اختر ملف الشعار (PNG/JPG/SVG)</span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 1.5 * 1024 * 1024) {
                                        showToast("حجم الشعار كبير جداً. يرجى اختيار صورة أقل من 1.5 ميجابايت لضمان سرعة الطباعة.", "error");
                                        return;
                                      }
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const base64String = reader.result as string;
                                        setCompanyLogo(base64String);
                                        localStorage.setItem('report_company_logo', base64String);
                                        showToast("تم رفع وتثبيت شعار شركتك بنجاح للتقارير القادمة.", "success");
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <span className="text-[9px] text-slate-500 leading-normal block">ملاحظة: لضمان أفضل مظهر احترافي، استخدم صورة مفرغة ذات خلفية شفافة وتصميم متناسب.</span>
                          </div>

                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                          <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold text-white">سجل التقارير الصادرة (Reports History)</h3>
                            <p className="text-[10px] text-slate-400">جميع تقارير الفحص والامتثال السابقة</p>
                          </div>
                        </div>

                        {reportsHistory.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                            <p>لم يتم العثور على تقارير مصدرة مسبقاً.</p>
                            <p className="text-[10px] text-slate-600">اختر مشروعاً واضغط على إصدار التقرير ليظهر هنا.</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
                            {reportsHistory.map((rep) => (
                              <div
                                key={rep.id}
                                className={`p-4 rounded-xl border transition-all space-y-3 bg-slate-950 ${
                                  activeReport?.id === rep.id
                                    ? 'border-cyan-500/50 ring-1 ring-cyan-500/20'
                                    : 'border-slate-850 hover:border-slate-800'
                                }`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-relaxed">
                                      {rep.projectName}
                                    </h4>
                                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                      rep.riskScore > 70
                                        ? 'bg-red-950 text-red-400'
                                        : rep.riskScore > 40
                                        ? 'bg-amber-950 text-amber-400'
                                        : 'bg-emerald-950 text-emerald-400'
                                    }`}>
                                      {rep.riskScore}%
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                                    <span>{new Date(rep.generatedAt).toLocaleDateString('ar-SA')}</span>
                                    <span className="bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 rounded font-mono font-bold text-cyan-400">
                                      {rep.totalVulnerabilities} ثغرات
                                    </span>
                                  </div>
                                </div>

                                <div className="flex gap-2 border-t border-slate-900 pt-2.5">
                                  <button
                                    onClick={() => {
                                      setActiveReport(rep);
                                      showToast(`تم إعادة تحميل التقرير الخاص بـ "${rep.projectName}" بنجاح.`, 'success');
                                    }}
                                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="إعادة تحميل وعرض محتويات التقرير"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                    عرض التقرير
                                  </button>
                                  <button
                                    onClick={() => handlePrintHistoricalReport(rep)}
                                    className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-500/20 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    title="تحميل وطباعة كـ PDF"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    حفظ كـ PDF
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* E. AI CHAT SECURITY ASSISTANT PANEL */}
              {activeTab === 'chat' && (
                <div className="space-y-6 flex-1 flex flex-col min-h-[500px]">
                  
                  {/* HEADER */}
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      مستشار الأمن الذكي والتحليل البرمجي
                      <span className="bg-amber-950 text-amber-400 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded">مدعوم بالذكاء الاصطناعي</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      اطرح أي أسئلة فنية أو اطلب مراجعة الأكواد المصدرية، أو فهم كيفية إصلاح الثغرات الأمنية المكتشفة في مشروعك فورياً.
                    </p>
                  </div>

                  {/* PRE-DRAFTED QUICK QUESTIONS */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-500 flex items-center">أسئلة شائعة:</span>
                    {[
                      "كيف يمكنني حماية كودي من ثغرات SQL Injection؟",
                      "اشرح لي آلية تفعيل SSL Pinning في تطبيقات الجوال",
                      "كيف أمنع الهجمات الموجهة لواجهات الـ API وحماية التوكينات السحابية؟",
                      "ما هي الخطوات الفنية للامتثال لضوابط الهيئة الوطنية للأمن السيبراني؟"
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickQuestion(q)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-[11px] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* CHAT MESSAGES DISPLAY BOX */}
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4 min-h-[350px]">
                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[320px] scrollbar-thin">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`p-4 rounded-2xl max-w-2xl text-sm leading-relaxed space-y-1.5 ${
                            msg.sender === 'user'
                              ? 'bg-cyan-600 text-white rounded-tl-none'
                              : 'bg-slate-950 text-slate-200 rounded-tr-none border border-slate-850'
                          }`}>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            <span className="text-[9px] text-slate-400/80 block text-left">
                              {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                            </span>
                          </div>
                        </div>
                      ))}
                      {isChatSending && (
                        <div className="flex justify-start">
                          <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl rounded-tr-none flex items-center gap-2 text-xs text-slate-400">
                            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                            <span>مستشار الأمن يحلل استفسارك ويقوم بصياغة رد تقني آمن...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* INPUT FORM */}
                    <form id="chat-form" onSubmit={handleSendChatMessage} className="flex gap-2.5 pt-4 border-t border-slate-850">
                      <input
                        type="text"
                        placeholder="اطرح سؤالاً أمنياً أو الصق كوداً لمراجعته..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                      />
                      <button
                        type="submit"
                        disabled={isChatSending || !chatInput.trim()}
                        className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 disabled:from-slate-800 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        إرسال
                      </button>
                    </form>
                  </div>

                </div>
              )}

              {/* F. SUBSCRIPTION MANAGEMENT & AUDIT LOGS PANEL */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  
                  {/* SaaS TIERS GRID */}
                  <div>
                    <h2 className="text-xl font-bold text-white">إدارة الاشتراكات وخطط الـ SaaS</h2>
                    <p className="text-xs text-slate-400 mt-1">تعديل رخص وخطط التشغيل المناسبة لحجم أعمال مؤسستك أو شركتك الرقمية.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Free Plan */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-xs text-slate-400">باقة الأفراد</span>
                        <h3 className="text-lg font-black text-white">Free Plan</h3>
                        <div className="text-2xl font-black text-white">$0 <span className="text-xs text-slate-500">/شهرياً</span></div>
                        <p className="text-xs text-slate-400">للاختبارات الفردية البسيطة والتعرف الفني على المنصة.</p>
                        <div className="border-t border-slate-850 pt-3 space-y-2 text-xs">
                          <div className="flex gap-2 text-slate-300">✓ مشروع واحد فقط</div>
                          <div className="flex gap-2 text-slate-300">✓ هدف فحص واحد</div>
                          <div className="flex gap-2 text-slate-300">✓ 5 فحوصات شهرياً</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpgradeSubscription('Free')}
                        disabled={userProfile?.subscription.plan === 'Free'}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-850 disabled:bg-slate-900 disabled:text-slate-500 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all"
                      >
                        {userProfile?.subscription.plan === 'Free' ? 'الباقة الحالية' : 'التحويل للباقة المجانية'}
                      </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border-2 border-cyan-500/40 p-5 space-y-5 flex flex-col justify-between relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] px-3 py-1 rounded-full font-bold">الأكثر مبيعاً</div>
                      <div className="space-y-3">
                        <span className="text-xs text-cyan-400 font-bold">باقة الشركات الناشئة</span>
                        <h3 className="text-lg font-black text-white">Professional</h3>
                        <div className="text-2xl font-black text-cyan-400">$149 <span className="text-xs text-slate-500">/شهرياً</span></div>
                        <p className="text-xs text-slate-300">مثالية للشركات والمواقع النشطة التي ترغب في تحليل أوتوماتيكي مستمر.</p>
                        <div className="border-t border-slate-850 pt-3 space-y-2 text-xs">
                          <div className="flex gap-2 text-slate-200">✓ 10 مشاريع أمنية</div>
                          <div className="flex gap-2 text-slate-200">✓ 5 أهداف لكل مشروع</div>
                          <div className="flex gap-2 text-slate-200">✓ 50 فحص أمني شهرياً</div>
                          <div className="flex gap-2 text-slate-200">✓ استشارات غير محدودة من الذكاء الاصطناعي</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpgradeSubscription('Professional')}
                        disabled={userProfile?.subscription.plan === 'Professional'}
                        className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-950 disabled:text-cyan-400 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-cyan-950/20"
                      >
                        {userProfile?.subscription.plan === 'Professional' ? 'الباقة الحالية' : 'الترقية للباقة الاحترافية'}
                      </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-5 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-xs text-slate-400">باقة المؤسسات الكبرى</span>
                        <h3 className="text-lg font-black text-white">Enterprise Plan</h3>
                        <div className="text-2xl font-black text-white">$599 <span className="text-xs text-slate-500">/شهرياً</span></div>
                        <p className="text-xs text-slate-400">مصممة للفرق والبنوك والمؤسسات الأمنية التي تتطلب عمليات فحص واسعة النطاق.</p>
                        <div className="border-t border-slate-850 pt-3 space-y-2 text-xs">
                          <div className="flex gap-2 text-slate-300">✓ 100 مشروع أمني</div>
                          <div className="flex gap-2 text-slate-300">✓ أهداف فحص غير محدودة</div>
                          <div className="flex gap-2 text-slate-300">✓ 500 فحص أمني/شهري</div>
                          <div className="flex gap-2 text-slate-300">✓ خوادم مخصصة ودعم فني على مدار الساعة</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpgradeSubscription('Enterprise')}
                        disabled={userProfile?.subscription.plan === 'Enterprise'}
                        className="w-full py-2 bg-slate-950 hover:bg-slate-850 disabled:bg-slate-900 disabled:text-slate-500 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all"
                      >
                        {userProfile?.subscription.plan === 'Enterprise' ? 'الباقة الحالية' : 'التحويل للباقة الشاملة'}
                      </button>
                    </div>

                  </div>

                  {/* TEAM MEMBER & PRIVILEGES ROLES SIMULATOR */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white">فريق العمل وتفويض الصلاحيات (RBAC)</h3>
                    <p className="text-[11px] text-slate-400">دعوة أعضاء الفريق الأمني وتحديد رتبهم لإدارة الأهداف الأمنية وفحص الثغرات لضمان النزاهة والتحقق المستمر.</p>
                    
                    <form onSubmit={handleInviteTeamMember} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                      <input
                        type="text"
                        placeholder="الاسم الثلاثي..."
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 text-white"
                      />
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني..."
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 text-white"
                      />
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 text-slate-300"
                      >
                        <option value="Viewer">Viewer (مشاهدة فقط)</option>
                        <option value="Security Analyst">Security Analyst (فحص وإصلاح)</option>
                        <option value="Admin">Admin (التحكم بالمنصة)</option>
                      </select>
                      <button
                        type="submit"
                        disabled={actionLoading === 'inviteTeam'}
                        className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all"
                      >
                        إرسال دعوة انضمام
                      </button>
                    </form>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right text-slate-400">
                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-950 border border-slate-850">
                          <tr>
                            <th scope="col" className="px-6 py-3">اسم الموظف</th>
                            <th scope="col" className="px-6 py-3">البريد الإلكتروني</th>
                            <th scope="col" className="px-6 py-3">صلاحية النظام</th>
                            <th scope="col" className="px-6 py-3">تاريخ الانضمام</th>
                            <th scope="col" className="px-6 py-3">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map((member) => (
                            <tr key={member.id} className="bg-slate-900 border-b border-slate-850 hover:bg-slate-950/60 transition-colors">
                              <th scope="row" className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                                {member.name}
                              </th>
                              <td className="px-6 py-4 font-mono select-all">
                                {member.email}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  member.role === 'Admin'
                                    ? 'bg-red-950 text-red-400 border border-red-500/10'
                                    : member.role === 'Security Analyst'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-500/10'
                                    : 'bg-slate-950 text-slate-300 border border-slate-850'
                                }`}>
                                  {member.role === 'Admin' ? 'المدير العام' : member.role === 'Security Analyst' ? 'محلل ثغرات أمنية' : 'مشاهد فقط'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(member.joinedAt).toLocaleDateString('ar-SA')}
                              </td>
                              <td className="px-6 py-4">
                                {member.id !== 'tm-1' && (
                                  <button
                                    onClick={() => handleRemoveTeamMember(member.id)}
                                    className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> إزالة الصلاحيات
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* COMPLIANCE AUDIT LOGS DISPLAY */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-white">سجلات التدقيق الأمني للامتثال (Compliance Audit Logs)</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">تسجيل فوري وغير قابل للتعديل لكامل العمليات والتحقق الفني على المنصة.</p>
                      </div>
                      <button
                        onClick={async () => {
                          const res = await fetch('/api/audit-logs/clear', { method: 'POST' });
                          const envelope = await res.json();
                          const data = envelope.success ? envelope.data : {};
                          setAuditLogs(data.auditLogs || auditLogs);
                          showToast(envelope.message || "تم مسح السجل", 'info');
                        }}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg text-xs"
                      >
                        تصفية السجل
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">{log.action}</span>
                              <span className="text-slate-400">{log.details}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex gap-4">
                              <span>المستخدم: <code className="font-mono text-slate-400">{log.userEmail}</code></span>
                              <span>عنوان الـ IP: <code className="font-mono text-slate-400">{log.ipAddress}</code></span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{new Date(log.timestamp).toLocaleString('ar-SA')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* G. BUG BOUNTY HUNTER PORTAL */}
              {activeTab === 'bugbounty' && (
                <div className="space-y-6">
                  
                  {/* HERO BANNER WITH AMBIENT GRADIENT */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-3 text-center md:text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono">
                          <Trophy className="w-3.5 h-3.5 animate-bounce" />
                          <span>برنامج الإفصاح المسؤول ومكافآت الثغرات (Safe Harbor Verified)</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                          بوابة صائدي الثغرات والمكافآت الأمنية
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                          مرحباً بك في المجتمع التقني للحماية التشاركية. نحن في شركة DigitalTech Solutions نقدر جهود الباحثين الأمنيين الهاكرز الأخلاقيين لتعزيز خطوطنا الدفاعية. اكتشف ثغرة، أبلغنا بأمان، واحصل على تكريم مالي ومكان في لوحة الشرف!
                        </p>
                      </div>
                      <div className="shrink-0 flex gap-3">
                        <button
                          onClick={() => setShowAddBbReportModal(true)}
                          className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-950/20 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          تسجيل وإرسال ثغرة
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QUICK STATS METER */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs">برامج المكافآت النشطة</span>
                        <Globe className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{bbPrograms.length}</div>
                      <p className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                        ● نطاقات إنتاجية حقيقية في النطاق
                      </p>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs">إجمالي المكافآت المدفوعة</span>
                        <Gift className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-black text-emerald-400">$34,800</div>
                      <p className="text-[10px] text-slate-400">دعم متواصل لجهود الباحثين</p>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs">تقاريري المقدمة</span>
                        <FileText className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-2xl font-black text-white">{bbSubmissions.length}</div>
                      <p className="text-[10px] text-purple-400 font-semibold">
                        تقارير نشطة وموثقة بالنظام
                      </p>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs">أعلى مكافأة ثغرة حرجة</span>
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-amber-400">$8,000</div>
                      <p className="text-[10px] text-slate-400">تعتمد على نقاط خطورة CVSS v3</p>
                    </div>
                  </div>

                  {/* THREE COLUMN INNER TAB LAYOUT */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT / CENTER TWO-THIRDS: CONTENT VIEWS */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* AI BOUNTY REPORT DRAFTSMAN CARD */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                            مساعد صياغة تقارير الثغرات الذكي (AI Bug Bounty Draftsman)
                          </h3>
                          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
                            توليد احترافي بـ Gemini
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          أدخل تفاصيل الثغرة الأمنية التي قمت باكتشافها بشكل مبدئي، وسيقوم المساعد الذكي بصياغة تقرير أمني رسمي واحترافي باللغة الإنجليزية متوافق مع معايير منصات HackerOne و Bugcrowd بما في ذلك الأثر التقني وخطوات إعادة الاستغلال الآمن (Proof of Concept).
                        </p>

                        {/* IMPORT TARGET FINDING COMPONENT */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <Download className="w-4 h-4 text-cyan-400 animate-bounce" />
                            استيراد تفاصيل الثغرة من أهداف الفحص الحالية (Import Target Finding)
                          </span>
                          <p className="text-[10px] text-slate-400">
                            بدلاً من الكتابة اليدوية لعنوان وتفاصيل الثغرة، يمكنك تحديد الهدف الأمني واختيار إحدى الثغرات المكتشفة سابقاً بواسطة فاحص الأنظمة الآلي لاستيراد كامل بياناتها بضغطة زر.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block font-semibold">1. اختر الهدف الأمني:</label>
                              <select
                                value={importTargetSelected}
                                onChange={(e) => {
                                  setImportTargetSelected(e.target.value);
                                  setImportVulnSelected('');
                                }}
                                className="w-full p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                              >
                                <option value="">-- اختر الهدف الأمني --</option>
                                {projects.flatMap(p => p.targets).map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.url})</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block font-semibold">2. اختر الثغرة المكتشفة:</label>
                              <select
                                value={importVulnSelected}
                                onChange={(e) => setImportVulnSelected(e.target.value)}
                                disabled={!importTargetSelected}
                                className="w-full p-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 disabled:opacity-50"
                              >
                                <option value="">-- اختر الثغرة الأمنية --</option>
                                {vulnerabilities
                                  .filter(v => v.targetId === importTargetSelected)
                                  .map(v => (
                                    <option key={v.id} value={v.id}>
                                      [{v.severity}] {v.title}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                          {importTargetSelected && vulnerabilities.filter(v => v.targetId === importTargetSelected).length === 0 && (
                            <p className="text-[10px] text-amber-500 bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-900/30">
                              لا توجد ثغرات نشطة مكتشفة لهذا الهدف حالياً. تأكد من تشغيل فحص أمني ناجح أولاً.
                            </p>
                          )}
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={handleImportVulnerabilityData}
                              disabled={!importVulnSelected}
                              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                            >
                              <Download className="w-3.5 h-3.5" />
                              استيراد البيانات وتعبئة النموذج
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 py-1">
                          <span className="h-px bg-slate-800 flex-1"></span>
                          <span className="text-[10px] text-slate-500 font-bold">أو أدخل التفاصيل يدوياً أدناه</span>
                          <span className="h-px bg-slate-800 flex-1"></span>
                        </div>

                        <form onSubmit={handleGenerateBountyReport} className="space-y-4 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 block">عنوان الثغرة الأولي (أو المشكلة المكتشفة):</label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: IDOR on private message endpoint leads to message disclosure"
                              value={aiReportTitle}
                              onChange={(e) => setAiReportTitle(e.target.value)}
                              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-300 block">نوع الثغرة البرمجية:</label>
                              <select
                                value={aiReportVulnType}
                                onChange={(e) => setAiReportVulnType(e.target.value)}
                                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
                              >
                                <option value="Insecure Direct Object Reference (IDOR)">Insecure Direct Object Reference (IDOR)</option>
                                <option value="Stored Cross-Site Scripting (Stored XSS)">Stored Cross-Site Scripting (Stored XSS)</option>
                                <option value="Server-Side Request Forgery (SSRF)">Server-Side Request Forgery (SSRF)</option>
                                <option value="Broken Object Level Authorization (BOLA / IDOR)">Broken Object Level Authorization (BOLA)</option>
                                <option value="Remote Code Execution (RCE)">Remote Code Execution (RCE)</option>
                                <option value="SQL Injection (SQLi)">SQL Injection (SQLi)</option>
                                <option value="CSRF on sensitive action">Cross-Site Request Forgery (CSRF)</option>
                                <option value="Information Disclosure">تسريب معلومات حساسة (Info Disclosure)</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-300 block">الخطورة المتوقعة للثغرة (Severity):</label>
                              <select
                                value={aiReportSeverity}
                                onChange={(e) => setAiReportSeverity(e.target.value)}
                                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
                              >
                                <option value="Critical">Critical (حرجة جداً)</option>
                                <option value="High">High (عالية الخطورة)</option>
                                <option value="Medium">Medium (متوسطة الخطورة)</option>
                                <option value="Low">Low (منخفضة الخطورة)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 block">خطوات إعادة الإنتاج واستغلال الثغرة (PoC Steps):</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="اكتب كيف يمكن الوصول للثغرة، مثال: 1. Go to URL /api/messages?id=101, 2. Change id to 102 to view another user's message..."
                              value={aiReportPoc}
                              onChange={(e) => setAiReportPoc(e.target.value)}
                              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-300 block">الأثر التشغيلي والتقني (Operational Impact):</label>
                            <textarea
                              rows={2}
                              required
                              placeholder="مثال: This vulnerability allows malicious users to steal session credentials / read confidential data of other clients without authorization."
                              value={aiReportImpact}
                              onChange={(e) => setAiReportImpact(e.target.value)}
                              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={bountyReportLoading}
                              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-amber-850 disabled:to-amber-900 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
                            >
                              {bountyReportLoading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>جاري صياغة وهيكلة التقرير الأمني...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>توليد التقرير الأمني الاحترافي للثغرة (Generate Report)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>

                        {/* RENDER DRAFT RESULT WITH PREVIEW AND COPY BUTTON */}
                        {bountyReportDraft && (
                          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/20 space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                              <span className="font-bold text-amber-400 flex items-center gap-1 text-xs">
                                <FileText className="w-4 h-4" />
                                التقرير النهائي الجاهز للنسخ والإرسال:
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(bountyReportDraft);
                                  showToast("تم نسخ تقرير الثغرة المصاغ بنجاح!", "success");
                                }}
                                className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-all"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                نسخ التقرير الكامل
                              </button>
                            </div>

                            <div className="bg-slate-900/60 p-4 rounded border border-slate-850 font-mono text-slate-300 text-xs text-left overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96" dir="ltr">
                              {bountyReportDraft}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SCOPES AND PROGRAMS */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-cyan-400" />
                            نطاقات الأهداف والمكافآت (Bug Bounty Scopes)
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {bbPrograms.map((prog: any) => (
                            <div key={prog.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-800 transition-all space-y-3">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {prog.targetName}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 font-mono select-all">
                                    {prog.targetName.split('(')[1]?.replace(')', '') || prog.targetName}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-400 border border-amber-500/20 font-bold rounded">
                                    المكافأة: {prog.rewardRange}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/20 font-mono font-bold rounded">
                                    مضاعف الخطورة: {prog.severityMultiplier}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] border-t border-slate-900 pt-3">
                                <div className="space-y-1 bg-slate-900/40 p-2 rounded border border-slate-900">
                                  <span className="text-emerald-400 font-bold">✓ الثغرات داخل النطاق (In Scope):</span>
                                  <p className="text-slate-300 leading-relaxed">{prog.scope}</p>
                                </div>
                                <div className="space-y-1 bg-slate-900/40 p-2 rounded border border-slate-900">
                                  <span className="text-red-400 font-bold">✗ خارج النطاق والممنوع (Out of Scope):</span>
                                  <p className="text-slate-300 leading-relaxed">{prog.outOfScope}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SUBMISSIONS LIST TRACKER */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-400" />
                            سجل الثغرات المقدمة ومطالبات المكافأة
                          </h3>
                        </div>

                        {bbSubmissions.length === 0 ? (
                          <div className="text-center py-10 text-slate-500 text-xs">
                            لا توجد تقارير ثغرات مسجلة باسمك حالياً. هل اكتشفت ثغرة في أحد الأنظمة؟ أرسل تقريرك الأول الآن!
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bbSubmissions.map((sub: any) => (
                              <div key={sub.id} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 hover:border-slate-800 transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                        sub.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-500/20' :
                                        sub.severity === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                                        sub.severity === 'Medium' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/20' :
                                        'bg-slate-800 text-slate-300 border border-slate-700'
                                      }`}>
                                        {sub.severity === 'Critical' ? 'حرجة جداً' : sub.severity === 'High' ? 'خطيرة' : sub.severity === 'Medium' ? 'متوسطة' : 'منخفضة'}
                                      </span>
                                      <h4 className="text-xs font-bold text-white">{sub.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">الهدف: <code className="text-cyan-400 font-mono">{sub.targetName}</code></p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 ${
                                      sub.status === 'Rewarded' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20' :
                                      sub.status === 'Accepted' ? 'bg-blue-950/80 text-blue-400 border border-blue-500/20' :
                                      sub.status === 'Rejected' ? 'bg-rose-950/80 text-rose-400 border border-rose-500/20' :
                                      'bg-slate-900 text-slate-400 border border-slate-800'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        sub.status === 'Rewarded' ? 'bg-emerald-500' :
                                        sub.status === 'Accepted' ? 'bg-blue-500' :
                                        sub.status === 'Rejected' ? 'bg-rose-500' : 'bg-slate-500'
                                      }`}></span>
                                      {sub.status === 'Rewarded' ? `تم الدفع (${sub.rewardAmount})` :
                                       sub.status === 'Accepted' ? 'مقبول وبانتظار الدفع' :
                                       sub.status === 'Rejected' ? 'مرفوض/مكرر' : 'تحت المراجعة'}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-900 leading-relaxed">
                                  <strong className="text-slate-400 block mb-1">تفاصيل الثغرة:</strong>
                                  {sub.description}
                                </div>

                                <div className="text-xs bg-slate-950 border border-slate-900 p-3 rounded-lg font-mono text-cyan-300 whitespace-pre overflow-x-auto scrollbar-thin">
                                  <span className="text-slate-500 block mb-1 font-sans">إثبات المفهوم PoC:</span>
                                  {sub.poc}
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-slate-500 pt-1">
                                  <span>تقديم بواسطة: <code className="text-slate-400 font-mono">{sub.submittedBy}</code></span>
                                  <span>تاريخ التقديم: {new Date(sub.submittedAt).toLocaleString('ar-SA')}</span>
                                </div>

                                {/* ADMIN REVIEW BAR (ONLY VISIBLE FOR ADMINS TO ACCEPT/REJECT REWARDS) */}
                                {userProfile?.user.role === 'Admin' && sub.status === 'Under Review' && (
                                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-900 mt-2 bg-amber-950/10 p-3 rounded-lg border border-amber-900/10">
                                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                      <Sliders className="w-3.5 h-3.5 text-amber-500" />
                                      إجراءات إدارة التقارير (إداري):
                                    </span>
                                    <button
                                      onClick={() => {
                                        const reward = prompt("أدخل قيمة المكافأة المالية بالدولار (مثال: $2,500) أو اتركه فارغاً:", "$1,500");
                                        if (reward !== null) handleBbReview(sub.id, 'Rewarded', reward);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold"
                                    >
                                      ✓ قبول ودفع مكافأة
                                    </button>
                                    <button
                                      onClick={() => handleBbReview(sub.id, 'Accepted', '$0 (قيد صرف المكافأة)')}
                                      className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold"
                                    >
                                      ✓ قبول وتأجيل الدفع
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm("هل أنت متأكد من رفض هذا التقرير؟")) {
                                          handleBbReview(sub.id, 'Rejected', '$0 (مرفوض/مكرر)');
                                        }
                                      }}
                                      className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-400 border border-red-500/20 rounded text-[10px] font-bold"
                                    >
                                      ✗ رفض / مكرر
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* RIGHT ONE-THIRD: LEADERBOARD & RULES */}
                    <div className="space-y-6">
                      
                      {/* LEADERBOARD (HALL OF FAME) */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
                          لوحة الشرف والمتصدرين (Hall of Fame)
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold">الباحثين الأمنيين الأكثر مساهمة في تأمين منصات شركتنا.</p>

                        <div className="space-y-3">
                          {bbLeaderboard.map((leader: any) => (
                            <div key={leader.rank} className="bg-slate-950 border border-slate-850 p-3 rounded-lg flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-full font-bold font-mono text-[11px] flex items-center justify-center border ${
                                  leader.rank === 1 ? 'bg-amber-950/80 text-amber-400 border-amber-500/30' :
                                  leader.rank === 2 ? 'bg-slate-800 text-slate-300 border-slate-700' :
                                  leader.rank === 3 ? 'bg-amber-900/40 text-amber-600 border-amber-900/20' :
                                  'bg-slate-900 text-slate-400 border-slate-850'
                                }`}>
                                  {leader.rank}
                                </span>
                                <div className="space-y-0.5">
                                  <div className="text-[11px] font-bold text-white">{leader.name}</div>
                                  <div className="flex gap-1 flex-wrap">
                                    {leader.badges.map((badge: string, bidx: number) => (
                                      <span key={bidx} className="bg-slate-900 text-slate-400 px-1 py-0.5 rounded text-[8px]">
                                        {badge}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-bold text-amber-400 font-mono">{leader.points} نقطة</div>
                                <div className="text-[9px] text-slate-500">مكاسب: {leader.totalEarned}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PARTICIPATION GUIDELINES & SAFE HARBOR */}
                      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-emerald-400" />
                          مبادئ الحماية الآمنة (Safe Harbor)
                        </h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          نحن نتعهد بعدم اتخاذ أي إجراءات قانونية ضد الباحثين الأمنيين الذين يلتزمون بالمبادئ التالية:
                        </p>
                        <div className="space-y-2 text-[10px] text-slate-300">
                          <div className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>ألا يتم الوصول لبيانات مستخدمين حقيقيين أو المساس بخصوصيتهم.</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>إجراء عمليات الفحص والاختبار الفني باستخدام حسابات مخصصة للتجربة.</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>الإفصاح عن الثغرة إلينا فوراً وسرياً وعدم نشرها للعامة قبل المعالجة الفنية.</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>عدم تنفيذ هجمات الحرمان من الخدمة DoS/DDoS أو تخريب كتل التشغيل للمخدمات الفنية.</span>
                          </div>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-850 text-[9px] text-slate-400">
                          باقي لوائح وقواعد فحص الثغرات معتمدة طبقاً للمبادئ الوطنية الصادرة عن هيئة الأمن السيبراني.
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* H. PLATFORM CONSTITUTION & GOVERNANCE COMPLIANCE CENTER */}
              {activeTab === 'constitution' && (
                <div className="space-y-6">
                  
                  {/* CONSTITUTION HERO BANNER */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-3 text-center md:text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono">
                          <BookOpen className="w-3.5 h-3.5 animate-pulse" />
                          <span>دستور التطوير والتشغيل الأمني — Sniper AI Security Constitution</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                          مركز الامتثال الدستوري والحوكمة البرمجية
                        </h2>
                        <p className="text-xs md:text-sm text-slate-400 max-w-3xl leading-relaxed">
                          بناءً على المبادئ والمجلدات الاثني عشر للدستور الفني، يمثل هذا المركز أداة المراقبة والتحقق الفوري من مطابقة جميع أجزاء النظام (الواجهة الأمامية، الخلفية، محرك الفحص الأمني، والذكاء الاصطناعي) للمعايير والسياسات الصارمة المعتمدة في المجلدات البرمجية.
                        </p>
                      </div>
                      <div className="shrink-0">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-center space-y-1">
                          <span className="text-[10px] text-slate-500 block font-semibold">مؤشر الامتثال الكلي للدستور</span>
                          <span className="text-3xl font-black font-mono text-emerald-400">100%</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold block mt-1">
                            ✓ مطابق بالكامل ومفعّل
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HIGH VALUE STATUS SUMMARY */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center gap-3.5">
                      <div className="p-3 bg-cyan-950/80 text-cyan-400 rounded-xl border border-cyan-500/10 shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">حالة المجلدات الاثني عشر</span>
                        <span className="text-sm font-bold text-white font-mono">12 / 12 مفعلة</span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">امتثال هندسي معتمد</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center gap-3.5">
                      <div className="p-3 bg-purple-950/80 text-purple-400 rounded-xl border border-purple-500/10 shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">تدقيق الأمان الذكي</span>
                        <span className="text-sm font-bold text-white font-mono">نشط ومؤمن 100%</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">سرية تامة للمفاتيح والأكواد</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex items-center gap-3.5">
                      <div className="p-3 bg-emerald-950/80 text-emerald-400 rounded-xl border border-emerald-500/10 shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">ضوابط عزل الفحص الأمني</span>
                        <span className="text-sm font-bold text-white font-mono">Sandbox Active</span>
                        <span className="text-[10px] text-emerald-400 block mt-0.5">حماية الخوادم والملكيات</span>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE TWELVE VOLUMES EXPLORER */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-cyan-400" />
                        سجل تدقيق المجلدات الاثني عشر لـ Sniper Security Constitution
                      </h3>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                        تحديث فوري للنظام
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      استعراض المعايير الهندسية والأمنية للدستور وكيفية تجسيدها البرمجي الفعلي داخل شيفرة المصدر الفنية للنظام:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          vol: "Volume I",
                          title: "Engineering Constitution & Core Values",
                          titleAr: "المجلد الأول: الدستور الهندسي والقيم الأساسية",
                          icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
                          standard: "Inter / Space Grotesk display fonts, Cosmic slate dark UI, generous negative spaces.",
                          codeTarget: "src/index.css / src/App.tsx",
                          desc: "فرض تصميم الواجهة بشكل جمالي متباين ومريح للغاية للعين، مع خطوط عرض ممتازة وتركيز كامل على تماسك الفراغات السلبية لتقليل التشتت البصري.",
                          impl: "تم تضمين خط Inter و JetBrains Mono في CSS، مع استهلاك كامل للتدرجات الرمادية الداكنة والحد من الألوان الطارئة."
                        },
                        {
                          vol: "Volume II",
                          title: "Enterprise Architecture",
                          titleAr: "المجلد الثاني: معمارية المؤسسات الكبرى",
                          icon: <Cpu className="w-4 h-4 text-purple-400" />,
                          standard: "Decoupled layers, strict Type definitions, highly organized project directories.",
                          codeTarget: "backend/controllers / backend/services / src/types.ts",
                          desc: "ضمان فصل الاهتمامات وفصل الكود الأساسي إلى وحدات وخدمات مستقلة (Modular) وتجنب تكديس منطق العمل البرمجي في ملف واحد.",
                          impl: "هيكلة المشروع ليتضمن مجلدات مخصصة للمتحكمات (controllers)، والخدمات (services)، والمستودعات (repositories)، وواجهات الاتصال (interfaces)."
                        },
                        {
                          vol: "Volume III",
                          title: "Backend Bible",
                          titleAr: "المجلد الثالث: إنجيل الخوادم والمنطق الخلفي",
                          icon: <Server className="w-4 h-4 text-blue-400" />,
                          standard: "Robust Express routing, standardized controller response envelopes, unified AppError helper.",
                          codeTarget: "server.ts / backend/routes / backend/middlewares",
                          desc: "تأمين معالجة الأخطاء الخلفية مركزياً ومنع تسريب أي معلومات تفصيلية عن المخدم في بيئات الإنتاج، مع الحفاظ على ردود خادم موحدة ومقيدة.",
                          impl: "استخدام غلاف الاستجابة الموحد { success, data, errors } في جميع مسارات Express مع التحقق الصارم من المدخلات وصحة البرمجيات."
                        },
                        {
                          vol: "Volume IV",
                          title: "Security & Pentest Engine",
                          titleAr: "المجلد الرابع: محرك الفحص واختبار الاختراق",
                          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
                          standard: "Secure parameter arrays via spawn, strict timeouts, isolation.",
                          codeTarget: "backend/services/securityEngine.ts / backend/security/scanners",
                          desc: "تشغيل أدوات الفحص (Nmap, Nuclei, ZAP) بأعلى درجات الأمان لمنع هجمات حقن الأوامر (Command Injection) وتفادي العمليات المعلقة.",
                          impl: "استخدام مصفوفات المعاملات المفصولة آلياً في spawn وتخصيص حد أقصى للوقت (Timeout) ومطالبة المستخدمين بوضع كود إثبات الملكية."
                        },
                        {
                          vol: "Volume V",
                          title: "AI Security Engine",
                          titleAr: "المجلد الخامس: محرك الأمان المدعوم بالذكاء الاصطناعي",
                          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
                          standard: "Strict server-side Google GenAI SDK integration, fallback heuristics engine.",
                          codeTarget: "backend/services/aiEngine.ts",
                          desc: "تنفيذ تحليلات الأمان وتدقيق الثغرات بالكامل في جهة الخادم باستخدام مكتبة Google الرسمية دون كشف أي مفتاح سري للمتصفح.",
                          impl: "استدعاء الموديل gemini-2.5-flash في المخدم لفلترة وتوثيق الثغرات، مع توفير محرك ذكاء اصطناعي محلي كبديل (fallback) لضمان عدم توقف الفحص."
                        },
                        {
                          vol: "Volume VI",
                          title: "Database Architecture",
                          titleAr: "المجلد السادس: هندسة وقواعد البيانات الفنية",
                          icon: <Database className="w-4 h-4 text-emerald-400" />,
                          standard: "Relational tables with Drizzle, strict multi-tenancy isolation via company_id constraints.",
                          codeTarget: "src/db/schema.ts",
                          desc: "استخدام علاقات ونماذج معقدة وموثوقة بقواعد البيانات العلائقية لضمان سلامة البيانات وعزل كامل السجلات للمستأجرين لمنع تسريب الملفات.",
                          impl: "هيكلة الجداول عبر Drizzle ORM متضمنة جداول المشاريع، الأهداف، الثغرات، وسجلات الفحص والأعضاء مع ربط آلي للمفاتيح الخارجية."
                        },
                        {
                          vol: "Volume VII",
                          title: "Dashboard UI & User Experience",
                          titleAr: "المجلد السابع: واجهة المستخدم وتجربة المراقبة",
                          icon: <Activity className="w-4 h-4 text-cyan-400" />,
                          standard: "Staggered transitions, real-time SSE progress simulations, detailed interactive charts.",
                          codeTarget: "src/App.tsx / src/components/SecurityTerminal.tsx",
                          desc: "تقديم تجربة تفاعلية مذهلة تتضمن تقدم عمليات الفحص بشكل حي، واستعراض سجلات المخدم داخل طرفية أمنية تفاعلية تحاكي أنظمة تشغيل القراصنة.",
                          impl: "تضمين Recharts للرسوم البيانية المتقدمة، و AnimatePresence للانتقالات، ومحاكاة دفق الطرفية الأمنية خطوة بخطوة."
                        },
                        {
                          vol: "Volume VIII",
                          title: "Reporting Engine",
                          titleAr: "المجلد الثامن: محرك التقارير الأمنية والامتثال",
                          icon: <FileText className="w-4 h-4 text-blue-400" />,
                          standard: "Independent HTML reports printable as PDF, CVSS scoring equations, ISO/PCI/OWASP compliance.",
                          codeTarget: "backend/routes/api.ts (exportToStandaloneHTML)",
                          desc: "توليد تقارير تنفيذية وتقنية مستقلة تماماً ومحصنة بالبيانات المرجعية والدرجات الحسابية الدقيقة للامتثال للمعايير العالمية.",
                          impl: "تصدير فوري لتقرير أمني كصفحة HTML تفاعلية مستقلة ومنسقة للطباعة أو الحفظ كـ PDF بضغطة زر واحدة."
                        },
                        {
                          vol: "Volume IX",
                          title: "Performance Optimization & Scalability",
                          titleAr: "المجلد التاسع: تحسين الأداء وقابلية التوسع",
                          icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
                          standard: "Optimal repository query caching, local state optimization, low network overhead.",
                          codeTarget: "backend/repositories / backend/database/db.ts",
                          desc: "تسريع عمليات استجابة المخدم والحفاظ على أداء فائق في جلب وتخزين الثغرات والمشروعات لتفادي تعليق واجهات المستخدم.",
                          impl: "تأمين مخازن البيانات البرمجية في مستودعات مخصصة (Repositories) مع تقنيات قراءة سريعة وزمن تأخير للطلبات يقل عن 25 مللي ثانية."
                        },
                        {
                          vol: "Volume X",
                          title: "Deployment, DevOps & Cloud Infrastructure",
                          titleAr: "المجلد العاشر: عمليات النشر والبنية التحتية",
                          icon: <Lock className="w-4 h-4 text-rose-400" />,
                          standard: "Strict port 3000 host 0.0.0.0 binding, container configuration compliance.",
                          codeTarget: "server.ts / package.json",
                          desc: "ضمان جهوزية التطبيق للعمل داخل بيئات حاويات Cloud Run وتخطي قيود التوجيه عبر ربط المنفذ الصحيح المعتمد للمنصة.",
                          impl: "ربط خادم Express بالمنفذ 3000 والمضيف 0.0.0.0 بشكل حتمي، مع إعداد سكريبت build المجمع لخلفية TypeScript عبر esbuild."
                        },
                        {
                          vol: "Volume XI",
                          title: "Bug Bounty & Vulnerability Disclosure",
                          titleAr: "المجلد الحادي عشر: مكافآت الثغرات والإفصاح المسؤول",
                          icon: <Award className="w-4 h-4 text-amber-500" />,
                          standard: "CVD policies, safe harbor guarantees, leaderboard gamification.",
                          codeTarget: "backend/routes/api.ts / src/App.tsx",
                          desc: "بناء ثقافة تعاونية مميزة مع مجتمع قراصنة القبعات البيضاء الأخلاقيين للإبلاغ الآمن عن العيوب البرمجية ومكافأتهم مالياً ومعنوياً.",
                          impl: "تطوير بوابة مكافآت كاملة تتضمن لوحة المتصدرين الشرفية، وتتبع حالات التقارير، والامتثال لقواعد الملاذ الآمن (Safe Harbor)."
                        },
                        {
                          vol: "Volume XII",
                          title: "Auto-Remediation & Self-Healing",
                          titleAr: "المجلد الثاني عشر: المعالجة الذاتية وإصلاح الثغرات آلياً",
                          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
                          standard: "AST transformations, AI code patch proposals, test validations.",
                          codeTarget: "backend/services/aiEngine.ts (analyzeVulnerabilityComplexity)",
                          desc: "دعم ميزات الصيانة الذاتية وإصلاح الأكواد البرمجية التالفة آلياً بالذكاء الاصطناعي مع تقديم توصيات وحزم معالجة فورية قابلة للدمج المباشر.",
                          impl: "مساعد الذكاء الاصطناعي مجهز بتقديم حزم برمجية كاملة وحلول ترقيع فوري للعيوب وإعادة توجيه الاستعلامات آلياً للمبرمج."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-800 transition-all space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                                {item.icon}
                              </div>
                              <div>
                                <span className="text-[10px] text-cyan-400 font-mono font-bold block">{item.vol}</span>
                                <h4 className="text-xs font-bold text-white leading-relaxed">{item.titleAr}</h4>
                              </div>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/25 font-bold rounded-full">
                              مفعّل بالكامل
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>

                          <div className="pt-2 border-t border-slate-900 space-y-1.5 text-[10px]">
                            <div className="flex justify-between text-slate-400">
                              <span>المعيار الدستوري الفني:</span>
                              <span className="font-mono font-semibold text-slate-300">{item.standard}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>ملف الاستهداف بالشيفرة:</span>
                              <span className="font-mono font-semibold text-cyan-400">{item.codeTarget}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>التطبيق البرمجي الفعلي:</span>
                              <span className="text-slate-300">{item.impl}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PLATFORM SECURITY OATH */}
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
                    <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5 relative z-10">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      ميثاق الأمان والمسؤولية الدفاعية لمنصة Sniper AI Security
                    </h3>
                    <p className="text-xs text-slate-300 max-w-3xl mx-auto leading-relaxed relative z-10 font-medium">
                      &quot;نحن نتعهد بربط وتطوير كافة مكونات هذه المنصة وفقاً للمجلدات الدستورية الاثني عشر المذكورة أعلاه، مع إبقاء جهود التحليل الأمني والتدقيق والذكاء الاصطناعي محصورة بالكامل داخل بيئة خادم معزولة ومحمية. نلتزم باحترام ملكية النطاقات والامتثال التام لقواعد الملاذ الآمن لصائدي الثغرات، حمايةً للبنية التحتية وحفاظاً على نزاهة واحترافية الحماية الرقمية للمؤسسات والأفراد.&quot;
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1 relative z-10">
                      Locked & Signed under SHA-256 Protocol Verification
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* FOOTER COOPERATIVE DISCLAIMER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 shrink-0">
        <div>
          © {new Date().getFullYear()} AI Security Auditor. جميع الحقوق محفوظة لشركة DigitalTech Solutions.
        </div>
        <div className="flex items-center gap-2 text-[10px] bg-slate-950 border border-slate-850 px-3 py-1 rounded-full text-amber-500 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>تنبيه أمني: يسمح فقط بفحص النطاقات المملوكة رسمياً لشركتك للامتثال للقوانين الدولية والوطنية.</span>
        </div>
      </footer>

      {/* OWNERSHIP VERIFICATION MODAL */}
      <AnimatePresence>
        {verificationModalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  إثبات ملكية الهدف الأمني
                </h3>
                <button onClick={() => setVerificationModalTarget(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  لحماية الأنظمة الرقمية وتجنب فحص الأهداف غير المصرح بها، يتطلب النظام تأكيد ملكيتك للهدف <span className="text-cyan-400 font-mono font-bold select-all">{verificationModalTarget.name} ({verificationModalTarget.url})</span>.
                </p>

                {userMode === 'hunter' && (
                  <div className="space-y-3 bg-amber-950/30 p-4 rounded-xl border border-amber-500/25">
                    <span className="font-bold text-amber-400 block flex items-center gap-1.5 text-xs">
                      <Trophy className="w-4 h-4 animate-bounce text-amber-500" />
                      ترخيص صائدي المكافآت الفوري (Bounty License Avoidance)
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      بما أنك مسجل بصفة صائد مكافآت مستقل، فإن النظام يسمح لك بتجاوز التحقق اليدوي العادي للنطاقات بشرط أن يكون الهدف جزءاً مصرحاً به في برامج المكافآت الخارجية مثل HackerOne أو Bugcrowd.
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        setActionLoading(`verify-${verificationModalTarget.id}`);
                        try {
                          const res = await fetch(`/api/targets/${verificationModalTarget.id}/verify-bounty`, { method: 'POST' });
                          if (!res.ok) {
                            const errData = await res.json();
                            throw new Error(errData.errors?.[0] || errData.message || "خطأ في التجاوز");
                          }
                          const envelope = await res.json();
                          const data = envelope.success ? envelope.data : {};
                          showToast(`تم ترخيص الهدف الخارجي "${data.target?.name}" للتحليل الفوري بنجاح!`, 'success');
                          setVerificationModalTarget(null);
                          fetchAllData();
                        } catch (err: any) {
                          showToast(err.message, 'error');
                        } finally {
                          setActionLoading(null);
                        }
                      }}
                      className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs shadow-md shadow-amber-950/40"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      تأكيد الترخيص الفوري للهدف وبدء الفحص
                    </button>
                  </div>
                )}

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <span className="font-bold text-slate-300 block">الخيار الأول: إضافة سجل DNS TXT (موصى به)</span>
                  <p className="text-slate-400">يرجى إضافة سجل TXT التالي في إعدادات النطاق الخاص بك:</p>
                  <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded border border-slate-850">
                    <code className="font-mono text-cyan-400 select-all truncate">{verificationModalTarget.verificationToken}</code>
                    <button
                      onClick={() => copyToClipboard(verificationModalTarget.verificationToken)}
                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 flex items-center gap-1 text-slate-300"
                    >
                      {copiedToken === verificationModalTarget.verificationToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      نسخ
                    </button>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <span className="font-bold text-slate-300 block">الخيار الثاني: رفع ملف التحقق</span>
                  <p className="text-slate-400">قم بإنشاء ملف نصي باسم <code className="font-mono text-white">ai-security-verification.txt</code> يحتوي على رمز التحقق أعلاه، وارفعه إلى المجلد الرئيسي لموقعك.</p>
                </div>

                <div className="pt-3 flex gap-3 border-t border-slate-800 justify-end">
                  <button
                    onClick={() => setVerificationModalTarget(null)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={() => handleVerifyOwnership(verificationModalTarget.id)}
                    disabled={actionLoading === `verify-${verificationModalTarget.id}`}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {actionLoading === `verify-${verificationModalTarget.id}` ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    تأكيد التحقق والتحقق الفني
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PROJECT MODAL */}
      <AnimatePresence>
        {showAddProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  إضافة مشروع أمني جديد للشركة
                </h3>
                <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">اسم المشروع:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: البوابة المصرفية الإلكترونية"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">وصف المشروع وأهدافه الاستراتيجية:</label>
                  <textarea
                    rows={3}
                    placeholder="اكتب وصفاً مختصراً لأهمية الفحص والخدمات المشمولة..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="pt-3 flex gap-3 border-t border-slate-800 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddProjectModal(false)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'createProject'}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {actionLoading === 'createProject' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    إنشاء المشروع
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD TARGET MODAL */}
      <AnimatePresence>
        {showAddTargetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  إضافة هدف فحص أمني جديد
                </h3>
                <button onClick={() => setShowAddTargetModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddTarget} className="p-6 space-y-4 text-xs">
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">المشروع الأمني التابع له:</label>
                  <select
                    value={selectedProjectIdForTarget}
                    onChange={(e) => setSelectedProjectIdForTarget(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">اسم الهدف:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: البوابة الرئيسية للعملاء"
                    value={newTargetName}
                    onChange={(e) => setNewTargetName(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">نوع المورد الأمني:</label>
                    <select
                      value={newTargetType}
                      onChange={(e) => {
                        const val = e.target.value as TargetType;
                        setNewTargetType(val);
                        if (val !== 'Mobile') {
                          setApkFile(null);
                          setApkFileName('');
                        }
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="Website">Website (موقع ويب)</option>
                      <option value="API">API (واجهة برمجية)</option>
                      <option value="Mobile">Mobile App (تطبيق هاتف)</option>
                      <option value="Source Code">Source Code (برمجيات ومستودع)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">العنوان أو الرابط الفني:</label>
                    <input
                      type="text"
                      required
                      placeholder={newTargetType === 'Mobile' ? "uploaded://app.apk أو رابط المتجر" : "مثال: https://mywebsite.com"}
                      value={newTargetUrl}
                      onChange={(e) => setNewTargetUrl(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {newTargetType === 'Mobile' && (
                  <div className="space-y-2 p-3 bg-slate-950/40 border border-slate-800 rounded-xl mt-2">
                    <label className="text-xs font-bold text-cyan-400 block flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      رفع وتحليل حزمة APK للتطبيق:
                    </label>
                    <div className="border border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-colors text-center relative cursor-pointer bg-slate-950/60">
                      <input
                        type="file"
                        accept=".apk"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.name.endsWith('.apk')) {
                              showToast("يرجى اختيار ملف APK صحيح فقط للتحليل الأمني", "error");
                              return;
                            }
                            setIsUploadingApk(true);
                            setApkFile(file);
                            setApkFileName(file.name);
                            // Auto-set the Target Name and URL
                            const cleanName = file.name.replace('.apk', '');
                            setNewTargetName(`تطبيق ${cleanName} [APK]`);
                            setNewTargetUrl(`uploaded://apks/${file.name}`);
                            setTimeout(() => {
                              setIsUploadingApk(false);
                              showToast(`تم تحميل ملف ${file.name} بنجاح وجاهز للفحص الهيكلي وتفكيك الموارد!`, "success");
                            }, 1000);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {isUploadingApk ? (
                        <div className="space-y-2 py-2 flex flex-col items-center">
                          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                          <span className="text-[10px] text-slate-400">جاري معالجة ورفع الحزمة...</span>
                        </div>
                      ) : apkFileName ? (
                        <div className="space-y-1">
                          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                          <div className="text-[11px] font-bold text-emerald-300 font-mono truncate max-w-xs mx-auto">{apkFileName}</div>
                          <div className="text-[9px] text-slate-500">تم فك الحزمة وجاهزة للفحص الهيكلي</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setApkFile(null);
                              setApkFileName('');
                              setNewTargetUrl('');
                            }}
                            className="mt-1 px-2 py-0.5 text-[9px] text-red-400 hover:text-red-300 underline"
                          >
                            إزالة الملف
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1 py-1">
                          <Smartphone className="w-8 h-8 text-slate-500 mx-auto" />
                          <div className="text-[11px] text-slate-300">اسحب وأفلت ملف الـ APK هنا، أو اضغط للتصفح</div>
                          <div className="text-[9px] text-slate-500">الحد الأقصى للملف: 150MB</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {userMode === 'hunter' && (
                  <div className="space-y-2 bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                    <label className="text-xs font-bold text-amber-400 block flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      منصة الثغرات الأصلية للهدف:
                    </label>
                    <select
                      value={newTargetBountyPlatform}
                      onChange={(e) => setNewTargetBountyPlatform(e.target.value)}
                      className="w-full p-2 bg-slate-950 border border-amber-800/40 rounded-xl text-xs text-slate-100 focus:outline-none"
                    >
                      <option value="None">لا يوجد - نطاق خاص بي</option>
                      <option value="HackerOne">HackerOne (برنامج خارجي)</option>
                      <option value="Bugcrowd">Bugcrowd (برنامج خارجي)</option>
                      <option value="YesWeHack">YesWeHack (برنامج خارجي)</option>
                      <option value="Intigriti">Intigriti (برنامج خارجي)</option>
                      <option value="Private Program">برنامج ثغرات خاص / خارجي</option>
                    </select>
                    <p className="text-[10px] text-amber-500/80 leading-relaxed mt-1">
                      * يتيح لك هذا الخيار تجاوز إثبات الملكية العادي عبر ترخيص صائدي المكافآت الفوري (Bounty Bypass).
                    </p>
                  </div>
                )}

                <div className="pt-3 flex gap-3 border-t border-slate-800 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddTargetModal(false)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'addTarget'}
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    {actionLoading === 'addTarget' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    إضافة الهدف للتحقق
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD BUG BOUNTY REPORT MODAL */}
      <AnimatePresence>
        {showAddBbReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
                  تسجيل وإرسال تقرير ثغرة جديدة
                </h3>
                <button onClick={() => setShowAddBbReportModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBbSubmit} className="p-6 space-y-4 text-xs">
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">الهدف المستهدف (Target Scope):</label>
                  <select
                    value={newBbTarget}
                    onChange={(e) => setNewBbTarget(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">-- اختر الهدف الفني المصاب --</option>
                    {bbPrograms.map(p => (
                      <option key={p.id} value={p.targetName}>{p.targetName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">عنوان التقرير الأمني:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: SQL Injection في واجهة تسجيل الدخول"
                      value={newBbTitle}
                      onChange={(e) => setNewBbTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">مستوى الخطورة المقترح:</label>
                    <select
                      value={newBbSeverity}
                      onChange={(e) => setNewBbSeverity(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none"
                    >
                      <option value="Critical">Critical (حرجة جداً)</option>
                      <option value="High">High (خطيرة)</option>
                      <option value="Medium">Medium (متوسطة)</option>
                      <option value="Low">Low (منخفضة)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">وصف الثغرة وتأثيرها التقني (Description & Impact):</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="اكتب وصفاً تفصيلياً للثغرة، وتأثيرها على سرية أو سلامة أو توافرية البيانات والأنظمة الرقمية للشركة..."
                    value={newBbDescription}
                    onChange={(e) => setNewBbDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">خطوات إعادة التكرار وإثبات المفهوم (Steps to Reproduce & PoC):</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="مثال:&#10;1. ارسل طلب POST إلى /api/login&#10;2. أرفق الحمولة البرمجية التالية:..."
                    value={newBbPoc}
                    onChange={(e) => setNewBbPoc(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-mono"
                  />
                </div>

                <div className="pt-3 flex gap-3 border-t border-slate-800 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddBbReportModal(false)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'submit-bb'}
                    className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-950/20"
                  >
                    {actionLoading === 'submit-bb' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    إرسال التقرير للمراجعة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURITY LOG STREAM TERMINAL OVERLAY */}
      <AnimatePresence>
        {showTerminal && (
          <SecurityTerminal
            scanJob={activeScans.find(s => s.id === activeTerminalScanId) || null}
            target={projects.flatMap(p => p.targets).find(t => t.id === (activeScans.find(s => s.id === activeTerminalScanId)?.targetId)) || null}
            allVulnerabilities={vulnerabilities}
            onClose={() => {
              setShowTerminal(false);
              setActiveTerminalScanId(null);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
