// Shared API response helpers
// Using native Response API to avoid Next.js module resolution issues

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function successResponse<T>(data: T, message?: string): Response {
  return jsonResponse({
    success: true,
    data,
    ...(message && { message }),
  });
}

export function errorResponse(message: string, status = 500, error?: string): Response {
  return jsonResponse(
    {
      success: false,
      message,
      ...(error && { error }),
    },
    status
  );
}

// Re-export NextRequest type for convenience
export type { NextRequest } from 'next/server';

