import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

    const { avatar } = await req.json(); // avatar est une string base64
    user.avatar = avatar;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur avatar upload :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
