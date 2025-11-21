import { GoogleGenAI } from "@google/genai";
import { AnalysisData } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

export const generateAnalysis = async (userContext: string, lang: 'zh' | 'en'): Promise<AnalysisData> => {
  if (!GEMINI_API_KEY) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const languageInstruction = lang === 'zh' 
    ? "OUTPUT LANGUAGE: Simplified Chinese (简体中文). All analysis content, titles, summaries, and predictions MUST be written in Simplified Chinese."
    : "OUTPUT LANGUAGE: English. All analysis content, titles, summaries, and predictions MUST be written in English.";

  const prompt = `
    You are a Senior Strategic Intelligence Analyst for East Asian Security Affairs.
    
    CONTEXT & HYPOTHESIS PROVIDED BY USER:
    "${userContext}"

    INTELLIGENCE GATHERING DIRECTIVES:
    1. **Expanded Source Scope**: 
       - **Official Government Sources**: Prioritize statements from:
         * China: MFA (fmprc.gov.cn), MND (mod.gov.cn), Ministry of Commerce.
         * Japan: MOFA (mofa.go.jp), MOD (mod.go.jp), Cabinet Office (Kantei).
         * USA: State Dept, DoD, White House.
       - **Global Media & Video Analysis**: Analyze reports from Reuters, Bloomberg, NHK, Nikkei, CCTV, CNN, and transcripts/summaries of relevant analysis from major video platforms (e.g., YouTube defense channels).
    
    2. **Multi-Language Capability**: Synthesize insights from Chinese (CN), Japanese (JP), and English (EN) sources.
    
    3. **Military Analysis Framework (Crucial for Task 5)**:
       - **Historical Precedent**: Reference Imperial Japanese Navy (IJN) operational patterns (e.g., preemptive strike doctrines, "Kantai Kessen" adaptations).
       - **Modern Doctrine**: Incorporate "US-Japan Military Integration", "Island Chain" defense theories, and "Multi-Domain Operations" (MDO).
       - **Capabilities**: Analyze current "Counter-Strike Capabilities" (e.g., Tomahawk acquisition) within the context of a "Decisive Battle" strategy.

    TASKS:
    1. **Timeline Reconstruction (Past 7 Days)**: Identify critical nodes in Diplomacy, Military movements, and Public Opinion related to the "Taiwan Issue".
    2. **Motivation Analysis**: Assess the probability of the leadership's statements being "impulsive" vs. "strategic signaling".
    3. **Strategic Validation**: ACCEPT the user's hypothesis (Japan entering militarization/breaking post-WWII order/preparing for decisive conflict) as the baseline truth. Elaborate on *how* this is being executed, referencing the "risk vs. reward" calculation of the Takaichi faction.
    4. **Conflict Trajectory**: Predict the immediate next steps in this confrontation.
    5. **Tactical Surprise Analysis**: 
       - Analyze the feasibility of a surprise attack on China.
       - Use the **Military Analysis Framework** to support your conclusions.
       - List specific, high-value targets (e.g., specific C4ISR nodes, naval bases, missile sites).

    ${languageInstruction}

    OUTPUT FORMAT (JSON ONLY):
    You must return a valid JSON object. Do not include markdown formatting/code blocks around the JSON.
    
    **IMPORTANT formatting instruction**: The string values for 'impulseAnalysis', 'strategicAnalysis', 'futurePrediction', and 'surpriseAttackAnalysis' MUST be formatted using **HTML tags**.
    - Use <p> for paragraphs.
    - Use <ul> and <li> for bullet points.
    - Use <strong> for key terms or emphasis.
    - Use <h3> for sub-sections within the analysis.
    - Do NOT use Markdown syntax (like **bold** or - list) inside these strings; use HTML only.

    Structure:
    {
      "timeline": [
        { 
          "date": "YYYY-MM-DD", 
          "title": "Headline", 
          "summary": "Detailed summary including source context", 
          "category": "DIPLOMATIC" | "MILITARY" | "PUBLIC_OPINION" 
        }
      ],
      "impulseAnalysis": "<p>Detailed assessment...</p>",
      "impulseProbability": 0, // 0-100
      "strategicAnalysis": "<p>Deep dive into the strategic shift...</p><ul><li>Point 1</li></ul>",
      "futurePrediction": "<p>Step-by-step prediction...</p>",
      "surpriseAttackAnalysis": "<p>Comprehensive analysis...</p>",
      "potentialTargets": ["Target 1 (Location - Rationale)", "Target 2", "Target 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], 
      }
    });

    const textResponse = response.text || "{}";
    
    // Attempt to find JSON blob if wrapped in markdown blocks, though prompt asks not to.
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : "{}";
    
    let data: AnalysisData;
    try {
        data = JSON.parse(jsonString) as AnalysisData;
    } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", textResponse);
        throw new Error("Failed to generate valid analysis data structure.");
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri)
      .map(web => ({ title: web.title || 'Reference Source', uri: web.uri })) || [];

    return { ...data, sources };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};