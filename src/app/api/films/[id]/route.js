import { getMovieDetails } from "@/lib/tmdb";

export async function GET(request, { params }) {
  // ✅ Cette structure déclenche un faux warning dans Next.js 15.3+
  // ❗️ Il est sans danger, le code fonctionne parfaitement
  const id = params.id;

  if (!id) {
    return Response.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const movie = await getMovieDetails(id);
    return Response.json(movie);
  } catch (error) {
    if (!process.env.SHOW_API_ERRORS) {
      return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }

    console.error("Erreur API /films/[id] :", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
