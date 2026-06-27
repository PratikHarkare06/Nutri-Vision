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
  return {
    createdAt: entry.created_at,
    foods: entry.foods || [],
    id: entry._id.toString(),
    imageUrl: imageUrl,
    macros: {
      calories: entry.calories ?? 0,
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
    mealType: entry.mealType || "unknown",
    mealCategory: entry.mealCategory || "meal",
    volumeSource: entry.volumeSource || "density",
  };
};

module.exports = { FoodEntry, mapFoodEntryToAnalysis };
