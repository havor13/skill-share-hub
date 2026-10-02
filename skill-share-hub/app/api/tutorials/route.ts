import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Tutorial, { TUTORIAL_CATEGORIES } from "@/models/Tutorial";
import { errorResponse } from "@/lib/ApiResponse";

// GET /api/tutorials?search=&category=
// Public: lists tutorials, with optional text search and category filter.
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();

    const query: Record<string, unknown> = {};

    if (category) {
      if (!(TUTORIAL_CATEGORIES as readonly string[]).includes(category)) {
        return errorResponse(
          `Invalid category. Must be one of: ${TUTORIAL_CATEGORIES.join(", ")}`,
          400
        );
      }
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const tutorials = await Tutorial.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ tutorials }, { status: 200 });
  } catch (err) {
    console.error("GET /api/tutorials error:", err);
    return errorResponse("Failed to fetch tutorials", 500);
  }
}

// POST /api/tutorials
// Requires an authenticated session. Creates a new tutorial owned by the caller.
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized. You must be logged in to create a tutorial.", 401);
    }

    const body = await request.json();
    const { title, description, category, contentUrl } = body ?? {};

    if (!title || !description || !category || !contentUrl) {
      return errorResponse(
        "Missing required fields: title, description, category, contentUrl",
        400
      );
    }

    if (!(TUTORIAL_CATEGORIES as readonly string[]).includes(category)) {
      return errorResponse(
        `Invalid category. Must be one of: ${TUTORIAL_CATEGORIES.join(", ")}`,
        400
      );
    }

    await dbConnect();

    const tutorial = await Tutorial.create({
      title,
      description,
      category,
      contentUrl,
      author: session.user.id,
    });

    return NextResponse.json({ tutorial }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tutorials error:", err);
    return errorResponse("Failed to create tutorial", 500);
  }
}