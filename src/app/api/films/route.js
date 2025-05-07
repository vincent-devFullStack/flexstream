import { fetchFromTMDB } from "../tmdb";

export async function GET() {
  try {
    const [popularRes, topRatedRes] = await Promise.all([
      fetchFromTMDB("/movie/popular", "&language=fr-FR"),
      fetchFromTMDB("/movie/top_rated", "&language=fr-FR"),
    ]);

    return Response.json({
      popular: popularRes.results,
      topRated: topRatedRes.results,
    });
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
