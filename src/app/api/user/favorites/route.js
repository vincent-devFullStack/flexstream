import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Ajouter un média aux favoris
export async function POST(req) {
  await connectToDB();

  const token = req.headers.get("token");
  const { tmdbId, type, mediaData } = await req.json();

  if (!token || !tmdbId || !type || !mediaData) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer le premier genre, sinon "Sans genre"
    const firstGenre =
      Array.isArray(mediaData.genres) && mediaData.genres.length > 0
        ? mediaData.genres[0].name
        : "Sans genre";

    if (type === "movies") {
      if (!user.movies.some((m) => m.tmdbId === tmdbId)) {
        user.movies.push({
          tmdbId: mediaData.tmdbId,
          title: mediaData.title,
          posterPath: mediaData.posterPath,
          note: mediaData.note,
          genre: firstGenre, // le seul champ de genre
        });
      }
    } else if (type === "series") {
      if (!user.series.some((s) => s.tmdbId === tmdbId)) {
        user.series.push({
          tmdbId: mediaData.tmdbId,
          title: mediaData.title,
          posterPath: mediaData.posterPath,
          note: mediaData.note,
          genre: firstGenre,
        });
      }
    } else {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Supprimer un média des favoris
export async function DELETE(req) {
  await connectToDB();

  const token = req.headers.get("token");
  const { tmdbId, type } = await req.json();

  if (!token || !tmdbId || !type) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (type === "movies") {
      user.movies = user.movies.filter((m) => m.tmdbId !== tmdbId);
    } else if (type === "series") {
      user.series = user.series.filter((s) => s.tmdbId !== tmdbId);
    } else {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
