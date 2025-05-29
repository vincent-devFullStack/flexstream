import { connectToDB } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    let { email, password } = await req.json();
    email = email.toLowerCase(); // 🔒 Normalisation

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: "User created" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}
