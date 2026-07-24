import React, { useState } from 'react';
import { CreditCard, Shield, Check, Sliders, Users, Trash2, Key, Smartphone } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';

export interface SubscriptionPageProps {
  userProfile: any;
  actionLoading: string | null;
  onUpgradeSubscription: (planName: string) => void;
  twoFactorEnabled: boolean;
  twoFactorType: 'sms' | 'totp' | null;
  twoFactorPhone: string;
  onDisableMfa: () => void;
  onOpenMfaSetup: () => void;
  auditLogs: any[];
  onClearAuditLogs: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  userProfile,
  actionLoading,
  onUpgradeSubscription,
  twoFactorEnabled,
  twoFactorType,
  twoFactorPhone,
  onDisableMfa,
  onOpenMfaSetup,
  auditLogs = [],
  onClearAuditLogs
}) => {
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];
  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-black text-white">الاشتراكات والتحقق الأمني المتقدم</h2>
        <p className="text-xs text-slate-400 mt-1">تتبع خطة SaaS النشطة، وتفعيل قنوات التحقق الثنائي (2FA)، وتصفح سجلات تدقيق العمليات الأمنية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SAAS SUBSCRIPTION */}
        <Card title="خطة الاشتراك والدفع" className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">الخطة الحالية:</span>
              <Badge variant="info">{userProfile?.subscription?.plan || 'Free'}</Badge>
            </div>
            <div className="text-2xl font-black text-white">
              {userProfile?.subscription?.cost || 0}$ <span className="text-xs text-slate-500">/ شهرياً</span>
            </div>
            <p className="text-[10px] text-slate-500">تجديد تلقائي في: {userProfile?.subscription?.currentPeriodEnd ? new Date(userProfile.subscription.currentPeriodEnd).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300">ترقية الخطة:</h4>
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                <div>
                  <span className="text-xs font-bold text-white">Professional Plan</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">حتى 50 فحصاً أمنياً شهرياً وفحص شفرات برمجية</p>
                </div>
                <Button size="sm" onClick={() => onUpgradeSubscription('Professional')}>ترقية لـ Pro</Button>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex justify-between items-center gap-2">
                <div>
                  <span className="text-xs font-bold text-white">Enterprise Plan</span>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-bold text-amber-500">فحوصات غير محدودة وفريق مخصص ودعم فني</p>
                </div>
                <Button size="sm" onClick={() => onUpgradeSubscription('Enterprise')}>ترقية لـ Enterprise</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* 2-FACTOR AUTHENTICATION */}
        <Card title="إدارة التحقق الثنائي (MFA/2FA)" className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            قم بحماية حسابك ومشاريعك ضد محاولات الوصول غير المصرح بها بتفعيل التحقق الثنائي عبر تطبيق المصادقة أو رسائل SMS.
          </p>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg border ${twoFactorEnabled ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white">حالة الحماية الثنائية</span>
                <span className="text-[10px] text-slate-500 block">
                  {twoFactorEnabled ? `نشط (${twoFactorType === 'totp' ? 'تطبيق Authenticator' : 'رسالة قصيرة SMS'})` : 'غير نشط'}
                </span>
              </div>
            </div>
            {twoFactorEnabled ? (
              <Button size="sm" variant="danger" onClick={onDisableMfa}>تعطيل 2FA</Button>
            ) : (
              <Button size="sm" onClick={onOpenMfaSetup}>تفعيل الآن</Button>
            )}
          </div>
        </Card>

        {/* AUDIT LOGS */}
        <Card title="سجل تدقيق العمليات الأمنية (Audit Logs)" className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500">آخر العمليات والإجراءات المسجلة للشركة</span>
            <Button size="sm" variant="ghost" className="text-red-400 text-[10px]" onClick={onClearAuditLogs}>تصفير السجلات</Button>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {safeAuditLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-600 text-xs">لا توجد عمليات مسجلة حتى الآن.</div>
            ) : (
              safeAuditLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString('ar-EG')}</span>
                  </div>
                  <p className="text-slate-500">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </div>
  );
};
