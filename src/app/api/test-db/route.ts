import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Test MongoDB connection
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI not found in environment variables',
        envVars: {
          MONGODB_URI: process.env.MONGODB_URI,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
        }
      }, { status: 500 });
    }

    // Try to connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      connectionString: MONGODB_URI.replace(/\/\/.*@/, '//***:***@') // Hide credentials
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      envVars: {
        MONGODB_URI: process.env.MONGODB_URI ? 'Found' : 'Not found',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
      }
    }, { status: 500 });
  }
}

