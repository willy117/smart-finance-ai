
import { GoogleGenAI } from "@google/genai";
import { Transaction, Account, Category } from "../types";

// getFinancialAdvice uses Gemini 3 Pro for complex financial reasoning and analysis.
export const getFinancialAdvice = async (
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[]
): Promise<string> => {
  // Always initialize GoogleGenAI with the API key from process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summaryText = transactions.map(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    return `${t.date}: ${cat?.name} - ${t.type === 'INCOME' ? '+' : '-'}${t.amount} (${t.description})`;
  }).join('\n');

  const accountText = accounts.map(a => `${a.name} (${a.bankName}): 餘額 ${a.balance}`).join('\n');

  const prompt = `
    你是一位專業的個人理財顧問。以下是使用者的財務狀況：
    
    帳戶資訊：
    ${accountText}
    
    最近交易紀錄：
    ${summaryText}
    
    請根據這些數據提供：
    1. 支出分析建議（例如是否有過多不必要支出）。
    2. 儲蓄建議。
    3. 投資或資產配置的簡單方向。
    請用親切且專業的口吻回答，並使用繁體中文。
  `;

  try {
    // Financial planning is a complex reasoning task, so we use gemini-3-pro-preview.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    // Directly access the .text property of the GenerateContentResponse object.
    return response.text || "抱歉，目前無法生成建議。請稍後再試。";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "分析過程中發生錯誤，請檢查您的網路連線或稍後再試。";
  }
};
