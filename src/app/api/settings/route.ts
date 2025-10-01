import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import User from "@/lib/db/models/User";

// GET /api/settings - Get user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      companySettings: user.companySettings || null,
      preferences: user.preferences || null,
    });
  } catch (error: unknown) {
    console.error("Error fetching settings:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch settings", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { companySettings, preferences } = body;

    console.log("Settings API - Received data:", {
      companySettings,
      preferences,
    });

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update company settings if provided
    if (companySettings) {
      user.companySettings = {
        ...(user.companySettings || {}),
        ...companySettings,
      };
    }

    // Update preferences if provided
    if (preferences) {
      user.preferences = {
        ...(user.preferences || {}),
        ...preferences,
      };
    }

    await user.save();

    console.log("Settings API - User saved:", {
      companySettings: user.companySettings,
      preferences: user.preferences,
    });

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      companySettings: user.companySettings,
      preferences: user.preferences,
    });
  } catch (error: unknown) {
    console.error("Error updating settings:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update settings", details: errorMessage },
      { status: 500 }
    );
  }
}
