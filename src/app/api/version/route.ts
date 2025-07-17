import { NextResponse } from 'next/server';

/**
 * Version API endpoint for cache invalidation
 * Returns current deployment version/timestamp
 */
export async function GET() {
  try {
    // Generate version based on current timestamp
    // In production, this could be based on build time or git commit
    const version = process.env.VERCEL_GIT_COMMIT_SHA || 
                   process.env.BUILD_ID || 
                   Date.now().toString();

    const buildTime = process.env.BUILD_TIME || new Date().toISOString();

    return NextResponse.json({
      version,
      buildTime,
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Version API error:', error);
    
    return NextResponse.json({
      version: 'unknown',
      buildTime: new Date().toISOString(),
      timestamp: Date.now(),
      environment: 'unknown',
      error: 'Failed to get version info'
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  }
}
