
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import SpotifyConfig from "@/components/SpotifyConfig";
import { isSpotifyAuthorized } from "@/utils/gameLogic";
import { useToast } from "@/hooks/use-toast";

const Config = () => {
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    setIsAuthorized(isSpotifyAuthorized());
  }, []);

  // Handler for when Spotify is connected
  const handleSpotifyConnected = () => {
    setIsAuthorized(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    // Force page refresh to ensure React state is reset
    window.location.href = "/login";
  };
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-spotify-green">Game Configuration</h1>
          <div className="flex items-center gap-4">
            <div className="text-white">
              Logged in as: <span className="font-medium">{user.username}</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
            <Link to="/">
              <Button variant="outline" className="bg-spotify-green/10 text-spotify-green border-spotify-green/30">
                Back to Game
              </Button>
            </Link>
          </div>
        </div>
        
        {isAuthorized && (
          <div className="mb-4 p-3 bg-green-900/40 border border-green-700/50 rounded-md text-green-300">
            <p>✅ Spotify API connected successfully!</p>
          </div>
        )}
        
        <SpotifyConfig onAuthenticated={handleSpotifyConnected} />
        
        <div className="mt-8 bg-spotify-lightgray/20 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-spotify-white mb-2">User Account</h2>
          <p className="text-spotify-white/80 mb-4">
            You are currently logged in as <span className="font-semibold">{user.username}</span>.
          </p>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" /> Logout
            </Button>
          </div>
        </div>
        
        <div className="mt-8 bg-spotify-lightgray/20 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-spotify-white mb-2">How It Works</h2>
          <p className="text-spotify-white/80 mb-4">
            This game uses the Spotify API to fetch real artist data. It automatically connects to the API without requiring you to log in or provide any credentials.
          </p>
          <p className="text-spotify-white/80">
            Just enjoy the game and test your knowledge of music popularity!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Config;
