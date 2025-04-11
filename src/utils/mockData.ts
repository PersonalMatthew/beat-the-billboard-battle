
export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  monthlyListeners: number;
  genres: string[];
}

// Default mock data
export const artists: Artist[] = [
  {
    id: "1",
    name: "Drake",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
    monthlyListeners: 68543210,
    genres: ["hip hop", "rap", "canadian hip hop"]
  },
  {
    id: "2",
    name: "Taylor Swift",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0",
    monthlyListeners: 83641970,
    genres: ["pop", "country pop"]
  },
  {
    id: "3",
    name: "The Weeknd",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb7c23e3302e4773eb0c7332e8",
    monthlyListeners: 79543210,
    genres: ["r&b", "canadian pop"]
  },
  {
    id: "4",
    name: "Bad Bunny",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eba9027165d44664c0c8cdc88c",
    monthlyListeners: 59432100,
    genres: ["reggaeton", "latin trap"]
  },
  {
    id: "5",
    name: "Billie Eilish",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb7b9603c2310d917d42764ea6",
    monthlyListeners: 47654320,
    genres: ["pop", "electropop"]
  },
  {
    id: "6",
    name: "BTS",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb",
    monthlyListeners: 41987650,
    genres: ["k-pop", "pop"]
  },
  {
    id: "7",
    name: "Ariana Grande",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb0d9edad71efe0fe0bb44257a",
    monthlyListeners: 56432100,
    genres: ["pop", "r&b"]
  },
  {
    id: "8",
    name: "Justin Bieber",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36",
    monthlyListeners: 69876540,
    genres: ["canadian pop", "pop"]
  },
  {
    id: "9",
    name: "Dua Lipa",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb2f61382d245575cc5d8a75f7",
    monthlyListeners: 54321000,
    genres: ["dance pop", "pop"]
  },
  {
    id: "10",
    name: "Ed Sheeran",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb9d2a762f8f28361eccf3e534",
    monthlyListeners: 72143650,
    genres: ["pop", "uk pop"]
  },
  {
    id: "11",
    name: "Olivia Rodrigo",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb6b5f66fe52822c920c90a3aa",
    monthlyListeners: 47843210,
    genres: ["pop", "teen pop"]
  },
  {
    id: "12",
    name: "Post Malone",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebafba463c0a0d4318913e3005",
    monthlyListeners: 54321098,
    genres: ["hip hop", "pop rap"]
  },
  {
    id: "13",
    name: "Eminem",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eba00b11c129b27a88fc72f36b",
    monthlyListeners: 58765430,
    genres: ["hip hop", "detroit hip hop"]
  },
  {
    id: "14",
    name: "Rihanna",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb99e4fca7c0b7cb166d915789",
    monthlyListeners: 58432109,
    genres: ["pop", "r&b", "barbadian pop"]
  },
  {
    id: "15",
    name: "Adele",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb68f6e5892075d7f22615bd17",
    monthlyListeners: 37654321,
    genres: ["british soul", "pop"]
  },
  {
    id: "16",
    name: "Coldplay",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb989ed05e1f0570cc4726c2d3",
    monthlyListeners: 59871230,
    genres: ["permanent wave", "pop", "rock"]
  },
  {
    id: "17",
    name: "Harry Styles",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb9260c3c581e481e4c0362d0e",
    monthlyListeners: 57654321,
    genres: ["pop", "uk pop"]
  },
  {
    id: "18",
    name: "Lady Gaga",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebb12dcb035d3e693c5a669165",
    monthlyListeners: 39876540,
    genres: ["dance pop", "pop"]
  },
  {
    id: "19",
    name: "Kendrick Lamar",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebc54e063388addb796664a4a0",
    monthlyListeners: 41234567,
    genres: ["conscious hip hop", "hip hop", "west coast rap"]
  },
  {
    id: "20",
    name: "Bruno Mars",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5eb4a4a40d478f03ddd096179f4",
    monthlyListeners: 55432109,
    genres: ["pop", "r&b"]
  }
];

// Function to fetch artist data from Spotify API
export async function fetchArtistFromSpotify(artistId: string): Promise<Artist | null> {
  try {
    const accessToken = localStorage.getItem('spotify_access_token');
    
    if (!accessToken) {
      console.log('No Spotify access token found');
      return null;
    }
    
    // Fetch artist data
    const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (!artistResponse.ok) {
      console.error('Failed to fetch artist data:', await artistResponse.text());
      return null;
    }
    
    const artistData = await artistResponse.json();
    
    // Fetch artist's top tracks to get popularity
    const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (!topTracksResponse.ok) {
      console.error('Failed to fetch top tracks:', await topTracksResponse.text());
      return null;
    }
    
    const topTracks = await topTracksResponse.json();
    
    // Calculate average popularity as a substitute for monthly listeners
    // as monthly listeners is not directly available from the API
    const avgPopularity = topTracks.tracks.reduce((sum: number, track: any) => sum + track.popularity, 0) / 
      topTracks.tracks.length;
      
    // Convert to a number that looks like monthly listeners
    const estimatedMonthlyListeners = Math.round(avgPopularity * 1000000);
    
    const artist: Artist = {
      id: artistData.id,
      name: artistData.name,
      imageUrl: artistData.images[0]?.url || '',
      monthlyListeners: estimatedMonthlyListeners,
      genres: artistData.genres || []
    };
    
    return artist;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return null;
  }
}

// Function to authenticate with Spotify
export async function authenticateSpotify(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!tokenResponse.ok) {
      console.error('Failed to get access token:', await tokenResponse.text());
      return null;
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Store token in localStorage
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_token_expiry', (Date.now() + tokenData.expires_in * 1000).toString());
    
    return accessToken;
  } catch (error) {
    console.error('Error authenticating with Spotify:', error);
    return null;
  }
}

// Function to replace a mock artist with Spotify data
export async function updateArtistWithSpotifyData(artistIndex: number, spotifyArtistId: string): Promise<boolean> {
  const spotifyArtist = await fetchArtistFromSpotify(spotifyArtistId);
  
  if (spotifyArtist && artistIndex >= 0 && artistIndex < artists.length) {
    artists[artistIndex] = spotifyArtist;
    return true;
  }
  
  return false;
}

// Check if token needs refreshing
export function needsTokenRefresh(): boolean {
  const expiry = localStorage.getItem('spotify_token_expiry');
  return !expiry || Date.now() > parseInt(expiry);
}
