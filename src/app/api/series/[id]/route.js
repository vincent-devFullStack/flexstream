import { getSerieDetails } from "../../tmdb";

export async function GET(_request, { params }) {
  const id = params?.id;

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
