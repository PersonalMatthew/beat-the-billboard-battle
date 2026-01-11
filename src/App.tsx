
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Config from "./pages/Config";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Check if Spotify API is connected
      const token = localStorage.getItem('spotify_access_token');
      const user = localStorage.getItem('user');

      console.log("App.tsx - Auth check:", { hasToken: !!token, hasUser: !!user });

      // If not authenticated, automatically create a default user
      if (!user) {
        const defaultUser = { username: "Player" };
        localStorage.setItem('user', JSON.stringify(defaultUser));
      }

      setIsApiConnected(!!token && !!user);
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-spotify-black">
        <div className="animate-spin w-12 h-12 border-4 border-spotify-green border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isApiConnected ? <Index /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={isApiConnected ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/config" element={<Config />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
