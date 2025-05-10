const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY manquante. Vérifie ton .env.local");
}

export async function fetchFromTMDB(endpoint, params = "") {
  const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}${params}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // ou cache: "no-store"
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[TMDb] ${endpoint} : ${res.status}`, errorText);
    throw new Error(`Erreur TMDb sur ${endpoint}`);
  }

  return res.json();
}

// Fonctions spécifiques
export async function getPopularMovies() {
  const data = await fetchFromTMDB("/movie/popular", "&language=fr-FR&page=1");
  return data.results;
}

export async function getTopRatedMovies() {
  const data = await fetchFromTMDB(
    "/movie/top_rated",
    "&language=fr-FR&page=1"
  );
  return data.results;
}

export async function getMovieDetails(id) {
  const data = await fetchFromTMDB(`/movie/${id}`, "&language=fr-FR");
  return data;
}

export async function getSearchResults(query) {
  const data = await fetchFromTMDB(
    "/search/movie",
    `&query=${encodeURIComponent(query)}&language=fr-FR`
  );
  return data.results;
}

export async function getPopularSeries() {
  const data = await fetchFromTMDB("/tv/popular", "&language=fr-FR&page=1");
  return data.results;
}

export async function getTopRatedSeries() {
  const data = await fetchFromTMDB("/tv/top_rated", "&language=fr-FR&page=1");
  return data.results;
}

export async function getSerieDetails(id) {
  return fetchFromTMDB(`/tv/${id}`, "&language=fr-FR");
}

export async function getWatchProviders(id, type = "movie") {
  const url = `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.error(`Erreur TMDB (${url})`, res.status, text);
    return {};
  }

  const data = await res.json();
  const results = data.results?.FR || {};

  return {
    flatrate: results.flatrate || [],
    rent: results.rent || [],
    buy: results.buy || [],
  };
}
