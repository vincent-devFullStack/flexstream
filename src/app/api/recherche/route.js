import { fetchFromTMDB } from "../tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return Response.json({ results: [] });
  }

  try {
    const data = await fetchFromTMDB(
      "/search/movie",
      `&query=${encodeURIComponent(query)}&language=fr-FR`
    );
    return Response.json({ results: data.results });
  } catch (error) {
    console.error("Erreur /api/recherche :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
