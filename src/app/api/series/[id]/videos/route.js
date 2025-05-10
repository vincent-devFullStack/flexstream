import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(_request, context) {
  const { id } = await context.params; // ✅ pour éviter le warning

  if (!id) {
    return new Response(JSON.stringify({ error: "ID manquant" }), {
      status: 400,
    });
  }

  try {
    const data = await fetchFromTMDB(`/tv/${id}/videos`, "&language=fr-FR");
    return new Response(JSON.stringify(data));
  } catch (err) {
    console.error("Erreur getVideos série:", err);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des vidéos" }),
      { status: 500 }
    );
  }
}
