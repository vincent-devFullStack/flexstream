import { getMovieDetails } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  const { id } = await context.params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID du film manquant dans l'URL" }),
      { status: 400 }
    );
  }

  try {
    const movie = await getMovieDetails(id);
    return new Response(JSON.stringify(movie));
  } catch (err) {
    console.error(`[TMDB] Erreur chargement film ${id} :`, err);
    return new Response(
      JSON.stringify({ error: "Impossible de charger les détails du film" }),
      { status: 500 }
    );
  }
}
