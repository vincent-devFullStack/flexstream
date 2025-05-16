const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!TMDB_API_KEY) {
  throw new Error("Clé API TMDb manquante. Vérifie ton .env.local !");
}

async function fetchFromTMDB(endpoint, params = "") {
  const url = `${BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}${params}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Met en cache pendant 1h pour limiter les appels
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[TMDb] Erreur sur ${endpoint} (${res.status})`, errorText);
    throw new Error(
      `Impossible de récupérer les données depuis TMDb (${endpoint})`
    );
  }

  return res.json();
}

// Films
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
  return fetchFromTMDB(`/movie/${id}`, "&language=fr-FR");
}

// Recherche
export async function getSearchResults(query) {
  const data = await fetchFromTMDB(
    "/search/movie",
    `&query=${encodeURIComponent(query)}&language=fr-FR`
  );
  return data.results;
}

// Séries
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
  const url = `${BASE_URL}/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[TMDb] Fournisseurs indisponibles (${url})`,
      res.status,
      text
    );
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

export async function getMovieVideos(id) {
  const data = await fetchFromTMDB(`/movie/${id}/videos`, "&language=fr-FR");
  return data.results;
}

export async function getSerieVideos(id) {
  const data = await fetchFromTMDB(`/tv/${id}/videos`, "&language=fr-FR");
  return data.results;
}

export async function getMovieCredits(id) {
  const data = await fetchFromTMDB(`/movie/${id}/credits`, "&language=fr-FR");
  return data.cast;
}

export async function getSerieCredits(id) {
  const data = await fetchFromTMDB(`/tv/${id}/credits`, "&language=fr-FR");
  return data.cast;
}

export { fetchFromTMDB };
