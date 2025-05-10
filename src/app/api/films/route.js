import { fetchFromTMDB } from "../../../lib/tmdb";

export async function GET() {
  try {
    const [popular1, popular2, topRated1, topRated2] = await Promise.all([
      fetchFromTMDB("/movie/popular", "&language=fr-FR&page=1"),
      fetchFromTMDB("/movie/popular", "&language=fr-FR&page=2"),
      fetchFromTMDB("/movie/top_rated", "&language=fr-FR&page=1"),
      fetchFromTMDB("/movie/top_rated", "&language=fr-FR&page=2"),
    ]);

    return Response.json({
      popular: [...popular1.results, ...popular2.results],
      topRated: [...topRated1.results, ...topRated2.results],
    });
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
