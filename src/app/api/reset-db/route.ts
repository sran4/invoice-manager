import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import Customer from '@/lib/db/models/Customer';
import WorkDescription from '@/lib/db/models/WorkDescription';
import Invoice from '@/lib/db/models/Invoice';

// POST /api/reset-db - Reset database collections (for development only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Clear all collections for this user
    await Customer.deleteMany({ userId: session.user.email });
    await WorkDescription.deleteMany({ userId: session.user.email });
    await Invoice.deleteMany({ userId: session.user.email });

    return NextResponse.json({
      success: true,
      message: 'Database collections cleared successfully'
    });
  } catch (error: any) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Failed to reset database', details: error.message },
      { status: 500 }
    );
  }
}
