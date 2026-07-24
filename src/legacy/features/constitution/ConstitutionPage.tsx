import React, { useState } from 'react';
import { BookOpen, Shield, Code, Settings, Server, TrendingUp, HelpCircle, ArrowUpRight, Check } from 'lucide-react';
import { Card } from '../../shared/components/Card';
import { Badge } from '../../shared/components/Badge';

export interface ConstitutionPageProps {
  userProfile: any;
}

export const ConstitutionPage: React.FC<ConstitutionPageProps> = ({ userProfile }) => {
  const [selectedVol, setSelectedVol] = useState<number>(0);

  const volumes = [
    {
      title: "المجلد الأول: الدستور الهندسي والقيم الأساسية (Engineering Constitution)",
      desc: "الرؤية العامة، معايير جودة الشيفرة البرمجية، الأداء العام، وتجربة المستخدم السيبرانية.",
      points: [
        "الفصل الكامل والدقيق لمنطق الواجهة الرسومية عن منطق الأعمال.",
        "تبني معايير تباين بصري فائقة الدقة لمنع إجهاد العين أثناء العمليات الطويلة.",
        "الحفاظ على مرونة البناء وتجنب الاعتماد على المكتبات الخارجية المجهولة."
      ]
    },
    {
      title: "المجلد الثاني: هندسة الأنظمة والترابط المتكامل (Enterprise Architecture)",
      desc: "الاعتماد على المكونات مفتتة المسؤولية وتكامل الطبقات لمنع تضارب تدفق المعلومات.",
      points: [
        "الالتزام الصارم بتوجيه البيانات الحساسة وصلاحيات الإدراج.",
        "توظيف خدمات الوسيط لإدارة الاتصالات وقنوات الفحص.",
        "التحقق الدوري التلقائي لضمان المزامنة الحية وحماية السجلات."
      ]
    },
    {
      title: "المجلد الثالث: البوابة البرمجية والتحكم في الموارد (Backend Bible)",
      desc: "قواعد واجهات Express، تأمين البيانات الواردة، وإدارة خطوط فحص الموارد النشطة.",
      points: [
        "إغلاق المنافذ وتمرير الطلبات الحساسة حصرياً عبر طبقة الحماية الخلفية.",
        "حجب المعرفات الفرعية والمفاتيح الأمنية عن التضمين في جانب العميل (Browser Client).",
        "تنسيق السجلات وتصميم استجابات موحدة للأخطاء لتفادي تسريب البيانات الفنية للأنظمة."
      ]
    },
    {
      title: "المجلد الرابع: محرك الفحص ومحاكاة الاختراق (Security Engine)",
      desc: "تشغيل أدوات التدقيق الهيكلي المعتمدة عالمياً وتحليل النتائج تلقائياً.",
      points: [
        "تشغيل الفحوصات الأمنية المعزولة لضمان عدم تأثر البنى التحتية للمواقع.",
        "تكامل آليات محاكاة الهجوم للتحقق من ثبوتية الأثر الأمني وجودته.",
        "إصدار لقطات إثبات المفهوم PoC لجميع الثغرات المكتشفة للتسريع من حلها."
      ]
    },
    {
      title: "المجلد الخامس: طبقة الذكاء الاصطناعي الأمني (AI Security Engine)",
      desc: "الاستعانة بنماذج Gemini لتسريع تحليل الثغرات وتوفير شروحات فنية عميقة وتلقائية.",
      points: [
        "بناء أطر توجيهية صارمة (Strict Prompts) لمنع توليد شفرات برمجية خاطئة أو ضارة.",
        "تأمين الاتصال الفني بنموذج الذكاء الاصطناعي وحجب المفاتيح السرية في الخادم الخلفي.",
        "تدريب المحركات لتقديم خطوات حل عملية ومطابقة للغات البرمجة المستهدفة."
      ]
    },
    {
      title: "المجلد السادس: هندسة قواعد البيانات والسرية (Database Bible)",
      desc: "هيكلية PostgreSQL وإدارة النماذج وفصل بيانات الشركات الكبرى (Multi-tenancy).",
      points: [
        "الفصل البرمجي التام لبيانات الشركات الكبرى استناداً إلى معرف الشركة (Company ID).",
        "تحسين الاستعلامات وبناء كشافات وفهارس دورية لمنع تباطؤ التقارير الأمنية.",
        "مراقبة الجداول وإجراء تدقيق أوتوماتيكي دوري لسجلات الدخول والعمليات."
      ]
    }
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">دستور المنصة الأمني والتطويري</h2>
          <p className="text-xs text-slate-400 mt-1">المجلدات الاثني عشر والمبادئ التوجيهية الحاكمة لتشغيل وتطوير نظام القناص الأمني</p>
        </div>
        <Badge variant="success">الاصدار المعتمد v1.2</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* VOLUMES SELECTOR */}
        <div className="lg:col-span-4 space-y-2">
          {volumes.map((vol, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedVol(idx)}
              className={`w-full p-3 rounded-lg border text-right transition-all text-xs flex flex-col gap-1 ${
                selectedVol === idx
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/20'
                  : 'bg-slate-900/40 text-slate-400 border-slate-850 hover:text-slate-200'
              }`}
            >
              <span className="font-bold">{vol.title.split(':')[0]}</span>
              <span className="text-[10px] text-slate-500 leading-normal">{vol.title.split(':')[1]}</span>
            </button>
          ))}
        </div>

        {/* DETAILED VIEW */}
        <Card title={volumes[selectedVol].title} className="lg:col-span-8 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">{volumes[selectedVol].desc}</p>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-white border-b border-slate-800 pb-1.5">المبادئ التوجيهية الصارمة (Strict Rules):</h4>
            <div className="space-y-2.5">
              {volumes[selectedVol].points.map((pt, pIdx) => (
                <div key={pIdx} className="flex gap-2.5 p-3 bg-slate-950 border border-slate-850 rounded-lg">
                  <div className="p-1 bg-cyan-950 text-cyan-400 rounded-full h-fit border border-cyan-500/10">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed font-sans">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};
