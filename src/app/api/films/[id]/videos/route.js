import { getMovieVideos } from "@/lib/tmdb";

export async function GET(_req, context) {
  const { id } = await context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID manquant" }), {
      status: 400,
    });
  }

  try {
    const data = await getMovieVideos(id);
    return new Response(JSON.stringify({ results: data }));
  } catch (err) {
    console.error("Erreur getMovieVideos:", err);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des vidéos" }),
      { status: 500 }
    );
  }
}
