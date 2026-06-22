const { callNvidiaNim, extractJsonFromText } = require("../utils/nvidiaNim");

const generateWorkoutPlanWithGemini = async (profile) => {
  const targetGoal = profile.primaryGoal || "General Fitness";
  const activityLevel = profile.activityLevel || "Moderately Active";

  const prompt = `You are a world-class certified personal trainer and fitness expert.
Create a detailed 7-day personalized workout plan for a user with the following profile:
- Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm
- Current Activity Level: ${activityLevel}
- Primary Fitness Goal: ${targetGoal}

Return ONLY a valid JSON array of exactly 7 objects (one for each day, Monday to Sunday). Each day object must exactly follow this schema:
[
  {
    "day": "Monday",
    "focus": "Full Body Strength",
    "durationMins": 45,
    "isRestDay": false,
    "exercises": [
      {
        "name": "Dumbbell Goblet Squats",
        "sets": 3,
        "reps": "10-12",
        "restSecs": 60,
        "notes": "Keep chest up and core tight."
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Active Recovery",
    "durationMins": 30,
    "isRestDay": true,
    "exercises": [
       {
        "name": "Light Yoga or Walking",
        "sets": 1,
        "reps": "30 mins",
        "restSecs": 0,
        "notes": "Focus on stretching and mobility."
      }
    ]
  }
]

Ensure the plan perfectly aligns with their goal (${targetGoal}) and current activity level. If it's a rest day, set isRestDay to true and provide recovery activities.
Do not return any markdown formatting outside of the JSON.`;

  try {
    const textOutput = await callNvidiaNim(prompt);
    return extractJsonFromText(textOutput);
  } catch (error) {
    console.error("Nvidia NIM Workout Plan Error:", error);
    throw new Error("Failed to generate workout plan");
  }
};

module.exports = { generateWorkoutPlanWithGemini };
