
import { Artist, artists } from "./mockData";

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
export function getArtistPair(): [Artist, Artist] {
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
