import { getWatchProviders } from "@/lib/tmdb";

export async function GET(req, context) {
  const { id, type } = await context.params;

  if (!id || !type) {
    return new Response(JSON.stringify({ error: "ID ou type manquant" }), {
      status: 400,
    });
  }

  try {
    const providers = await getWatchProviders(id, type);
    return new Response(JSON.stringify(providers), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur API providers :", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération des providers" }),
      { status: 500 }
    );
  }
}
