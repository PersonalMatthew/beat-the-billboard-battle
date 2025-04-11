
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SpotifyConfig from "@/components/SpotifyConfig";
import { isSpotifyAuthorized } from "@/utils/gameLogic";

const Config = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    setIsAuthorized(isSpotifyAuthorized());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-spotify-green">Game Configuration</h1>
          <div className="space-x-2">
            <Link to="/artists">
              <Button variant="outline" className="bg-spotify-green/10 text-spotify-green border-spotify-green/30">
                View Artists
              </Button>
            </Link>
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
        
        <SpotifyConfig />
        
        <div className="mt-8 bg-spotify-lightgray/20 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-spotify-white mb-2">How to Find Artist IDs</h2>
          <p className="text-spotify-white/80 mb-2">
            You can find a Spotify artist ID in the URL when viewing an artist on Spotify web:
          </p>
          <code className="block bg-spotify-black p-2 rounded text-spotify-green text-sm mb-4">
            https://open.spotify.com/artist/<span className="text-spotify-white">06HL4z0CvFAxyc27GXpf02</span>
          </code>
          <p className="text-spotify-white/80">
            The part after "/artist/" is the artist ID you need to enter above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Config;
