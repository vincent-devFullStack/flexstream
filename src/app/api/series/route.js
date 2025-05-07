export async function GET() {
  const { TMDB_API_KEY } = process.env;

  try {
    const [popularRes, topRatedRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`
      ),
    ]);

    if (!popularRes.ok || !topRatedRes.ok) {
      return Response.json({ error: "Erreur TMDB" }, { status: 500 });
    }

    const popular = await popularRes.json();
    const topRated = await topRatedRes.json();

    return Response.json({
      popular: popular.results,
      topRated: topRated.results,
    });
  } catch (error) {
    console.error("Erreur API series:", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
