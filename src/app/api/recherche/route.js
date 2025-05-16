import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
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

    const combined = [...movieResults, ...tvResults].slice(0, 10);

    return new Response(JSON.stringify({ results: combined }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`[TMDB] Erreur recherche "${query}" :`, err);
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue lors de la recherche" }),
      { status: 500 }
    );
  }
}
