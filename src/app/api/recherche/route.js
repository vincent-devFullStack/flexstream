import { fetchFromTMDB } from "../../../lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ results: [] });
  }

  try {
    // Appels parallèles pour films et séries
    const [movieData, tvData] = await Promise.all([
      fetchFromTMDB(
        "/search/movie",
        `&query=${encodeURIComponent(query)}&language=fr-FR`
      ),
      fetchFromTMDB(
        "/search/tv",
        `&query=${encodeURIComponent(query)}&language=fr-FR`
      ),
    ]);

    // Normalisation des résultats avec type
    const movieResults = (movieData.results || []).map((item) => ({
      id: item.id,
      title: item.title,
      vote_average: item.vote_average,
      poster_path: item.poster_path,
      type: "movie",
    }));

    const tvResults = (tvData.results || []).map((item) => ({
      id: item.id,
      title: item.name,
      vote_average: item.vote_average,
      poster_path: item.poster_path,
      type: "tv",
    }));

    // Fusion et limite
    const combined = [...movieResults, ...tvResults].slice(0, 10);

    return Response.json({ results: combined });
  } catch (error) {
    console.error("Erreur /api/recherche :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
