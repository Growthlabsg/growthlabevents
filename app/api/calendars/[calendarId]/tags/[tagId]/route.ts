import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { updateEventTag, deleteEventTag } from '@/lib/eventTags';

// PUT /api/calendars/[calendarId]/tags/[tagId] - Update a tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ calendarId: string; tagId: string }> }
) {
  try {
    const { calendarId, tagId } = await params;
    const body = await request.json();
    const { name, color } = body;

    const updates: { name?: string; color?: string } = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;

    const tag = updateEventTag(tagId, updates, calendarId);

    if (!tag) {
      return jsonResponse(
        {
          success: false,
          message: 'Tag not found',
        },
        404
      );
    }

    return jsonResponse({
      success: true,
      data: tag,
      message: 'Tag updated successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// DELETE /api/calendars/[calendarId]/tags/[tagId] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ calendarId: string; tagId: string }> }
) {
  try {
    const { calendarId, tagId } = await params;
    const deleted = deleteEventTag(tagId, calendarId);

    if (!deleted) {
      return jsonResponse(
        {
          success: false,
          message: 'Tag not found',
        },
        404
      );
    }

    return jsonResponse({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to delete tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
