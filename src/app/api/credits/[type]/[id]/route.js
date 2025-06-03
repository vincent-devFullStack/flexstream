import { getMovieCredits, getSerieCredits } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  const { id, type } = await context.params;

  if (!id || !type) {
    return new Response(
      JSON.stringify({ error: "ID ou type manquant dans l'URL" }),
      { status: 400 }
    );
  }

  try {
    const data =
      type === "tv" ? await getSerieCredits(id) : await getMovieCredits(id);

    return new Response(JSON.stringify({ cast: data }));
  } catch {
    return new Response(
      JSON.stringify({ error: "Erreur lors du chargement du casting" }),
      { status: 500 }
    );
  }
}
