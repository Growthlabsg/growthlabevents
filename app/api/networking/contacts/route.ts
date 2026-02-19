import type { NextRequest } from 'next/server';
import {
  requestContactExchange,
  respondToContactExchange,
  getContactRequests,
  getConnections,
} from '@/lib/networking';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/networking/contacts - Get contact requests or connections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as 'sent' | 'received' | 'connections' | null;

    if (!userId) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing userId parameter',
        },
        400
      );
    }

    if (type === 'connections') {
      const connections = getConnections(userId);
      return jsonResponse({
        success: true,
        data: connections,
      });
    }

    const requestType = (type === 'sent' ? 'sent' : 'received') as 'sent' | 'received';
    const requests = getContactRequests(userId, requestType);

    return jsonResponse({
      success: true,
      data: requests,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get contacts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/networking/contacts - Request or respond to contact exchange
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'request') {
      const { fromUserId, toUserId, eventId, message } = body;

      if (!fromUserId || !toUserId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: fromUserId, toUserId',
          },
          400
        );
      }

      const contactRequest = requestContactExchange(fromUserId, toUserId, eventId, message);

      return jsonResponse({
        success: true,
        data: contactRequest,
        message: 'Contact exchange request sent',
      });
    }

    if (action === 'respond') {
      const { requestId, toUserId, status } = body;

      if (!requestId || !toUserId || !status) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: requestId, toUserId, status',
          },
          400
        );
      }

      if (status !== 'approved' && status !== 'rejected') {
        return jsonResponse(
          {
            success: false,
            message: 'Invalid status. Use "approved" or "rejected"',
          },
          400
        );
      }

      const contactRequest = respondToContactExchange(requestId, toUserId, status);

      return jsonResponse({
        success: true,
        data: contactRequest,
        message: `Contact exchange request ${status}`,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "request" or "respond"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process contact request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
