import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import WorkDescription from "@/lib/db/models/WorkDescription";

// GET /api/work-descriptions - Get all work descriptions for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workDescriptions = await WorkDescription.find({
      userId: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      workDescriptions,
    });
  } catch (error: unknown) {
    console.error("Error fetching work descriptions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch work descriptions", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/work-descriptions - Create a new work description
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, rate } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workDescription = new WorkDescription({
      userId: session.user.email,
      title,
      description,
      rate: rate || 0,
    });

    await workDescription.save();

    return NextResponse.json(
      {
        success: true,
        workDescription,
        message: "Work description created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating work description:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create work description", details: errorMessage },
      { status: 500 }
    );
  }
}
