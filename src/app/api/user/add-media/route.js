import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function POST(req) {
  await connectToDB();

  const token = req.headers.get("token");
  const body = await req.json();
  const { type, tmdbId, title, posterPath, note } = body;

  if (!["movies", "series"].includes(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    if (!user[type]) {
      user[type] = [];
    }

    const list = user[type];
    const exists = list.some((entry) => entry.tmdbId === tmdbId);

    let genres = [];

    // 🔍 Appel TMDb selon type
    if (!exists) {
      const endpoint =
        type === "movies"
          ? `https://api.themoviedb.org/3/movie/${tmdbId}`
          : `https://api.themoviedb.org/3/tv/${tmdbId}`;

      const res = await fetch(
        `${endpoint}?api_key=${TMDB_API_KEY}&language=fr-FR`
      );
      if (res.ok) {
        const data = await res.json();
        genres = data.genres.length ? [data.genres[0].name] : [];
      }
    }

    if (exists) {
      user[type] = list.map((entry) =>
        entry.tmdbId === tmdbId ? { ...entry.toObject(), note } : entry
      );
    } else {
      user[type].push({ tmdbId, title, posterPath, note, genres });
    }

    user.markModified(type);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API add-media :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
