import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Bell, ShieldCheck, Save, Copy, Check } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useProfile } from '../hooks/api/useProfile';

export const Settings = () => {
  const { data: profile } = useProfile();
  const userProfile = profile?.user || {};
  const companyProfile = profile?.company || { name: 'شركة قناص الأمن السيبراني' };
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'api' | 'notifications'>('general');
  const [companyName, setCompanyName] = useState(companyProfile.name || 'شركة قناص الأمن السيبراني');

  useEffect(() => {
    if (profile?.company?.name) {
      setCompanyName(profile.company.name);
    }
  }, [profile]);
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const apiKey = 'snp_live_98a72f10b3e945c2a11b8971';

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            إعدادات المنصة والأمان
          </h1>
          <p className="text-sm text-slate-400 mt-1">تكوين إعدادات المؤسسة، مفاتيح API، خيارات المصادقة الثنائية، والإشعارات المباشرة</p>
        </div>

        {savedMessage && (
          <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 animate-pulse">
            ✓ تم حفظ التعديلات بنجاح
          </Badge>
        )}
      </div>

      {/* TABS HEADER */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: 'الإعدادات العامة' },
          { id: 'security', label: 'الأمان والمصادقة' },
          { id: 'api', label: 'مفاتيح API والربط' },
          { id: 'notifications', label: 'تفضيلات الإشعارات' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <Card className="bg-slate-900/40 border-slate-800/60 p-6">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-sm max-w-xl">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">اسم الشركة والمنظمة</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-right text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">البريد الإلكتروني للإنذارات الأمنية</label>
              <input
                type="email"
                defaultValue={userProfile.email}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-left font-mono text-sm"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">المنطقة الزمنية (Timezone)</label>
              <select className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none text-right text-sm">
                <option>(GMT+03:00) التوقيت القياسي للرياض ومكة المكرمة</option>
                <option>(GMT+04:00) التوقيت القياسي لدبي</option>
                <option>(GMT+00:00) التوقيت العالمي الموحد UTC / لندن</option>
              </select>
            </div>

            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold mt-2">
              <Save className="w-4 h-4 ml-1.5" /> حفظ الإعدادات العامة
            </Button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">المصادقة الثنائية (Two-Factor Authentication 2FA)</h4>
                <p className="text-xs text-slate-400 mt-1">تأمين حماية حسابات الإدارة والمحللين باستخدام تطبيق Google Authenticator</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400">مفعّل</Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">تغيير كلمة المرور</h4>
              <input type="password" placeholder="كلمة المرور الحالية" className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 text-right" />
              <input type="password" placeholder="كلمة المرور الجديدة" className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500 text-right" />
              <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                تحديث كلمة المرور
              </Button>
            </div>
          </div>
        )}

        {/* API KEYS TAB */}
        {activeTab === 'api' && (
          <div className="space-y-4 max-w-xl">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              مفتاح واجهة الربط المباشر (Sniper Production API Key)
            </h4>
            <p className="text-xs text-slate-400">استخدم هذا المفتاح لربط أنظمة CI/CD أو إطلاق الفحص عبر الـ CLI برمجياً.</p>

            <div className="flex items-center gap-2" dir="ltr">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-lg text-cyan-400 font-mono text-sm focus:outline-none"
              />
              <Button onClick={handleCopy} variant="outline" className="border-slate-800 shrink-0">
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span className="ml-1.5">{copiedKey ? 'تم النسخ' : 'نسخ المفتاح'}</span>
              </Button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-xl">
            {[
              { title: 'إنذارات الثغرات الحرجة (Critical Vulnerability Alerts)', desc: 'إرسال إشعار فوري عند اكتشاف ثغرة CVSS 9.0+', enabled: true },
              { title: 'تقارير الفحص التلقائية (Daily Scan Digest)', desc: 'ملخص يومي بنتايج الفحص والأهداف التي تم اختبارها', enabled: true },
              { title: 'بلاغات Bug Bounty الجديدة', desc: 'تنبيه عند تقديم صائد ثغرات لبلاغ جديد قيد المراجعة', enabled: false }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={item.enabled} className="h-5 w-5 accent-cyan-500 cursor-pointer" />
              </div>
            ))}
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
              حفظ تفضيلات الإشعارات
            </Button>
          </div>
        )}

      </Card>

    </div>
  );
};
