import React, { useState } from 'react';
import { Settings, Key, Bell, ShieldCheck, Save, Copy, Check } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'api' | 'notifications'>('general');
  const [companyName, setCompanyName] = useState('Sniper Cyber Systems Corp.');
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
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            Platform Settings (إعدادات المنصة والأمان)
          </h2>
          <p className="text-xs text-slate-400 mt-1">تكوين إعدادات المؤسسة، مفاتيح API، خيارات المصادقة الثنائية، والإشعارات المباشرة</p>
        </div>

        {savedMessage && (
          <Badge variant="success" className="animate-pulse">
            ✓ تم حفظ التعديلات بنجاح
          </Badge>
        )}
      </div>

      {/* TABS HEADER */}
      <div className="flex border-b border-slate-800 gap-2">
        {[
          { id: 'general', label: 'General (عام)' },
          { id: 'security', label: 'Security & 2FA (الأمان)' },
          { id: 'api', label: 'API Keys (مفاتيح الربط)' },
          { id: 'notifications', label: 'Notifications (الإشعارات)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <Card variant="cyber" className="p-6">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">اسم الشركة والمنظمة</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">المنطقة الزمنية (Timezone)</label>
              <select className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none font-mono">
                <option>(GMT+03:00) Riyadh / Makkah Standard Time</option>
                <option>(GMT+04:00) Dubai Standard Time</option>
                <option>(GMT+00:00) UTC / London</option>
              </select>
            </div>

            <Button onClick={handleSave} className="bg-cyan-600 text-white font-bold text-xs mt-2">
              <Save className="w-4 h-4" /> حفظ الإعدادات العامة
            </Button>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs max-w-xl">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">المصادقة الثنائية (Two-Factor Authentication - 2FA)</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">تأمين حساب المنظمة باستخدام تطبيقات TOTP كـ Google Authenticator</p>
              </div>
              <Badge variant="success">مفعلة ✓</Badge>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-white">تغيير كلمة المرور</h4>
              <input type="password" placeholder="كلمة المرور الحالية" className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none" />
              <input type="password" placeholder="كلمة المرور الجديدة" className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white focus:outline-none" />
            </div>

            <Button onClick={handleSave} className="bg-cyan-600 text-white font-bold text-xs">
              <Save className="w-4 h-4" /> تحديث كلمة المرور
            </Button>
          </div>
        )}

        {/* API TAB */}
        {activeTab === 'api' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h4 className="font-bold text-white">Sniper Platform API Key</h4>
            <p className="text-slate-400 leading-relaxed">
              استخدم هذا المفتاح للربط البرمجي التلقائي مع أدوات CI/CD وخطوط الإنتاج والأتمتة الخارجية.
            </p>

            <div className="flex items-center gap-2 p-3 bg-[#070B14] border border-slate-800 rounded-xl">
              <span className="font-mono text-cyan-400 flex-1 truncate">{apiKey}</span>
              <button onClick={handleCopy} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 font-bold">
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedKey ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 text-xs max-w-xl">
            <h4 className="font-bold text-white">قنوات التنبيه المباشرة (Alert Webhooks & Notifications)</h4>
            
            <div className="space-y-2">
              <label className="text-slate-400 block">Slack / Discord Webhook URL:</label>
              <input
                type="text"
                placeholder="https://hooks.slack.com/services/..."
                className="w-full p-3 bg-[#070B14] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <Button onClick={handleSave} className="bg-cyan-600 text-white font-bold text-xs">
              <Save className="w-4 h-4" /> حفظ قنوات التنبيه
            </Button>
          </div>
        )}

      </Card>

    </div>
  );
};
