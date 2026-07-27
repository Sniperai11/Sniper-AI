const fs = require('fs');
let code = fs.readFileSync('backend/services/aiEngine.ts', 'utf8');

const retryLogic = `
async function generateContentWithRetry(params: any, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      if (err?.status === 503 || err?.status === 429) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
      } else {
        throw err;
      }
    }
  }
}
`;

code = code.replace(/export class AIEngineService implements IAIEngine \{/, retryLogic + '\nexport class AIEngineService implements IAIEngine {');

// Replace await ai.models.generateContent with await generateContentWithRetry
code = code.replace(/await ai\.models\.generateContent\(/g, 'await generateContentWithRetry(');

fs.writeFileSync('backend/services/aiEngine.ts', code);
