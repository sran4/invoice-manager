import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import Customer from '@/lib/db/models/Customer';

// GET /api/test-models - Test if models are working correctly
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Test creating a customer with string userId
    const testCustomer = new Customer({
      userId: session.user.email, // This should work now
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123-456-7890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345'
      }
    });

    // Validate the customer (don't save it)
    const validationError = testCustomer.validateSync();
    
    if (validationError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validationError.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Models are working correctly with string userId',
      testData: {
        userId: session.user.email,
        userIdType: typeof session.user.email
      }
    });
  } catch (error: any) {
    console.error('Error testing models:', error);
    return NextResponse.json(
      { error: 'Failed to test models', details: error.message },
      { status: 500 }
    );
  }
}
