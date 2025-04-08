
import { Artist } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/gameLogic";
import { useState } from "react";

interface ArtistCardProps {
  artist: Artist;
  onSelect: () => void;
  revealed: boolean;
  isCorrect?: boolean | null;
}

const ArtistCard = ({ artist, onSelect, revealed, isCorrect }: ArtistCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Determine background class based on revealed state and correctness
  const getBgClass = () => {
    if (!revealed) return "bg-spotify-lightgray";
    return isCorrect === true 
      ? "bg-green-700" 
      : isCorrect === false 
        ? "bg-red-700" 
        : "bg-spotify-lightgray";
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get fallback image with artist initial
  const getFallbackImage = () => {
    const initial = artist.name ? artist.name.charAt(0).toUpperCase() : "?";
    return (
      <div className="w-full h-full flex items-center justify-center bg-spotify-green text-white text-6xl font-bold">
        {initial}
      </div>
    );
  };

  return (
    <div 
      className={`artist-card relative rounded-lg p-6 shadow-lg ${getBgClass()} flex flex-col items-center justify-between h-full transition-all duration-300`}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {/* Artist Image */}
        <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full border-4 border-spotify-green">
          {imageError ? (
            getFallbackImage()
          ) : (
            <img 
              src={artist.imageUrl} 
              alt={artist.name} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
        
        {/* Artist Name */}
        <h2 className="text-2xl font-bold text-white mb-2">{artist.name}</h2>
        
        {/* Artist Genres - Adding null check before accessing 'slice' */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {artist.genres && artist.genres.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="bg-spotify-black bg-opacity-40 text-xs px-2 py-1 rounded-full text-white"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      
      {/* Monthly Listeners (shown only when revealed) */}
      {revealed ? (
        <div className="text-center mt-2">
          <p className="text-sm text-white opacity-80">Monthly Listeners</p>
          <p className="text-2xl font-bold text-spotify-white">
            {formatNumber(artist.monthlyListeners)}
          </p>
        </div>
      ) : (
        <Button 
          onClick={onSelect}
          className="bg-spotify-green hover:bg-spotify-green/80 text-white font-bold py-2 px-6 rounded-full mt-4 w-full"
        >
          Has More Listeners
        </Button>
      )}
    </div>
  );
};

export default ArtistCard;
