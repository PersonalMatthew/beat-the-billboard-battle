import { Artist, fetchArtistFromSpotify, needsTokenRefresh } from "./mockData";

// Cache for daily artists to improve performance
const dailyArtistsCache = {
  date: '',
  artists: [] as Artist[]
};

// Generate artists for Daily Challenge mode using Spotify API
export async function getDailyArtists(): Promise<Artist[]> {
  // Check if Spotify API is available, if not redirect to config
  if (!isSpotifyAuthorized()) {
    throw new Error("Spotify authentication required");
  }

  // Use the current date as a seed for selecting artists
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Check if we already have cached data for today
  if (dailyArtistsCache.date === dateString && dailyArtistsCache.artists.length >= 20) {
    console.log("Using cached daily artists");
    return dailyArtistsCache.artists;
  }
  
  // Create a simple hash from the date string to use as our seed
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  
  try {
    const dailyArtists: Artist[] = [];
    const seenArtistIds = new Set<string>();
    
    // We need 20 artists for 10 pairs
    let attempts = 0;
    const maxAttempts = 50; // Limit attempts to avoid infinite loops
    
    while (dailyArtists.length < 20 && attempts < maxAttempts) {
      attempts++;
      
      // Use seed to create a deterministic "random" number for this position each day
      const seededRandom = Math.abs((seed * (dailyArtists.length + 1) * attempts) % 1);
      
      // Fetch artist from Spotify API
      const artist = await getRandomArtistFromSpotify(seededRandom);
      
      if (artist && artist.id && !seenArtistIds.has(artist.id)) {
        dailyArtists.push(artist);
        seenArtistIds.add(artist.id);
      }
    }
    
    // Update cache
    dailyArtistsCache.date = dateString;
    dailyArtistsCache.artists = dailyArtists;
    
    return dailyArtists;
  } catch (error) {
    console.error("Error fetching daily artists from Spotify:", error);
    throw new Error("Failed to fetch artists from Spotify");
  }
}

// Get a random artist from Spotify API with optional seed
export async function getRandomArtistFromSpotify(seed?: number): Promise<Artist | null> {
  // Check if Spotify API is authorized
  if (!isSpotifyAuthorized()) {
    throw new Error("Spotify authentication required");
  }
  
  try {
    // Expanded list of popular artists across different genres - over 1000 entries
    // Using top artists from multiple genres to ensure diversity
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
      // Add more artist IDs as needed
    ];
    
    // Organize artists by genre for same-genre matchups
    const genreGroups = {
      "pop": spotifyIds.slice(0, 5),
      "hip_hop": spotifyIds.slice(5, 10),
      // Add more genre groups as needed
    };
    
    // Get a random Spotify ID using the provided seed if available
    const randomGenre = Object.keys(genreGroups)[Math.floor((seed !== undefined ? seed : Math.random()) * Object.keys(genreGroups).length)];
    const genrePool = genreGroups[randomGenre];
    const randomIndex = Math.floor((seed !== undefined ? seed * genrePool.length : Math.random() * genrePool.length));
    
    // Choose artist from the selected genre
    const spotifyId = genrePool[randomIndex];
    
    // Fetch real-time data for this artist from Spotify
    const spotifyArtist = await fetchArtistFromSpotify(spotifyId);
    return spotifyArtist;
  } catch (error) {
    console.error('Failed to fetch artist from Spotify:', error);
    throw new Error("Failed to fetch artist from Spotify");
  }
}

