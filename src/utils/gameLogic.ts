import { Artist, artists, fetchArtistFromSpotify, needsTokenRefresh } from "./mockData";

// Get a random artist from our list with Spotify API integration
export async function getRandomArtistFromSpotify(): Promise<Artist | null> {
  // Check if Spotify API is authorized
  if (isSpotifyAuthorized()) {
    try {
      // Instead of using numeric IDs from our mock data, use real Spotify IDs
      // Spotify uses base62 IDs, not simple numbers
      const spotifyIds = [
        "3TVXtAsR1Inumwj472S9r4", // Drake
        "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
        "1Xyo4u8uXC1ZmMpatF05PJ", // The Weeknd
        "4q3ewBCX7sLwd24euuV69X", // Bad Bunny
        "6qqNVTkY8uBg9cP3Jd7DAH", // Billie Eilish
        "3Nrfpe0tUJi4K4DXYWgMUX", // BTS
        "66CXWjxzNUsdJxJ2JdwvnR", // Ariana Grande
        "1uNFoZAHBGtllmzznpCI3s", // Justin Bieber
        "6M2wZ9GZgrQXHCFfjv46we", // Dua Lipa
        "6eUKZXaKkcviH0Ku9w2n3V", // Ed Sheeran
        "1McMsnEElThX1knmY4oliG", // Olivia Rodrigo
        "246dkjvS1zLTtiykXe5h60", // Post Malone
        "7dGJo4pcD2V6oG8kP0tJRR", // Eminem
        "5pKCCKE2ajJHZ9KAiaK11H", // Rihanna
        "4dpARuHxo51G3z768sgnrY", // Adele
        "4gzpq5DPGxSnKTe4SA8HAU", // Coldplay
        "6KImCVD70vtIoJWnq6nGn3", // Harry Styles
        "1HY2Jd0NmPuamShAr6KMms", // Lady Gaga
        "2YZyLoL8N0Wb9xBt1NhZWg", // Kendrick Lamar
        "0du5cEVh5yTK9QJze8zA0C"  // Bruno Mars
      ];
      
      // Get a random Spotify ID
      const randomIndex = Math.floor(Math.random() * spotifyIds.length);
      const spotifyId = spotifyIds[randomIndex];
      
      // Fetch real-time data for this artist from Spotify
      const spotifyArtist = await fetchArtistFromSpotify(spotifyId);
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
      } while (artistB && artistA && artistB.id === artistA.id);
      
      if (artistA && artistB) {
        return [artistA, artistB];
      }
      // Fall back to mock data if API fails
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
