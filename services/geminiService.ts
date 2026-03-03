import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client using the API key directly from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseUserQuery = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following search query from a user looking for social media creators: "${query}". 
      Identify filters like: Domicile (location), Tier (NANO, MIKRO, MAKRO, MEGA), category, and minimum followers. 
      Return only JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domicile: { type: Type.STRING, description: 'Location identified' },
            tier: { type: Type.STRING, description: 'NANO, MIKRO, MAKRO, or MEGA' },
            category: { type: Type.STRING, description: 'Content category' },
            minFollowers: { type: Type.NUMBER, description: 'Minimum followers count' },
            explanation: { type: Type.STRING, description: 'A friendly explanation of what was found' }
          }
        }
      }
    });

    // Ensure the response text is handled as a property and trimmed before parsing
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
};