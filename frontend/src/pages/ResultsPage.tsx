import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  CameraIcon,
  HomeIcon,
  InfoIcon,
  MacroChartIcon,
  PlusIcon,
  ShareIcon,
} from "../components/icons";
import { useUploadStore } from "../store/uploadStore";

type ResultsPageProps = {
  onBack: () => void;
  onNavigate: (nextPath: string) => void;
};

const foodCategories: Record<string, string> = {
  "Grilled Chicken": "Lean Protein",
  "Brown Rice": "Whole Grains",
  "Steamed Broccoli": "Vegetables",
  "Grilled Atlantic Salmon": "Lean Protein",
  "Steamed Asparagus": "Vegetables",
  "Lemon Vinaigrette": "Healthy Fats",
  "Banana": "Fruit",
  "Avocado": "Healthy Fats",
  "Yogurt": "Dairy",
  Lettuce: "Leafy Greens",
  Tomatoes: "Vegetables",
  Cucumber: "Vegetables",
  Carrots: "Root Vegetables",
};

const macroColors = {
  protein: "#9DB89F", // Sage Green
  carbs: "#E8815A",   // Orange
  fat: "#D4A847",     // Amber/Yellow
  fiber: "#7A9EBE",   // Blue
};

const formatNumber = (value: number) => {
  if (Number.isInteger(value)) return `${value}`;
  return value.toFixed(1);
};

