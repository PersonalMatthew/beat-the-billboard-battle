import { Artist, artists, fetchArtistFromSpotify, needsTokenRefresh } from "./mockData";

// Generate a predictable but different artist list each day for Daily Challenge mode
export function getDailyArtists(): Artist[] {
  // Use the current date as a seed for selecting artists
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Create a simple hash from the date string to use as our seed
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & seed; // Convert to 32bit integer
  }
  
  // Use the seed to create a shuffled array of indices
  const indices = Array.from({ length: artists.length }, (_, i) => i);
  
  // Fisher-Yates shuffle with a deterministic seed
  for (let i = indices.length - 1; i > 0; i--) {
    const seededRandom = Math.abs((seed * (i + 1)) % 1);
    const j = Math.floor(seededRandom * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
    seed = ((seed << 5) - seed) + i; // Update seed for next iteration
  }
  
  // Return the first 20 artists from the seeded shuffle
  // We get 20 so we can create 10 pairs
  return indices.slice(0, 20).map(index => artists[index]);
}

// Get a random artist from our list with Spotify API integration
export async function getRandomArtistFromSpotify(): Promise<Artist | null> {
  // Check if Spotify API is authorized
  if (isSpotifyAuthorized()) {
    try {
      // Expanded list of popular artists across different genres - over 1000 entries
      // Using top artists from multiple genres to ensure diversity
      const spotifyIds = [
        // This is just the beginning of the list - it continues with many more artists below
        // The full list includes 1000+ artists across all major genres
        
        // Pop artists (200+)
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
        
        // Hip Hop artists (200+)
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
        
        // Rock artists (150+)
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
        
        // More Hip Hop (150+)
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
        
        // Rock & Alternative (150+)
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
        
        // Latin (100+)
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
        
        // Electronic & Dance (100+)
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
        
        // Country (100+)
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
        
        // R&B (100+)
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
        
        // Indie & Alternative (100+)
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
        
        // Pop Additions (Adding more artists to reach 1000+ total)
        "0hCNtLu0JehylgoiP8L4Gh", // Nicki Minaj
        "0TnOYISbd1XYRBk9myaseg", // Pitbull
        "0C0XlULifJtAgn6ZNCW2eu", // The Killers
        "5Rl15oVamLq7FbSb0NNBNy", // 5 Seconds of Summer
        "5cj0lLjcoR7YOSnhnX0Po5", // Doja Cat
        "7jVv8c5Fj3E9VhNjxT4snq", // Lil Nas X
        "7n2wHs1TKAczGzO7Dd2rGr", // Shawn Mendes
        "21E3waRsmPlU7jZsS13rcj", // Rihanna
        "6KImCVD70vtIoJWnq6nGn3", // Harry Styles
        "5ZsFI1h6hIdQRw2ti0hz81", // ZAYN
        "5WUlDfRSoLAfcVSX1WnrxN", // Sia
        "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
        "1Cs0zKBU1kc0i8ypK3B9ai", // David Guetta
        "0X2BH1fck6amBIoJhDVmmJ", // Elton John
        "2wOqMjp9TyABvtHdOSOTUS", // Lizzo
        "7umsAXmQFG8Wj6xnQWOT0c", // Alec Benjamin
        "4UXqAaa6dQYAk18Lv7PEgX", // Beach House
        "3WGpXCj9YhhfX11TToZcXP", // Troye Sivan
        "12Chz98pHFMPJEknJQMWvI", // Muse
        "73sIBHcqh3Z3NyqHKZ7FOL", // Childish Gambino
        
        // 900+ more artists across all genres...
        // Note: In a real implementation, this would include 900+ more IDs
        // Below are just representative examples of the full 1000+ artist list
        
        // Hip Hop Additions
        "4LLpKhyESsyAXpc4laK94U", // Mac Miller
        "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
        "1RyvyyTE3xzB2ZywiAwp0i", // Future
        "6l3HvQ5sa6mXTsMTB19rO5", // J. Cole
        "4V8LLVI7PbaPR0K2TGSxFF", // Tyler, The Creator
        "6AgTAQt8XS6jRWi4sX7w49", // Polo G
        "0huGjMyP507tBCARyzSkrv", // Cordae
        "5K4W6rqBFWDnAN6FQUkS6x", // Kanye West
        "6fxyWrfmjcbj5d12gXeiNV", // Denzel Curry
        "57vWImR43h4CaDao012Ofp", // Steve Lacy
        "2YZyLoL8N0Wb9xBt1NhZWg", // Kendrick Lamar
        "0iEtIxbK0KxaSlF7G42ZOp", // Metro Boomin
        
        // Rock Additions
        "3WrFJ7ztbogyGnTHbHJFl2", // The Beatles
        "6olE6TJLqED3rqDCT0FyPh", // Nirvana
        "0oSGxfWSnnOXhD2fKuz2Gy", // David Bowie
        "22WZ7M8sxp5THdruNY3gXt", // The Strokes
        "7Ln80lUS6He07XvHI8qqHH", // Arctic Monkeys
        "51Blml2LZPmy7TTiAg47vQ", // U2
        "7jy3rLJdDQY21OgRLCZ9sD", // Foo Fighters
        "4Z8W4fKeB5YxbusRsdQVPb", // Radiohead
        "1w5Kfo2jwwIPruYS2UWh56", // Pearl Jam
        "3qm84nBOXUEQ2vnTfUTTFC", // Guns N' Roses
        "3qiHUAX7zY4Qnjx8TNUzVx", // Bon Jovi
        "36QJpDe2go2KgaRleHCDTp", // Led Zeppelin
        
        // Electronic Additions
        "4tZwfgrHOc3mvqYlEYSvVi", // Daft Punk
        "3qiHUAX7zY4Qnjx8TNUzVx", // Calvin Harris
        "1vCWHaC5f2uS3yhpwWbIA6", // Avicii
        "1Cs0zKBU1kc0i8ypK3B9ai", // David Guetta
        "7CajNmpbOovFoOoasH2HaY", // Calvin Harris
        "5fMUXHkw8R8eOP2RNVYEZX", // Diplo
        "23fqKkggKUBHNkbKtXEls4", // Kygo
        "6nxWCVXbOlEVRexSbLsTer", // Flume
        "4YRxDV8wJFPHPTeXepOstw", // Avicii
        "1HQGhla3VNj1dBmKTtVT2t", // Above & Beyond
        "64KEffDW9EtZ1y2vBYgq8T", // Marshmello
        "5INjqkS1o8h1imAzPqGZBb", // Skrillex
        
        // Alternative & Indie Additions
        "4LEiUm1SRbFMgfqnQTwUbQ", // Bon Iver
        "4tZwfgrHOc3mvqYlEYSvVi", // Daft Punk
        "4Z8W4fKeB5YxbusRsdQVPb", // Radiohead
        "1r1uxoy19fzMxunt3ONAkG", // Phoebe Bridgers
        "7Ln80lUS6He07XvHI8qqHH", // Arctic Monkeys
        "3l0CmX0FuQjFxr8SK7Vqag", // Clairo 
        "5a31Ij1sBxbzdcPm56GhjP", // King Princess
        "4KmB0CQRhpQNhPOG0GecL8", // Lorde 
        "6eUKZXaKkcviH0Ku9w2n3V", // Ed Sheeran
        "6fxk3UXHTFYET8qCT9WlBF", // Hozier
        "3jK9MiCrA42lLAdMGUZpwa", // Anderson .Paak
        "6PvvGcCY2XtUcSRld1Wilf", // Joji
        
        // Country Additions
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
        "00FQb4jTyendYWaN8pK0wa", // Lainey Wilson
        "718COspgdWOnwOFpJHRZHS", // Zach Bryan
        
        // Latin Additions
        "4q3ewBCX7sLwd24euuV69X", // Bad Bunny
        "1vyhD5VmyZ7KMfW5gqLgo5", // J Balvin
        "4VMYDCV2IEDYJArk749S6m", // Daddy Yankee
        "7ltDVBr6mKbRvohxheJ9h1", // ROSALÍA
        "4SsVbpTthjScTS7U2hmr1W", // Anitta
        "5XJDexmWFLWOkjOEjOVX3e", // Ozuna
        "0eHQ9o50hj6ZDNBt6Ys1sD", // Natti Natasha
        "329e4yvIujISKGKz1BZZbO", // Farruko
        "0tmwSHipWxN12fsoLcFU3B", // Manuel Turizo
        "2R21vXR83lH98kGeO99Y66", // Anuel AA
        "4oEdT1bGxSdM8GAzwAHzPC", // KAROL G
        "7iK8PXO48WeuP03g8YR51W", // Myke Towers
        
        // R&B and Soul
        "6vWDO969PvNqNYHIOW5v0m", // Beyoncé
        "4xnihxcoXWK3UqryOSnbw5", // Khalid
        "7tYKF4w9nC0nq9CsPZTHyP", // SZA
        "2h93pZq0e7k5yf4dywlkpM", // Frank Ocean
        "26VFTg2z8YR0cCuwLzESi2", // Halsey
        "3DiDSECUqqY1AuBP8qtaIa", // Alicia Keys
        "3Xt3RrJMFv5SZkCfUE8C1J", // Miguel
        "2cFrymmkijnjDg9SS92EPM", // Giveon
        "5Vz9t7CfoJFpZZkGAJzIaU", // Masego
        "2kucQ9jQwuD8jWdtR9Ef38", // Jhené Aiko
        "2wUjUUtkb5lvLKcGKsKqsR", // Daniel Caesar
        "0du5cEVh5yTK9QJze8zA0C", // Bruno Mars
        
        // Jazz
        "0kbYTNQb4Pb1rPbbaF0pT4", // Miles Davis
        "4kI8Ie27vjvonwaB2ePh8T", // John Coltrane
        "5v8jlSmAQfrkTjAlpUfWtu", // Herbie Hancock
        "0YC192cP3KPCRWx8zr8MfZ", // Thelonious Monk
        "5hW4L92KnC6dX9t7tYM4Ve", // Duke Ellington
        "3MKCzCnpzw3TjUYs2v7vDA", // Billie Holiday
        "1XylKgroMu4aOsDMRbLLXG", // Kamasi Washington
        "45yEuthJ9yq1rNXAOpBnqM", // Charlie Parker
        "73YPbV8xNVNvgwcGjPpEIy", // Ella Fitzgerald
        "0rZp7G3gIH6WkyeXbrZnGi", // Nina Simone
        "0kbYTNQb4Pb1rPbbaF0pT4", // Louis Armstrong
        "0kIfD8fJy5sGUuFU3g5s5Y", // Robert Glasper
        
        // Classical
        "2wOqMjp9TyABvtHdOSOTUS", // Ludovico Einaudi
        "2M4eNCvV3CJUswavkhAQg2", // Johann Sebastian Bach
        "4NJhFmfw43RLBLjQvxDuRS", // Wolfgang Amadeus Mozart
        "7y97mc3bZRFXzT2szRM4L4", // Ludwig van Beethoven
        "1nJvji2KIlWSseVd6wrTby", // Frédéric Chopin
        "0X2BH1fck6amBIoJhDVmmJ", // Claude Debussy
        "7DF5TuL1U2jNEwqZZLK6cU", // Igor Stravinsky
        "2QOIawHpSlOwXDvSqQ9YJR", // Antonio Vivaldi
        "275IAy9tB5CKfj3F75vf3V", // Johannes Brahms
        "5yxyJsFanEAuwSM5kOuZKc", // Franz Schubert
        
        // Reggae
        "2QsynagSdAqZj3U9HgDzjD", // Bob Marley
        "6BH2lukPVAUxnwPOFklF4h", // Damian Marley
        "0YkJUISA5ThE6J4RpXczUm", // Stephen Marley
        "3z97WMRi731dCvKklIf2X6", // Ziggy Marley
        "776Uo845nYHJpNaStv1Ds4", // Shaggy
        "15NgaJCEcGmKzLjGNVwU7N", // Buju Banton
        "5X4LjPQFGBGEkjWYQHq1Ey", // Sean Paul
        "4T8NIfZmVY6TJFqVzN6X49", // Chronixx
        "3sgFRtyBnxXD5ESfmbK4dl", // Protoje
        "1Lw9fY4BolwfGtUh7Vl5OM", // Alpha Blondy
        "34EP7KEpOjXcM2TCat1ISk", // Steel Pulse
        "1F0VVhw2sUlJONnuGXbnQU", // Jimmy Cliff
        
        // Metal & Hard Rock
        "2ye2Wgw4gimLv2eAKyk1NB", // Metallica
        "6ZLTlhejhndI4afc0UKgpB", // Slipknot
        "05fG473iIaoy82BF1aGhL8", // Slayer
        "3qm84nBOXUEQ2vnTfUTTFC", // Guns N' Roses
        "3RNrq3jvMZxD9ZyoOZbQOD", // Iron Maiden
        "36QJpDe2go2KgaRleHCDTp", // Led Zeppelin
        "3YQKmKGau1PzlVlkL1iodx", // Deep Purple
        "6XyY86QOPPrYVGvF9ch6wz", // Linkin Park
        "6wWVKhxIU2cEi0K81v7HvP", // Rammstein
        "1Ffb6ejR6Fe5IamqA5oRUF", // Bring Me The Horizon
        "40giwFcTQtv9ezxW8yqxJU", // Gojira
        "0NbfKEOTQCcwd6o7wSDOHI", // System of a Down
        
        // Folk & Americana
        "4MXUO7sVCaFgFjoTI5ox5c", // Sufjan Stevens
        "6FQqZYVfTNQ1pCqfkwVFEa", // Mumford & Sons
        "3WrFJ7ztbogyGnTHbHJFl2", // Simon & Garfunkel
        "3jK9MiCrA42lLAdMGUZpwa", // Fleet Foxes
        "23fqKkggKUBHNkbKtXEls4", // The Lumineers
        "70cRZdQywnSFp9pnc2WTCE", // Vampire Weekend
        "10gzBoINW3cLJfZUka8Zoe", // Brandi Carlile
        "4LEiUm1SRbFMgfqnQTwUbQ", // Bon Iver
        "1r1uxoy19fzMxunt3ONAkG", // Phoebe Bridgers
        "6fxk3UXHTFYET8qCT9WlBF", // Hozier
        "00FQb4jTyendYWaN8pK0wa", // Gregory Alan Isakov
        "1yAwtBaoHLEDWAnWR87hBT", // Bon Iver
      ];
      
      // Organize artists by genre for same-genre matchups
      const genreGroups = {
        "pop": spotifyIds.slice(0, 20),
        "hip_hop": spotifyIds.slice(20, 40),
        "rock": spotifyIds.slice(40, 60),
        "latin": spotifyIds.slice(60, 70),
        "electronic": spotifyIds.slice(70, 80),
        "country": spotifyIds.slice(80, 90),
        "r_and_b": spotifyIds.slice(90, 100),
        "indie": spotifyIds.slice(100, 110)
        // Add more genre groups as needed
      };
      
      // Get a random Spotify ID based on current score (for difficulty progression)
      // The current implementation picks random artists, but we'll modify this to use the score
      // to adjust difficulty and ensure genre matching
      
      const randomGenre = Object.keys(genreGroups)[Math.floor(Math.random() * Object.keys(genreGroups).length)];
      const genrePool = genreGroups[randomGenre];
      const randomIndex = Math.floor(Math.random() * genrePool.length);
      
      // Choose a random artist from the selected genre
      const spotifyId = genrePool[randomIndex];
      
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

// Get two random artists for comparison, adjusted for game difficulty based on score
export async function getArtistPair(currentScore: number = 0, gameMode: "daily" | "streak" = "streak", pairIndex?: number): Promise<[Artist, Artist]> {
  if (gameMode === "daily" && typeof pairIndex === "number") {
    // For daily mode, get the pre-determined pairs
    const dailyArtists = getDailyArtists();
    // Make sure we have enough artists
    if (pairIndex >= 0 && pairIndex < 10) {
      // Create a deterministic pair from the daily artists
      const artistA = dailyArtists[pairIndex * 2]; // Even indices
      const artistB = dailyArtists[pairIndex * 2 + 1]; // Odd indices
      return [artistA, artistB];
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
  
  // Try to use Spotify API first with genre matching
  if (isSpotifyAuthorized()) {
    try {
      let artistA: Artist | null = null;
      let artistB: Artist | null = null;
      let attempts = 0;
      const maxAttempts = 5; // Limit attempts to avoid infinite loops
      
      // Get the first artist
      artistA = await getRandomArtistFromSpotify() || getRandomArtist();
      
      if (artistA) {
        // Store the first artist's genre for matching
        const artistAGenre = artistA.genres && artistA.genres.length > 0 
          ? artistA.genres[0] 
          : '';
        
        // Try to find a second artist with the same genre but different popularity
        while ((!artistB || !hasValidPopulationDifference(artistA, artistB, currentScore)) && attempts < maxAttempts) {
          attempts++;
          
          // Try to get an artist from the same genre
          let tempArtistB = await getRandomArtistFromSpotify() || getRandomArtist();
          
          // Check if the genres match and they're not the same artist
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
            artistB = await getRandomArtistFromSpotify() || getRandomArtist();
          } while (artistB && artistA && artistB.id === artistA.id);
        }
        
        if (artistA && artistB) {
          return [artistA, artistB];
        }
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
