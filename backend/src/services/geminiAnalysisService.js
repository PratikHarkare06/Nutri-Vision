const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const crypto = require("crypto");

const analyzeFoodImageWithGemini = async (imagePath, mimeType, imageUrl) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString("base64");

  const prompt = `You are a professional nutritionist and image recognition AI. Analyze this food image and estimate the nutritional content.
Please output ONLY a valid JSON object without any markdown wrapping or additional text.
The JSON must strictly follow this structure:
{
  "foods": [
    {
      "name": "Food Name (e.g., Grilled Chicken, Brown Rice, etc)",
      "confidence": 0.95
    }
  ],
  "macros": {
    "calories": 400,
    "protein": 20,
    "carbs": 30,
    "fat": 15,
    "fiber": 5
  },
  "volume": 200,
  "weight": 250
}
Ensure the estimated weight is in grams (g) and volume is in cubic centimeters (cm³). Confidence should be a float between 0 and 1.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const textOutput = response.text;
    const parsedData = JSON.parse(textOutput);

    // Build final analysis object expected by the rest of the application
    return {
      id: crypto.randomUUID(),
      imageUrl,
      foods: parsedData.foods || [],
      macros: parsedData.macros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      volume: parsedData.volume || 0,
      weight: parsedData.weight || 0,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze food image with Gemini.");
  }
};

const getMealSuggestions = async (remainingCalories, remainingProtein) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are an expert Indian nutritionist. The user has ${remainingCalories} kcal and ${remainingProtein}g of protein left for their daily target.
Suggest 3 specific, realistic Indian meals (or snacks) they can eat right now to hit these targets as closely as possible without going over by more than 10%.
Return a JSON array of 3 objects, each with:
- "name": String (Dish name)
- "description": String (Short 1-sentence appetizing description with portion sizes)
- "calories": Number
- "protein": Number`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Advisor Error:", error);
    return [];
  }
};

const generatePersonalizedDietPlan = async (profile, metrics) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  
  const restrictions = profile.dietary_restrictions?.length ? profile.dietary_restrictions.join(", ") : "None";
  const allergies = profile.food_allergies?.length ? profile.food_allergies.join(", ") : "None";
  const targetCalories = metrics.maintenanceCalories; // Use maintenance or adjust based on a goal if we had one.
  const dietMode = profile.diet_mode || "Balanced";

  const prompt = `You are a world-class Indian nutritionist.
Create a detailed 7-day personalized meal plan for a user with the following profile:
- Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight_kg}kg, Height: ${profile.height_cm}cm
- Activity Level: ${profile.activity_level}
- Target Daily Calories: ~${targetCalories} kcal
- Diet Mode: ${dietMode}
- Dietary Restrictions: ${restrictions}
- Allergies: ${allergies}

Return ONLY a valid JSON array of exactly 7 objects (one for each day, Monday to Sunday). Each day object must exactly follow this schema:
{
  "day": "Monday",
  "totalCalories": 2000,
  "totalProtein": 120,
  "totalCarbs": 200,
  "totalFat": 60,
  "meals": [
    {
      "type": "Breakfast",
      "name": "Oats Idli with Sambar",
      "description": "Healthy oats idli served with protein-rich lentil sambar.",
      "calories": 400,
      "protein": 15,
      "carbs": 60,
      "fat": 10
    },
    // ... exactly 4 meals per day: Breakfast, Lunch, Snack, Dinner
  ]
}

Ensure the daily macros closely sum up to the Target Daily Calories. Make the meals realistic, emphasizing Indian cuisine where appropriate while strictly adhering to the user's Diet Mode and allergies. Do not return anything outside the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt],
      config: { responseMimeType: "application/json" },
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Diet Plan Error:", error);
    throw new Error("Failed to generate diet plan");
  }
};

module.exports = { analyzeFoodImageWithGemini, getMealSuggestions, generatePersonalizedDietPlan };
