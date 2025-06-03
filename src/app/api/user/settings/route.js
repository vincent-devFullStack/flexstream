import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req) {
  await connectToDB();

  const token = req.headers.get("token");
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

    const { action, newPassword, avatar } = await req.json();

    if (action === "change-password") {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "Mot de passe trop court" },
          { status: 400 }
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      return NextResponse.json({
        success: true,
        message: "Mot de passe modifié",
      });
    }

    if (action === "upload-avatar") {
      if (!avatar) {
        return NextResponse.json({ error: "Avatar manquant" }, { status: 400 });
      }
      user.avatar = avatar;
      await user.save();
      return NextResponse.json({ success: true, message: "Avatar modifié" });
    }

    if (action === "delete-account") {
      await user.deleteOne();
      return NextResponse.json({ success: true, message: "Compte supprimé" });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
