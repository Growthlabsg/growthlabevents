import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '@/lib/notifications';

// GET /api/notifications/preferences - Get notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'current-user';

    const preferences = getNotificationPreferences(userId);

    return jsonResponse({
      success: true,
      data: preferences,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get notification preferences',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/notifications/preferences - Update notification preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'current-user', ...updates } = body;

    const updated = updateNotificationPreferences(userId, updates);

    return jsonResponse({
      success: true,
      data: updated,
      message: 'Notification preferences updated successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update notification preferences',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

