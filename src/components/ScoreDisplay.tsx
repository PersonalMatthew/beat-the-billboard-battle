
import { getHighScore } from "@/utils/gameLogic";
import { Music, Trophy, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScoreDisplayProps {
  currentScore: number;
  gameMode?: "daily" | "streak";
  onBackClick?: () => void;
}

const ScoreDisplay = ({ currentScore, gameMode = "streak", onBackClick }: ScoreDisplayProps) => {
  const highScore = getHighScore(gameMode);
  const isDaily = gameMode === "daily";
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-8 w-full">
      {onBackClick && (
        <div className="self-start mb-2">
          <Button 
            variant="ghost" 
            className="text-spotify-green hover:text-white hover:bg-spotify-green/20"
            onClick={onBackClick}
          >
            <ChevronLeft className="mr-1" size={18} />
            Change Mode
          </Button>
        </div>
      )}
    
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center bg-spotify-lightgray px-6 py-3 rounded-full">
          <Music className="mr-2 text-spotify-green" size={24} />
          <div>
            <p className="text-xs text-white/80">{isDaily ? "CURRENT SCORE" : "CURRENT STREAK"}</p>
            <p className="text-2xl font-bold text-white">{currentScore}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-spotify-lightgray px-6 py-3 rounded-full">
          <Trophy className="mr-2 text-spotify-green" size={24} />
          <div>
            <p className="text-xs text-white/80">{isDaily ? "DAILY HIGH SCORE" : "BEST STREAK"}</p>
            <p className="text-2xl font-bold text-white">{highScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
