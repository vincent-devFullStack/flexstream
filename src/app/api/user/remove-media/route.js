import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectToDB();

  const token = req.headers.get("token"); // ✅ Correction ici
  const { tmdbId, type } = await req.json();

  // ✅ Log utile pour débug
  console.log("🛠️ Requête suppression reçue :", {
    tokenPresent: !!token,
    tmdbId,
    type,
  });

  if (!token || !tmdbId || !type) {
    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // 🔁 assure-toi que c’est bien `userId` dans ton token

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
  } catch (err) {
    console.error("❌ Erreur suppression media :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
