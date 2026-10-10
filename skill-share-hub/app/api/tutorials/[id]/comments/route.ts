// app/api/tutorials/[id]/comments/route.ts   (NEW)
import { NextRequest, NextResponse } from "next/server";
import mongoose, { type Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Tutorial, { type IComment } from "@/models/Tutorial";
import { errorResponse, isValidObjectId } from "@/lib/ApiResponse";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type CommentDoc = IComment & { _id: Types.ObjectId };

type PopulatedComment = {
  _id: Types.ObjectId;
  text: string;
  createdAt: Date;
  user: { _id: Types.ObjectId; name: string } | null;
};

// GET /api/tutorials/:id/comments — public
// Returns every comment (oldest first) with the author's name.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id)
      .select("comments")
      .populate("comments.user", "name")
      .lean();

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    const comments = (tutorial.comments as unknown as PopulatedComment[]) ?? [];

    return NextResponse.json({ comments }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tutorials/:id/comments error:", err);
    return errorResponse("Failed to fetch comments", 500);
  }
}

// POST /api/tutorials/:id/comments
// Requires an authenticated session. Body: { text: string (1-1000 chars) }
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse(
        "Unauthorized. You must be logged in to comment.",
        401
      );
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (text.length < 1 || text.length > 1000) {
      return errorResponse("Comment must be between 1 and 1000 characters.", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    tutorial.comments.push({
      user: new mongoose.Types.ObjectId(session.user.id),
      text,
    } as IComment);

    await tutorial.save();

    const created = tutorial.comments[tutorial.comments.length - 1] as CommentDoc;

    return NextResponse.json(
      {
        comment: {
          _id: created._id,
          text: created.text,
          createdAt: created.createdAt,
          user: { _id: session.user.id, name: session.user.name ?? "User" },
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/tutorials/:id/comments error:", err);
    return errorResponse("Failed to post comment", 500);
  }
}
