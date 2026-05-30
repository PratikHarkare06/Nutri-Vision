import { useRef, useState } from "react";
import { SparklesIcon, CameraIcon } from "../components/icons";
import { useUploadStore } from "../store/uploadStore";

// Mock data to match mockup screenshot
const mockPantryItems = [
  { name: "Avocados", details: "3 units • Added Oct 22", tag: "Fresh", color: "#EBF2EB", text: "#7A9E7E", icon: "🥑" },
  { name: "Chicken Breast", details: "500g • Added Oct 24", tag: "Low", color: "#FEF0EB", text: "#E8815A", icon: "🍗" },
  { name: "Quinoa", details: "1.2kg • Added Sep 15", tag: "Fresh", color: "#FEF9EB", text: "#D4A847", icon: "🌾" },
  { name: "Greek Yogurt", details: "1 tub • Added Oct 20", tag: "Fresh", color: "#EBF2F8", text: "#7A9EBE", icon: "🥛" },
  { name: "Spinach", details: "100g • Added Oct 25", tag: "Low", color: "#EBF2EB", text: "#7A9E7E", icon: "🥬" },
];

const mockRecipes = [
  { name: "Zesty Quinoa Salad", time: "15 min", match: "90%", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80" },
  { name: "Creamy Chicken & Rice", time: "20 min", match: "85%", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80" },
  { name: "Green Power Smoothie", time: "5 min", match: "100%", img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80" },
];

export const PantryPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<"All" | "Fresh" | "Dry">("All");

  const {
    pantryAnalysis,
    isUploading,
    errorMessage,
    progressMessage,
    uploadPantryImage,
    setPantryAnalysis
  } = useUploadStore();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadPantryImage(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setPantryAnalysis(null);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 min-h-screen bg-background relative overflow-y-auto pb-24 px-8 pt-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textHeading tracking-tight">My Pantry</h1>
          <p className="text-textMuted text-sm mt-1">
            Manage your ingredients and discover recipes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerUpload}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#9DB89F] hover:bg-[#7A9E7E] text-white rounded-full text-xs font-bold transition-all shadow-sm"
          >
            {isUploading ? (
              <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <span className="text-sm font-semibold">+</span>
            )}
            Add Ingredient
          </button>
          
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-border hover:bg-surfaceAlt text-textHeading transition-colors shadow-sm">
            🛒
          </button>
        </div>
      </header>

      {/* Upload/Progress overlay */}
      {isUploading && (
        <div className="max-w-6xl mx-auto w-full mb-6 p-4 rounded-xl bg-[#EBF2EB] border border-[#D4E6D5] text-[#2C3E2B] text-sm font-medium flex items-center gap-3">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <span>{progressMessage || "Analyzing ingredients..."}</span>
        </div>
      )}

      {errorMessage && (
        <div className="max-w-6xl mx-auto w-full mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 mb-8">
        
        {/* Left Column (Current Inventory) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-textHeading">Current Inventory</h2>
            
            {/* Category Pills */}
            <div className="bg-[#E2E4DC]/40 border border-border rounded-full p-1 flex">
              {(["All", "Fresh", "Dry"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                    filter === opt 
                      ? "bg-white text-textHeading shadow-sm" 
                      : "text-textMuted hover:text-textHeading"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Cards Stack */}
          <div className="space-y-3">
            {(pantryAnalysis ? pantryAnalysis.identifiedIngredients.map((ing, i) => ({
              name: ing,
              details: "Added today",
              tag: "Fresh",
              color: "#EBF2EB",
              text: "#7A9E7E",
              icon: "🥬"
            })) : mockPantryItems).map((item) => (
              <div 
                key={item.name} 
                className={`bg-white border rounded-2xl p-4 flex justify-between items-center transition-all duration-300
                  ${item.tag === "Low" 
                    ? "border-[#E8815A]/30 hover:border-[#E8815A]/60 shadow-[0_2px_12px_-3px_rgba(232,129,90,0.08)] hover:shadow-[0_4px_16px_-2px_rgba(232,129,90,0.15)]" 
                    : "border-[#7A9E7E]/30 hover:border-[#7A9E7E]/60 shadow-[0_2px_12px_-3px_rgba(122,158,126,0.08)] hover:shadow-[0_4px_16px_-2px_rgba(122,158,126,0.15)]"
                  }`}
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F6F1] border border-border flex items-center justify-center text-lg select-none">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-textHeading text-sm capitalize">{item.name}</h4>
                    <p className="text-xs text-textMuted mt-0.5">{item.details}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase transition-colors
                  ${item.tag === "Low"
                    ? "bg-[#FEF0EB] text-[#E8815A] border-[#FEF0EB]"
                    : "bg-[#EBF2EB] text-[#7A9E7E] border-[#EBF2EB]"
                  }`}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>

          {/* View All Ingredients Button */}
          <button className="w-full py-2.5 bg-white border border-[#E2E4DC] hover:border-[#7A9E7E] text-textMuted hover:text-[#7A9E7E] rounded-xl text-xs font-bold transition-all shadow-sm">
            View All Ingredients
          </button>
        </div>

        {/* Right Column (Recipe AI suggestions) */}
        <div className="space-y-8">
          
          {/* Recipe AI Header Card */}
          <section className="bg-white rounded-[24px] border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-textHeading">
              <span className="text-lg">✨</span>
              <h3 className="font-bold text-base">Recipe AI</h3>
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              We found {pantryAnalysis ? pantryAnalysis.recipes.length : 12} recipes you can make with your current pantry items.
            </p>
            <button
              onClick={triggerUpload}
              className="w-full py-2.5 bg-[#9DB89F] hover:bg-[#7A9E7E] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Generate New Ideas
            </button>
          </section>

          {/* Top Matches Recipes List */}
          <div>
            <h3 className="text-base font-bold text-textHeading mb-4 uppercase tracking-wider">Top Matches</h3>
            <div className="space-y-4">
              {(pantryAnalysis ? pantryAnalysis.recipes.map((r, idx) => ({
                name: r.name,
                time: r.prepTime,
                match: "95%",
                img: getMealImage(r.name)
              })) : mockRecipes).map((recipe, index) => (
                <div key={index} className="bg-white border border-border rounded-2xl p-3 flex gap-4 hover:shadow-md transition-shadow relative">
                  <img
                    src={recipe.img}
                    alt={recipe.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-textHeading text-sm truncate capitalize">{recipe.name}</h4>
                      <button className="text-textMuted hover:text-rose-500 text-sm">❤️</button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-textMuted mt-1.5 font-semibold">
                      <span>⏱ {recipe.time}</span>
                      <span>•</span>
                      <span className="text-[#10B981]">✓ {recipe.match} match</span>
                    </div>
                    <button 
                      onClick={() => alert(`Recipe details: ${recipe.name}`)}
                      className="text-xs font-bold text-[#7A9E7E] hover:text-[#5C7A60] transition-colors mt-2.5 block text-left"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Summary Strip */}
      <footer className="max-w-6xl mx-auto w-full bg-white rounded-[24px] border border-border p-6 shadow-sm grid grid-cols-3 gap-4 text-center divide-x divide-[#F5F5F0]">
        <div>
          <div className="text-2xl font-extrabold text-textHeading">84%</div>
          <div className="text-xs text-textMuted mt-0.5">Freshness Score</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-textHeading">4</div>
          <div className="text-xs text-textMuted mt-0.5">Items Expiring Soon</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-textHeading">$12.50</div>
          <div className="text-xs text-textMuted mt-0.5">Est. Waste Saved</div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to resolve meal image
const getMealImage = (name: string) => {
  if (name.toLowerCase().includes("salad") || name.toLowerCase().includes("quinoa")) {
    return "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80";
  }
  if (name.toLowerCase().includes("smoothie") || name.toLowerCase().includes("shake")) {
    return "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80";
  }
  return "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80";
};
