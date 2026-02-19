import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  createPayment,
  updatePaymentStatus,
  getPayment,
  getUserPayments,
  getEventPayments,
} from '@/lib/payments';

// GET /api/payments - Get payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    const paymentId = searchParams.get('paymentId');

    if (paymentId) {
      const payment = getPayment(paymentId);
      if (!payment) {
        return jsonResponse(
          {
            success: false,
            message: 'Payment not found',
          },
          404
        );
      }
      return jsonResponse({
        success: true,
        data: payment,
      });
    }

    if (userId) {
      const payments = getUserPayments(userId);
      return jsonResponse({
        success: true,
        data: payments,
      });
    }

    if (eventId) {
      const payments = getEventPayments(eventId);
      return jsonResponse({
        success: true,
        data: payments,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Missing userId, eventId, or paymentId parameter',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get payments',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/payments - Create payment or update status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const {
        eventId,
        userId,
        ticketTypeId,
        quantity,
        amount,
        discountCodeId,
        discountAmount,
        stripePaymentIntentId,
      } = body;

      if (!eventId || !userId || !ticketTypeId || !quantity || amount === undefined) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields',
          },
          400
        );
      }

      const payment = createPayment(
        eventId,
        userId,
        ticketTypeId,
        quantity,
        amount,
        discountCodeId,
        discountAmount || 0,
        stripePaymentIntentId
      );

      return jsonResponse({
        success: true,
        data: payment,
        message: 'Payment created successfully',
      });
    }

    if (action === 'update-status') {
      const { paymentId, status, stripePaymentIntentId } = body;

      if (!paymentId || !status) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: paymentId, status',
          },
          400
        );
      }

      const payment = updatePaymentStatus(paymentId, status, stripePaymentIntentId);

      if (!payment) {
        return jsonResponse(
          {
            success: false,
            message: 'Payment not found',
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        data: payment,
        message: 'Payment status updated successfully',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "create" or "update-status"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

