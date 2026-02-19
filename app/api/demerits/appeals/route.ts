import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  submitAppeal,
  reviewAppeal,
  getUserAppeals,
  getPendingAppeals,
  getDemeritById,
} from '@/lib/demeritSystem';

// GET /api/demerits/appeals - Get appeals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const pending = searchParams.get('pending') === 'true';

    if (pending) {
      const appeals = getPendingAppeals();
      // Include demerit information with each appeal
      const appealsWithDemerits = appeals.map((appeal) => {
        const demerit = getDemeritById(appeal.demeritId);
        return {
          ...appeal,
          demerit: demerit || null,
        };
      });
      return jsonResponse({
        success: true,
        data: appealsWithDemerits,
      });
    }

    if (userId) {
      const appeals = getUserAppeals(userId);
      // Include demerit information with each appeal
      const appealsWithDemerits = appeals.map((appeal) => {
        const demerit = getDemeritById(appeal.demeritId);
        return {
          ...appeal,
          demerit: demerit || null,
        };
      });
      return jsonResponse({
        success: true,
        data: appealsWithDemerits,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Missing userId or pending parameter',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get appeals',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/demerits/appeals - Submit or review an appeal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'submit') {
      const { demeritId, userId, reason, description } = body;

      if (!demeritId || !userId || !reason) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: demeritId, userId, reason',
          },
          400
        );
      }

      const appeal = submitAppeal(demeritId, userId, reason, description);

      return jsonResponse({
        success: true,
        data: appeal,
        message: 'Appeal submitted successfully',
      });
    }

    if (action === 'review') {
      const { appealId, status, reviewedBy, reviewNotes } = body;

      if (!appealId || !status || !reviewedBy) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: appealId, status, reviewedBy',
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

      const appeal = reviewAppeal(appealId, status, reviewedBy, reviewNotes);

      return jsonResponse({
        success: true,
        data: appeal,
        message: `Appeal ${status} successfully`,
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "submit" or "review"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process appeal',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
