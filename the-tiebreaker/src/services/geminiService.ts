import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AnalysisType = "pros-cons" | "comparison" | "swot";

export interface AnalysisResponse {
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string | string[] | { [key: string]: string }[];
    type: "list" | "text" | "table";
  }[];
}

export async function getDecisionAnalysis(
  decision: string,
  type: AnalysisType
): Promise<AnalysisResponse> {
  const systemInstruction = `You are a decision-making expert. Analyze the provided decision or options and return a structured JSON response.
  For 'pros-cons', provide a list of pros and cons.
  For 'comparison', provide a comparison table if multiple options are given, or compare the decision against the status quo.
  For 'swot', provide a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats).
  Always include a concise summary and a clear title.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this decision: "${decision}" using the ${type} framework.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "A list of strings for 'list' type, or a single string for 'text' type (as an array of one string), or an array of objects for 'table' type."
                },
                type: {
                  type: Type.STRING,
                  enum: ["list", "text", "table"]
                }
              },
              required: ["heading", "content", "type"]
            }
          }
        },
        required: ["title", "summary", "sections"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid response format from AI");
  }
}
