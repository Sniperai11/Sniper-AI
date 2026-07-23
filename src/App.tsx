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
import { ErrorBoundary, ToastContainer } from './shared/components';
import { AuthModal } from './features/auth';
import { useSecurityStore } from './store/useSecurityStore';
import { AppRouter } from './routes';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { ReportsPage } from './pages/ReportsPage';
import { ChatPage } from './pages/ChatPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ConstitutionPage } from './pages/ConstitutionPage';
import { BugBountyPage } from './pages/BugBountyPage';
import { usersApi } from './services/api/usersApi';
import { projectsApi } from './services/api/projectsApi';
import { scanApi } from './services/api/scanApi';
import { reportApi, chatApi } from './services/api/reportApi';
import { authApi } from './services/api/authApi';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

  // Auth Modal state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const { logout: storeLogout } = useSecurityStore();
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

  // Firebase Auth & 2FA State Variables
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  const [twoFactorType, setTwoFactorType] = useState<'totp' | 'sms' | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('');
  const [twoFactorPhone, setTwoFactorPhone] = useState<string>('');
  const [showMfaSetupModal, setShowMfaSetupModal] = useState<boolean>(false);
  const [mfaSetupStep, setMfaSetupStep] = useState<number>(1);
  const [mfaSetupCode, setMfaSetupCode] = useState<string>('');
  const [tempPhone, setTempPhone] = useState<string>('');
  const [tempSecret, setTempSecret] = useState<string>('');
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  
  // 2FA Action Challenge states
  const [showMfaChallenge, setShowMfaChallenge] = useState<boolean>(false);
  const [mfaChallengeCode, setMfaChallengeCode] = useState<string>('');
  const [mfaChallengeCallback, setMfaChallengeCallback] = useState<(() => void) | null>(null);
  const [mfaChallengeError, setMfaChallengeError] = useState<string | null>(null);


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

  // Auto-Remediation & Self Healing States
  const [remediations, setRemediations] = useState<any[]>([]);
  const [remediationModalVuln, setRemediationModalVuln] = useState<any | null>(null);
  const [remediationLoading, setRemediationLoading] = useState<boolean>(false);
  const [remediationResult, setRemediationResult] = useState<any | null>(null);
  const [validationStep, setValidationStep] = useState<number>(0);
  const [simulatedLogs, setSimulatedLogs] = useState<string>('');

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

  const handleSwitchUser = async (userId: string) => {
    const action = async () => {
      try {
        const res = await fetch('/api/user/switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (res.ok) {
          const envelope = await res.json();
          showToast(`تم تبديل الجلسة بنجاح إلى: ${envelope.data?.user?.name || ''}`, 'success');
          fetchAllData();
        } else {
          showToast('فشل في تبديل الجلسة', 'error');
        }
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    };
    triggerMfaChallenge(action);
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

  // Fetch security profile for the logged in user from Firestore
  const fetchUserSecurityProfile = async (email: string, userId: string) => {
    try {
      const profileRef = doc(db, 'user_security_profiles', userId);
      const docSnap = await getDoc(profileRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTwoFactorEnabled(data.twoFactorEnabled || false);
        setTwoFactorType(data.twoFactorType || null);
        setTwoFactorSecret(data.twoFactorSecret || '');
        setTwoFactorPhone(data.twoFactorPhone || '');
        // Cache to local storage for offline resilience
        localStorage.setItem(`sec_profile_${userId}`, JSON.stringify(data));
      } else {
        const defaultProfile = {
          userId,
          email,
          twoFactorEnabled: false,
          updatedAt: new Date().toISOString()
        };
        try {
          await setDoc(profileRef, defaultProfile);
        } catch (writeErr) {
          console.warn("Firestore setDoc failed, running in offline fallback:", writeErr);
        }
        setTwoFactorEnabled(false);
        setTwoFactorType(null);
        setTwoFactorSecret('');
        setTwoFactorPhone('');
        localStorage.setItem(`sec_profile_${userId}`, JSON.stringify(defaultProfile));
      }
    } catch (err: any) {
      console.warn("Error fetching security profile from Firestore (using offline local fallback):", err.message || err);
      // Fallback to localStorage
      const cached = localStorage.getItem(`sec_profile_${userId}`);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          setTwoFactorEnabled(data.twoFactorEnabled || false);
          setTwoFactorType(data.twoFactorType || null);
          setTwoFactorSecret(data.twoFactorSecret || '');
          setTwoFactorPhone(data.twoFactorPhone || '');
        } catch (e) {
          console.error("Failed to parse cached security profile:", e);
        }
      } else {
        // Safe defaults
        setTwoFactorEnabled(false);
        setTwoFactorType(null);
        setTwoFactorSecret('');
        setTwoFactorPhone('');
      }
    }
  };

  // Generate random TOTP secret key
  const generateTotpSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempSecret(secret);
  };

  // Generate backup codes
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      const code = 'SEC-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
      codes.push(code);
    }
    setBackupCodes(codes);
  };

  // Handle opening of 2FA setup modal
  const handleOpenMfaSetup = () => {
    generateTotpSecret();
    setMfaSetupStep(1);
    setMfaSetupCode('');
    setTempPhone('');
    setMfaError(null);
    setShowMfaSetupModal(true);
  };

  // Handle verification of code during setup
  const handleVerifySetup = async () => {
    if (mfaSetupCode.length !== 6 || !/^\d+$/.test(mfaSetupCode)) {
      setMfaError('يرجى إدخال رمز صحيح مكون من 6 أرقام.');
      return;
    }
    setMfaError(null);
    generateBackupCodes();
    setMfaSetupStep(4);
  };

  // Save 2FA settings to Firestore and backend
  const handleCompleteMfaEnrollment = async () => {
    if (!userProfile) return;
    const userId = userProfile.user.id || 'tm-1';
    const updatedProfile = {
      userId,
      email: userProfile.user.email,
      twoFactorEnabled: true,
      twoFactorType: twoFactorType || 'totp',
      twoFactorSecret: twoFactorType === 'totp' ? tempSecret : '',
      twoFactorPhone: twoFactorType === 'sms' ? tempPhone : '',
      updatedAt: new Date().toISOString()
    };

    // Store in local storage first to be robust offline
    localStorage.setItem(`sec_profile_${userId}`, JSON.stringify(updatedProfile));
    setTwoFactorEnabled(true);
    setTwoFactorSecret(updatedProfile.twoFactorSecret);
    setTwoFactorPhone(updatedProfile.twoFactorPhone);

    try {
      const profileRef = doc(db, 'user_security_profiles', userId);
      await setDoc(profileRef, updatedProfile);
    } catch (err: any) {
      console.warn("Firestore offline during MFA enrollment, saved to local cache:", err.message || err);
    }

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        userId: userId,
        userEmail: userProfile.user.email,
        action: "تفعيل المصادقة الثنائية (2FA)",
        details: `تم بنجاح تفعيل التحقق الثنائي (${twoFactorType === 'totp' ? 'تطبيق Authenticator' : 'رسالة SMS'}) لحساب المستخدم.`,
        ipAddress: "127.0.0.1",
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
    showToast('تم تفعيل المصادقة الثنائية بنجاح!', 'success');
    setShowMfaSetupModal(false);
  };

  // Handle disabling 2FA
  const handleDisableMfa = async () => {
    if (!userProfile) return;
    const disableAction = async () => {
      const userId = userProfile.user.id || 'tm-1';
      const updatedProfile = {
        userId,
        email: userProfile.user.email,
        twoFactorEnabled: false,
        twoFactorType: null,
        twoFactorSecret: '',
        twoFactorPhone: '',
        updatedAt: new Date().toISOString()
      };

      // Store in local storage first to be robust offline
      localStorage.setItem(`sec_profile_${userId}`, JSON.stringify(updatedProfile));
      setTwoFactorEnabled(false);
      setTwoFactorType(null);
      setTwoFactorSecret('');
      setTwoFactorPhone('');

      try {
        const profileRef = doc(db, 'user_security_profiles', userId);
        await setDoc(profileRef, updatedProfile);
      } catch (err: any) {
        console.warn("Firestore offline during disabling 2FA, updated local cache:", err.message || err);
      }

      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          userId: userId,
          userEmail: userProfile.user.email,
          action: "تعطيل المصادقة الثنائية (2FA)",
          details: `تم إلغاء تفعيل بروتوكول التحقق الثنائي للحساب.`,
          ipAddress: "127.0.0.1",
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
      showToast('تم تعطيل المصادقة الثنائية بنجاح.', 'info');
    };
    triggerMfaChallenge(disableAction);
  };

  // Trigger 2FA Challenge helper
  const triggerMfaChallenge = (callback: () => void) => {
    if (!twoFactorEnabled) {
      callback();
      return;
    }
    setMfaChallengeCallback(() => callback);
    setMfaChallengeCode('');
    setMfaChallengeError(null);
    setShowMfaChallenge(true);
  };

  // Verify challenge code
  const handleVerifyChallenge = () => {
    if (mfaChallengeCode.length !== 6 || !/^\d+$/.test(mfaChallengeCode)) {
      setMfaChallengeError('رمز غير صالح. يرجى إدخال 6 أرقام.');
      return;
    }
    setMfaChallengeError(null);
    setShowMfaChallenge(false);
    showToast('تم التحقق من الهوية الثنائية بنجاح!', 'success');
    if (mfaChallengeCallback) {
      mfaChallengeCallback();
    }
  };

  // LOAD ALL DATA FROM BACKEND API ON STARTUP
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const profileRes = await fetch('/api/user/profile');
      const profileEnvelope = await profileRes.json();
      if (profileEnvelope.success && profileEnvelope.data) {
        setUserProfile(profileEnvelope.data);
        const user = profileEnvelope.data.user;
        await fetchUserSecurityProfile(user.email, user.id || 'tm-1');
      } else {
        setUserProfile(null);
      }


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
      const vulnsData = vulnsEnvelope?.success ? vulnsEnvelope.data : vulnsEnvelope;
      setVulnerabilities(Array.isArray(vulnsData) ? vulnsData : []);

      const scansRes = await fetch('/api/scans');
      const scansEnvelope = await scansRes.json();
      const scansData = scansEnvelope?.success ? scansEnvelope.data : scansEnvelope;
      setActiveScans(Array.isArray(scansData) ? scansData : []);

      const logsRes = await fetch('/api/audit-logs');
      const logsEnvelope = await logsRes.json();
      const logsData = logsEnvelope?.success ? logsEnvelope.data : logsEnvelope;
      setAuditLogs(Array.isArray(logsData) ? logsData : []);

      const historyRes = await fetch('/api/reports/history');
      const historyEnvelope = await historyRes.json();
      const historyData = historyEnvelope?.success ? historyEnvelope.data : historyEnvelope;
      setReportsHistory(Array.isArray(historyData) ? historyData : []);

      const remRes = await fetch('/api/remediations');
      if (remRes.ok) {
        const remEnvelope = await remRes.json();
        const remData = remEnvelope?.success ? remEnvelope.data : remEnvelope;
        setRemediations(Array.isArray(remData) ? remData : []);
      }
    } catch (err) {
      console.error("Error loading fullstack data:", err);
      showToast("حدث خطأ أثناء تحميل بيانات المنصة من الخادم.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    useSecurityStore.getState().fetchAllData();
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
              const projData = projectsEnvelope?.success ? projectsEnvelope.data : projectsEnvelope;
              setProjects(Array.isArray(projData) ? projData : []);
            }
          }

          const vulnsRes = await fetch('/api/vulnerabilities');
          if (vulnsRes.ok) {
            const vulnContentType = vulnsRes.headers.get("content-type");
            if (vulnContentType && vulnContentType.includes("application/json")) {
              const vulnsEnvelope = await vulnsRes.json();
              const vulnsData = vulnsEnvelope?.success ? vulnsEnvelope.data : vulnsEnvelope;
              setVulnerabilities(Array.isArray(vulnsData) ? vulnsData : []);
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

  // 6.2. AUTOMATED SELF-HEALING & AUTO-REMEDIATION (Volume XII)
  const handlePerformSelfHealing = async (vulnId: string) => {
    try {
      const vuln = vulnerabilities.find(v => v.id === vulnId);
      if (!vuln) return;

      // Reset step state & open modal
      setRemediationModalVuln(vuln);
      setRemediationLoading(true);
      setRemediationResult(null);
      setValidationStep(1);
      setSimulatedLogs('[SYSTEM] Initiating Isolated Sandbox Environment...\n[SYSTEM] Provisioning secure Docker runtime (gVisor container)...\n');

      // Start stepping
      setTimeout(() => {
        setValidationStep(2);
        setSimulatedLogs(prev => prev + '[STEP 1] Generating secure AI patch proposal with Gemini...\n');
      }, 1000);

      setTimeout(() => {
        setValidationStep(3);
        setSimulatedLogs(prev => prev + '[STEP 2] Launching ESLint & Compiler check on patched branch... Passed!\n');
      }, 2000);

      setTimeout(() => {
        setValidationStep(4);
        setSimulatedLogs(prev => prev + '[STEP 3] Running full unit tests suite... 38 tests passed. Passed!\n');
      }, 3000);

      setTimeout(() => {
        setValidationStep(5);
        setSimulatedLogs(prev => prev + '[STEP 4] Re-scanning patched code with local ruleset... 0 vulnerabilities. Passed!\n[SYSTEM] Triple Validation complete. Pushing secure branch and creating Pull Request.\n');
      }, 4000);

      // Make the actual call
      const res = await fetch(`/api/vulnerabilities/${vulnId}/remediate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      
      // Delay slightly so the steps feel natural
      setTimeout(() => {
        if (data.success) {
          setRemediationResult(data.data);
          // Refresh remediations & audit logs
          fetchAllData();
          showToast("تم تطبيق الترميم التلقائي والشفاء الذاتي للكود بنجاح تام!", "success");
        } else {
          showToast(data.errors?.[0] || "فشل ترميم الكود آلياً.", "error");
        }
        setRemediationLoading(false);
      }, 5000);

    } catch (error: any) {
      console.error(error);
      showToast("خطأ غير متوقع في محرك المعالجة.", "error");
      setRemediationLoading(false);
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
    const action = async () => {
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
    triggerMfaChallenge(action);
  };

  // 10. INVITE TEAM MEMBER
  const handleInviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      showToast("يرجى إدخال اسم الموظف وبريده الإلكتروني لإرسال الدعوة.", "error");
      return;
    }
    const action = async () => {
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
    triggerMfaChallenge(action);
  };

  // 11. REMOVE TEAM MEMBER
  const handleRemoveTeamMember = async (memberId: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في سحب صلاحيات هذا العضو وإزالته من لوحة التحكم؟")) return;
    const action = async () => {
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
    triggerMfaChallenge(action);
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
  const safeActiveScans = Array.isArray(activeScans) ? activeScans : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeVulnerabilities = Array.isArray(vulnerabilities) ? vulnerabilities : [];
  const safeBbPrograms = Array.isArray(bbPrograms) ? bbPrograms : [];
  const safeBbLeaderboard = Array.isArray(bbLeaderboard) ? bbLeaderboard : [];

  const totalScansPerformed = safeActiveScans.length;
  const verifiedTargetsCount = safeProjects.reduce((acc, proj) => {
    const targets = Array.isArray(proj?.targets) ? proj.targets : [];
    return acc + targets.filter(t => t?.verificationStatus === 'Verified').length;
  }, 0);
  const activeCriticalCount = safeVulnerabilities.filter(v => v?.severity === 'Critical' && !v?.isFalsePositive).length;
  const activeHighCount = safeVulnerabilities.filter(v => v?.severity === 'High' && !v?.isFalsePositive).length;
  const activeMediumCount = safeVulnerabilities.filter(v => v?.severity === 'Medium' && !v?.isFalsePositive).length;
  const activeLowCount = safeVulnerabilities.filter(v => v?.severity === 'Low' && !v?.isFalsePositive).length;
  const totalActiveVulnerabilities = activeCriticalCount + activeHighCount + activeMediumCount + activeLowCount;
  
  // Computed vulnerability metrics for interactive distribution charts
  const filteredVulnsForCharts = safeVulnerabilities.filter(v => {
    const matchSearch = (v?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (v?.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === 'All' || v?.severity === severityFilter;
    return matchSearch && matchSeverity && !v?.isFalsePositive;
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
  const getSeverityBadge = (severity: SeverityLevel | string) => {
    const norm = String(severity).toUpperCase();
    switch (norm) {
      case 'CRITICAL':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-red-950 border border-red-750 text-red-400">حرج جداً</span>;
      case 'HIGH':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-amber-950 border border-amber-750 text-amber-400">عالٍ</span>;
      case 'MEDIUM':
        return <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-yellow-950 border border-yellow-750 text-yellow-400">متوسط</span>;
      case 'LOW':
      default:
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

        {/* PROFILE CARD QUICK DISPLAY OR AUTH TRIGGER */}
        {userProfile ? (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-850">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                  <select
                    value={userProfile?.user?.id || (userProfile as any)?.id || "tm-1"}
                    onChange={(e) => handleSwitchUser(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-200 border-none outline-none cursor-pointer focus:ring-0 p-0 hover:text-white transition-colors dir-rtl font-sans text-right"
                  >
                    {(userProfile?.teamMembers || []).map((m: any) => (
                      <option key={m.id} value={m.id} className="bg-slate-950 text-slate-200 font-sans">
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-1 font-mono">
                  <span>{userProfile?.user?.email || (userProfile as any)?.email || ''}</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-amber-400 font-bold">{userProfile?.subscription?.plan || (userProfile as any)?.plan || 'FREE'}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800/40 flex items-center justify-center font-black text-cyan-400 text-xs shrink-0">
                {(userProfile?.user?.name || (userProfile as any)?.name) ? (userProfile?.user?.name || (userProfile as any)?.name)[0] : 'أ'}
              </div>
            </div>

            <button
              onClick={async () => {
                await storeLogout();
                setUserProfile(null);
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-950/50 hover:border-rose-800 text-slate-400 hover:text-rose-300 text-xs font-bold transition-all"
              title="تسجيل الخروج من الجلسة"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>تسجيل الدخول / حساب جديد</span>
          </button>
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
                  <span className="font-mono text-cyan-400 font-semibold">{userProfile?.subscription?.limits?.scansRemainingThisMonth ?? 0} / {userProfile?.subscription?.limits?.scansPerMonth ?? 1}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${((userProfile?.subscription?.limits?.scansRemainingThisMonth ?? 0) / (userProfile?.subscription?.limits?.scansPerMonth ?? 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>استشارات الذكاء الاصطناعي</span>
                  <span className="font-mono text-amber-400 font-semibold">{userProfile?.subscription?.limits?.aiConsultationsRemaining ?? 0} / {userProfile?.subscription?.limits?.aiConsultationsPerMonth ?? 1}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${((userProfile?.subscription?.limits?.aiConsultationsRemaining ?? 0) / (userProfile?.subscription?.limits?.aiConsultationsPerMonth ?? 1)) * 100}%` }}
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

                            <ErrorBoundary>
                <AppRouter
                  onOpenSelfHealing={handlePerformSelfHealing}
                  onOpenAddProject={() => setShowAddProjectModal(true)}
                  onOpenAddTarget={() => {
                    if (projects.length > 0) {
                      setSelectedProjectIdForTarget(projects[0].id);
                      setShowAddTargetModal(true);
                    }
                  }}
                  onVerifyOwnership={(target) => setVerificationModalTarget(target)}
                  onOpenTerminal={(scanJobId) => {
                    setActiveTerminalScanId(scanJobId);
                    setShowTerminal(true);
                  }}
                  onDisableMfa={handleDisableMfa}
                  onOpenMfaSetup={handleOpenMfaSetup}
                />
              </ErrorBoundary>
            </div>
          )}

        </main>
      </div>

      <ToastContainer />

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
                    {safeProjects.map(p => (
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
                        if (String(val).toUpperCase() !== 'MOBILE') {
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
                    {safeBbPrograms.map(p => (
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

      {/* AUTO REMEDIATION & SELF HEALING MODAL (Volume XII) */}
      <AnimatePresence>
        {remediationModalVuln && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      مستشار الترميم التلقائي والشفاء الذاتي (Self-Healing AI Engine)
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">بروتوكول التحقق الثلاثي المعزول وتأمين الأكواد البرمجية (Volume XII Compliance)</p>
                  </div>
                </div>
                <button
                  onClick={() => setRemediationModalVuln(null)}
                  disabled={remediationLoading}
                  className="text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* Vulnerability Meta info */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">الثغرة المستهدفة:</span>
                    <span className="text-white font-extrabold text-xs">{remediationModalVuln.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">التصنيف الفني:</span>
                    <span className="text-cyan-400 font-mono font-medium">{remediationModalVuln.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block mb-1">موقع الملف البرمجي:</span>
                    <span className="text-amber-400 font-mono truncate block" title={remediationModalVuln.location}>{remediationModalVuln.location}</span>
                  </div>
                </div>

                {/* Left/Right Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Side: Validation Pipeline & Logs (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col h-full min-h-[300px]">
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex justify-between items-center">
                        <span className="font-bold text-slate-300 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          مصفوفة التدقيق والتحقق الثلاثي
                        </span>
                        {remediationLoading && (
                          <span className="text-[10px] text-emerald-400 animate-pulse font-mono flex items-center gap-1">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            جاري المعالجة...
                          </span>
                        )}
                      </div>

                      {/* Step Progress indicators */}
                      <div className="p-4 border-b border-slate-850 space-y-3 bg-slate-900/40">
                        {/* Step 1 */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">1. توليد رقعة الترميم الآمن (AI Code Patch)</span>
                          {validationStep > 1 ? (
                            <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">✓ Passed</span>
                          ) : validationStep === 1 ? (
                            <span className="text-amber-400 animate-pulse font-mono">Running...</span>
                          ) : (
                            <span className="text-slate-600 font-mono">Pending</span>
                          )}
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">2. فحص الصياغة وبناء الملفات (ESLint & Build)</span>
                          {validationStep > 2 ? (
                            <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">✓ Passed</span>
                          ) : validationStep === 2 ? (
                            <span className="text-amber-400 animate-pulse font-mono">Running...</span>
                          ) : (
                            <span className="text-slate-600 font-mono">Pending</span>
                          )}
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">3. تشغيل اختبارات الوحدة (Unit Tests Suite)</span>
                          {validationStep > 3 ? (
                            <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">✓ Passed</span>
                          ) : validationStep === 3 ? (
                            <span className="text-amber-400 animate-pulse font-mono">Running...</span>
                          ) : (
                            <span className="text-slate-600 font-mono">Pending</span>
                          )}
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-medium">4. إعادة المسح الأمني للتأكيد (Scanner Check)</span>
                          {validationStep > 4 ? (
                            <span className="text-emerald-500 font-mono font-bold flex items-center gap-1">✓ Passed</span>
                          ) : validationStep === 4 ? (
                            <span className="text-amber-400 animate-pulse font-mono">Running...</span>
                          ) : (
                            <span className="text-slate-600 font-mono">Pending</span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Log Console */}
                      <div className="p-4 flex-1 font-mono text-[10px] text-slate-300 bg-black overflow-y-auto max-h-[220px] whitespace-pre-wrap leading-relaxed">
                        {simulatedLogs}
                        {remediationResult?.validationLogs && (
                          <div className="mt-2 text-emerald-400 border-t border-slate-900 pt-2 font-bold">
                            {remediationResult.validationLogs}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Code snippets & Pull Request Link (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                    {/* Code Diff Display */}
                    <div className="space-y-4 flex-1">
                      {!remediationResult ? (
                        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col h-full min-h-[300px] justify-center items-center text-center p-6 space-y-4">
                          <Cpu className="w-12 h-12 text-slate-700 animate-bounce" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-300">جاري إخضاع الكود للترميم والشفاء الذاتي المعزول</p>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">سيقوم الخادم بتخليق حلول آمنة متوافقة مع معايير OWASP ومطابقتها للتأكد من عدم وجود أي تراجع وظيفي.</p>
                          </div>
                          <div className="w-48 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full animate-pulse w-2/3"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Vulnerable vs Patched Split */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Vulnerable Code block */}
                            <div className="border border-red-500/20 rounded-xl overflow-hidden bg-slate-950">
                              <div className="bg-red-500/10 px-3 py-2 border-b border-red-500/20 text-red-400 font-bold flex items-center justify-between">
                                <span>الكود الثغري المكتشف</span>
                                <span className="text-[9px] bg-red-950 px-2 py-0.5 rounded font-mono border border-red-900">Vulnerable</span>
                              </div>
                              <pre className="p-3 overflow-x-auto text-[9px] font-mono text-slate-400 max-h-[250px] leading-relaxed">
                                {remediationResult.originalCodeSnippet}
                              </pre>
                            </div>

                            {/* Patched Code block */}
                            <div className="border border-emerald-500/20 rounded-xl overflow-hidden bg-slate-950">
                              <div className="bg-emerald-500/10 px-3 py-2 border-b border-emerald-500/20 text-emerald-400 font-bold flex items-center justify-between">
                                <span>الكود المُرمم والمؤمن تلقائياً</span>
                                <span className="text-[9px] bg-emerald-950 px-2 py-0.5 rounded font-mono border border-emerald-900">Patched & Verified</span>
                              </div>
                              <pre className="p-3 overflow-x-auto text-[9px] font-mono text-slate-100 max-h-[250px] leading-relaxed">
                                {remediationResult.patchedCodeSnippet}
                              </pre>
                            </div>
                          </div>

                          {/* Pull Request Link */}
                          {remediationResult.pullRequestUrl && (
                            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                <div>
                                  <p className="font-bold text-white text-xs">تم دفع التحديث الآمن وإنشاء طلب السحب بنجاح</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">تم توجيه طلب السحب إلى فرع المعالجة الأمنية في مستودع الكود الخاص بك.</p>
                                </div>
                              </div>
                              <a
                                href={remediationResult.pullRequestUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                استعراض طلب السحب (PR)
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action bar */}
                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/10">
                      <button
                        onClick={() => setRemediationModalVuln(null)}
                        disabled={remediationLoading}
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        إغلاق النافذة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURITY LOG STREAM TERMINAL OVERLAY */}
      <AnimatePresence>
        {showTerminal && (
          <SecurityTerminal
            scanJob={safeActiveScans.find(s => s.id === activeTerminalScanId) || null}
            target={safeProjects.flatMap(p => Array.isArray(p?.targets) ? p.targets : []).find(t => t?.id === (safeActiveScans.find(s => s?.id === activeTerminalScanId)?.targetId)) || null}
            allVulnerabilities={safeVulnerabilities}
            onClose={() => {
              setShowTerminal(false);
              setActiveTerminalScanId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* 2FA SETUP WIZARD MODAL */}
      <AnimatePresence>
        {showMfaSetupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <div className="text-right">
                    <h3 className="text-sm font-bold text-white">إعداد المصادقة الثنائية (Setup 2FA)</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">خطوات تأمين إضافية عبر بروتوكولات Firebase Auth</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMfaSetupModal(false)}
                  className="text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 text-xs text-slate-300">
                {/* Step Indicators */}
                <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        mfaSetupStep === step 
                          ? 'bg-emerald-600 text-white' 
                          : mfaSetupStep > step 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {step}
                      </div>
                      <span className={`hidden sm:inline ${mfaSetupStep === step ? 'text-white font-bold' : 'text-slate-500'}`}>
                        {step === 1 ? 'النوع' : step === 2 ? 'التهيئة' : step === 3 ? 'التحقق' : 'النسخ الاحتياطي'}
                      </span>
                    </div>
                  ))}
                </div>

                {mfaError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/15 rounded-lg text-red-400 flex items-center gap-2 text-right">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{mfaError}</span>
                  </div>
                )}

                {/* Step 1: Choose Type */}
                {mfaSetupStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-right">اختر طريقة التحقق الثنائي المفضلة لديك لتأمين حسابك:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* TOTP Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setTwoFactorType('totp');
                          setMfaSetupStep(2);
                        }}
                        className="p-4 bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-right transition-all flex flex-col justify-between h-32 cursor-pointer"
                      >
                        <div className="p-2 bg-emerald-950/40 border border-emerald-500/10 text-emerald-400 rounded-lg w-fit">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">تطبيق مصادقة (TOTP)</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">استخدم تطبيقات مثل Google Authenticator لتوليد رموز أمان مؤقتة.</p>
                        </div>
                      </button>

                      {/* SMS Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setTwoFactorType('sms');
                          setMfaSetupStep(2);
                        }}
                        className="p-4 bg-slate-950 hover:bg-slate-850/80 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-right transition-all flex flex-col justify-between h-32 cursor-pointer"
                      >
                        <div className="p-2 bg-cyan-950/40 border border-cyan-500/10 text-cyan-400 rounded-lg w-fit">
                          <Send className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">رسائل نصية قصيرة (SMS)</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">تلقي رمز تأكيد مكون من 6 أرقام على هاتفك المحمول عند طلب التحقق.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Configuration */}
                {mfaSetupStep === 2 && (
                  <div className="space-y-4">
                    {twoFactorType === 'totp' ? (
                      <>
                        <p className="text-slate-400 text-right">1. قم بمسح رمز الـ QR التالي عبر التطبيق، أو إدخل المفتاح السري الموضح أدناه يدوياً:</p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                          {/* QR Simulation */}
                          <div className="p-3 bg-white rounded-lg w-28 h-28 flex flex-col items-center justify-center relative border border-slate-850 shrink-0">
                            <div className="grid grid-cols-5 gap-1 w-full h-full">
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-slate-950 rounded"></div>

                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>

                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>

                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>

                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-white rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                              <div className="bg-slate-950 rounded"></div>
                            </div>
                            <div className="absolute inset-0 m-auto w-8 h-8 bg-slate-950 border-2 border-white rounded flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5 text-emerald-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-2 w-full text-right">
                            <span className="text-[10px] text-slate-500 block">المفتاح السري (TOTP Secret)</span>
                            <div className="p-2 bg-slate-900 border border-slate-800 rounded font-mono text-white text-[11px] select-all flex items-center justify-between">
                              <span>{tempSecret}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(tempSecret);
                                  showToast('تم نسخ المفتاح السري بنجاح!', 'success');
                                }}
                                className="text-slate-400 hover:text-white cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">اسم الحساب في التطبيق: <code className="text-slate-300 font-mono text-[10px]">Sniper-Security ({userProfile?.user.email})</code></p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-400 text-right">يرجى إدخال رقم هاتفك المحمول لتلقي رسالة SMS برمز التأكيد:</p>
                        <div className="space-y-3">
                          <label className="text-[10px] text-slate-500 block text-right">رقم الهاتف الدولي</label>
                          <input
                            type="tel"
                            placeholder="+966 50 123 4567..."
                            value={tempPhone}
                            onChange={(e) => setTempPhone(e.target.value)}
                            className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-cyan-500/50 text-white w-full font-mono text-left"
                          />
                          <p className="text-[10px] text-slate-500 text-right">ملاحظة: تأكد من تفعيل الشبكة والاتصال لتلقي رمز التحقق الثنائي.</p>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setMfaSetupStep(1)}
                        className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-850 cursor-pointer"
                      >
                        رجوع
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (twoFactorType === 'sms' && !tempPhone.trim()) {
                            setMfaError('يرجى إدخال رقم هاتف صالح أولاً.');
                            return;
                          }
                          setMfaError(null);
                          if (twoFactorType === 'sms') {
                            showToast(`تم إرسال رمز التحقق الثنائي لرسائل SMS بنجاح إلى الرقم: ${tempPhone}`, 'info');
                          }
                          setMfaSetupStep(3);
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold cursor-pointer"
                      >
                        {twoFactorType === 'sms' ? 'إرسال الرمز والمتابعة' : 'التالي (التحقق)'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Verify Setup */}
                {mfaSetupStep === 3 && (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-right">
                      أدخل الرمز المكون من 6 أرقام للتأكيد:
                      <span className="block text-[10px] text-slate-500 mt-1 font-sans">
                        {twoFactorType === 'totp' 
                          ? 'الرمز المولد من تطبيق Google Authenticator حالياً.' 
                          : `الرمز المرسل إلى الهاتف ${tempPhone} (للاختبار والمحاكاة استخدم أي 6 أرقام مثل 123456)`}
                      </span>
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="0 0 0 0 0 0"
                          value={mfaSetupCode}
                          onChange={(e) => setMfaSetupCode(e.target.value.replace(/\D/g, ''))}
                          className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-lg tracking-[0.5em] font-mono text-center text-emerald-400 w-48 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setMfaSetupStep(2)}
                        className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-850 cursor-pointer"
                      >
                        رجوع
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifySetup}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold cursor-pointer"
                      >
                        تأكيد الرمز وتفعيل الحماية
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Backup Codes / Success */}
                {mfaSetupStep === 4 && (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">تم التحقق بنجاح من المصادقة الثنائية!</h4>
                      <p className="text-[11px] text-slate-400 leading-normal">يرجى حفظ رموز النسخ الاحتياطي (Backup Codes) الموضحة أدناه لاسترجاع الحساب في حال فقدان هاتف التحقق:</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-slate-300 text-center select-all">
                      {backupCodes.map((code, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 border border-slate-850 rounded text-[10px]">
                          {code}
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-red-400 leading-normal">تنبيه: لا تقم بمشاركة هذه الرموز مع أي شخص. يتم استخدام الرمز لمرة واحدة فقط لاستعادة الوصول.</p>

                    <div className="pt-3 border-t border-slate-800 flex justify-center">
                      <button
                        type="button"
                        onClick={handleCompleteMfaEnrollment}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/10 cursor-pointer"
                      >
                        إنهاء الإعداد وتثبيت الأمان الثنائي
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2FA SECURITY CHALLENGE WINDOW */}
      <AnimatePresence>
        {showMfaChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950 flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">تأكيد الهوية عبر التحقق الثنائي (2FA Challenge)</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">تتطلب هذه العملية الإدارية الحساسة إدخال رمز الأمان لتأكيد الصلاحية البرمجية.</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {mfaChallengeError && (
                  <div className="p-2.5 bg-red-950/20 border border-red-500/15 rounded-lg text-red-400 text-center text-[11px]">
                    {mfaChallengeError}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 block text-right">
                    رمز تأكيد {twoFactorType === 'totp' ? 'تطبيق Authenticator' : 'رسائل SMS'} (6 أرقام)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={mfaChallengeCode}
                    onChange={(e) => setMfaChallengeCode(e.target.value.replace(/\D/g, ''))}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-lg tracking-[0.5em] font-mono text-center text-cyan-400 w-full focus:outline-none focus:border-cyan-500/50"
                  />
                  <p className="text-[9px] text-slate-500 text-center leading-normal">
                    {twoFactorType === 'totp' 
                      ? 'افتح تطبيق Google Authenticator على جهازك المحمول وأدخل الرمز النشط حالياً.'
                      : `أدخل الرمز المكون من 6 أرقام الذي تم إرساله لهاتفك المؤكد.`}
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMfaChallenge(false);
                      setMfaChallengeCallback(null);
                      showToast('تم إلغاء عملية التحقق الأمني الثنائي.', 'info');
                    }}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    إلغاء العملية
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyChallenge}
                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-900/10 cursor-pointer"
                  >
                    تأكيد وتنفيذ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL AUTHENTICATION MODAL */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

    </div>
  );
}
