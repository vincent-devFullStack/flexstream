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
    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Mot de passe trop court" },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur API change-password:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
