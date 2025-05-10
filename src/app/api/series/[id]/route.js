import { getSerieDetails } from "@/lib/tmdb";

export async function GET(_request, context) {
  const { id } = await context.params; // ✅ nécessaire pour éviter le warning Next.js

  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const serie = await getSerieDetails(id);

    if (!serie) {
      return Response.json({ error: "Série introuvable" }, { status: 404 });
    }

    return Response.json(serie);
  } catch (error) {
    console.error("Erreur API /series/[id] :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
