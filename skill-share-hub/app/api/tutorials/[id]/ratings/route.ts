import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Tutorial, { type IRating } from "@/models/Tutorial";
import { errorResponse, isValidObjectId } from "@/lib/ApiResponse";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/tutorials/:id/ratings — public
// Returns every individual rating plus the current aggregate.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id)
      .select("ratings averageRating ratingsCount")
      .populate("ratings.user", "name email")
      .lean();

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    return NextResponse.json(
      {
        ratings: tutorial.ratings,
        averageRating: tutorial.averageRating,
        ratingsCount: tutorial.ratingsCount,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/tutorials/:id/ratings error:", err);
    return errorResponse("Failed to fetch ratings", 500);
  }
}

// POST /api/tutorials/:id/ratings
// Requires an authenticated session. Body: { value: number (1-5) }
// If the user has already rated this tutorial, their rating is updated
// rather than duplicated. The tutorial's aggregate fields are recalculated
// automatically by the model's pre-save hook.
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized. You must be logged in to rate a tutorial.", 401);
    }

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid tutorial id", 400);
    }

    const body = await request.json();
    const value = Number(body?.value);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return errorResponse("Rating value must be an integer between 1 and 5.", 400);
    }

    await dbConnect();

    const tutorial = await Tutorial.findById(id);

    if (!tutorial) {
      return errorResponse("Tutorial not found", 404);
    }

    const existingRating = tutorial.ratings.find(
      (r: IRating) => r.user.toString() === session.user.id
    );

    if (existingRating) {
      existingRating.value = value;
      tutorial.markModified("ratings");
    } else {
      tutorial.ratings.push({
        user: new mongoose.Types.ObjectId(session.user.id),
        value,
      });
    }

    await tutorial.save();

    return NextResponse.json(
      {
        averageRating: tutorial.averageRating,
        ratingsCount: tutorial.ratingsCount,
      },
      { status: existingRating ? 200 : 201 }
    );
  } catch (err) {
    console.error("POST /api/tutorials/:id/ratings error:", err);
    return errorResponse("Failed to submit rating", 500);
  }
}