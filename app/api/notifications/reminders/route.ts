import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  scheduleEmailReminder,
  getUserReminders,
  getEventReminders,
  markReminderSent,
  cancelEventReminders,
} from '@/lib/notifications';

// GET /api/notifications/reminders - Get reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');

    if (userId) {
      const reminders = getUserReminders(userId);
      return jsonResponse({
        success: true,
        data: reminders,
      });
    }

    if (eventId) {
      const reminders = getEventReminders(eventId);
      return jsonResponse({
        success: true,
        data: reminders,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Missing userId or eventId parameter',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get reminders',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/notifications/reminders - Schedule or manage reminders
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'schedule') {
      const { eventId, userId, eventDate, eventTime } = body;

      if (!eventId || !userId || !eventDate || !eventTime) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: eventId, userId, eventDate, eventTime',
          },
          400
        );
      }

      const reminders = scheduleEmailReminder(eventId, userId, eventDate, eventTime);

      return jsonResponse({
        success: true,
        data: reminders,
        message: `Scheduled ${reminders.length} email reminder(s)`,
      });
    }

    if (action === 'mark-sent') {
      const { reminderId } = body;

      if (!reminderId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: reminderId',
          },
          400
        );
      }

      const marked = markReminderSent(reminderId);

      if (!marked) {
        return jsonResponse(
          {
            success: false,
            message: 'Reminder not found',
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        message: 'Reminder marked as sent',
      });
    }

    if (action === 'cancel') {
      const { eventId } = body;

      if (!eventId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: eventId',
          },
          400
        );
      }

      const cancelled = cancelEventReminders(eventId);

      return jsonResponse({
        success: true,
        data: { cancelled },
        message: `Cancelled ${cancelled} reminder(s)`,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "schedule", "mark-sent", or "cancel"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process reminder request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

