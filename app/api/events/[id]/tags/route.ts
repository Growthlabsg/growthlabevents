import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  getEventTagsForEvent,
  assignTagsToEvent,
  removeTagFromEvent,
} from '@/lib/eventTags';

// GET /api/events/[id]/tags - Get tags for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tags = getEventTagsForEvent(id);
    return jsonResponse({ success: true, data: { eventId: id, tags } });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get event tags',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/events/[id]/tags - Assign or remove tags
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, tagIds, tagId } = body;

    if (action === 'assign') {
      if (!Array.isArray(tagIds)) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing or invalid "tagIds" field (must be an array)',
          },
          400
        );
      }
      assignTagsToEvent(id, tagIds);
      const tags = getEventTagsForEvent(id);
      return jsonResponse({
        success: true,
        data: { eventId: id, tags },
        message: 'Tags assigned successfully',
      });
    } else if (action === 'remove') {
      if (!tagId) {
        return jsonResponse(
          { success: false, message: 'Missing required field: tagId' },
          400
        );
      }
      removeTagFromEvent(id, tagId);
      const tags = getEventTagsForEvent(id);
      return jsonResponse({
        success: true,
        data: { eventId: id, tags },
        message: 'Tag removed successfully',
      });
    } else {
      return jsonResponse(
        { success: false, message: 'Invalid action. Use "assign" or "remove"' },
        400
      );
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update event tags',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
