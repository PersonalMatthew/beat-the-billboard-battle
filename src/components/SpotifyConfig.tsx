
import { useState } from "react";
import { authenticateSpotify, updateArtistWithSpotifyData, needsTokenRefresh } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const SpotifyConfig = () => {
  const { toast } = useToast();
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [artistId, setArtistId] = useState<string>("");
  const [artistPosition, setArtistPosition] = useState<string>("0");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('spotify_access_token') !== null && !needsTokenRefresh();
  });

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
    } else {
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Spotify API. Check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateArtist = async () => {
    if (!artistId || artistPosition === "") {
      toast({
        title: "Missing Information",
        description: "Please enter both Artist ID and position",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Not Authenticated",
        description: "Please authenticate with Spotify first",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    const success = await updateArtistWithSpotifyData(parseInt(artistPosition), artistId);
    setIsUpdating(false);

    if (success) {
      toast({
        title: "Artist Updated",
        description: `Successfully updated artist at position ${artistPosition}`,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update artist. Check the artist ID and position.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Spotify API Configuration</CardTitle>
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

        {isAuthenticated && (
          <>
            <div className="h-px bg-border my-4" />
            <div className="space-y-2">
              <label htmlFor="artistId" className="text-sm font-medium">
                Spotify Artist ID
              </label>
              <Input
                id="artistId"
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                placeholder="e.g., 06HL4z0CvFAxyc27GXpf02"
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="position" className="text-sm font-medium">
                Position to Replace (0-19)
              </label>
              <Input
                id="position"
                type="number"
                min="0"
                max="19"
                value={artistPosition}
                onChange={(e) => setArtistPosition(e.target.value)}
                placeholder="Enter position (0-19)"
                disabled={isUpdating}
              />
            </div>
            <Button 
              onClick={handleUpdateArtist} 
              className="w-full" 
              disabled={isUpdating || !artistId || artistPosition === ""}
            >
              {isUpdating ? "Updating..." : "Update Artist"}
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-muted-foreground">
        Find artist IDs in Spotify URLs or using the Spotify Web API
      </CardFooter>
    </Card>
  );
};

export default SpotifyConfig;
