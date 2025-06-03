import { getWatchProviders } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(_req, context) {
  const { id, type } = await context.params;

  if (!id || !type) {
    return new Response(
      JSON.stringify({ error: "ID ou type manquant dans l'URL" }),
      { status: 400 }
    );
  }

  try {
    const providers = await getWatchProviders(id, type);

    return new Response(JSON.stringify(providers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "Impossible de récupérer les plateformes disponibles",
      }),
      { status: 500 }
    );
  }
}
