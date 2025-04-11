
import { Artist, artists, fetchArtistFromSpotify, needsTokenRefresh } from "./mockData";

// Get a random artist from our list with Spotify API integration
export async function getRandomArtistFromSpotify(): Promise<Artist | null> {
  // Check if Spotify API is authorized
  if (isSpotifyAuthorized()) {
    try {
      // Expanded list of popular artists across different genres
      const spotifyIds = [
        // Pop
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
        "0du5cEVh5yTK9QJze8zA0C", // Bruno Mars
        
        // New artists
        "0C8ZW7ezQVs4URX5aX7Kqx", // Selena Gomez
        "4NHQUGzhtTLFvgF5SZesLK", // Tame Impala
        "5Pwc4xIPtQLFEnJriah9YJ", // OneRepublic
        "2wY79sveU1sp5g7SokKOiI", // Sam Smith
        "5y8tKLUfMvliMe8IKamR32", // Fleetwood Mac
        "0EmeFodog0BfCgMzAIvKQp", // Shakira
        "2wUjUUtkb5lvLKcGKsKqsR", // Alessia Cara
        "7n2wHs1TKAczGzO7Dd2rGr", // Shawn Mendes
        "64KEffDW9EtZ1y2vBYgq8T", // Marshmello
        "4tZwfgrHOc3mvqYlEYSvVi", // Daft Punk
        
        // Hip Hop
        "55Aa2cqylxrFIXC767Z865", // Lil Wayne
        "5f7VJjfbwm532GiveGC0ZK", // Lil Baby
        "6l3HvQ5sa6mXTsMTB19rO5", // J. Cole
        "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
        "6KZDXtSj0SzGOV705nNeh3", // Kid Cudi
        "0iEtIxbK0KxaSlF7G42ZOp", // Metro Boomin
        "4O15NlyKLIASxsJ0PrXPfz", // Lil Uzi Vert
        "2hlmm7s2ICUX0LVIhVFlZQ", // Gunna
        "4r63FhuTkUYltbVAg5TQnk", // DaBaby
        "7wlFDEWiM5OoIAt8RSli8b", // Tyler, The Creator
        
        // Rock
        "3k2zN7LVuxRRMLQbVU3Etd", // Imagine Dragons
        "3YQKmKGau1PzlVlkL1iodx", // Twenty One Pilots
        "6XyY86QOPPrYVGvF9ch6wz", // Linkin Park
        "53XhwfbYqKCa1cC15pYq2q", // Imagine Dragons
        "6DCIj8jNaNpBz8e5oKFPtp", // The 1975
        "711MCceyCBcFnzjGY4Q7Un", // AC/DC
        "69GGBxA162lTqCwzJG5jLp", // The Chainsmokers
        "3RNrq3jvMZxD9ZyoOZbQOD", // Arcade Fire
        "4kI8Ie27vjvonwaB2ePh8T", // Portugal. The Man
        "27T030eWyCQRmDyuvr1kxY", // Lorde
        
        // Latin
        "1vyhD5VmyZ7KMfW5gqLgo5", // J Balvin
        "4VMYDCV2IEDYJArk749S6m", // Daddy Yankee
        "7ltDVBr6mKbRvohxheJ9h1", // ROSALÍA
        "4SsVbpTthjScTS7U2hmr1W", // Anitta
        "5XJDexmWFLWOkjOEjOVX3e", // Ozuna
        "0eHQ9o50hj6ZDNBt6Ys1sD", // Natti Natasha
        "329e4yvIujISKGKz1BZZbO", // Farruko
        "0tmwSHipWxN12fsoLcFU3B", // Manuel Turizo
        "2R21vXR83lH98kGeO99Y66", // Anuel AA
        "4q3ewBCX7sLwd24euuV69X", // Bad Bunny
        
        // Electronic/Dance
        "4YRxDV8wJFPHPTeXepOstw", // Avicii
        "2CIMQHirSU0MQqyYHq0eOx", // Deadmau5
        "57dN52uHvrHOxijzpIgu3E", // Rüfüs Du Sol
        "7jLSEPYCYQ5ssWU3BICqrW", // ODESZA
        "5INjqkS1o8h1imAzPqGZBb", // Skrillex
        "5he5w2lnU9x7JFhnwcekXX", // Martin Garrix
        "45eNHdiiabvmbp4erw26rg", // ILLENIUM
        "6nxWCVXbOlEVRexSbLsTer", // Flume
        "1anyVhU62p31KFi8MEzkbf", // Kygo
        "40ZNYROS4zLfyyBSs2PGe2", // Zedd
        
        // Country
        "4YLtscXsxbVgi031ovDDdh", // Chris Stapleton
        "26bcq2nyj5GB7uRr558iQg", // Maren Morris
        "2q3GG88dVwuQPF4FmySr9I", // Kacey Musgraves
        "1n2pb9Tsfe4SwAjmUac6YT", // Luke Combs
        "4oUHIQIBe0LHzYfvXNW4QM", // Morgan Wallen
        "6roFdX1y5BYSbp60OTJWMd", // Kelsea Ballerini
        "4pb4rqWSoGUgxm63xmJ8xc", // Blake Shelton
        "31TPClRtHm23RisEBtV3X7", // Justin Moore
        "2m62cc253Xvd9qYQ8d2X3d", // Jason Aldean
        "1dID9zgn0OV0Y8FNRu9JL8", // Carrie Underwood
        
        // R&B
        "6vWDO969PvNqNYHIOW5v0m", // Beyoncé
        "6l3HvQ5sa6mXTsMTB19rO5", // J. Cole
        "68kEuyFKyqrdQQLLsmiatm", // Vince Staples
        "2RdwBSPQiwcmiDo9kixcl8", // Pharrell Williams
        "7c0XG5cIJTrrAgEC3ULPiq", // Ty Dolla $ign
        "4xnihxcoXWK3UqryOSnbw5", // Khalid
        "7tYKF4w9nC0nq9CsPZTHyP", // SZA
        "2h93pZq0e7k5yf4dywlkpM", // Frank Ocean
        "26VFTg2z8YR0cCuwLzESi2", // Halsey
        "3DiDSECUqqY1AuBP8qtaIa", // Alicia Keys
        
        // Indie
        "4UXqAaa6dQYAk18Lv7PEgX", // Beach House
        "7Ln80lUS6He07XvHI8qqHH", // Arctic Monkeys
        "22WZ7M8sxp5THdruNY3gXt", // The Strokes
        "6sFIWsNpZYqfjUpaCgueju", // Carly Rae Jepsen
        "1r1uxoy19fzMxunt3ONAkG", // Phoebe Bridgers
        "6fxk3UXHTFYET8qCT9WlBF", // Hozier
        "3l0CmX0FuQjFxr8SK7Vqag", // Clairo
        "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
        "2kucQ9jQwuD8jWdtR9Ef38", // Father John Misty
        "4V8LLVI7PbaPR0K2TGSxFF", // Tyler, The Creator
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
