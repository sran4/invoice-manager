import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import Invoice from '@/lib/db/models/Invoice';
import Customer from '@/lib/db/models/Customer';

// GET /api/invoices/[id]/export - Get invoice with customer data for export
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user.email
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Fetch customer data
    const customer = await Customer.findOne({
      _id: invoice.customerId,
      userId: session.user.email
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice,
      customer
    });
  } catch (error: any) {
    console.error('Error fetching invoice for export:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice data', details: error.message },
      { status: 500 }
    );
  }
}
