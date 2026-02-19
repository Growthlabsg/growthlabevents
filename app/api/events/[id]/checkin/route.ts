import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';

// In-memory storage for attendance (in production, use database)
const attendanceStore = new Map<string, Map<string, {
  checkedIn: boolean;
  checkedInAt?: string;
  checkedOutAt?: string;
  attendeeName: string;
  attendeeEmail?: string;
}>>();

// POST /api/events/[id]/checkin - Check in an attendee
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || 'checkin'; // 'checkin' or 'checkout'

    if (!body.registrationId && !body.qrCode && !body.email) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required field: registrationId, qrCode, or email',
        },
        400
      );
    }

    // Initialize event attendance if not exists
    if (!attendanceStore.has(id)) {
      attendanceStore.set(id, new Map());
    }

    const eventAttendance = attendanceStore.get(id)!;
    const attendeeId = body.registrationId || body.qrCode || body.email;
    const now = new Date().toISOString();

    if (action === 'checkout') {
      // Check out
      if (!eventAttendance.has(attendeeId) || !eventAttendance.get(attendeeId)!.checkedIn) {
        return jsonResponse(
          {
            success: false,
            message: 'Attendee is not checked in',
          },
          400
        );
      }

      const attendance = eventAttendance.get(attendeeId)!;
      attendance.checkedOutAt = now;
      attendance.checkedIn = false;

      return jsonResponse({
        success: true,
        data: {
          checkedOut: true,
          checkedOutAt: now,
          checkedInAt: attendance.checkedInAt,
        },
        message: 'Successfully checked out',
      });
    } else {
      // Check in
      if (eventAttendance.has(attendeeId) && eventAttendance.get(attendeeId)!.checkedIn) {
        return jsonResponse(
          {
            success: false,
            message: 'Attendee is already checked in',
          },
          400
        );
      }

      eventAttendance.set(attendeeId, {
        checkedIn: true,
        checkedInAt: now,
        attendeeName: body.attendeeName || 'Unknown',
        attendeeEmail: body.email,
      });

      return jsonResponse({
        success: true,
        data: {
          checkedIn: true,
          checkedInAt: now,
        },
        message: 'Successfully checked in',
      });
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process check-in/check-out',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/checkin - Get attendance list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventAttendance = attendanceStore.get(id);

    if (!eventAttendance) {
      return jsonResponse({
        success: true,
        data: {
          checkedIn: [],
          checkedOut: [],
          totalCheckedIn: 0,
          totalCheckedOut: 0,
        },
      });
    }

    const checkedIn: any[] = [];
    const checkedOut: any[] = [];

    eventAttendance.forEach((attendance, attendeeId) => {
      const entry = {
        attendeeId,
        attendeeName: attendance.attendeeName,
        attendeeEmail: attendance.attendeeEmail,
        checkedInAt: attendance.checkedInAt,
        checkedOutAt: attendance.checkedOutAt,
      };

      if (attendance.checkedIn) {
        checkedIn.push(entry);
      } else if (attendance.checkedOutAt) {
        checkedOut.push(entry);
      }
    });

    return jsonResponse({
      success: true,
      data: {
        checkedIn,
        checkedOut,
        totalCheckedIn: checkedIn.length,
        totalCheckedOut: checkedOut.length,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get attendance',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

