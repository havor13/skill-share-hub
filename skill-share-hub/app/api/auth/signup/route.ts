import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { errorResponse } from "@/lib/ApiResponse";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body ?? {};

    if (!name || !email || !password) {
      return errorResponse("Name, email, and password are required.", 400);
    }

    if (password.length < 8) {
      return errorResponse("Password must be at least 8 characters.", 400);
    }

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse("An account with that email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/auth/signup error:", err);
    return errorResponse("Failed to create account", 500);
  }
}