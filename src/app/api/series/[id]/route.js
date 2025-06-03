import { getSerieDetails } from "@/lib/tmdb";

export async function GET(_request, context) {
  const { id } = await context.params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID de la série manquant dans l'URL" }),
      { status: 400 }
    );
  }

  try {
    const serie = await getSerieDetails(id);

    if (!serie) {
      return new Response(JSON.stringify({ error: "Série introuvable" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(serie), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "Impossible de récupérer les détails de la série",
      }),
      { status: 500 }
    );
  }
}
