export default async function handler(req, res) {
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
      return res.status(500).json({ error: "Erreur TMDB" });
    }

    const popular = await popularRes.json();
    const topRated = await topRatedRes.json();

    res.status(200).json({
      popular: popular.results,
      topRated: topRated.results,
    });
  } catch (error) {
    console.error("Erreur API series:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
