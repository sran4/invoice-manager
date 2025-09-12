import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { refreshToken, logoutAll } = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (logoutAll) {
      // Remove all refresh tokens
      user.refreshTokens = [];
    } else if (refreshToken) {
      // Remove specific refresh token
      await user.removeRefreshToken(refreshToken);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: logoutAll ? 'Logged out from all devices' : 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
