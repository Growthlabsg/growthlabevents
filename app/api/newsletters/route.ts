import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  createNewsletter,
  updateNewsletter,
  getNewsletter,
  getNewsletters,
  deleteNewsletter,
  sendNewsletter,
} from '@/lib/newsletters';

// GET /api/newsletters - Get newsletters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId');
    const newsletterId = searchParams.get('newsletterId');

    if (newsletterId) {
      const newsletter = getNewsletter(newsletterId);
      if (!newsletter) {
        return jsonResponse(
          { success: false, message: 'Newsletter not found' },
          404
        );
      }
      return jsonResponse({ success: true, data: newsletter });
    }

    if (calendarId) {
      const newsletters = getNewsletters(calendarId);
      return jsonResponse({ success: true, data: newsletters });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Missing calendarId or newsletterId parameter',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get newsletters',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/newsletters - Create or update newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { calendarId, title, subject, content } = body;
      if (!calendarId || !title || !subject || !content) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: calendarId, title, subject, content',
          },
          400
        );
      }
      const newsletter = createNewsletter(calendarId, title, subject, content);
      return jsonResponse({
        success: true,
        data: newsletter,
        message: 'Newsletter created successfully',
      });
    }

    if (action === 'update') {
      const { newsletterId, title, subject, content, status, scheduledAt } = body;
      if (!newsletterId) {
        return jsonResponse(
          { success: false, message: 'Missing required field: newsletterId' },
          400
        );
      }
      const newsletter = updateNewsletter(newsletterId, {
        title,
        subject,
        content,
        status,
        scheduledAt,
      });
      if (!newsletter) {
        return jsonResponse(
          { success: false, message: 'Newsletter not found' },
          404
        );
      }
      return jsonResponse({
        success: true,
        data: newsletter,
        message: 'Newsletter updated successfully',
      });
    }

    if (action === 'send') {
      const { newsletterId } = body;
      if (!newsletterId) {
        return jsonResponse(
          { success: false, message: 'Missing required field: newsletterId' },
          400
        );
      }
      const campaign = sendNewsletter(newsletterId);
      if (!campaign) {
        return jsonResponse(
          { success: false, message: 'Newsletter not found' },
          404
        );
      }
      return jsonResponse({
        success: true,
        data: campaign,
        message: 'Newsletter sent successfully',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "create", "update", or "send"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process newsletter request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// DELETE /api/newsletters - Delete newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsletterId = searchParams.get('newsletterId');
    if (!newsletterId) {
      return jsonResponse(
        { success: false, message: 'Missing newsletterId parameter' },
        400
      );
    }
    const deleted = deleteNewsletter(newsletterId);
    if (!deleted) {
      return jsonResponse(
        { success: false, message: 'Newsletter not found' },
        404
      );
    }
    return jsonResponse({
      success: true,
      message: 'Newsletter deleted successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to delete newsletter',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
