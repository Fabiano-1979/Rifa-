import { GoogleGenAI, Type } from "@google/genai";
import { GeminiContent } from '../types';

export const generateRaffleTheme = async (): Promise<GeminiContent | null> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a catchy, exciting title, a short description (2 sentences), and 3 bullet point highlights for a digital raffle where the prize is a high-end Tech Setup (MacBook + Monitor). Language: Portuguese (Brazil).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prizeHighlights: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "prizeHighlights"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeminiContent;

  } catch (error) {
    console.error("Failed to generate raffle theme", error);
    return null;
  }
};