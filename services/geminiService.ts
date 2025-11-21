
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
    # Role: Geopolitical Risk Analyst (SJM-CRI 2.0 Specialist)

    ## Core Objective
    You are an expert AI analyst responsible for monitoring and assessing the risk of military conflict between China and Japan. Your task is to execute the **SJM-CRI 2.0 (Sino-Japanese Military Conflict Risk Index)** protocol.

    ## Context & Hypothesis
    User Context: "${userContext}"

    ## Workflow
    1. **Data Acquisition**: You have access to Google Search. You must search for:
       - Official Travel Advisories (US/CN/JP) in the last 30 days.
       - PLA and JSDF military movements (Taiwan Strait, East China Sea).
       - Political rhetoric (PM Takaichi/Beijing responses).
       - Third-party stances (EU/NATO/ASEAN).
    2. **Information Refinement**: Cross-reference sources. Prioritize official government statements and military logs over opinion pieces.
    3. **Dynamic Scoring (SJM-CRI 2.0 Model)**:
       Calculate the risk using the following STRICT weights.
       
       **Formula**: 
       Base_Score = (0.35 * I_TS) + (0.20 * I_ECS) + (0.15 * I_SUR) + (0.15 * I_IPS) + (0.15 * I_TPI)
       Total_Risk = Base_Score * M

       **Indices**:
       - **I_TS (Taiwan Strait Stability) [Weight 0.35]**: Assess military sorties, median line crossings, and political confrontation regarding Taiwan.
       - **I_ECS (East China Sea) [Weight 0.20]**: Assess Coast Guard incursions (Senkaku/Diaoyu), radar lock-ons, and grey zone operations.
       - **I_SUR (Sino-US Relations) [Weight 0.15]**: Assess high-level comms (hotlines), sanctions, and carrier strike group deployments.
       - **I_IPS (Internal Politics) [Weight 0.15]**: Assess domestic economic pressure, nationalism levels, and leadership political survival needs.
       - **I_TPI (Third Party Influence) [Weight 0.15]**: Assess statements/actions from EU, NATO, G7, and ASEAN.
       
       **M (Risk Multiplier)**:
       - Base: 1.0
       - +0.2: If active "Reconsider Travel" or higher warning from CN or JP.
       - +0.5: If US issues "Do Not Travel" or evacuates non-essential personnel.
       - +0.3: If any direct physical casualty or warning shots fired.

    ## Output Requirements
    ${languageInstruction}
    
    **Formatting**: 
    - Use HTML tags (\`<p>\`, \`<ul>\`, \`<li>\`, \`<strong>\`) for all string analysis fields. 
    - Do NOT use Markdown.
    - Ensure the tone is objective, professional, and intelligence-focused.

    **JSON Structure**:
    Return a SINGLE valid JSON object matching this structure:
    {
      "timeline": [
        { "date": "YYYY-MM-DD", "title": "Short Headline", "summary": "Concise event summary", "category": "DIPLOMATIC" | "MILITARY" | "PUBLIC_OPINION" }
      ],
      "conflictIndex": {
        "totalScore": 0.0, // Calculated Total_Risk
        "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        "riskMultiplier": { "value": 1.0, "reason": "Explanation of multiplier" },
        "indices": {
          "taiwanStrait": 0.0, // Score 0-10
          "eastChinaSea": 0.0, // Score 0-10
          "sinoUsRelation": 0.0, // Score 0-10
          "internalPolitics": 0.0, // Score 0-10
          "thirdParty": 0.0 // Score 0-10
        },
        "drivers": ["<p>Key driver 1...</p>", "<p>Key driver 2...</p>"],
        "mitigators": ["<p>Key mitigator 1...</p>", "<p>Key mitigator 2...</p>"]
      },
      "impulseAnalysis": "<p>Analysis of leadership impulse vs rationality...</p>",
      "impulseProbability": 0, // Integer 0-100
      "strategicAnalysis": "<p>Confirmation of militarization intent...</p>",
      "futurePrediction": "<p>Prediction of conflict trajectory...</p>",
      "surpriseAttackAnalysis": "<h3>Feasibility Analysis</h3><p>...</p>",
      "potentialTargets": ["Target 1", "Target 2"]
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
