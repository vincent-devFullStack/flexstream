const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

console.log("Clé TMDB chargée :", TMDB_API_KEY);

export async function getPopularMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb API Error:", res.status, errorText);
    throw new Error("Erreur lors du chargement des films");
  }

  const data = await res.json();
  return data.results;
}

export async function getMovieDetails(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR`
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb Film Error:", res.status, errorText);
    throw new Error("Erreur lors du chargement du film");
  }

  return res.json();
}

export async function getSearchResults(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    process.env.TMDB_API_KEY
  }&language=fr-FR&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb search error:", res.status, errorText);
    throw new Error("Erreur lors de la recherche");
  }

  const data = await res.json();
  return data.results;
}

export async function getPopularSeries() {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb API Series Error:", res.status, errorText);
    throw new Error("Erreur lors du chargement des séries");
  }

  const data = await res.json();
  return data.results;
}

export async function getTopRatedSeries() {
  const res = await fetch(
    `${BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb Top Rated Series Error:", res.status, errorText);
    throw new Error("Erreur lors du chargement des séries mieux notées");
  }

  const data = await res.json();
  return data.results;
}

export async function getTopRatedMovies() {
  const res = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TMDb Top Rated Movies Error:", res.status, errorText);
    throw new Error("Erreur lors du chargement des films mieux notés");
  }

  const data = await res.json();
  return data.results;
}
