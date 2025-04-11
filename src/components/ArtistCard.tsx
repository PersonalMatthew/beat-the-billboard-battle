
import { Artist } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/gameLogic";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ArtistCardProps {
  artist: Artist;
  onSelect: () => void;
  revealed: boolean;
  isCorrect?: boolean | null;
}

const ArtistCard = ({ artist, onSelect, revealed, isCorrect }: ArtistCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(artist.imageUrl || '');
  
  // Reset image error state when artist changes
  useEffect(() => {
    setImageError(false);
    setImageUrl(artist.imageUrl || '');
  }, [artist.id, artist.imageUrl]);
  
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
    console.log(`Image failed to load for artist: ${artist.name}`);
    setImageError(true);
    
    // Try a different image format or source
    if (imageUrl.includes('.jpg')) {
      setImageUrl(imageUrl.replace('.jpg', '.png'));
    } else if (imageUrl.includes('.png')) {
      setImageUrl(imageUrl.replace('.png', '.webp'));
    } else {
      // Use a placeholder if all attempts fail
      setImageError(true);
    }
  };

  // Get fallback image with artist initial
  const getFallbackContent = () => {
    const initial = artist.name ? artist.name.charAt(0).toUpperCase() : "?";
    return initial;
  };

  return (
    <div 
      className={`artist-card relative rounded-lg p-6 shadow-lg ${getBgClass()} flex flex-col items-center justify-between h-full transition-all duration-300`}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {/* Artist Image */}
        <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full border-4 border-spotify-green">
          <Avatar className="w-full h-full">
            {!imageError && (
              <AvatarImage 
                src={imageUrl} 
                alt={artist.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
            <AvatarFallback 
              className="w-full h-full flex items-center justify-center bg-spotify-green text-white text-6xl font-bold"
            >
              {getFallbackContent()}
            </AvatarFallback>
          </Avatar>
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
