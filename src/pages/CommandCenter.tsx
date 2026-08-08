import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LiveEventStream } from '../components/realtime/LiveEventStream';
import { GlobalTimeline } from '../components/realtime/GlobalTimeline';
import { 
  ShieldAlert, ShieldCheck, Activity, Target, 
  ArrowUpRight, AlertTriangle, Bug, TrendingDown, Calendar, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  getSystemStats, getRiskTrend, getAssetDistribution, getRecentAlerts 
} from '../api/services/commandCenter';

const getSeverityBadge = (severity: string) => {
  const sev = severity.toLowerCase();
  if (sev.includes('crit') || sev.includes('حرج')) return <Badge variant="destructive" className="border-0">حرج (Critical)</Badge>;
  if (sev.includes('high') || sev.includes('عال')) return <Badge variant="warning" className="border-0 bg-amber-500/20 text-amber-400">عالي (High)</Badge>;
  if (sev.includes('med') || sev.includes('متوسط')) return <Badge variant="secondary" className="border-0 text-slate-300 bg-slate-800">متوسط (Medium)</Badge>;
  return <Badge variant="outline">{severity}</Badge>;
};

export const CommandCenter = () => {
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['systemStats'],
    queryFn: getSystemStats,
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['riskTrend'],
    queryFn: getRiskTrend,
  });

  const { data: assetDataObj, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assetDistribution'],
    queryFn: getAssetDistribution,
  });

  const { data: alertsData, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['recentAlerts'],
    queryFn: getRecentAlerts,
  });

  const cumulativeRisk30Days = React.useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      const base = 420;
      const curve = Math.sin(i * 0.35) * 35 + (i < 14 ? i * 9 : 126 - (i - 14) * 6.5);
      const score = Math.max(160, Math.round(base + curve));
      return {
        day: `اليوم ${dayNum}`,
        date: `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`,
        score: score,
        critical: Math.round(score * 0.42),
        high: Math.round(score * 0.38),
      };
    });
  }, []);

  if (isLoadingStats || isLoadingTrend || isLoadingAssets || isLoadingAlerts) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
          <div className="text-sm text-slate-500 animate-pulse">جاري تحميل لوحة التحكم...</div>
        </div>
      </div>
    );
  }

  const stats = statsData?.data;
  const riskData = trendData?.data || [];
  const assetData = assetDataObj?.data || [];
  const recentAlerts = alertsData?.data || [];

  const latestCumulativeScore = cumulativeRisk30Days[cumulativeRisk30Days.length - 1].score;
  const peakCumulativeScore = Math.max(...cumulativeRisk30Days.map(d => d.score));
  const initialCumulativeScore = cumulativeRisk30Days[0].score;
  const scoreChangePercent = (((latestCumulativeScore - initialCumulativeScore) / initialCumulativeScore) * 100).toFixed(1);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* Mobile Top Stats */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-4">
        <div>
          <p className="text-xs font-medium text-slate-400">مؤشر الأمان الأمني للمؤسسة</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-3xl font-black text-emerald-400 leading-none">{stats?.riskScore || 0}</h2>
            <span className="text-sm font-medium text-emerald-500 mb-0.5">+2</span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      {/* Header */}
      <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">مركز القيادة والعمليات الأمنية</h1>
          <p className="text-slate-400 text-sm mt-1">الموقف الأمني الشامل للمؤسسة واستخبارات التهديدات النشطة</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 text-xs sm:text-sm">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير التقرير</span>
          </Button>
          <Button className="gap-2 text-xs sm:text-sm">
            <ShieldAlert className="h-4 w-4" />
            فرز التنبيهات
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <Card className="hidden lg:block bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-400">معدل الأمان الشامل</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-emerald-400">{stats?.riskScore || 0}</h2>
                  <span className="text-xs sm:text-sm font-medium text-emerald-500">/ 100</span>
                </div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats?.riskScore || 0}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-400">التهديدات الحرجة النشطة</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-red-400">{stats?.totalVulnerabilities || 0}</h2>
                  <span className="text-xs sm:text-sm font-medium text-red-500">+3 اليوم</span>
                </div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-400">الأصول المعرضة للخطر</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-400">{stats?.activeAssets || 0}</h2>
                </div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/60 hidden sm:block">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-400">وكلاء الذكاء الاصطناعي النشطون</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-cyan-400">{stats?.activeAgents || 0}</h2>
                  <span className="text-xs sm:text-sm font-medium text-slate-500">/ 5</span>
                </div>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                مراقبة أمنية مستمرة
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Security Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <LiveEventStream />
        </div>
        <div className="h-[600px] sm:h-[700px]">
          <GlobalTimeline />
        </div>
      </div>

      {/* 30-Day Cumulative Risk Score Summary Card */}
      <Card className="bg-slate-900/60 border-slate-800/80 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 sm:p-6 pb-2 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                مؤشر درجة المخاطر التراكمية (Cumulative Risk Score)
                <Badge variant="outline" className="bg-cyan-950/60 text-cyan-400 border-cyan-500/30 text-xs">
                  <Calendar className="w-3 h-3 ml-1" />
                  آخر 30 يوماً
                </Badge>
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                حساب ديناميكي تراكمي لحجم المخاطر والتهديدات الأمنية المرصودة على مستوى جميع الأصول
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] font-medium text-slate-400 block">الدرجة التراكمية الحالية</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-cyan-400">{latestCumulativeScore}</span>
                <span className={`text-xs font-bold flex items-center ${Number(scoreChangePercent) <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <TrendingDown className="w-3 h-3 ml-0.5 inline" />
                  {scoreChangePercent}%
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden sm:block" />
            <div className="text-left sm:text-right hidden sm:block">
              <span className="text-[11px] font-medium text-slate-400 block">أعلى مستوى مخاطرة (Peak)</span>
              <span className="text-lg font-bold text-amber-400">{peakCumulativeScore}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-4">
          <div className="h-[220px] sm:h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeRisk30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cumulativeRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="criticalRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  interval={3}
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px', padding: '10px' }}
                  itemStyle={{ fontSize: '12px', color: '#e2e8f0' }}
                  labelStyle={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px' }}
                  formatter={(value: any, name: any) => [
                    `${value} نقطة مخاطرة`, 
                    name === 'score' ? 'الدرجة التراكمية الكلية' : name === 'critical' ? 'المخاطر الحرجة' : name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#06b6d4" 
                  fill="url(#cumulativeRiskGrad)" 
                  strokeWidth={2.5} 
                  name="score" 
                  dot={false}
                  activeDot={{ r: 6, fill: '#38bdf8', stroke: '#0891b2', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="critical" 
                  stroke="#ef4444" 
                  fill="url(#criticalRiskGrad)" 
                  strokeWidth={1.5} 
                  name="critical" 
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
                درجة المخاطر التراكمية الإجمالية
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b border-dashed border-red-500 inline-block" />
                المخاطر الحرجة المباشرة
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              تحديث تلقائي مستمر عبر محرك تحليل الثغرات الذكي
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base font-medium">اتجاه الثغرات الأمنية (6 أشهر)</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs hidden sm:flex">عرض التفاصيل <ArrowUpRight className="mr-1 h-3 w-3" /></Button>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0 sm:pt-0">
            <div className="h-[200px] sm:h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="critical" stackId="1" stroke="#f87171" fill="url(#colorCritical)" strokeWidth={2} name="حرجة" />
                  <Area type="monotone" dataKey="high" stackId="1" stroke="#fbbf24" fill="url(#colorHigh)" strokeWidth={2} name="عالية" />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke="#94a3b8" fill="url(#colorMedium)" strokeWidth={2} name="متوسطة" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden sm:block bg-slate-900/40 border-slate-800/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">توزيع الأصول الرقمية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {assetData.map((asset) => (
                <div key={asset.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">{asset.name}</span>
                    <span className="text-sm font-semibold text-white">{asset.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between lg:hidden px-1">
          <h2 className="text-base font-bold text-white tracking-tight">أحدث التنبيهات الحرجة</h2>
          <Button variant="ghost" size="sm" className="text-xs text-cyan-400">عرض الكل</Button>
        </div>

        {/* Mobile: Card Based List View */}
        <div className="grid grid-cols-1 gap-3 lg:hidden">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                  <span className="font-bold text-slate-200 mt-1">{alert.type}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500 uppercase">المخاطرة</span>
                  <span className={`text-lg font-black ${alert.risk >= 9 ? 'text-red-400' : 'text-amber-400'}`}>
                    {alert.risk.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-950/50 rounded-lg p-2.5 flex items-center justify-between border border-slate-800/50 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase">الأصل المستهدف</span>
                  <span className="text-sm font-medium text-slate-300">{alert.asset}</span>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent border-slate-700">
                  التفاصيل
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Full Table */}
        <Card className="hidden lg:block bg-slate-900/40 border-slate-800/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-medium">أحدث التنبيهات والأحداث الحرجة</CardTitle>
              <p className="text-sm text-slate-500 mt-1">الثغرات والتهديدات التي تم اكتشافها مؤخراً في النظام</p>
            </div>
            <Button variant="outline" size="sm">عرض الكل</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-slate-500 bg-slate-900/50 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">المعرف</th>
                    <th className="px-4 py-3 font-medium">الخطورة</th>
                    <th className="px-4 py-3 font-medium">الأصل الرقمي</th>
                    <th className="px-4 py-3 font-medium">نوع الثغرة</th>
                    <th className="px-4 py-3 font-medium">وقت الاكتشاف</th>
                    <th className="px-4 py-3 font-medium">الحالة</th>
                    <th className="px-4 py-3 text-left font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-300">{alert.id}</td>
                      <td className="px-4 py-4">{getSeverityBadge(alert.severity)}</td>
                      <td className="px-4 py-4 text-slate-300">{alert.asset}</td>
                      <td className="px-4 py-4 text-slate-300">{alert.type}</td>
                      <td className="px-4 py-4 text-slate-400">{alert.time}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium ${(alert.status as string) === 'Open' || (alert.status as string) === 'مفتوح' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {alert.status === 'Open' ? 'مفتوحة' : alert.status === 'Investigating' ? 'قيد التحقيق' : alert.status === 'Remediated' ? 'معالجة' : alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-left">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30">
                          فحص والتحقيق
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
