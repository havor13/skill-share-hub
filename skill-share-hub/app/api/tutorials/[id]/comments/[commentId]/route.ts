// app/api/tutorials/[id]/comments/[commentId]/route.ts   (NEW)
import { NextRequest, NextResponse } from "next/server";
import { type Types } from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Tutorial, { type IComment } from "@/models/Tutorial";
import { errorResponse, isValidObjectId } from "@/lib/ApiResponse";

interface RouteParams {
  params: Promise<{ id: string; commentId: string }>;
}

type CommentDoc = IComment & { _id: Types.ObjectId };

// DELETE /api/tutorials/:id/comments/:commentId
// Allowed for the comment's author or an admin.
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse(
        "Unauthorized. You must be logged in to delete a comment.",
        401
      );
    }

    const { id, commentId } = await params;

    if (!isValidObjectId(id) || !isValidObjectId(commentId)) {
      return errorResponse("Invalid id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    const comment = (tutorial.comments as CommentDoc[]).find(
      (c) => c._id.toString() === commentId
    );

    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    const isOwner = comment.user.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return errorResponse(
        "Forbidden. You can only delete your own comments.",
        403
      );
    }

    tutorial.comments = (tutorial.comments as CommentDoc[]).filter(
      (c) => c._id.toString() !== commentId
    );

    await tutorial.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/tutorials/:id/comments/:commentId error:", err);
    return errorResponse("Failed to delete comment", 500);
  }
}
