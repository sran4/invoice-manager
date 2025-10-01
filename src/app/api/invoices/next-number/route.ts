import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import Invoice from "@/lib/db/models/Invoice";

// GET /api/invoices/next-number - Get the next invoice number for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get current year (2 digits)
    const currentYear = new Date().getFullYear().toString().slice(-2);

    // Find the highest invoice number for this user in the current year
    const lastInvoice = await Invoice.findOne({
      userId: session.user.email,
      invoiceNumber: { $regex: `^${currentYear}` },
    }).sort({ invoiceNumber: -1 });

    let nextNumber = 1000; // Default starting number for the year

    if (lastInvoice && lastInvoice.invoiceNumber) {
      // Extract number from invoice number (e.g., "251005" -> 1005)
      const match = lastInvoice.invoiceNumber.match(/^\d{2}(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const invoiceNumber = `${currentYear}${nextNumber}`;

    console.log(
      `Generated invoice number: ${invoiceNumber} for user: ${session.user.email}`
    );

    return NextResponse.json({
      success: true,
      invoiceNumber,
    });
  } catch (error: unknown) {
    console.error("Error generating invoice number:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate invoice number", details: errorMessage },
      { status: 500 }
    );
  }
}
