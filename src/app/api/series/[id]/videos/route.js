import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const endpoint = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=fr-FR`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Erreur TMDb : ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur /api/films/[id]/videos :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
