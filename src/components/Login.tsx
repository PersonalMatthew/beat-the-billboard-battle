
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SpotifyConfig from "./SpotifyConfig";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Demo login - In a real app, you'd validate against a backend
    setTimeout(() => {
      if (username && password) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify({ username }));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to Beat The Billboard Battle!",
        });
        
        // Navigate to the game
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter both username and password.",
          variant: "destructive",
        });
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  const handleSpotifyConnected = () => {
    setSpotifyConnected(true);
    toast({
      title: "Spotify Connected",
      description: "Successfully connected to Spotify API!",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Sign in to your account to play Beat The Billboard Battle
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-spotify-green hover:bg-spotify-green/80"
              disabled={isLoggingIn || !spotifyConnected}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mb-4 text-center text-white">
        <p>Spotify API connection is required before login</p>
      </div>
      
      <SpotifyConfig onAuthenticated={handleSpotifyConnected} />
    </div>
  );
};

export default Login;
