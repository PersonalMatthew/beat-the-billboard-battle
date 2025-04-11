
import { useState, useEffect } from "react";
import { authenticateSpotify, needsTokenRefresh } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface SpotifyConfigProps {
  onAuthenticated?: () => void;
}

const SpotifyConfig = ({ onAuthenticated }: SpotifyConfigProps) => {
  const { toast } = useToast();
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('spotify_access_token') !== null && !needsTokenRefresh();
  });

  // Check auth state on component mount
  useEffect(() => {
    if (isAuthenticated && onAuthenticated) {
      onAuthenticated();
    }
  }, [isAuthenticated, onAuthenticated]);

  const handleAuthenticate = async () => {
    if (!clientId || !clientSecret) {
      toast({
        title: "Missing Information",
        description: "Please enter both Client ID and Client Secret",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticating(true);
    const token = await authenticateSpotify(clientId, clientSecret);
    setIsAuthenticating(false);

    if (token) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Successfully authenticated with Spotify API",
      });
      
      if (onAuthenticated) {
        onAuthenticated();
      }
    } else {
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Spotify API. Check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spotify API Connection</CardTitle>
        <CardDescription>
          Enter your Spotify API credentials to fetch real artist data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="clientId" className="text-sm font-medium">
            Client ID
          </label>
          <Input
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter Spotify Client ID"
            disabled={isAuthenticating}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="clientSecret" className="text-sm font-medium">
            Client Secret
          </label>
          <Input
            id="clientSecret"
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Enter Spotify Client Secret"
            disabled={isAuthenticating}
          />
        </div>
        
        <Button 
          onClick={handleAuthenticate} 
          className="w-full" 
          disabled={isAuthenticating || !clientId || !clientSecret}
        >
          {isAuthenticating ? "Authenticating..." : isAuthenticated ? "Re-Authenticate" : "Authenticate"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-center text-xs text-muted-foreground">
        <p>Get your API credentials from the <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline text-spotify-green">Spotify Developer Dashboard</a></p>
        <p className="text-center">This app uses the Spotify Web API to fetch real artist data. No user login required.</p>
      </CardFooter>
    </Card>
  );
};

export default SpotifyConfig;
