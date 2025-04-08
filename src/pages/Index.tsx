
import { useState, useEffect } from "react";
import ArtistCard from "@/components/ArtistCard";
import ScoreDisplay from "@/components/ScoreDisplay";
import GameOverScreen from "@/components/GameOverScreen";
import { Artist } from "@/utils/mockData";
import { getArtistPair, checkGuess, saveHighScore, getHighScore } from "@/utils/gameLogic";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [artists, setArtists] = useState<[Artist, Artist]>([{} as Artist, {} as Artist]);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [correctArtist, setCorrectArtist] = useState<Artist | null>(null);
  const [wrongArtist, setWrongArtist] = useState<Artist | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Initialize the game
  useEffect(() => {
    startNewRound();
  }, []);

  // Start a new round
  const startNewRound = () => {
    const newArtistPair = getArtistPair();
    setArtists(newArtistPair);
    setRevealed(false);
    setSelectedArtist(null);
    setIsCorrect(null);
  };

  // Handle user guess
  const handleSelectArtist = (selected: Artist, other: Artist) => {
    // Prevent multiple selections
    if (selectedArtist) return;
    
    setSelectedArtist(selected);
    setRevealed(true);
    
    const correct = checkGuess(selected, other);
    setIsCorrect(correct);
    
    if (correct) {
      // Correct guess
      const newScore = score + 1;
      setScore(newScore);
      
      // Show success toast
      toast({
        title: "Correct!",
        description: "You guessed right!",
        variant: "default",
      });
      
      // Schedule next round
      setTimeout(() => {
        startNewRound();
      }, 2000);
    } else {
      // Wrong guess - game over
      setCorrectArtist(other);
      setWrongArtist(selected);
      
      // Save high score
      saveHighScore(score);
      
      // Show game over after a delay
      setTimeout(() => {
        setGameOver(true);
      }, 2000);
    }
  };

  // Reset the game
  const handlePlayAgain = () => {
    setScore(0);
    setGameOver(false);
    startNewRound();
  };

  // Display game over screen if game is over
  if (gameOver) {
    return (
      <GameOverScreen
        score={score}
        highScore={getHighScore()}
        wrongArtist={{ 
          name: wrongArtist?.name || "", 
          monthlyListeners: wrongArtist?.monthlyListeners || 0 
        }}
        correctArtist={{ 
          name: correctArtist?.name || "", 
          monthlyListeners: correctArtist?.monthlyListeners || 0 
        }}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  // Display the main game
  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
      <p className="text-white text-lg mb-8 text-center max-w-2xl">
        Guess which artist has more monthly Spotify listeners. How far can you go?
      </p>
      
      <ScoreDisplay currentScore={score} />
      
      <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-6xl gap-6 mb-10">
        {/* First Artist */}
        <ArtistCard 
          artist={artists[0]} 
          onSelect={() => handleSelectArtist(artists[0], artists[1])} 
          revealed={revealed}
          isCorrect={selectedArtist?.id === artists[0].id ? isCorrect : null}
        />
        
        {/* VS Display */}
        <div className="flex flex-col items-center justify-center my-4 md:my-0">
          <div className="bg-spotify-green/20 p-6 rounded-full">
            <span className="vs-text text-4xl font-bold text-spotify-green">VS</span>
          </div>
        </div>
        
        {/* Second Artist */}
        <ArtistCard 
          artist={artists[1]} 
          onSelect={() => handleSelectArtist(artists[1], artists[0])} 
          revealed={revealed}
          isCorrect={selectedArtist?.id === artists[1].id ? isCorrect : null}
        />
      </div>
      
      <div className="text-center text-white/70 text-sm mb-8">
        <p>Who has more monthly listeners on Spotify?</p>
      </div>
    </div>
  );
};

export default Index;
