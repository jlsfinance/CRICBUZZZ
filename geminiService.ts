
import { GoogleGenAI, Type } from "@google/genai";

// Generate professional commentary using gemini-3-flash-preview
export async function getAICommentary(matchData: any, language: string = "English") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let promptLanguage = "English";
  let persona = "Harsha Bhogle for English";
  
  if (language === "Hindi") {
    promptLanguage = "Hindi (Devanagari script)";
    persona = "Aakash Chopra or Vivek Razdan";
  } else if (language === "Gujarati") {
    promptLanguage = "Gujarati";
    persona = "a passionate Gujarati cricket commentator";
  } else if (language === "Tamil") {
    promptLanguage = "Tamil";
    persona = "Kris Srikkanth";
  } else if (language === "Urdu") {
    promptLanguage = "Urdu";
    persona = "Ramiz Raja";
  }

  // Detect if this is a detailed ball event or a general match summary
  const isBallEvent = matchData.shotType || matchData.wicketType;
  
  let prompt = "";

  if (isBallEvent) {
      prompt = `
      Act as ${persona}. Generate a single, exciting ball-by-ball commentary line in ${promptLanguage}.
      
      Match Context:
      - Bowler: ${matchData.bowler || 'The Bowler'}
      - Batter: ${matchData.batter || 'The Batsman'}
      - Shot: ${matchData.shotType} towards ${matchData.shotZone}
      - Runs Scored: ${matchData.runs}
      - Fielder Involved: ${matchData.fielder || 'No fielder'}
      - Event: ${matchData.wicketType ? `WICKET! (${matchData.wicketType})` : matchData.runs === 4 ? 'FOUR Runs' : matchData.runs === 6 ? 'SIX Runs' : 'Standard Delivery'}
      
      Style Guide:
      - Mention the player names clearly.
      - If 4 or 6: Describe the shot execution and the bowler's reaction.
      - If Wicket: Dramatic! Describe how ${matchData.bowler} got ${matchData.batter} out.
      - Keep it succinct (max 30 words).
      `;
  } else {
      prompt = `You are an elite, world-class cricket commentator (like ${persona}). 
      Generate a professional, witty, and high-energy commentary in ${promptLanguage} for this match situation: ${JSON.stringify(matchData)}. 
      
      Instructions:
      1. Use technical cricket terminology appropriate for the language.
      2. Focus on the tactical nuances.
      3. Length: Approx 40-60 words.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Correctly extract text output from response property
    return response.text || "Ball bowled...";
  } catch (error) {
    console.error("AI Commentary Error:", error);
    return "Great delivery! The pressure is building.";
  }
}

// Perform technical analysis with defined schema for consistency using gemini-3-pro-preview for complex reasoning
export async function analyzePlayerSkill(playerInfo: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a legendary cricket scout and coach. Analyze this grassroots talent clip metadata: ${JSON.stringify(playerInfo)}. 
      Assess their technical proficiency across specific dimensions. 
      Provide 0-100 scores for: Power, Technique, Agility, Temperament.
      Identify one "Technical Flaw" and one "Elite Trait".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            power: { type: Type.NUMBER },
            technique: { type: Type.NUMBER },
            agility: { type: Type.NUMBER },
            temperament: { type: Type.NUMBER },
            flaw: { type: Type.STRING },
            trait: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["power", "technique", "agility", "temperament", "flaw", "trait", "summary"]
        }
      }
    });
    
    // Correctly extract text output from response property
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Skill Analysis Error:", error);
    return {
      power: 65,
      technique: 82,
      agility: 70,
      temperament: 90,
      flaw: "Slightly slow on the pull shot",
      trait: "Elite timing through the covers",
      summary: "A classical player with excellent composure. Potentially the next mainstay in the middle order."
    };
  }
}

// Get strategic advice for fantasy team selection using gemini-3-pro-preview for complex reasoning
export async function getAIFantasyAdvice(players: any[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `As an expert cricket analyst, suggest the best possible fantasy XI from these players: ${JSON.stringify(players)}. Include 1 Captain and 1 Vice-Captain recommendation based on statistical probability of high performance.`,
    });
    // Correctly extract text output from response property
    return response.text || "Selection depends on the final toss and pitch report.";
  } catch (error) {
    console.error("AI Fantasy Advice Error:", error);
    return "Check player availability and pitch conditions before finalizing your squad.";
  }
}

// Analyze auction bidding strategy
export async function getAIAuctionInsights(bidData: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this cricket auction bid: ${JSON.stringify(bidData)}. Is it a value buy or an overspend? Give a 2-sentence tactical breakdown from a franchise owner's perspective.`,
    });
    // Correctly extract text output from response property
    return response.text || "Strategic bid placed by the franchise.";
  } catch (error) {
    return "Strategic bid placed by the franchise.";
  }
}
