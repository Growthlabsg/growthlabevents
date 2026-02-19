import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  addToWaitlist,
  removeFromWaitlist,
  getWaitlist,
  getWaitlistPosition,
  isOnWaitlist,
} from '@/lib/waitlist';

// POST /api/events/[id]/waitlist - Add/remove from waitlist
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, userId, email, name } = body;

    if (action === 'add') {
      if (!userId || !email || !name) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: userId, email, name',
          },
          400
        );
      }
      addToWaitlist(id, userId, email, name);
      const position = getWaitlistPosition(id, userId);
      return jsonResponse({
        success: true,
        data: { eventId: id, userId, position },
        message: 'Added to waitlist',
      });
    } else if (action === 'remove') {
      if (!userId) {
        return jsonResponse(
          { success: false, message: 'Missing required field: userId' },
          400
        );
      }
      removeFromWaitlist(id, userId);
      return jsonResponse({
        success: true,
        data: { eventId: id, userId },
        message: 'Removed from waitlist',
      });
    } else {
      return jsonResponse(
        { success: false, message: 'Invalid action. Use "add" or "remove"' },
        400
      );
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update waitlist',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/waitlist - Get waitlist
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (userId) {
      const position = getWaitlistPosition(id, userId);
      const onWaitlist = isOnWaitlist(id, userId);
      return jsonResponse({
        success: true,
        data: { eventId: id, userId, onWaitlist, position },
      });
    } else {
      const waitlist = getWaitlist(id);
      return jsonResponse({
        success: true,
        data: { eventId: id, waitlist, total: waitlist.length },
      });
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get waitlist',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
