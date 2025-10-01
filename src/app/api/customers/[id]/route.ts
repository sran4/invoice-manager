import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import connectDB from "@/lib/db/connection";
import Customer from "@/lib/db/models/Customer";

// GET /api/customers/[id] - Get a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const customer = await Customer.findOne({
      _id: id,
      userId: session.user.email,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error: unknown) {
    console.error("Error fetching customer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch customer", details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update a specific customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Check if customer exists and belongs to user
    const existingCustomer = await Customer.findOne({
      _id: id,
      userId: session.user.email,
    });

    if (!existingCustomer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email.toLowerCase() !== existingCustomer.email) {
      const emailExists = await Customer.findOne({
        userId: session.user.email,
        email: email.toLowerCase(),
        _id: { $ne: id },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Customer with this email already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
      message: "Customer updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating customer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update customer", details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete a specific customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const customer = await Customer.findOneAndDelete({
      _id: id,
      userId: session.user.email,
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting customer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete customer", details: errorMessage },
      { status: 500 }
    );
  }
}
