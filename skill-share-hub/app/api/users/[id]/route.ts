// app/api/users/[id].ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET /api/users/:id → fetch user profile
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const user = await User.findById(params.id).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("GET user error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/users/:id → update user profile
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
      select: "-passwordHash",
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("PUT user error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
