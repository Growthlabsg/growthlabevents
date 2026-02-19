import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// In-memory storage for collaborations (in production, use database)
const collaborations: Map<string, Array<{
  collaboratorId: string;
  collaboratorName: string;
  role: 'co-host' | 'partner' | 'sponsor';
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
}>> = new Map();

// POST /api/events/[id]/collaborate - Request collaboration
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { collaboratorId, collaboratorName, role, action } = body;

    if (!collaborations.has(id)) {
      collaborations.set(id, []);
    }

    const eventCollaborations = collaborations.get(id)!;

    if (action === 'request') {
      // Request collaboration
      if (!collaboratorId || !collaboratorName || !role) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: collaboratorId, collaboratorName, role',
          },
          400
        );
      }

      // Check if already exists
      const existing = eventCollaborations.find(
        c => c.collaboratorId === collaboratorId && c.status === 'pending'
      );

      if (existing) {
        return jsonResponse(
          {
            success: false,
            message: 'Collaboration request already pending',
          },
          400
        );
      }

      eventCollaborations.push({
        collaboratorId,
        collaboratorName,
        role,
        status: 'pending',
        requestedAt: new Date().toISOString(),
      });

      return jsonResponse({
        success: true,
        data: {
          eventId: id,
          collaboratorId,
          status: 'pending',
        },
        message: 'Collaboration request sent',
      });
    } else if (action === 'accept' || action === 'reject') {
      // Accept or reject collaboration
      if (!collaboratorId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: collaboratorId',
          },
          400
        );
      }

      const collaboration = eventCollaborations.find(
        c => c.collaboratorId === collaboratorId && c.status === 'pending'
      );

      if (!collaboration) {
        return jsonResponse(
          {
            success: false,
            message: 'Collaboration request not found',
          },
          404
        );
      }

      collaboration.status = action === 'accept' ? 'accepted' : 'rejected';

      return jsonResponse({
        success: true,
        data: {
          eventId: id,
          collaboratorId,
          status: collaboration.status,
        },
        message: `Collaboration ${action === 'accept' ? 'accepted' : 'rejected'}`,
      });
    } else {
      return jsonResponse(
        {
          success: false,
          message: 'Invalid action. Use "request", "accept", or "reject"',
        },
        400
      );
    }
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process collaboration',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/collaborate - Get collaborations for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventCollaborations = collaborations.get(id) || [];

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        collaborations: eventCollaborations,
        pending: eventCollaborations.filter(c => c.status === 'pending').length,
        accepted: eventCollaborations.filter(c => c.status === 'accepted').length,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get collaborations',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