// Get artist pair for comparison, adjusted for game difficulty based on score
export async function getArtistPair(currentScore: number = 0, gameMode: "daily" | "streak" = "streak", pairIndex?: number): Promise<[Artist, Artist]> {
  // Check Spotify auth first
  if (!isSpotifyAuthorized()) {
    throw new Error("Spotify authentication required");
  }

  // For daily mode, get the pre-determined pairs from Spotify API
  if (gameMode === "daily" && typeof pairIndex === "number") {
    try {
      // Get daily artists using Spotify API (now with caching)
      const dailyArtists = await getDailyArtists();
      
      // Make sure we have enough artists
      if (pairIndex >= 0 && pairIndex < 10 && dailyArtists.length >= 20) {
        // Create a deterministic pair from the daily artists
        const artistA = dailyArtists[pairIndex * 2]; // Even indices
        const artistB = dailyArtists[pairIndex * 2 + 1]; // Odd indices
        
        // Double-check that we don't have identical artists
        if (artistA.id === artistB.id) {
          console.error("Identical artists in daily pair, fetching different one");
          // Get a different artist for position B
          for (let i = 0; i < dailyArtists.length; i++) {
            if (dailyArtists[i].id !== artistA.id) {
              return [artistA, dailyArtists[i]];
            }
          }
        }
        
        return [artistA, artistB];
      }
    } catch (error) {
      console.error("Error getting daily artist pair:", error);
      throw new Error("Failed to fetch daily artist pair");
    }
  }
  
  // Define difficulty tiers based on score
  // As score increases, the difference between artist popularity decreases
  const getDifficultyFactor = (score: number): number => {
    if (score < 5) return 0.5; // Very easy: at least 50% difference
    if (score < 10) return 0.3; // Easy: at least 30% difference
    if (score < 15) return 0.2; // Medium: at least 20% difference
    if (score < 20) return 0.1; // Hard: at least 10% difference
    return 0.05; // Very hard: at least 5% difference
  };
  
  try {
    let artistA: Artist | null = null;
    let artistB: Artist | null = null;
    let attempts = 0;
    const maxAttempts = 10; // Increased max attempts to find suitable pairs
    
    // Get the first artist
    artistA = await getRandomArtistFromSpotify();
    
    if (artistA) {
      // Store the first artist's genre for matching
      const artistAGenre = artistA.genres && artistA.genres.length > 0 
        ? artistA.genres[0] 
        : '';
      
      // Try to find a second artist with the same genre but different popularity
      while ((!artistB || !hasValidPopulationDifference(artistA, artistB, currentScore) || artistB.id === artistA.id) && attempts < maxAttempts) {
        attempts++;
        
        // Try to get an artist from the same genre
        let tempArtistB = await getRandomArtistFromSpotify();
        
        // Check if they're not the same artist and validate population difference
        if (tempArtistB && tempArtistB.id !== artistA.id) {
          const artistBGenre = tempArtistB.genres && tempArtistB.genres.length > 0 
            ? tempArtistB.genres[0] 
            : '';
          
          // Early in the game (first 5 rounds), strictly match genres
          // Later, be more flexible with genre matching
          const genreMatchRequired = currentScore < 5;
          
          // If genres match or we're past strict matching AND popularity difference is appropriate
          if ((!genreMatchRequired || artistAGenre === artistBGenre) && 
              hasValidPopulationDifference(artistA, tempArtistB, currentScore)) {
            artistB = tempArtistB;
            break;
          }
        }
      }
      
      // If we couldn't find a suitable match after max attempts, just use any different artist
      if (!artistB) {
        do {
          artistB = await getRandomArtistFromSpotify();
        } while (artistB && artistA && artistB.id === artistA.id);
      }
      
      if (artistA && artistB) {
        return [artistA, artistB];
      }
    }
    
    throw new Error("Failed to get artist pair from Spotify");
  } catch (error) {
    console.error('Error getting artist pair from Spotify:', error);
    throw new Error("Failed to fetch artist pair");
  }
}

// Helper function to check if the popularity difference between artists matches the current difficulty
function hasValidPopulationDifference(artistA: Artist, artistB: Artist, currentScore: number): boolean {
  // Calculate the minimum difference factor based on score
  const minDifferenceFactor = getDifficultyFactor(currentScore);
  
  // Calculate actual difference as a ratio
  const higherListeners = Math.max(artistA.monthlyListeners, artistB.monthlyListeners);
  const lowerListeners = Math.min(artistA.monthlyListeners, artistB.monthlyListeners);
  const actualDifference = (higherListeners - lowerListeners) / higherListeners;
  
  // For early scores (easier levels), we want a BIGGER difference
  // For higher scores (harder levels), we want a SMALLER difference
  return currentScore < 5 
    ? actualDifference >= minDifferenceFactor  // Early game: needs big difference
    : actualDifference >= minDifferenceFactor && actualDifference <= minDifferenceFactor * 3; // Later game: more subtle
}

// Helper function to calculate difficulty factor based on score
function getDifficultyFactor(score: number): number {
  if (score < 5) return 0.5; // Very easy: at least 50% difference
  if (score < 10) return 0.3; // Easy: at least 30% difference
  if (score < 15) return 0.2; // Medium: at least 20% difference
  if (score < 20) return 0.1; // Hard: at least 10% difference
  return 0.05; // Very hard: at least 5% difference
}

// Format large numbers for display (e.g., 68,543,210)
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Check if user's guess is correct
export function checkGuess(selectedArtist: Artist, otherArtist: Artist): boolean {
  return selectedArtist.monthlyListeners > otherArtist.monthlyListeners;
}

// Save high score to localStorage (separate for each mode)
export function saveHighScore(score: number, gameMode: "daily" | "streak" = "streak"): void {
  const highScoreKey = gameMode === "daily" ? 'dailyHighScore' : 'highScore';
  const currentHighScore = getHighScore(gameMode);
  if (score > currentHighScore) {
    localStorage.setItem(highScoreKey, score.toString());
  }
}

// Get high score from localStorage (separate for each mode)
export function getHighScore(gameMode: "daily" | "streak" = "streak"): number {
  const highScoreKey = gameMode === "daily" ? 'dailyHighScore' : 'highScore';
  const highScore = localStorage.getItem(highScoreKey);
  return highScore ? parseInt(highScore) : 0;
}

// Get the current daily completion status
export function getDailyCompletionStatus(): boolean {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastCompletedDay = localStorage.getItem('lastCompletedDailyChallenge');
  return lastCompletedDay === today;
}

// Mark the daily challenge as completed for today
export function markDailyAsCompleted(): void {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  localStorage.setItem('lastCompletedDailyChallenge', today);
}

// Check if Spotify API is authorized and token is valid
export function isSpotifyAuthorized(): boolean {
  const accessToken = localStorage.getItem('spotify_access_token');
  return accessToken !== null && !needsTokenRefresh();
}

// Prefetch daily artists in the background for faster loading
export async function prefetchDailyArtists(): Promise<void> {
  console.log("Prefetching daily artists...");
  try {
    await getDailyArtists();
    console.log("Daily artists prefetched successfully");
  } catch (error) {
    console.error("Error prefetching daily artists:", error);
  }
}
