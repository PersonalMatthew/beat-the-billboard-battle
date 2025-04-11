
import { useState, useEffect } from "react";
import { authenticateSpotify, needsTokenRefresh } from "@/utils/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface SpotifyConfigProps {
  onAuthenticated?: () => void;
}

const SpotifyConfig = ({ onAuthenticated }: SpotifyConfigProps) => {
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('spotify_access_token') !== null && !needsTokenRefresh();
  });

  // Pre-configured Spotify API credentials (in a real app, these would be environment variables)
  const CLIENT_ID = "your-spotify-client-id"; // Replace with your actual Spotify client ID
  const CLIENT_SECRET = "your-spotify-client-secret"; // Replace with your actual Spotify client secret

  // Authenticate on component mount if needed
  useEffect(() => {
    const checkAndAuthenticate = async () => {
      if (!isAuthenticated && !isAuthenticating) {
        await handleAuthenticate();
      } else if (isAuthenticated && onAuthenticated) {
        onAuthenticated();
      }
    };
    
    checkAndAuthenticate();
  }, [isAuthenticated, onAuthenticated]);

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    
    try {
      const token = await authenticateSpotify(CLIENT_ID, CLIENT_SECRET);
      setIsAuthenticating(false);
      
      if (token) {
        setIsAuthenticated(true);
        toast({
          title: "API Connected",
          description: "Successfully connected to Spotify API",
        });
        
        if (onAuthenticated) {
          onAuthenticated();
        }
      } else {
        toast({
          title: "API Connection Failed",
          description: "Failed to connect to Spotify API. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsAuthenticating(false);
      toast({
        title: "API Connection Failed",
        description: "An error occurred while connecting to Spotify API.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spotify API Status</CardTitle>
        <CardDescription>
          {isAuthenticated 
            ? "Connected to Spotify API" 
            : isAuthenticating 
              ? "Connecting to Spotify API..." 
              : "Not connected to Spotify API"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticating ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="bg-green-900/40 border border-green-700/50 rounded-md p-3 text-green-300">
            <p>✅ Spotify API connected successfully!</p>
          </div>
        ) : (
          <div className="bg-red-900/40 border border-red-700/50 rounded-md p-3 text-red-300">
            <p>❌ Not connected to Spotify API. Attempting to connect automatically...</p>
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
