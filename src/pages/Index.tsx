import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import ArtistCard from "@/components/ArtistCard";
import ScoreDisplay from "@/components/ScoreDisplay";
import GameOverScreen from "@/components/GameOverScreen";
import GameModeSelector from "@/components/GameModeSelector";
import { Artist } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { 
  getArtistPair, 
  checkGuess, 
  saveHighScore, 
  getHighScore, 
  isSpotifyAuthorized,
  getDailyCompletionStatus,
  markDailyAsCompleted,
  prefetchDailyArtists
} from "@/utils/gameLogic";
import { useToast } from "@/hooks/use-toast";
import SpotifyConfig from "@/components/SpotifyConfig";

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
  const [gameMode, setGameMode] = useState<"daily" | "streak" | null>(null);
  const [dailyPairIndex, setDailyPairIndex] = useState<number>(0);
  const [dailyCompleted, setDailyCompleted] = useState<boolean>(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  
  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    const spotifyStatus = isSpotifyAuthorized();
    setSpotifyConnected(spotifyStatus);
    
    if (spotifyStatus) {
      prefetchDailyArtists().catch(err => console.error("Failed to prefetch:", err));
      
      const isCompleted = getDailyCompletionStatus();
      setDailyCompleted(isCompleted);
      
      const storedMode = localStorage.getItem('selectedGameMode');
      if (storedMode === "daily" || storedMode === "streak") {
        setGameMode(storedMode);
        startNewRound(storedMode);
      }
    }
  }, []);

  const startNewRound = async (mode: "daily" | "streak" = "streak") => {
    if (!isSpotifyAuthorized()) {
      toast({
        title: "Spotify Connection Required",
        description: "Please connect to Spotify to play the game.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setLoadAttempts(prev => prev + 1);
    
    try {
      let newArtistPair;
      if (mode === "daily") {
        newArtistPair = await getArtistPair(score, "daily", dailyPairIndex);
      } else {
        newArtistPair = await getArtistPair(score, "streak");
      }
      
      if (newArtistPair[0].name && newArtistPair[1].name) {
        setArtists(newArtistPair);
        setRevealed(false);
        setSelectedArtist(null);
        setIsCorrect(null);
        setLoading(false);
      } else {
        if (loadAttempts < 3) {
          console.log("Received invalid artist data, retrying...");
          startNewRound(mode);
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
        title: "Spotify Authentication Required",
        description: "Please connect your Spotify account to play.",
        variant: "destructive",
      });
      setLoading(false);
      setGameMode(null);
    }
  };

  const handleSelectMode = (mode: "daily" | "streak") => {
    if (!isSpotifyAuthorized()) {
      toast({
        title: "Spotify Connection Required",
        description: "Please connect to Spotify to play the game.",
        variant: "destructive",
      });
      return;
    }
    
    setGameMode(mode);
    setScore(0);
    setGameOver(false);
    setDailyPairIndex(0);
    localStorage.setItem('selectedGameMode', mode);
    startNewRound(mode);
  };

  const handleSpotifyConnected = () => {
    setSpotifyConnected(true);
    toast({
      title: "Spotify Connected",
      description: "Successfully connected to Spotify API!",
    });
    
    const storedMode = localStorage.getItem('selectedGameMode') as "daily" | "streak" | null;
    if (storedMode) {
      setGameMode(storedMode);
      startNewRound(storedMode);
    }
  };

  const handleBackToModeSelect = () => {
    setGameMode(null);
    localStorage.removeItem('selectedGameMode');
  };

  const handleSelectArtist = (selected: Artist, other: Artist) => {
    if (selectedArtist || loading) return;
    
    setSelectedArtist(selected);
    setRevealed(true);
    
    const correct = checkGuess(selected, other);
    setIsCorrect(correct);
    
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      
      toast({
        title: "Correct!",
        description: "You guessed right!",
        variant: "default",
      });
      
      if (gameMode === "daily") {
        const newIndex = dailyPairIndex + 1;
        setDailyPairIndex(newIndex);
        
        if (newIndex >= 10) {
          saveHighScore(newScore, "daily");
          markDailyAsCompleted();
          setDailyCompleted(true);
          
          setTimeout(() => {
            setGameOver(true);
          }, 2000);
        } else {
          setTimeout(() => {
            setLoadAttempts(0);
            startNewRound("daily");
          }, 2000);
        }
      } else {
        setTimeout(() => {
          setLoadAttempts(0);
          startNewRound("streak");
        }, 2000);
      }
    } else {
      setCorrectArtist(other);
      setWrongArtist(selected);
      
      saveHighScore(score, gameMode || "streak");
      
      setTimeout(() => {
        setGameOver(true);
      }, 2000);
    }
  };

  const handlePlayAgain = () => {
    setScore(0);
    setGameOver(false);
    setDailyPairIndex(0);
    setLoadAttempts(0);
    
    if (gameMode === "daily" && dailyCompleted) {
      setGameMode(null);
    } else {
      startNewRound(gameMode || "streak");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    window.location.href = "/login";
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!spotifyConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-between p-4">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
          <p className="text-white text-lg mb-8 text-center max-w-2xl">
            Connecting to Spotify API...
          </p>
          
          <div className="w-full max-w-md mx-auto bg-spotify-darkgray p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-spotify-green mb-4">Connecting to Spotify API</h2>
            <p className="text-white mb-6">
              Please wait while we connect to the Spotify API to fetch artist data...
            </p>
            <SpotifyConfig onAuthenticated={() => setSpotifyConnected(true)} />
          </div>
        </div>
        
        <footer className="w-full py-4 text-center text-white/50 text-sm mt-auto">
          <p>By PersonalMatthew 2025</p>
        </footer>
      </div>
    );
  }

  if (gameMode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-between p-4">
        <div className="flex w-full justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Welcome, {user.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/config">
              <Button size="sm" variant="ghost" className="text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button size="sm" variant="ghost" className="text-white" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col items-center">
          <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
          <p className="text-white text-lg mb-8 text-center max-w-2xl">
            Guess which artist has more monthly Spotify listeners. How far can you go?
          </p>
          
          <GameModeSelector onSelectMode={handleSelectMode} />
        </div>
        
        <footer className="w-full py-4 text-center text-white/50 text-sm mt-auto">
          <p>By PersonalMatthew 2025</p>
        </footer>
      </div>
    );
  }

  if (gameOver) {
    return (
      <GameOverScreen
        score={score}
        highScore={getHighScore(gameMode)}
        wrongArtist={{ 
          name: wrongArtist?.name || "", 
          monthlyListeners: wrongArtist?.monthlyListeners || 0 
        }}
        correctArtist={{ 
          name: correctArtist?.name || "", 
          monthlyListeners: correctArtist?.monthlyListeners || 0 
        }}
        onPlayAgain={handlePlayAgain}
        gameMode={gameMode}
        isDailyCompleted={gameMode === "daily" && dailyCompleted}
        dailyProgress={dailyPairIndex}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray flex flex-col items-center justify-between p-4">
      <div className="flex w-full justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">Welcome, {user.username}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/config">
            <Button size="sm" variant="ghost" className="text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <Button size="sm" variant="ghost" className="text-white" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold text-spotify-green mb-4 mt-8">Beat The Billboard Battle</h1>
        <p className="text-white text-lg mb-8 text-center max-w-2xl">
          Guess which artist has more monthly Spotify listeners. How far can you go?
        </p>
        
        <div className="mb-4">
          <span className="px-3 py-1 bg-spotify-green/20 text-spotify-green rounded-full text-sm font-medium">
            {gameMode === "daily" ? `Daily Challenge: ${dailyPairIndex + 1}/10` : "Streak Mode"}
          </span>
        </div>
        
        <ScoreDisplay 
          currentScore={score} 
          gameMode={gameMode} 
          onBackClick={handleBackToModeSelect}
        />
        
        {loading ? (
          <div className="flex items-center justify-center w-full py-20">
            <div className="animate-spin w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-6xl gap-6 mb-10">
            <ArtistCard 
              artist={artists[0]} 
              onSelect={() => handleSelectArtist(artists[0], artists[1])} 
              revealed={revealed}
              isCorrect={selectedArtist?.id === artists[0].id ? isCorrect : null}
            />
            
            <div className="flex flex-col items-center justify-center my-4 md:my-0">
              <div className="bg-spotify-green/20 p-6 rounded-full">
                <span className="vs-text text-4xl font-bold text-spotify-green">VS</span>
              </div>
            </div>
            
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
      
      <footer className="w-full py-4 text-center text-white/50 text-sm mt-auto">
        <p>By PersonalMatthew 2025</p>
      </footer>
    </div>
  );
};

export default Index;
