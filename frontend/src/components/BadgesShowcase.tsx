import React from "react";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  borderColorClass: string;
};

const ALL_BADGES: Badge[] = [
  {
    id: "Workout Warrior",
    name: "Workout Warrior",
    description: "Logged your first workout session using the companion companion timer.",
    icon: "🏋️‍♂️",
    colorClass: "bg-[#FEF0EB] text-[#E8815A]",
    borderColorClass: "border-[#FEE2D5]",
  },
  {
    id: "Fitness Master",
    name: "Fitness Master",
    description: "Reached Level 2 by earning XP from active healthy habits.",
    icon: "🏆",
    colorClass: "bg-[#FEF9EB] text-[#D4A847]",
    borderColorClass: "border-[#F5E6C4]",
  },
  {
    id: "Water Champion",
    name: "Water Champion",
    description: "Logged 3L or more of water intake in a single day.",
    icon: "💧",
    colorClass: "bg-[#EBF2F8] text-[#7A9EBE]",
    borderColorClass: "border-blueLight",
  },
  {
    id: "Pantry Chef",
    name: "Pantry Chef",
    description: "Cooked a recipe matching at least 80% of your pantry items.",
    icon: "🍳",
    colorClass: "bg-[#EBF2EB] text-[#7A9E7E]",
    borderColorClass: "border-[#D4E6D5]",
  },
  {
    id: "Zero-Waste Hero",
    name: "Zero-Waste Hero",
    description: "Generated and cooked an AI Zero-Waste recipe using expiring ingredients.",
    icon: "✨",
    colorClass: "bg-[#FFFCE6] text-[#D4B200]",
    borderColorClass: "border-[#FFE58F]",
  },
  {
    id: "Active Tracker",
    name: "Active Tracker",
    description: "Maintained a 7-day food logging consistency.",
    icon: "🥗",
    colorClass: "bg-[#F2EBF5] text-[#A57ABE]",
    borderColorClass: "border-[#E7D5E6]",
  },
];

type BadgesShowcaseProps = {
  unlockedBadges?: string[];
  xp?: number;
  level?: number;
};

export const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({
  unlockedBadges = [],
  xp = 0,
  level = 1,
}) => {
  const nextLevelThreshold = level * 500;
  const currentLevelBase = (level - 1) * 500;
  const progressInLevel = xp - currentLevelBase;
  const percentComplete = Math.min(100, Math.max(0, (progressInLevel / 500) * 100));

  return (
    <div className="space-y-6">
      {/* Level and XP Progress Summary */}
      <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-bold text-textHeading text-base">Level {level}</h3>
            <p className="text-[11px] text-textMuted font-medium mt-0.5">{xp} Total XP earned</p>
          </div>
          <span className="text-xs font-bold text-primary bg-[#EBF2EB] border border-[#D4E6D5] px-3 py-1 rounded-full">
            {progressInLevel} / 500 XP to Level {level + 1}
          </span>
        </div>
        <div className="w-full bg-[#F5F5F0] h-3 rounded-full overflow-hidden">
          <div 
            className="bg-[#7A9E7E] h-full rounded-full transition-all duration-500" 
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-textHeading text-sm uppercase tracking-wider">Achievements & Badges</h3>
          <p className="text-xs text-textMuted mt-1 leading-relaxed">
            Earn badges by logging meals, completing workouts, and maintaining health streaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id) || (badge.id === "Fitness Master" && level >= 2);
            return (
              <div 
                key={badge.id}
                className={`flex gap-4 p-4 border rounded-2xl transition-all duration-300 ${
                  isUnlocked 
                    ? "bg-white border-border shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md"
                    : "bg-[#FAFBF9] border-border/60 opacity-60 filter grayscale"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-sm ${
                  isUnlocked 
                    ? badge.colorClass + " " + badge.borderColorClass
                    : "bg-[#E2E4DC] border-[#C8CBBC] text-[#888888]"
                }`}>
                  {badge.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-textHeading text-xs truncate">{badge.name}</h4>
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-primary bg-[#EBF2EB] border border-[#D4E6D5] px-1.5 py-0.5 rounded-full">
                        ✓ Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-textMuted bg-[#E2E4DC]/40 border border-[#E2E4DC]/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-textMuted leading-relaxed mt-1">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
