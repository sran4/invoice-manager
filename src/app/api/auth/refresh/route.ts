import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Find user with this refresh token
    const user = await User.findOne({
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Clean expired refresh tokens
    await user.cleanExpiredRefreshTokens();

    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        id: user._id.toString(),
        email: user.email,
        name: user.name 
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
