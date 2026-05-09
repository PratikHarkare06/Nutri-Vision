import { SparklesIcon, BoltIcon, FireIcon } from "./icons";

type GamificationWidgetProps = {
  xp: number;
  level: number;
  badges: string[];
};

export const GamificationWidget = ({ xp, level, badges }: GamificationWidgetProps) => {
  // Calculate progress to next level
  // Level 1: 0-100, Level 2: 100-400, Level 3: 400-900, etc. (xp = (level-1)^2 * 100)
  const currentLevelXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = Math.pow(level, 2) * 100;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const xpGainedInLevel = xp - currentLevelXp;
  const progressPercent = Math.min(100, Math.max(0, (xpGainedInLevel / xpNeeded) * 100));

  return (
    <div className="bg-panel border border-panelBorder rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full hover:border-primary/50 transition-colors">
      
      {/* Header: Level & Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
            <span className="text-xl font-black text-primary">{level}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-textMain leading-tight">Nutri Hero</h3>
            <p className="text-sm text-textMuted font-medium">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary flex items-center gap-1 justify-end">
            <BoltIcon className="w-4 h-4" /> {xp} XP
          </div>
          <p className="text-xs text-textMuted mt-1">{nextLevelXp - xp} to next</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-3 w-full bg-background rounded-full overflow-hidden border border-panelBorder">
          <div 
            className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-3">Unlocked Badges</h4>
        {badges.length === 0 ? (
          <div className="text-center p-4 bg-background/50 border border-panelBorder rounded-xl border-dashed">
            <p className="text-sm text-textMuted">Log meals to earn badges!</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {badges.map((badge, idx) => (
              <div 
                key={idx} 
                className="group relative w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center cursor-help hover:scale-110 transition-transform"
              >
                <FireIcon className="w-6 h-6 text-yellow-500" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-textMain text-background text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {badge}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
