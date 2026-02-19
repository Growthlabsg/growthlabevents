import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscribers,
  getSubscriberCount,
} from '@/lib/newsletters';

// GET /api/newsletters/subscribers - Get subscribers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    if (!calendarId) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing calendarId parameter',
        },
        400
      );
    }

    const subscribers = getSubscribers(calendarId, activeOnly);
    const count = getSubscriberCount(calendarId);

    return jsonResponse({
      success: true,
      data: {
        subscribers,
        count,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get subscribers',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/newsletters/subscribers - Subscribe or unsubscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, calendarId, email, name } = body;

    if (!calendarId || !email) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required fields: calendarId, email',
        },
        400
      );
    }

    if (action === 'subscribe') {
      const subscriber = subscribeToNewsletter(calendarId, email, name);

      return jsonResponse({
        success: true,
        data: subscriber,
        message: 'Subscribed successfully',
      });
    }

    if (action === 'unsubscribe') {
      const unsubscribed = unsubscribeFromNewsletter(calendarId, email);

      if (!unsubscribed) {
        return jsonResponse(
          {
            success: false,
            message: 'Subscriber not found',
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        message: 'Unsubscribed successfully',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "subscribe" or "unsubscribe"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process subscription request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

