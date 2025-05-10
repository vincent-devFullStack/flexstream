import { getMovieDetails } from "@/lib/tmdb";

export async function GET(request, context) {
  const { id } = await context.params;

  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const movie = await getMovieDetails(id);
    return Response.json(movie);
  } catch (error) {
    console.error("Erreur API /films/[id] :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
