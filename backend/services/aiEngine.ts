import { GoogleGenAI, Type } from "@google/genai";
import { IAIEngine } from "../interfaces/IAIEngine";
import { IChatMessage, IAIVulnerabilityTemplate } from "../types/ai";
import { NormalizedVuln } from "../interfaces/IScannerPlugin";

// Initialize Server-Side Gemini API
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class AIEngineService implements IAIEngine {
  /**
   * 1. AI Security Scan - Generates vulnerabilities using structured Gemini 3.5 Flash JSON output
   */
  public async generateAIVulnerabilities(
    target: any,
    isHttp: boolean,
    fetchSuccess: boolean,
    statusInfo: string,
    headersDump: any
  ): Promise<IAIVulnerabilityTemplate[]> {
    const promptInput = `الهدف المراد فحصه:
- الاسم: ${target.name}
- الرابط/العنوان: ${target.url}
- النوع: ${target.type}
- هل نجح الاتصال المباشر: ${fetchSuccess ? "نعم" : "لا"}
- تفاصيل الاستجابة: ${statusInfo || "لا توجد"}
- ترويسات الاستجابة (HTTP Headers):
${JSON.stringify(headersDump, null, 2)}`;

    const systemInstruction = `أنت خبير فحص ثغرات ومستشار أمن سيبراني أول (Principal AI Security Auditor).
${target.type === "Mobile" ? "الهدف الحالي هو تطبيق جوال (APK). ركز تماماً على معايير OWASP Mobile Top 10 واستخرج ثغرات حقيقية ومقنعة تتعلق بالأندرويد والأمان الرقمي للتطبيقات." : "قم بتحليل بيانات الهدف الأمني وترويسات الاستجابة المكتشفة (أو تحليل المخاطر الافتراضية لنوع التطبيق إذا تعذر الاتصال أو كان مستودع شيفرة/تطبيق جوال)."}
استخرج ثغرات أمنية حقيقية وواقعية وموثقة ومفهومة للمطورين باللغة العربية الفصحى.
 must yield precise JSON output following this schema:
- title: عنوان الثغرة بالعربي
- type: نوع الثغرة (مثل SQL Injection, Insecure Headers, Sensitive Data Exposure, Cross-Site Scripting, Information Disclosure, Hardcoded Secrets, Insecure Data Storage, Lack of Code Obfuscation)
- severity: مستوى الخطورة (Critical, High, Medium, Low)
- cvssScore: درجة CVSS من 0.0 إلى 10.0
- location: موقع الثغرة في التطبيق (مثلاً HTTP Header أو حقل معين أو اسم فئة/ملف في الكود)
- description: وصف فني رائع ومقنع لكيف تم اكتشاف المشكلة
- impact: الأثر الأمني المدمر أو المخاطر المترتبة في حال تم استغلالها
- remediation: طريقة المعالجة والحل البرمجي الدقيق خطوة بخطوة باللغة العربية
- complianceMapping: كائن يحتوي على:
    * owasp: رمز معيار OWASP المقابل (مثل M01:2024-Insecure Data Storage لتطبيقات الجوال أو A05:2021-Security Misconfiguration للويب)
    * iso27001: رمز ISO 27001 المقابل
    * pciDss: رمز PCI DSS المقابل`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: promptInput },
        { text: `قم بإنشاء من 3 إلى 4 ثغرات واقعية ومقنعة جداً لهذا الهدف بناءً على البيانات أعلاه.` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              severity: { type: Type.STRING },
              cvssScore: { type: Type.NUMBER },
              location: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING },
              remediation: { type: Type.STRING },
              complianceMapping: {
                type: Type.OBJECT,
                properties: {
                  owasp: { type: Type.STRING },
                  iso27001: { type: Type.STRING },
                  pciDss: { type: Type.STRING }
                },
                required: ["owasp", "iso27001", "pciDss"]
              }
            },
            required: [
              "title", "type", "severity", "cvssScore", "location",
              "description", "impact", "remediation", "complianceMapping"
            ]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as IAIVulnerabilityTemplate[];
    }
    throw new Error("Empty response from AI engine");
  }

  /**
   * 2. Deep AI analysis of a specific vulnerability
   */
  public async analyzeVulnerability(vuln: any): Promise<string> {
    const prompt = `أنت خبير أمن سيبراني (AI Security Auditor). قم بتحليل الثغرة الأمنية التالية بدقة وتزويدنا بتقرير مفصل ومفهوم باللغة العربية:
اسم الثغرة: ${vuln.title}
نوعها: ${vuln.type}
مستوى الخطورة: ${vuln.severity} (CVSS: ${vuln.cvssScore})
الموقع: ${vuln.location}
الوصف الفني: ${vuln.description}

المطلوب تقديم تحليل في غاية الاحترافية مقسم إلى النقاط التالية:
1. تحليل عميق وتفسير مبسط لآلية عمل الثغرة لغير التقنيين.
2. سيناريو واقعي لكيفية استغلال المخترق لهذه الثغرة في هجوم حقيقي.
3. خطة إصلاح برمجية عملية للمطورين مع كود برمجي آمن افتراضي (Secure Code snippet).
4. اقتراح حماية شاملة على مستوى جدار الحماية (WAF) أو البنية التحتية.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مهندس أمن سيبراني ومحلل ثغرات محترف بلغة عربية سليمة. ركز على التوجيهات العملية والمشاريع البرمجية وتوضيح المخاطر للمؤسسات والشركات."
      }
    });

    return response.text || "";
  }

  /**
   * 3. AI Security Interactive Chatbot Advisor
   */
  public async chatWithAdvisor(messages: IChatMessage[]): Promise<string> {
    const formattedMessages = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const chatInstance = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: "أنت (AI Security Auditor Assistant) - مستشار وخبير أمن سيبراني ذكي تابع لمنصة الأمن والتدقيق. وظيفتك هي الإجابة بدقة واحترافية باللغة العربية على أسئلة المستخدم حول الأمن السيبراني، شرح الثغرات الأمنية مثل OWASP Top 10، تحليل شيفرات المصدر، وتقديم تعليمات إصلاح آمنة واضحة وموثوقة للمهندسين ومدراء تكنولوجيا المعلومات."
      },
      history: formattedMessages.slice(0, -1)
    });

    const lastMessage = messages[messages.length - 1].text;
    const response = await chatInstance.sendMessage({ message: lastMessage });
    return response.text || "";
  }

  /**
   * 4. Executive Summary generator for Projects Report
   */
  public async generateExecutiveSummary(
    projectName: string,
    totalVulns: number,
    calculatedRisk: number,
    severityBreakdown: any
  ): Promise<string> {
    const prompt = `قم بكتابة ملخص تنفيذي (Executive Summary) احترافي جداً وموجه للإدارة العليا باللغة العربية لمشروع أمني يدعى "${projectName}".
عدد الثغرات الإجمالية: ${totalVulns}
تفاصيل الثغرات المكتشفة:
- حرجة جداً (Critical): ${severityBreakdown.Critical}
- عالية الخطورة (High): ${severityBreakdown.High}
- متوسطة (Medium): ${severityBreakdown.Medium}
- منخفضة الخطورة (Low): ${severityBreakdown.Low}
مستوى المخاطر التراكمي المقدر: ${calculatedRisk}% (كلما زاد دل على ضعف حماية الموقع).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مستشار أمني للأمن السيبراني، لغتك العربية رصينة، وتوضح الجوانب الاستراتيجية والإجراءات التصحيحية للإدارة."
      }
    });

    return response.text || "";
  }

  /**
   * 5. elite Bug Bounty Report Generator for HackerOne/Bugcrowd
   */
  public async generateBugBountyReport(
    title: string,
    vulnType: string,
    severity: string,
    pocSteps: string,
    impact: string
  ): Promise<string> {
    const prompt = `You are a world-class Elite Bug Bounty Hunter. Generate a highly professional English bug bounty report for HackerOne/Bugcrowd based on the following details:
- Target Vulnerability Title: ${title}
- Vulnerability Type: ${vulnType}
- Estimated Severity: ${severity}
- Steps to Reproduce / Proof of Concept (PoC): ${pocSteps}
- Business & Technical Impact: ${impact}

Generate a beautifully structured markdown report with the following precise sections:
1. **Summary / Description**: A high-level description of what the vulnerability is.
2. **Technical Details**: Where it occurs and why it happens.
3. **Steps to Reproduce (PoC)**: Clear, numbered step-by-step instructions.
4. **Impact**: Elaborate on the business and technical damage (e.g. data leak, account takeover).
5. **Remediation**: Suggest precise patching recommendations for the developer.

Make sure the tone is professional, objective, and clear. Do not include conversational preambles like "Here is your report". Start directly with the markdown format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite ethical hacker and bug bounty specialist drafting report templates in professional cybersecurity English.",
        temperature: 0.7,
      },
    });

    return response.text || "";
  }

  /**
   * AI Verification & Enrichment of Normalized Scanner Findings
   * Receives only normalized vulnerabilities from the ResultNormalizer to validate/expand descriptions.
   */
  public async auditAndEnrichNormalizedVulns(
    normalizedVulns: NormalizedVuln[],
    target: any
  ): Promise<any[]> {
    if (!normalizedVulns || normalizedVulns.length === 0) {
      return [];
    }

    const promptInput = `الهدف: ${target.name} (${target.url}) [النوع: ${target.type}]
الثغرات الموحدة الواردة من محرك الفحص:
${JSON.stringify(normalizedVulns, null, 2)}`;

    const systemInstruction = `أنت خبير فحص ثغرات ومستشار أمن سيبراني أول (Principal AI Security Auditor).
مهمتك هي مراجعة وتدقيق وتأكيد الثغرات الأمنية الموحدة الواردة من محرك الفحص (Result Normalizer).
قم بتعريب وتحسين وصياغة العناوين والوصف والأثر الأمني وإجراءات الحل البرمجي المناسبة بلغة عربية فصحى دقيقة ومقنعة للمطورين والمدريرين.
يجب إرجاع النتيجة كـ JSON Array يطابق نفس هيكل البيانات المدخل تماماً ومطابقتها لمعايير OWASP و ISO 27001 و PCI DSS.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          { text: promptInput },
          { text: `الرجاء تدقيق وإثراء هذه الثغرات وتوفير كائن JSON Array مطابق للتصميم.` }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                severity: { type: Type.STRING },
                cvssScore: { type: Type.NUMBER },
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING },
                remediation: { type: Type.STRING },
                evidence: { type: Type.STRING },
                complianceMapping: {
                  type: Type.OBJECT,
                  properties: {
                    owasp: { type: Type.STRING },
                    iso27001: { type: Type.STRING },
                    pciDss: { type: Type.STRING }
                  },
                  required: ["owasp", "iso27001", "pciDss"]
                }
              },
              required: [
                "title", "type", "severity", "cvssScore", "location",
                "description", "impact", "remediation"
              ]
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.warn("Gemini API enrichment failed, returning raw normalized findings:", err);
    }
    // Safe fallback if API fails
    return normalizedVulns.map(v => ({
      ...v,
      complianceMapping: {
        owasp: v.owasp || "A05:2021-Security Misconfiguration",
        iso27001: "A.12.6.1 إدارة الثغرات الفنية",
        pciDss: "Requirement 6.5"
      }
    }));
  }
}

// Singleton for easy import and legacy backward compatibility
export const aiEngineService = new AIEngineService();

// Export original functions for non-breaking compatibility
export const generateAIVulnerabilities = (target: any, isHttp: boolean, fetchSuccess: boolean, statusInfo: string, headersDump: any) =>
  aiEngineService.generateAIVulnerabilities(target, isHttp, fetchSuccess, statusInfo, headersDump);

export const analyzeVulnerability = (vuln: any) =>
  aiEngineService.analyzeVulnerability(vuln);

export const chatWithAdvisor = (messages: IChatMessage[]) =>
  aiEngineService.chatWithAdvisor(messages);

export const generateExecutiveSummary = (projectName: string, totalVulns: number, calculatedRisk: number, severityBreakdown: any) =>
  aiEngineService.generateExecutiveSummary(projectName, totalVulns, calculatedRisk, severityBreakdown);

export const generateBugBountyReport = (title: string, vulnType: string, severity: string, pocSteps: string, impact: string) =>
  aiEngineService.generateBugBountyReport(title, vulnType, severity, pocSteps, impact);
