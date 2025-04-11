
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { artists } from "@/utils/mockData";
import { formatNumber } from "@/utils/gameLogic";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

const ArtistList = () => {
  const [sortedArtists, setSortedArtists] = useState([...artists]);

  useEffect(() => {
    // Sort artists by monthly listeners (descending order)
    const sorted = [...artists].sort((a, b) => b.monthlyListeners - a.monthlyListeners);
    setSortedArtists(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkgray p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-spotify-green">Artist Rankings</h1>
          <Link to="/">
            <Button variant="outline" className="bg-spotify-green/10 text-spotify-green border-spotify-green/30">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Game
            </Button>
          </Link>
        </div>

        <div className="bg-spotify-lightgray/20 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-spotify-green/20 text-spotify-green">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Artist</th>
                <th className="p-4 text-right">Monthly Listeners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-spotify-lightgray/20">
              {sortedArtists.map((artist, index) => (
                <tr key={artist.id} className="text-spotify-white hover:bg-spotify-lightgray/10">
                  <td className="p-4 font-bold">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={artist.imageUrl} alt={artist.name} />
                        <AvatarFallback className="bg-spotify-green text-white">
                          {artist.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {artist.name}
                    </div>
                  </td>
                  <td className="p-4 text-right">{formatNumber(artist.monthlyListeners)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/config">
            <Button variant="default" className="bg-spotify-green hover:bg-spotify-green/80">
              Add More Artists
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtistList;
