import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, UserContext, Language, CarbonStats, ServiceType } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenerativeAI(process.env.API_KEY || '');

// Helper to generate granular breakdown
const generateCarbonBreakdown = (type: string, totalEmission: number): CarbonStats => {
  const energy = totalEmission / 0.82;
  const saved = type === 'website' ? 15000 : 
                type === 'design' ? 5000 : 
                type === 'scheme' ? 5000 : 
                type === 'market' ? 3000 :
                type === 'inventory' ? 200 :
                type === 'invoice' ? 100 : 
                10;

  let breakdown = [];

  if (type === 'design') {
    breakdown = [
      { step: "Prompt Analysis", emission: totalEmission * 0.1, energy: energy * 0.1 },
      { step: "Image Generation Model", emission: totalEmission * 0.7, energy: energy * 0.7 },
      { step: "Rendering & Processing", emission: totalEmission * 0.2, energy: energy * 0.2 }
    ];
  } else if (type === 'website') {
    breakdown = [
      { step: "Structure Planning", emission: totalEmission * 0.15, energy: energy * 0.15 },
      { step: "Content Generation", emission: totalEmission * 0.35, energy: energy * 0.35 },
      { step: "Layout Optimization", emission: totalEmission * 0.30, energy: energy * 0.30 },
      { step: "Code Synthesis", emission: totalEmission * 0.20, energy: energy * 0.20 }
    ];
  } else if (type === 'scheme') {
    breakdown = [
      { step: "Query Parsing", emission: totalEmission * 0.1, energy: energy * 0.1 },
      { step: "Database Retrieval", emission: totalEmission * 0.6, energy: energy * 0.6 },
      { step: "Relevance Filtering", emission: totalEmission * 0.3, energy: energy * 0.3 }
    ];
  } else if (type === 'market') {
    breakdown = [
      { step: "Location Analysis", emission: totalEmission * 0.1, energy: energy * 0.1 },
      { step: "Commodity Retrieval", emission: totalEmission * 0.7, energy: energy * 0.7 },
      { step: "Trend Calculation", emission: totalEmission * 0.2, energy: energy * 0.2 }
    ];
  } else if (type === 'inventory') {
    breakdown = [
      { step: "Database Sync", emission: totalEmission * 0.3, energy: energy * 0.3 },
      { step: "Level Computation", emission: totalEmission * 0.5, energy: energy * 0.5 },
      { step: "UI Update", emission: totalEmission * 0.2, energy: energy * 0.2 }
    ];
  } else {
    // Chat / Default
    breakdown = [
      { step: "Context Loading", emission: totalEmission * 0.2, energy: energy * 0.2 },
      { step: "LLM Inference", emission: totalEmission * 0.6, energy: energy * 0.6 },
      { step: "Response Formatting", emission: totalEmission * 0.2, energy: energy * 0.2 }
    ];
  }

  return {
    emission: totalEmission,
    saved,
    energy,
    breakdown,
    idleEmission: 0,
    activeEmission: totalEmission,
    idleTime: 0
  };
};

export const sendMessageToGemini = async (
  history: Message[],
  userInput: string,
  context: UserContext,
  image?: string // Base64 Data URL (e.g., data:image/jpeg;base64,...)
): Promise<any> => {
  try {
    const model = 'gemini-3-flash-preview'; 
    
    // Map language code to name
    const languageNameMap: Record<string, string> = {
      'en-US': 'English',
      'hi-IN': 'Hindi',
      'ta-IN': 'Tamil',
      'bn-IN': 'Bengali',
      'te-IN': 'Telugu',
      'mr-IN': 'Marathi',
      'gu-IN': 'Gujarati',
      'pa-IN': 'Punjabi',
      'kn-IN': 'Kannada',
      'ml-IN': 'Malayalam',
      'or-IN': 'Odia',
      'as-IN': 'Assamese',
      'ur-IN': 'Urdu',
      'ne-NP': 'Nepali',
      'sa-IN': 'Sanskrit'
    };
    
    const langName = languageNameMap[context.language] || 'English';

    // Construct the context-aware prompt
    const contextPrompt = `
      Current User Context:
      Language: ${context.language} (${langName})
      Business: ${context.businessName} (${context.businessType})
      Location: ${context.location}
      
      User Input: "${userInput}"
    `;

    // Filter history for context window (last 6 messages)
    const recentHistory = history.slice(-6).map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));

    // Construct user message part
    const userParts: any[] = [{ text: contextPrompt }];

    // If image is provided, strip metadata and add to parts
    if (image) {
      // Expecting data:image/jpeg;base64,XXXXX
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      
      if (base64Data && mimeType) {
        userParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
    }

    // Inject selected_language variable into system instruction
    const dynamicSystemInstruction = `
      ${SYSTEM_INSTRUCTION}
      
      CURRENT SESSION SETTINGS:
      selected_language = "${langName}"
    `;

    // We use generateContent with JSON mode implicitly via system instruction
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...recentHistory,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: dynamicSystemInstruction,
        responseMimeType: "application/json",
        // We use a lower temperature for consistent structured data
        temperature: 0.4,
      }
    });

    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    try {
      const parsed = JSON.parse(responseText);
      
      // Enhance with granular carbon breakdown
      // Use the emission value from LLM if reasonable, else default based on type
      let emission = parsed.carbon?.emission || 0.2;
      
      // Enforce realistic minimums for complex tasks
      if (parsed.type === 'website' && emission < 2.0) emission = 2.5;
      if (parsed.type === 'design' && emission < 1.0) emission = 1.5;
      if (parsed.type === 'market' && emission < 0.4) emission = 0.4;
      
      const enhancedCarbon = generateCarbonBreakdown(parsed.type || 'chat', emission);
      
      return {
        ...parsed,
        carbon: enhancedCarbon
      };

    } catch (e) {
      console.error("Failed to parse JSON from Gemini", responseText);
      // Fallback if model fails to output JSON
      return {
        text: responseText,
        type: 'chat',
        data: {},
        carbon: generateCarbonBreakdown('chat', 0.2)
      };
    }

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
