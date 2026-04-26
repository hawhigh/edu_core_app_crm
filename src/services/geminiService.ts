import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

export const getGeminiAI = () => {
  if (!ai) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export interface CurriculumSearchParams {
  grade: string;
  subject: string;
  topic: string;
  className?: string;
  context?: string;
}

export const generateCurriculum = async (params: CurriculumSearchParams) => {
  const genAI = getGeminiAI();
  
  const prompt = `
    Generate a detailed curriculum preparation for a teaching lesson.
    
    Target Grade: Grade ${params.grade}
    Subject Area: ${params.subject}
    Topic: ${params.topic}
    ${params.className ? `Target Class: ${params.className}` : ""}
    
    ${params.context ? `Contextual Reference Materials:\n${params.context}` : ""}
    
    Please provide a structured preparation including:
    1. Lesson Aims (3-4 specific goals)
    2. Key Vocabulary & Grammar Points
    3. Lesson Structure (Introduction, Core Activities, Conclusion with timings)
    4. Recommended Materials & Resources
    5. Homework/Follow-up activity
    
    Format the output in professional Markdown.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
