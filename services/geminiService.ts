
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCareAdvice = async (sneakerType: string, brand: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 short bullet points for cleaning a ${brand} ${sneakerType} sneaker professionally. Keep it brief and actionable for a sneaker care technician.`,
      config: {
        maxOutputTokens: 150
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini care advice failed", error);
    return "Standard cleaning protocol: scrub upper, clean midsole, deodorize interior.";
  }
};

export const getDailyReport = async (ordersCount: number, revenue: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, motivating 1-sentence performance summary for a sneaker cleaning shop that processed ${ordersCount} pairs today with $${revenue.toFixed(2)} in revenue.`,
      config: {
        maxOutputTokens: 100
      }
    });
    return response.text;
  } catch (error) {
    return "Great job today! Keep those kicks fresh.";
  }
};
