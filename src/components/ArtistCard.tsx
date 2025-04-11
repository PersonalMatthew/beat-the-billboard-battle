
import { Artist } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/gameLogic";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

interface ArtistCardProps {
  artist: Artist;
  onSelect: () => void;
  revealed: boolean;
  isCorrect?: boolean | null;
}

const ArtistCard = ({ artist, onSelect, revealed, isCorrect }: ArtistCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(artist.imageUrl || '');
  const [fallbackAttempts, setFallbackAttempts] = useState(0);
  
  // Reset image error state when artist changes
  useEffect(() => {
    setImageError(false);
    setFallbackAttempts(0);
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

  // Enhanced image error handling with more robust fallback mechanism
  const handleImageError = () => {
    console.log(`Image failed to load for artist: ${artist.name}`, imageUrl);
    
    // Prevent infinite fallback attempts
    if (fallbackAttempts >= 3) {
      console.log("Max fallback attempts reached, using placeholder");
      setImageError(true);
      return;
    }
    
    setFallbackAttempts(prev => prev + 1);
    
    // Try different image formats or fallback to a different source
    if (imageUrl.includes('.jpg')) {
      setImageUrl(imageUrl.replace('.jpg', '.png'));
    } else if (imageUrl.includes('.png')) {
      setImageUrl(imageUrl.replace('.png', '.webp'));
    } else if (imageUrl.includes('i.scdn.co')) {
      // Try alternate Spotify image URL patterns
      if (imageUrl.includes('/ab6761610000e5eb')) {
        // Try different image size format
        setImageUrl(imageUrl.replace('/ab6761610000e5eb', '/ab67616100005174'));
      } else if (imageUrl.includes('/ab67616100005174')) {
        // Try another image size format
        setImageUrl(imageUrl.replace('/ab67616100005174', '/ab6761610000f178'));
      } else {
        // If we can't fix the URL pattern, use fallback
        setImageError(true);
      }
    } else {
      // Use a placeholder if all attempts fail
      setImageError(true);
    }
  };

  // Get fallback content with artist initial or icon
  const getFallbackContent = () => {
    if (!artist.name) return <UserIcon className="h-12 w-12 text-white" />;
    const initial = artist.name.charAt(0).toUpperCase();
    return initial;
  };

  return (
    <div 
      className={`artist-card relative rounded-lg p-6 shadow-lg ${getBgClass()} flex flex-col items-center justify-between h-full transition-all duration-300`}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {/* Artist Image with enhanced error handling */}
        <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full border-4 border-spotify-green">
          <Avatar className="w-full h-full">
            {!imageError && (
              <AvatarImage 
                src={imageUrl} 
                alt={artist.name || "Artist"}
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
        <h2 className="text-2xl font-bold text-white mb-2 text-center">{artist.name || "Unknown Artist"}</h2>
        
        {/* Artist Genres - Adding null check before accessing 'slice' */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {artist.genres && artist.genres.length > 0 ? (
            artist.genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="bg-spotify-black bg-opacity-40 text-xs px-2 py-1 rounded-full text-white"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="bg-spotify-black bg-opacity-40 text-xs px-2 py-1 rounded-full text-white">
              Music
            </span>
          )}
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
