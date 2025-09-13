import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import WorkDescription from '@/lib/db/models/WorkDescription';

// GET /api/work-descriptions/[id] - Get a specific work description
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const workDescription = await WorkDescription.findOne({
      _id: params.id,
      userId: session.user.email
    });

    if (!workDescription) {
      return NextResponse.json(
        { error: 'Work description not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workDescription
    });
  } catch (error: any) {
    console.error('Error fetching work description:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work description', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/work-descriptions/[id] - Update a specific work description
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, rate } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedWorkDescription = await WorkDescription.findOneAndUpdate(
      {
        _id: params.id,
        userId: session.user.email
      },
      {
        title,
        description,
        rate: rate || 0
      },
      { new: true, runValidators: true }
    );

    if (!updatedWorkDescription) {
      return NextResponse.json(
        { error: 'Work description not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workDescription: updatedWorkDescription,
      message: 'Work description updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating work description:', error);
    return NextResponse.json(
      { error: 'Failed to update work description', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/work-descriptions/[id] - Delete a specific work description
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const workDescription = await WorkDescription.findOneAndDelete({
      _id: params.id,
      userId: session.user.email
    });

    if (!workDescription) {
      return NextResponse.json(
        { error: 'Work description not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Work description deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting work description:', error);
    return NextResponse.json(
      { error: 'Failed to delete work description', details: error.message },
      { status: 500 }
    );
  }
}
