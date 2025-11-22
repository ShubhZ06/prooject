import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

export const getStockInsights = async (stockData: string) => {
  if (!apiKey) return "API Key not configured";
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this inventory data and suggest reorder points: ${stockData}`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Error", error);
    return "Failed to fetch insights";
  }
};
