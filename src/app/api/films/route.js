import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET() {
  try {
    const [popular1, popular2, topRated1, topRated2] = await Promise.all([
      fetchFromTMDB("/movie/popular", "&language=fr-FR&page=1"),
      fetchFromTMDB("/movie/popular", "&language=fr-FR&page=2"),
      fetchFromTMDB("/movie/top_rated", "&language=fr-FR&page=1"),
      fetchFromTMDB("/movie/top_rated", "&language=fr-FR&page=2"),
    ]);

    const popular = [
      ...(popular1?.results || []),
      ...(popular2?.results || []),
    ];
    const topRated = [
      ...(topRated1?.results || []),
      ...(topRated2?.results || []),
    ];

    return new Response(JSON.stringify({ popular, topRated }), {
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Impossible de récupérer les films" }),
      { status: 500 }
    );
  }
}
