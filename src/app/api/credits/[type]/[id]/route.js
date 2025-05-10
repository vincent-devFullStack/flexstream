import { fetchFromTMDB } from "@/lib/tmdb";

export async function GET(request, context) {
  const { id, type } = await context.params;

  if (!id || !type) {
    return Response.json({ error: "ID ou type manquant" }, { status: 400 });
  }

  try {
    const data = await fetchFromTMDB(`/${type}/${id}/credits`);
    return Response.json(data);
  } catch (error) {
    console.error("Erreur API credits :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
