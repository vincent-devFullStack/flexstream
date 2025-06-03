import { getSerieVideos } from "@/lib/tmdb";

export async function GET(_request, context) {
  const { id } = await context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID manquant" }), {
      status: 400,
    });
  }

  try {
    const data = await getSerieVideos(id);
    return new Response(JSON.stringify({ results: data }));
  } catch {
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des vidéos" }),
      { status: 500 }
    );
  }
}
