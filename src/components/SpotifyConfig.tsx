
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateSpotify, needsTokenRefresh } from "@/utils/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface SpotifyConfigProps {
  onAuthenticated?: () => void;
}

const SpotifyConfig = ({ onAuthenticated }: SpotifyConfigProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('spotify_access_token') !== null && !needsTokenRefresh();
  });
  const [notifiedAuthenticated, setNotifiedAuthenticated] = useState(false);

  // Spotify API credentials - these are demo credentials and can be public
  const CLIENT_ID = "1c9856cb829c429e856cefb2b0d8da5a";
  const CLIENT_SECRET = "a56ef64f9de04ca2a99d5f2a4daaafea";

  // Authenticate on component mount if needed
  useEffect(() => {
    const checkAndAuthenticate = async () => {
      // Check if we have developer provided credentials
      const devClientId = localStorage.getItem("spotify_client_id");
      const devClientSecret = localStorage.getItem("spotify_client_secret");
      
      if (!isAuthenticated && !isAuthenticating) {
        if (devClientId && devClientSecret) {
          // Use developer credentials
          await handleAuthenticate(devClientId, devClientSecret);
        } else {
          // Use default credentials
          await handleAuthenticate();
        }
      } else if (isAuthenticated && onAuthenticated && !notifiedAuthenticated) {
        // Clear any previous game mode selection
        localStorage.removeItem('selectedGameMode');
        setNotifiedAuthenticated(true);
        onAuthenticated();
      }
    };
    
    checkAndAuthenticate();
  }, [isAuthenticated, onAuthenticated, notifiedAuthenticated]);

  const handleAuthenticate = async (clientId = CLIENT_ID, clientSecret = CLIENT_SECRET) => {
    setIsAuthenticating(true);
    
    try {
      localStorage.removeItem('spotify_access_token'); // Clear any existing token first
      localStorage.removeItem('selectedGameMode'); // Clear any game mode selection
      
      const token = await authenticateSpotify(clientId, clientSecret);
      setIsAuthenticating(false);
      
      if (token) {
        setIsAuthenticated(true);
        toast({
          title: "API Connected",
          description: "Successfully connected to Spotify API",
        });
        
        // Create user object if it doesn't exist
        if (!localStorage.getItem('user')) {
          const userObj = { username: "Developer" };
          localStorage.setItem('user', JSON.stringify(userObj));
        }
        
        if (onAuthenticated) {
          setNotifiedAuthenticated(true);
          onAuthenticated();
        } else {
          // If no callback is provided, navigate to home
          navigate("/");
        }
      } else {
        toast({
          title: "API Connection Failed",
          description: "Failed to connect to Spotify API. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticating(false);
      toast({
        title: "API Connection Failed",
        description: "An error occurred while connecting to Spotify API.",
        variant: "destructive",
      });
    }
  };

  const handleManualAuthenticate = () => {
    // Use default credentials for the default button
    handleAuthenticate();
  };

  const handleGoToHome = () => {
    // Create user object if it doesn't exist
    if (!localStorage.getItem('user')) {
      const userObj = { username: "Developer" };
      localStorage.setItem('user', JSON.stringify(userObj));
    }
    // Force navigation to home
    console.log("Navigating to home...");
    navigate("/", { replace: true });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Default Configuration</CardTitle>
        <CardDescription>
          {isAuthenticated 
            ? "Connected to Spotify API" 
            : isAuthenticating 
              ? "Connecting to Spotify API..." 
              : "Use default API credentials"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticating ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex flex-col gap-4">
            <div className="bg-green-900/40 border border-green-700/50 rounded-md p-3 text-green-300">
              <p>✅ Spotify API connected successfully!</p>
            </div>
            <Button 
              onClick={handleGoToHome}
              className="w-full bg-spotify-green hover:bg-spotify-green/80 text-lg py-6"
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Game Home
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-md p-3 text-yellow-300">
              <p>⚠️ Using default Spotify API configuration.</p>
            </div>
            <Button 
              onClick={handleManualAuthenticate} 
              className="w-full bg-spotify-green hover:bg-spotify-green/80"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? "Connecting..." : "Use Default Configuration"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-center text-xs text-muted-foreground">
        <p className="text-center">This app uses the Spotify Web API to fetch real artist data.</p>
      </CardFooter>
    </Card>
  );
};

export default SpotifyConfig;
