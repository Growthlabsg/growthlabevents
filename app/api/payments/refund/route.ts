import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  createRefund,
  processRefund,
  getPaymentRefunds,
  getAllRefunds,
} from '@/lib/payments';

// GET /api/payments/refund - Get refunds
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const eventId = searchParams.get('eventId');

    if (paymentId) {
      const refunds = getPaymentRefunds(paymentId);
      return jsonResponse({
        success: true,
        data: refunds,
      });
    }

    if (eventId) {
      const refunds = getAllRefunds(eventId);
      return jsonResponse({
        success: true,
        data: refunds,
      });
    }

    const refunds = getAllRefunds();
    return jsonResponse({
      success: true,
      data: refunds,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get refunds',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/payments/refund - Create or process refund
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { paymentId, amount, reason } = body;

      if (!paymentId || amount === undefined || !reason) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: paymentId, amount, reason',
          },
          400
        );
      }

      try {
        const refund = createRefund(paymentId, amount, reason);
        return jsonResponse({
          success: true,
          data: refund,
          message: 'Refund requested successfully',
        });
      } catch (error) {
        return jsonResponse(
          {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to create refund',
          },
          400
        );
      }
    }

    if (action === 'process') {
      const { refundId, processedBy } = body;

      if (!refundId || !processedBy) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: refundId, processedBy',
          },
          400
        );
      }

      const refund = processRefund(refundId, processedBy);

      if (!refund) {
        return jsonResponse(
          {
            success: false,
            message: 'Refund not found',
          },
          404
        );
      }

      return jsonResponse({
        success: true,
        data: refund,
        message: 'Refund processed successfully',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "create" or "process"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process refund request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

