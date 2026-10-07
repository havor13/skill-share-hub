import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Tutorial, { TUTORIAL_CATEGORIES } from "@/models/Tutorial";
import { errorResponse, isValidObjectId } from "@/lib/ApiResponse";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/tutorials/:id — public
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id)
      .populate("author", "name email")
      .lean();

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    return NextResponse.json({ tutorial }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tutorials/:id error:", err);
    return errorResponse("Failed to fetch tutorial", 500);
  }
}

// PUT /api/tutorials/:id
// Requires an authenticated session, and the caller must be the tutorial's author.
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized. You must be logged in to update a tutorial.", 401);
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    const isOwner = tutorial.author.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return errorResponse("Unauthorized. You can only update your own tutorials.", 403);
    }

    const body = await request.json();
    const { title, description, category, contentUrl } = body ?? {};

    if (category && !(TUTORIAL_CATEGORIES as readonly string[]).includes(category)) {
      return errorResponse(
        `Invalid category. Must be one of: ${TUTORIAL_CATEGORIES.join(", ")}`,
        400
      );
    }

    if (title !== undefined) tutorial.title = title;
    if (description !== undefined) tutorial.description = description;
    if (category !== undefined) tutorial.category = category;
    if (contentUrl !== undefined) tutorial.contentUrl = contentUrl;

    await tutorial.save();

    return NextResponse.json({ tutorial }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/tutorials/:id error:", err);
    return errorResponse("Failed to update tutorial", 500);
  }
}

// DELETE /api/tutorials/:id
// Requires an authenticated session, and the caller must be the tutorial's author.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized. You must be logged in to delete a tutorial.", 401);
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    const isOwner = tutorial.author.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return errorResponse("Unauthorized. You can only delete your own tutorials.", 403);
    }

    await tutorial.deleteOne();

    return NextResponse.json(
      { message: "Tutorial deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/tutorials/:id error:", err);
    return errorResponse("Failed to delete tutorial", 500);
  }
}