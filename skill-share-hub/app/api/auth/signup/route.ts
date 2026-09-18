// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";       // Mongoose connection helper
import User from "@/models/User";       // Mongoose User model

// Validation schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { email, password, displayName } = parsed.data;

    // Connect to MongoDB
    await dbConnect();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      username: displayName,
      passwordHash,
    });

    return NextResponse.json({
      message: "Account created successfully",
      user: { id: newUser._id, email: newUser.email, username: newUser.username },
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
