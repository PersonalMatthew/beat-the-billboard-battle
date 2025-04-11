
import { useState, useEffect } from "react";
import ArtistCard from "@/components/ArtistCard";
import ScoreDisplay from "@/components/ScoreDisplay";
import GameOverScreen from "@/components/GameOverScreen";
import { Artist } from "@/utils/mockData";
import { getArtistPair, checkGuess, saveHighScore, getHighScore, isSpotifyAuthorized } from "@/utils/gameLogic";
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
  const [spotifyConnected, setSpotifyConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  
  // Initialize the game
  useEffect(() => {
    const spotifyStatus = isSpotifyAuthorized();
    setSpotifyConnected(spotifyStatus);
    startNewRound();
    
    // Display toast about data source
    if (spotifyStatus) {
      toast({
        title: "Connected to Spotify",
        description: "Using real artist data from Spotify API!",
        variant: "default",
      });
    } else {
      toast({
        title: "Using mock data",
        description: "Connect Spotify API in settings for real-time data.",
        variant: "destructive",
      });
    }
  }, []);

  // Start a new round - passing the current score for difficulty adjustment
  const startNewRound = async () => {
    setLoading(true);
    setLoadAttempts(prev => prev + 1);
    
    try {
      // Pass the current score to getArtistPair for difficulty adjustment
      const newArtistPair = await getArtistPair(score);
      
      // Validate the artist data
      if (newArtistPair[0].name && newArtistPair[1].name) {
        setArtists(newArtistPair);
        setRevealed(false);
        setSelectedArtist(null);
        setIsCorrect(null);
        setLoading(false);
      } else {
        // If we get invalid data, try again (up to 3 times)
        if (loadAttempts < 3) {
          console.log("Received invalid artist data, retrying...");
          startNewRound();
        } else {
          console.error("Failed to load valid artist data after multiple attempts");
          toast({
            title: "Data Loading Error",
            description: "Could not load artist data. Please try again later.",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error getting artist pair:", error);
      toast({
        title: "Error",
        description: "There was a problem loading artists.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Handle user guess
  const handleSelectArtist = (selected: Artist, other: Artist) => {
    // Prevent multiple selections
    if (selectedArtist || loading) return;
    
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
        setLoadAttempts(0); // Reset load attempts counter
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
    setLoadAttempts(0); // Reset load attempts counter
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
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-between p-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
        <p className="text-white text-lg mb-8 text-center max-w-2xl">
          Guess which artist has more monthly Spotify listeners. How far can you go?
        </p>
        
        <ScoreDisplay currentScore={score} />
        
        {loading ? (
          <div className="flex items-center justify-center w-full py-20">
            <div className="animate-spin w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full"></div>
          </div>
        ) : (
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
        )}
        
        <div className="text-center text-white/70 text-sm mb-8">
          <p>Who has more monthly listeners on Spotify?</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-4 text-center text-white/50 text-sm mt-auto">
        <p>By PersonalMatthew 2025</p>
      </footer>
    </div>
  );
};

export default Index;
