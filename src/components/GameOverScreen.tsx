
import { formatNumber } from "@/utils/gameLogic";
import { Button } from "./ui/button";
import { Music, Trophy, Calendar, Repeat } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  wrongArtist: {
    name: string;
    monthlyListeners: number;
  };
  correctArtist: {
    name: string;
    monthlyListeners: number;
  };
  onPlayAgain: () => void;
  gameMode?: "daily" | "streak";
  isDailyCompleted?: boolean;
  dailyProgress?: number;
}

const GameOverScreen = ({ 
  score, 
  highScore, 
  wrongArtist, 
  correctArtist, 
  onPlayAgain,
  gameMode = "streak",
  isDailyCompleted = false,
  dailyProgress = 0
}: GameOverScreenProps) => {
  const isDaily = gameMode === "daily";
  const completedAll = isDaily && dailyProgress >= 10;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-spotify-lightgray rounded-xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-spotify-green mb-4">Game Over</h1>
        
        {/* Game mode badge */}
        <div className="mb-4">
          {isDaily ? (
            <span className="inline-flex items-center px-3 py-1 bg-spotify-green/20 text-spotify-green rounded-full text-sm font-medium">
              <Calendar size={16} className="mr-1" />
              Daily Challenge {isDailyCompleted ? "Completed" : `${dailyProgress}/10`}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 bg-spotify-green/20 text-spotify-green rounded-full text-sm font-medium">
              <Repeat size={16} className="mr-1" />
              Streak Mode
            </span>
          )}
        </div>
        
        {/* Score display */}
        <div className="flex items-center my-6">
          <Music className="text-spotify-green mr-3" size={32} />
          <div>
            <p className="text-xs text-white/80">{isDaily ? "DAILY SCORE" : "YOUR STREAK"}</p>
            <p className="text-4xl font-bold text-white">{score}</p>
          </div>
        </div>
        
        {/* High score */}
        <div className="flex items-center mb-8">
          <Trophy className="text-yellow-500 mr-3" size={32} />
          <div>
            <p className="text-xs text-white/80">{isDaily ? "DAILY HIGH SCORE" : "BEST STREAK"}</p>
            <p className="text-3xl font-bold text-white">{highScore}</p>
          </div>
        </div>
        
        {/* Result comparison */}
        <div className="w-full bg-spotify-black/40 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">The Answer Was:</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-md bg-red-900/30 border border-red-700/30">
              <p className="text-sm text-white/80">Your Pick</p>
              <p className="font-bold text-white mb-1">{wrongArtist.name}</p>
              <p className="text-sm text-white/60">{formatNumber(wrongArtist.monthlyListeners)} listeners</p>
            </div>
            
            <div className="text-center p-3 rounded-md bg-green-900/30 border border-green-700/30">
              <p className="text-sm text-white/80">Correct Answer</p>
              <p className="font-bold text-white mb-1">{correctArtist.name}</p>
              <p className="text-sm text-white/60">{formatNumber(correctArtist.monthlyListeners)} listeners</p>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="w-full">
          <Button 
            onClick={onPlayAgain} 
            className="w-full bg-spotify-green hover:bg-spotify-green/80 text-black font-bold py-3"
          >
            {isDaily && isDailyCompleted ? "Change Mode" : "Play Again"}
          </Button>
          
          {isDaily && isDailyCompleted && (
            <div className="mt-4 text-center text-sm text-white/60">
              <p>You've completed today's challenge!</p>
              <p>Come back tomorrow for a new one.</p>
            </div>
          )}
          
          {!isDaily && (
            <p className="text-center text-sm text-white/60 mt-3">
              Keep practicing to beat your high score!
            </p>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-4 text-center text-white/50 text-sm mt-8">
        <p>By PersonalMatthew 2025</p>
      </footer>
    </div>
  );
};

export default GameOverScreen;
