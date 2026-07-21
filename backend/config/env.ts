import { ApiError } from "../errors/ApiError";

export const ENV = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: process.env.NODE_ENV || "development",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

// Validate variables and configurations
export function validateEnvironment() {
  if (isNaN(ENV.PORT) || ENV.PORT < 1 || ENV.PORT > 65535) {
    throw new ApiError(
      "منفذ الخادم المكوّن غير صالح (PORT must be a number between 1 and 65535)",
      500,
      ["Invalid PORT environment variable"]
    );
  }

  const validEnvs = ["development", "production", "test"];
  if (!validEnvs.includes(ENV.NODE_ENV)) {
    throw new ApiError(
      "بيئة التشغيل غير صالحة (NODE_ENV must be development, production, or test)",
      500,
      [`Invalid NODE_ENV: ${ENV.NODE_ENV}`]
    );
  }

  if (!ENV.GEMINI_API_KEY || ENV.GEMINI_API_KEY === "dummy_key") {
    console.warn(
      "⚠️ [WARNING] مفتاح Gemini API غير مكوّن بشكل سليم (GEMINI_API_KEY is missing or dummy). لن تعمل ميزات التحليل الذكي في الوضع الحقيقي."
    );
  } else {
    console.log("✅ [ENV] تم التحقق من سلامة مفتاح Gemini API بنجاح.");
  }
}

