import { Logger } from "../utils/logger";
import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { userRepository } from "../repositories/UserRepository";
import { scanRepository } from "../repositories/ScanRepository";
import { aiEngineService } from "../services/aiEngine";
import { Formatter } from "../utils/formatter";
import { Validators } from "../utils/validators";

export class ChatController {
  /**
   * Sends messages to the AI Cyber Security Advisor chatbot
   */
  public sendMessageToAdvisor = async (req: AuthenticatedRequest, res: Response) => {
    const startTime = Date.now();
    try {
      const { messages, vulnerability } = req.body; // array of {role: 'user'|'model', text: string}
      Validators.requireFields(req.body, ["messages"]);

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json(Formatter.error("الرسائل مطلوبة ويجب أن تكون مصفوفة غير فارغة"));
      }

      const subscription = await userRepository.getSubscription();
      if (subscription.limits.aiConsultationsRemaining <= 0) {
        return res.status(403).json(Formatter.error("عذراً، لقد استهلكت الرصيد المتاح لاستشارات الذكاء الاصطناعي."));
      }

      subscription.limits.aiConsultationsRemaining -= 1;

      let reply = "";
      try {
        reply = await aiEngineService.chatWithAdvisor(messages);
      } catch (error) {
        Logger.error("Chat API error, triggering helpful offline response:", error);
        reply = `مرحباً بك! أنا مستشارك الذكي للأمن السيبراني. لم أتمكن من الاتصال بالخدمة السحابية الحية مؤقتاً، ولكن يسعدني تزويدك بالدعم الأمني:

سؤالك رائع! يتعلق الأمن السيبراني بتطبيق أفضل الممارسات الأمنية:
1. **تأمين البيانات**: استخدام التشفير القوي AES-256 للمفاتيح السحابية وقاعدة البيانات.
2. **التحقق المستمر**: لا تثق بأي مدخلات قادمة من الخارج (Zero Trust) وعقم كل معاملة ماليّة.
3. **تطبيق OWASP**: فحص التطبيقات دورياً للتأكد من خلوها من ثغرات حقن برمجية أو فقدان في تتبع الصلاحيات.

أخبرني بأي ثغرة محددة تود معرفة كيفية إصلاحها برمجياً لخدمتك فوراً!`;
      }

      const userMessage = messages[messages.length - 1]?.text || "";
      const latency = Date.now() - startTime;

      // Save persistent AI consultation in database
      await scanRepository.saveAIConsultation({
        prompt: userMessage,
        response: reply,
        model: "gemini-3.5-flash",
        tokens: Math.ceil((userMessage.length + reply.length) / 4),
        latency: latency,
        user: req.user?.email || "SecOps Analyst",
        vulnerability: vulnerability || null,
      });

      return res.json(Formatter.success({ reply }, "تم الحصول على رد المستشار الذكي"));
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json(Formatter.error(error.message));
    }
  };

  /**
   * Fetch persistent AI consultations history
   */
  public getConsultations = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const history = await scanRepository.getAIConsultations();
      return res.json(Formatter.success(history, "تم جلب سجل استشارات الذكاء الاصطناعي بنجاح"));
    } catch (error: any) {
      return res.status(500).json(Formatter.error(error.message));
    }
  };
}

export const chatController = new ChatController();

// Export legacy function for non-breaking backward compatibility
export const sendMessageToAdvisor = chatController.sendMessageToAdvisor;
export const getConsultations = chatController.getConsultations;
