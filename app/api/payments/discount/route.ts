import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  createDiscountCode,
  getDiscountCodes,
  validateDiscountCode,
  applyDiscountCode,
} from '@/lib/payments';

// GET /api/payments/discount - Get discount codes or validate one
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const calendarId = searchParams.get('calendarId');
    const code = searchParams.get('code');
    const amount = searchParams.get('amount');

    // Validate a specific code
    if (code && amount && eventId) {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum)) {
        return jsonResponse(
          {
            success: false,
            message: 'Invalid amount',
          },
          400
        );
      }

      const validation = validateDiscountCode(code, eventId, amountNum);
      return jsonResponse({
        success: validation.valid,
        data: validation.valid
          ? {
              discount: validation.discount,
              discountAmount: validation.discountAmount,
              finalAmount: amountNum - (validation.discountAmount || 0),
            }
          : null,
        message: validation.message,
      });
    }

    // Get all discount codes
    const codes = getDiscountCodes(eventId || undefined, calendarId || undefined);
    return jsonResponse({
      success: true,
      data: codes,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get discount codes',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/payments/discount - Create discount code or apply one
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const {
        code,
        type,
        value,
        eventId,
        calendarId,
        maxUses,
        validFrom,
        validUntil,
      } = body;

      if (!code || !type || value === undefined) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: code, type, value',
          },
          400
        );
      }

      if (type !== 'percentage' && type !== 'fixed') {
        return jsonResponse(
          {
            success: false,
            message: 'Invalid type. Use "percentage" or "fixed"',
          },
          400
        );
      }

      const discount = createDiscountCode(
        code,
        type,
        value,
        eventId,
        calendarId,
        maxUses,
        validFrom,
        validUntil
      );

      return jsonResponse({
        success: true,
        data: discount,
        message: 'Discount code created successfully',
      });
    }

    if (action === 'apply') {
      const { code, eventId } = body;

      if (!code || !eventId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: code, eventId',
          },
          400
        );
      }

      const applied = applyDiscountCode(code, eventId);
      return jsonResponse({
        success: applied,
        message: applied
          ? 'Discount code applied successfully'
          : 'Failed to apply discount code',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "create" or "apply"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process discount code request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

