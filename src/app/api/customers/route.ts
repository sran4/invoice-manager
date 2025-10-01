import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import Customer from "@/lib/db/models/Customer";

// GET /api/customers - Get all customers for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const customers = await Customer.find({ userId: session.user.email }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error: unknown) {
    console.error("Error fetching customers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch customers", details: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, fax, companyName, address } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.zipCode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if customer with same email already exists for this user
    const existingCustomer = await Customer.findOne({
      userId: session.user.email,
      email: email.toLowerCase(),
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer with this email already exists" },
        { status: 400 }
      );
    }

    const customer = new Customer({
      userId: session.user.email,
      name,
      email: email.toLowerCase(),
      phone,
      fax: fax || undefined,
      companyName: companyName || undefined,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    });

    await customer.save();

    return NextResponse.json(
      {
        success: true,
        customer,
        message: "Customer created successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating customer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create customer", details: errorMessage },
      { status: 500 }
    );
  }
}
