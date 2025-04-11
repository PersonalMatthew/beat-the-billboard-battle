
import { Artist, artists, fetchArtistFromSpotify, needsTokenRefresh } from "./mockData";

// Get a random artist from our list with Spotify API integration
export async function getRandomArtistFromSpotify(): Promise<Artist | null> {
  // Check if Spotify API is authorized
  if (isSpotifyAuthorized()) {
    try {
      // Get a random artist ID from our mock data to use as a source
      const randomIndex = Math.floor(Math.random() * artists.length);
      const sourceArtist = artists[randomIndex];
      
      // Fetch real-time data for this artist from Spotify
      const spotifyArtist = await fetchArtistFromSpotify(sourceArtist.id);
      return spotifyArtist;
    } catch (error) {
      console.error('Failed to fetch artist from Spotify:', error);
      return null;
    }
  }
  return null;
}

// Get a random artist from our list
export function getRandomArtist(excludeArtist?: Artist): Artist {
  let randomArtist: Artist;
  const availableArtists = excludeArtist 
    ? artists.filter(artist => artist.id !== excludeArtist.id) 
    : artists;
  
  const randomIndex = Math.floor(Math.random() * availableArtists.length);
  randomArtist = availableArtists[randomIndex];
  
  return randomArtist;
}

// Get two random artists for comparison
export async function getArtistPair(): Promise<[Artist, Artist]> {
  // Try to use Spotify API first
  if (isSpotifyAuthorized()) {
    try {
      const artistA = await getRandomArtistFromSpotify() || getRandomArtist();
      let artistB;
      
      // Make sure we don't get the same artist twice
      do {
        artistB = await getRandomArtistFromSpotify() || getRandomArtist();
      } while (artistB.id === artistA.id);
      
      return [artistA, artistB];
    } catch (error) {
      console.error('Error getting artist pair from Spotify:', error);
      // Fall back to mock data
    }
  }
  
  // Fall back to mock data if API is not available or fails
  const artistA = getRandomArtist();
  const artistB = getRandomArtist(artistA);
  
  return [artistA, artistB];
}

// Format large numbers for display (e.g., 68,543,210)
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Check if user's guess is correct
export function checkGuess(selectedArtist: Artist, otherArtist: Artist): boolean {
  return selectedArtist.monthlyListeners > otherArtist.monthlyListeners;
}

// Save high score to localStorage
export function saveHighScore(score: number): void {
  const currentHighScore = getHighScore();
  if (score > currentHighScore) {
    localStorage.setItem('highScore', score.toString());
  }
}

// Get high score from localStorage
export function getHighScore(): number {
  const highScore = localStorage.getItem('highScore');
  return highScore ? parseInt(highScore) : 0;
}

// Check if Spotify API is authorized and token is valid
export function isSpotifyAuthorized(): boolean {
  const accessToken = localStorage.getItem('spotify_access_token');
  return accessToken !== null && !needsTokenRefresh();
}
