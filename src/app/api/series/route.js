export async function GET() {
  const { TMDB_API_KEY } = process.env;

  try {
    const urls = [
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
      `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=2`,
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=2`,
    ];

    const [pop1, pop2, top1, top2] = await Promise.all(
      urls.map((url) => fetch(url))
    );

    if (![pop1, pop2, top1, top2].every((res) => res.ok)) {
      return Response.json({ error: "Erreur TMDB" }, { status: 500 });
    }

    const [popular1, popular2, topRated1, topRated2] = await Promise.all([
      pop1.json(),
      pop2.json(),
      top1.json(),
      top2.json(),
    ]);

    return Response.json({
      popular: [...popular1.results, ...popular2.results],
      topRated: [...topRated1.results, ...topRated2.results],
    });
  } catch (error) {
    console.error("Erreur API series:", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
