
import { getHighScore } from "@/utils/gameLogic";
import { Music } from "lucide-react";

interface ScoreDisplayProps {
  currentScore: number;
}

const ScoreDisplay = ({ currentScore }: ScoreDisplayProps) => {
  const highScore = getHighScore();
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
      <div className="flex items-center bg-spotify-lightgray px-6 py-3 rounded-full">
        <Music className="mr-2 text-spotify-green" size={24} />
        <div>
          <p className="text-xs text-white/80">CURRENT STREAK</p>
          <p className="text-2xl font-bold text-white">{currentScore}</p>
        </div>
      </div>
      
      <div className="flex items-center bg-spotify-lightgray px-6 py-3 rounded-full">
        <svg className="mr-2 text-spotify-green" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15L8.5 8L15.5 8L12 15Z" fill="currentColor" />
          <path d="M6 16H18M12 3V5M12 15L15.5 8H8.5L12 15ZM12 15V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="text-xs text-white/80">HIGH SCORE</p>
          <p className="text-2xl font-bold text-white">{highScore}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
