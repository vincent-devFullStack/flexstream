export async function GET() {
  const { TMDB_API_KEY } = process.env;

  if (!TMDB_API_KEY) {
    return new Response(JSON.stringify({ error: "Clé API TMDB manquante" }), {
      status: 500,
    });
  }

  const urls = [
    `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=2`,
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`,
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=2`,
  ];

  try {
    const responses = await Promise.all(urls.map((url) => fetch(url)));

    const allOk = responses.every((res) => res.ok);
    if (!allOk) {
      console.error("[TMDB] Une ou plusieurs requêtes ont échoué :", responses);
      return new Response(
        JSON.stringify({ error: "Erreur lors de la récupération des séries" }),
        { status: 500 }
      );
    }

    const [popular1, popular2, topRated1, topRated2] = await Promise.all(
      responses.map((res) => res.json())
    );

    const popular = [...popular1.results, ...popular2.results];
    const topRated = [...topRated1.results, ...topRated2.results];

    return new Response(JSON.stringify({ popular, topRated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[TMDB] Erreur globale API séries :", err);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
}
