import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, Activity, Lock, Globe, Server, 
  AlertTriangle, Radar, Bot, FileText, 
  Settings, Users, Network, CheckCircle, Search,
  Menu, X, MessageSquare, Zap, LogOut, ChevronDown, UserCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { LiveStatusBar } from '../realtime/LiveStatusBar';
import { NotificationCenter } from '../realtime/NotificationCenter';
import { clearToken } from '../../api/auth/tokenManager';
import { useProfile } from '../../hooks/api/useProfile';
import { useSwitchUser } from '../../hooks/api/useTeam';

export const EnterpriseLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default false for mobile
  const [isMobile, setIsMobile] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: profile } = useProfile();
  const { mutate: switchUser } = useSwitchUser();

  const currentUser = profile?.user || {
    id: 'tm-admin-1',
    name: 'المسؤول الرئيسي (System Admin)',
    email: 'alridwanykick@gmail.com',
    role: 'Admin'
  };

  const company = profile?.company || {
    name: 'منصة Sniper AI Security'
  };

  const teamMembers = profile?.teamMembers || [
    { id: 'tm-admin-1', name: 'المسؤول الرئيسي (System Admin)', email: 'alridwanykick@gmail.com', role: 'Admin' }
  ];

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  const handleSelectUser = (id: string) => {
    switchUser(id);
    setShowUserDropdown(false);
  };

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const navigation = [
    {
      group: 'مركز القيادة',
      items: [
        { name: 'نظرة عامة أمنية', href: '/command-center', icon: Activity },
        { name: 'المشاريع والأصول', href: '/projects', icon: Server },
      ]
    },
    {
      group: 'العمليات الأمنية',
      items: [
        { name: 'عمليات الفحص الأمني', href: '/scans', icon: Radar },
        { name: 'الثغرات الأمنية', href: '/vulnerabilities', icon: AlertTriangle },
        { name: 'المعالجة التلقائية', href: '/remediations', icon: CheckCircle },
        { name: 'مكافآت الثغرات', href: '/bugbounty', icon: Shield },
      ]
    },
    {
      group: 'قريباً (Coming Soon)',
      items: [
        { name: 'استخبارات التهديدات', href: '/threat-intelligence', icon: Shield },
        { name: 'تحليلات المخاطر', href: '/risk-analytics', icon: Activity },
        { name: 'الامتثال والمعايير', href: '/compliance', icon: CheckCircle },
        { name: 'التكاملات والربط', href: '/integrations', icon: Network },
      ]
    },
    {
      group: 'الإدارة والنظام',
      items: [
        { name: 'التقارير التنفيذية', href: '/reports', icon: FileText },
        { name: 'إدارة الفريق', href: '/team', icon: Users },
        { name: 'سجلات التدقيق', href: '/audit-logs', icon: FileText },
        { name: 'إعدادات الحساب', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-cyan-500/30 flex dir-rtl" dir="rtl">
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 flex flex-col w-72 lg:w-64 border-l border-slate-800 bg-[#050811] lg:bg-[#050811]/95 lg:backdrop-blur-xl transition-transform duration-300 ease-in-out",
        !isSidebarOpen && "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <Shield className="h-6 w-6" />
            <span className="text-lg font-bold tracking-wider text-white">SNIPER AI</span>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-800">
          {navigation.map((group, i) => (
            <div key={i} className="mb-6 px-4">
              <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-500">
                {group.group}
              </h4>
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-lg px-2 py-2.5 lg:py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-cyan-500/10 text-cyan-400" 
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => setShowUserDropdown(!showUserDropdown)} 
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer flex-1 transition-colors group"
            >
              <div className="h-9 w-9 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 font-bold text-cyan-400 shrink-0">
                {currentUser.name ? currentUser.name.charAt(0) : 'م'}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-100 truncate flex items-center gap-1.5">
                  {currentUser.name}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                </span>
                <span className="text-xs text-cyan-400/90 font-medium truncate">
                  {currentUser.role === 'Admin' ? 'مدير النظام (Admin)' : currentUser.role === 'Security Analyst' ? 'محلل أمني' : 'مستعرض'}
                </span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              title="تسجيل الخروج"
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 shrink-0"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Company name badge */}
          <div className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 truncate text-right">
            🏢 {company.name}
          </div>

          {/* User Session Switcher Dropdown */}
          {showUserDropdown && (
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl space-y-1.5 animate-in fade-in duration-200">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800 flex items-center justify-between">
                <span>تبديل حساب المستخدم الجاري</span>
                <span className="text-cyan-400">{teamMembers.length} أعضاء</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectUser(m.id)}
                    className={cn(
                      "w-full text-right px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors",
                      m.id === currentUser.id 
                        ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate">{m.name}</span>
                      <span className="text-[10px] text-slate-500 truncate">{m.email}</span>
                    </div>
                    {m.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-1" />}
                  </button>
                ))}
              </div>
              <div className="pt-1 border-t border-slate-800">
                <Button 
                  onClick={() => { setShowUserDropdown(false); navigate('/team'); }}
                  variant="ghost" 
                  size="sm" 
                  className="w-full h-7 text-xs text-cyan-400 hover:bg-cyan-500/10 justify-center"
                >
                  إدارة مستخدمي النظام →
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen w-full transition-all duration-300",
        "lg:mr-64"
      )}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-14 lg:h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-[#030712]/90 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
            
            <div className="flex items-center gap-2 lg:gap-4 flex-1">
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-slate-400 hover:text-white -mr-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Search */}
              <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="ابحث عن الأصول، الثغرات، الحوادث، التقارير..." 
                  className="w-full rounded-md border border-slate-800 bg-slate-900/50 py-1.5 pr-10 pl-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 text-right"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-slate-200">
                <Search className="h-5 w-5" />
              </Button>
              
              <LiveStatusBar />
              <NotificationCenter />

              {/* Admin profile pill */}
              <button 
                onClick={() => navigate('/team')}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 hover:bg-cyan-900/60 transition-colors"
                title="الانتقال إلى صفحة إدارة أعضاء الفريق ومدير النظام"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">{currentUser.name || 'مدير النظام'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  {currentUser.role === 'Admin' ? 'مدير النظام' : currentUser.role}
                </span>
              </button>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="hidden sm:flex items-center gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 text-xs font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button className="h-14 w-14 rounded-full shadow-lg shadow-cyan-500/20 bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center" title="المساعد الذكي للأمن">
          <Bot className="h-6 w-6" />
        </Button>
      </div>

    </div>
  );
};

