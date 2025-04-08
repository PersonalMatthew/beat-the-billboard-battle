
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/gameLogic";
import { X, Music } from "lucide-react";

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
}

const GameOverScreen = ({ 
  score, 
  highScore, 
  wrongArtist, 
  correctArtist, 
  onPlayAgain 
}: GameOverScreenProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-10 px-6 bg-spotify-black rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 mb-6">
        <X size={32} className="text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
      
      <p className="text-lg text-white/80 mb-6 text-center">
        Your streak has ended at <span className="text-spotify-green font-bold">{score}</span> correct guesses.
      </p>
      
      <div className="w-full max-w-md bg-spotify-lightgray rounded-lg p-6 mb-6">
        <p className="text-center text-white/80 mb-4">
          <span className="font-bold text-white">{wrongArtist.name}</span> has{" "}
          <span className="text-red-400 font-bold">{formatNumber(wrongArtist.monthlyListeners)}</span> monthly listeners.
        </p>
        
        <p className="text-center text-white/80">
          <span className="font-bold text-white">{correctArtist.name}</span> has{" "}
          <span className="text-green-400 font-bold">{formatNumber(correctArtist.monthlyListeners)}</span> monthly listeners.
        </p>
      </div>
      
      <div className="flex items-center mb-8 bg-spotify-lightgray px-6 py-3 rounded-full">
        <Music className="mr-2 text-spotify-green" size={24} />
        <div>
          <p className="text-xs text-white/80">HIGH SCORE</p>
          <p className="text-2xl font-bold text-white">{highScore}</p>
        </div>
      </div>
      
      <Button 
        onClick={onPlayAgain}
        className="bg-spotify-green hover:bg-spotify-green/80 text-white font-bold py-3 px-8 rounded-full"
      >
        Play Again
      </Button>
    </div>
  );
};

export default GameOverScreen;
