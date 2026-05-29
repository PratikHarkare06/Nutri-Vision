import { HistoryIcon, LogoIcon, ProfileIcon } from "./icons";

type AppHeaderProps = {
  currentPath: string;
  onNavigate: (nextPath: string) => void;
};

export const AppHeader = ({ onNavigate }: AppHeaderProps) => (
  <header className="h-[72px] border-b border-panelBorder bg-background px-8 flex-shrink-0 z-10 sticky top-0">
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate("/")}
      >
        <div className="bg-primary p-1.5 rounded-md flex items-center justify-center">
          <LogoIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          NutriVision
        </span>
      </div>
      
      <nav className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("/history")}
          className="text-textMuted hover:text-white transition-colors"
        >
          <HistoryIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onNavigate("/profile")}
          className="text-textMuted hover:text-white transition-colors"
        >
          <ProfileIcon className="h-6 w-6" />
        </button>
      </nav>
    </div>
  </header>
);
