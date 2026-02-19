import { NextResponse } from 'next/server';

// GET /api/health - Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    service: 'GrowthLab Events API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}