export const ResultsPage = ({ onBack, onNavigate }: ResultsPageProps) => {
  const analysis = useUploadStore((state) => state.analysis);
  const [isSaved, setIsSaved] = useState(false);

  const chartData = useMemo(() => {
    if (!analysis) return [];
    return [
      { name: "Protein", value: analysis.macros.protein || 1, color: macroColors.protein },
      { name: "Carbs", value: analysis.macros.carbs || 1, color: macroColors.carbs },
      { name: "Fat", value: analysis.macros.fat || 1, color: macroColors.fat },
    ];
  }, [analysis]);

  const totalMacros = useMemo(() => {
    if (!analysis) return 0;
    return (analysis.macros.protein || 0) + (analysis.macros.carbs || 0) + (analysis.macros.fat || 0);
  }, [analysis]);

  const macroPercentages = useMemo(() => {
    if (totalMacros === 0) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: Math.round(((analysis?.macros.protein || 0) / totalMacros) * 100),
      carbs: Math.round(((analysis?.macros.carbs || 0) / totalMacros) * 100),
      fat: Math.round(((analysis?.macros.fat || 0) / totalMacros) * 100),
    };
  }, [analysis, totalMacros]);

  if (!analysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-bold text-textHeading mb-2">No analysis data</h2>
          <button onClick={onBack} className="bg-primary text-white px-4 py-2 rounded-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const handleSaveToLog = () => {
    setIsSaved(true);
    alert("Saved successfully to log!");
  };

  return (
    <div className="flex-1 min-h-screen bg-background relative overflow-y-auto pb-24">
      {/* Header and Breadcrumb */}
      <header className="px-8 pt-8 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-textMuted mb-6">
          <HomeIcon className="h-3.5 w-3.5" />
          <span className="cursor-pointer hover:text-textHeading" onClick={onBack}>Dashboard</span>
          <span>&gt;</span>
          <span className="text-primary font-bold">Scan Results</span>
        </div>

        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-bold text-textHeading tracking-tight">Scan Results</h1>
            <p className="text-textMuted text-sm mt-1">AI-generated nutritional breakdown of your meal</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSaveToLog}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                isSaved ? "bg-emerald-600 text-white" : "bg-[#9DB89F] hover:bg-[#7A9E7E] text-white"
              }`}
            >
              <span>{isSaved ? "✓ Saved" : "Save to Log"}</span>
            </button>
            <button className="px-5 py-2.5 rounded-full bg-white border border-[#E2E4DC] hover:bg-surfaceAlt text-textHeading text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
              <ShareIcon className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="px-8 py-4 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8">
        
        {/* Left Column: Image and Macro breakdown */}
        <div className="space-y-6">
          
          {/* Scanned Image Card */}
          <div className="relative rounded-[24px] overflow-hidden border border-border bg-white shadow-sm">
            <img 
              src={analysis.imageUrl} 
              alt="Scanned Food" 
              className="w-full h-80 object-cover"
            />
            {/* Translucent Banner */}
            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-[#2C3E2B] flex items-center gap-1.5 shadow-sm">
              <span className="animate-pulse w-2 h-2 rounded-full bg-[#7A9E7E]"></span>
              AI Analysis Active
            </div>
          </div>

          {/* Nutritional Breakdown Card */}
          <section className="bg-white rounded-[24px] border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-textHeading mb-6">Nutritional Breakdown</h2>
            
            {/* Macro Pill Boxes */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              <div className="bg-[#FEF0EB] rounded-2xl p-3 border border-[#FEE2D5] text-center">
                <div className="text-xs font-bold text-[#E8815A]">{formatNumber(analysis.macros.calories)} kcal</div>
              </div>
              <div className="bg-[#EBF2EB] rounded-2xl p-3 border border-[#D4E6D5] text-center">
                <div className="text-xs font-bold text-[#7A9E7E]">{formatNumber(analysis.macros.protein)}g Protein</div>
              </div>
              <div className="bg-[#FEF9EB] rounded-2xl p-3 border border-[#FDF0CD] text-center">
                <div className="text-xs font-bold text-[#D4A847]">{formatNumber(analysis.macros.carbs)}g Carbs</div>
              </div>
              <div className="bg-[#F5F6F1] rounded-2xl p-3 border border-[#E2E4DC] text-center">
                <div className="text-xs font-bold text-textHeading">{formatNumber(analysis.macros.fat)}g Fats</div>
              </div>
            </div>

            {/* Macronutrient Ratio Chart */}
            <div className="text-center font-bold text-xs text-textMuted uppercase tracking-wider mb-4">Macronutrient Ratio</div>
            <div className="flex flex-col md:flex-row items-center justify-around gap-6">
              
              <div className="relative w-44 h-44 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      cx="50%" 
                      cy="50%" 
                      dataKey="value" 
                      innerRadius={50} 
                      outerRadius={75} 
                      paddingAngle={3} 
                      stroke="none"
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-textHeading">{formatNumber(analysis.macros.calories)}</span>
                  <span className="text-[10px] text-textMuted font-bold uppercase">Total kcal</span>
                </div>
              </div>

              {/* Legends with Percentages */}
              <div className="space-y-4 w-full max-w-xs">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#9DB89F]"></span>
                    <span className="text-sm font-semibold text-textHeading">Protein</span>
                  </div>
                  <span className="text-sm font-bold text-textHeading">{macroPercentages.protein}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E8815A]"></span>
                    <span className="text-sm font-semibold text-textHeading">Carbs</span>
                  </div>
                  <span className="text-sm font-bold text-textHeading">{macroPercentages.carbs}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D4A847]"></span>
                    <span className="text-sm font-semibold text-textHeading">Fats</span>
                  </div>
                  <span className="text-sm font-bold text-textHeading">{macroPercentages.fat}%</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Detected Items & Insights */}
        <div className="space-y-6">
          
          {/* Detected Items Card */}
          <section className="bg-white rounded-[24px] border border-border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-textHeading">Detected Items</h2>
              <span className="text-xs font-bold text-[#888888] bg-[#F5F5F0] px-2.5 py-1 rounded-full border border-border">
                {analysis.foods.length} items
              </span>
            </div>

            <div className="space-y-4">
              {analysis.foods.map((food, index) => {
                const category = foodCategories[food.name] ?? "Ingredient";
                const mockWeights = ["180g", "100g", "120g", "15ml"];
                const weight = mockWeights[index % mockWeights.length];
                return (
                  <div key={food.name} className="flex justify-between items-center pb-4 border-b border-[#F5F5F0] last:border-b-0 last:pb-0">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-[#F5F6F1] border border-border flex items-center justify-center font-bold text-xs text-[#7A9E7E]">
                        {food.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-textHeading text-sm capitalize">{food.name}</h4>
                        <p className="text-xs text-[#10B981] font-semibold mt-0.5">{(food.confidence * 100).toFixed(0)}% match</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-textHeading">{weight}</span>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-6 py-2.5 bg-white border border-[#E2E4DC] hover:border-primary text-textMuted hover:text-primary rounded-xl text-xs font-bold transition-all shadow-sm">
              Edit Ingredients
            </button>
          </section>

          {/* NutriTrack Insight Card */}
          <section className="bg-[#EBF2EB] border border-[#D4E6D5] rounded-[24px] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <h3 className="font-bold text-[#2C3E2B] text-base">NutriTrack Insight</h3>
            </div>
            <p className="text-sm text-textBody leading-relaxed">
              This meal is high in Omega-3 fatty acids and lean protein. It covers 65% of your daily Vitamin D requirement.
            </p>
            {/* Advice sub-block */}
            <div className="bg-white rounded-xl p-4 border border-[#D4E6D5]/60 flex items-start gap-2.5">
              <span className="text-base text-yellow-500 mt-0.5">💡</span>
              <p className="text-xs text-textBody leading-relaxed">
                Pair with a glass of water to aid digestion of high-fiber grains.
              </p>
            </div>
          </section>

          {/* Quick Actions Shortcuts */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate("/pantry")}
              className="bg-white hover:bg-surfaceAlt border border-border rounded-2xl p-4 text-center hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#EBF2EB] border border-[#D4E6D5] flex items-center justify-center text-[#7A9E7E]">
                🛒
              </div>
              <span className="text-xs font-bold text-textHeading">Add to Pantry</span>
            </button>
            <button 
              onClick={() => onNavigate("/diet-plan")}
              className="bg-white hover:bg-surfaceAlt border border-border rounded-2xl p-4 text-center hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#FEF9EB] border border-[#FDF0CD] flex items-center justify-center text-[#D4A847]">
                📖
              </div>
              <span className="text-xs font-bold text-textHeading">Similar Recipes</span>
            </button>
          </div>

        </div>
      </main>

      {/* Sticky Action Button for New Scan */}
      <button 
        onClick={onBack}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3.5 bg-[#9DB89F] hover:bg-[#7A9E7E] text-white rounded-full font-bold shadow-lg shadow-[#9DB89F]/30 hover:scale-105 active:scale-95 transition-all z-20"
      >
        <PlusIcon className="w-5 h-5" />
        <span>New Analysis</span>
      </button>
    </div>
  );
};
