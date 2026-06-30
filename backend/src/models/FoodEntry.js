const mongoose = require("mongoose");

const foodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    foods: [
      {
        confidence: {
          type: Number,
        },
        name: {
          trim: true,
          type: String,
        },
      },
    ],
    image_url: {
      required: true,
      trim: true,
      type: String,
    },
    calories: {
      type: Number,
    },
    protein: {
      type: Number,
    },
    carbs: {
      type: Number,
    },
    fat: {
      type: Number,
    },
    fiber: {
      type: Number,
    },
    volume: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    ingredients_macros: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    mealType: { type: String, default: "unknown" },
    mealCategory: { type: String, default: "meal" },
    volumeSource: { type: String, default: "density" },
  },
  {
    collection: "food_entries",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  },
);

const FoodEntry =
  mongoose.models.FoodEntry || mongoose.model("FoodEntry", foodEntrySchema);

const mapFoodEntryToAnalysis = (entry, req) => {
  let imageUrl = entry.image_url;
  if (req && imageUrl) {
    const uploadsIndex = imageUrl.indexOf("/uploads/");
    if (uploadsIndex !== -1) {
      const filename = imageUrl.slice(uploadsIndex + 9);
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      imageUrl = `${protocol}://${host}/uploads/${filename}`;
    }
  }

  // Calculate dynamic confidence interval
  const totalCalories = entry.calories ?? 0;
  const foodsList = entry.foods || [];
  let weightedConfidence = 0.85; // Default base confidence

  if (foodsList.length > 0) {
    let confidenceSum = 0;
    let counts = 0;
    foodsList.forEach(f => {
      if (typeof f.confidence === "number") {
        confidenceSum += f.confidence;
        counts++;
      }
    });
    if (counts > 0) {
      weightedConfidence = confidenceSum / counts;
    }
  }

  // Range percentage between 12% and 25% based on confidence
  const rangePercentage = 0.25 - (weightedConfidence * 0.13);
  const minCalories = Math.max(0, Math.round(totalCalories * (1 - rangePercentage)));
  const maxCalories = Math.round(totalCalories * (1 + rangePercentage));

  return {
    createdAt: entry.created_at || entry.createdAt,
    foods: entry.foods || [],
    id: entry._id ? entry._id.toString() : (entry.id || ""),
    imageUrl: imageUrl,
    macros: {
      calories: totalCalories,
      protein: entry.protein ?? 0,
      carbs: entry.carbs ?? 0,
      fat: entry.fat ?? 0,
      fiber: entry.fiber ?? 0,
    },
    volume: entry.volume ?? 0,
    weight: entry.weight ?? 0,
    ingredientsMacros: entry.ingredients_macros instanceof Map
      ? Object.fromEntries(entry.ingredients_macros)
      : (entry.ingredients_macros || {}),
    mealType: entry.mealType || entry.meal_type || "unknown",
    mealCategory: entry.mealCategory || entry.meal_category || "meal",
    volumeSource: entry.volumeSource || entry.volume_source || "density",
    confidenceRange: {
      min: minCalories,
      max: maxCalories,
      percentage: Math.round(rangePercentage * 100)
    }
  };
};

module.exports = { FoodEntry, mapFoodEntryToAnalysis };
