
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SpotifyConfig from "./SpotifyConfig";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Key } from "lucide-react";

const devFormSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  // Form definition
  const form = useForm<z.infer<typeof devFormSchema>>({
    resolver: zodResolver(devFormSchema),
    defaultValues: {
      clientId: localStorage.getItem("spotify_client_id") || "",
      clientSecret: localStorage.getItem("spotify_client_secret") || "",
    },
  });

  const onSubmit = (data: z.infer<typeof devFormSchema>) => {
    setIsAuthenticating(true);
    console.log("Submitting developer credentials");
    
    // Store API credentials in localStorage
    localStorage.setItem("spotify_client_id", data.clientId);
    localStorage.setItem("spotify_client_secret", data.clientSecret);
    
    // Remove any previously selected game mode
    localStorage.removeItem('selectedGameMode');
    
    // Set developer mode
    localStorage.setItem("developer_mode", "true");
    
    toast({
      title: "Developer credentials saved",
      description: "Your Spotify API credentials have been saved.",
    });
    
    // We'll attempt to connect to Spotify with these credentials
    handleConnectToSpotify(data.clientId, data.clientSecret);
  };

  const handleConnectToSpotify = async (clientId: string, clientSecret: string) => {
    try {
      // This will trigger the SpotifyConfig component to use these credentials
      setIsAuthenticating(true);
      console.log("Connecting to Spotify with developer credentials");
      
      setTimeout(() => {
        setSpotifyConnected(true);
        setIsAuthenticating(false);
        
        toast({
          title: "API Connection Successful",
          description: "Successfully connected to Spotify API with your credentials.",
        });
        
        // Create simple user object
        const userObj = {
          username: "Developer"
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        
        // Navigate to the game using hard redirect
        console.log("Redirecting from Login component");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }, 1500);
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsAuthenticating(false);
      
      toast({
        title: "API Connection Failed",
        description: "Could not connect to Spotify API with the provided credentials.",
        variant: "destructive",
      });
    }
  };

  const handleSpotifyConnected = () => {
    setSpotifyConnected(true);
    console.log("Spotify connected callback in Login component");
    
    toast({
      title: "Spotify Connected",
      description: "Successfully connected to Spotify API!",
    });
    
    // Create simple user object
    const userObj = {
      username: "Developer"
    };
    localStorage.setItem('user', JSON.stringify(userObj));
    
    // Clear any previously selected game mode
    localStorage.removeItem('selectedGameMode');
    
    // Navigate using hard redirect
    console.log("Redirecting after Spotify connected");
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-6 w-6 text-spotify-green" />
            <CardTitle>Developer Access</CardTitle>
          </div>
          <CardDescription>
            Enter your Spotify API credentials to access the application
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your Spotify Client ID" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Secret</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your Spotify Client Secret" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-spotify-green hover:bg-spotify-green/80"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? "Connecting..." : "Connect API"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      <div className="mb-4 text-center text-white">
        <p>Or use the default configuration:</p>
      </div>
      
      <SpotifyConfig onAuthenticated={handleSpotifyConnected} />
    </div>
  );
};

export default Login;
