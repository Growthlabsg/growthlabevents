import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { saveEvent, unsaveEvent, isEventSaved } from '@/lib/savedEvents';

// POST /api/events/[id]/save - Save/unsave an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'save' or 'unsave'

    if (action === 'save') {
      saveEvent(id);
      return jsonResponse({
        success: true,
        data: { eventId: id, saved: true },
        message: 'Event saved',
      });
    } else if (action === 'unsave') {
      unsaveEvent(id);
      return jsonResponse({
        success: true,
        data: { eventId: id, saved: false },
        message: 'Event unsaved',
      });
    } else {
      return jsonResponse(
        { success: false, message: 'Invalid action. Use "save" or "unsave"' },
        400
      );
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update saved status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/save - Check if event is saved
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const saved = isEventSaved(id);
    return jsonResponse({ success: true, data: { eventId: id, saved } });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to check saved status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
