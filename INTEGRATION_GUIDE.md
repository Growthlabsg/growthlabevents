# GrowthLab Events Platform - Complete Integration Guide

## ✅ Status: Ready for Integration

**Build Status**: ✅ Successful (0 errors)  
**Linter Status**: ✅ No errors  
**TypeScript**: ✅ All types valid  
**API Integration**: ✅ Fully configured

## Overview

This platform is fully configured to integrate with the GrowthLab main platform. All API endpoints are ready and the codebase is production-ready.

## Integration Architecture

### Two Integration Modes

#### Mode 1: Direct API Integration (Production - Recommended)
- **Environment Variable**: `NEXT_PUBLIC_USE_GROWTHLAB_API=true`
- **Behavior**: All API calls go directly to `https://api.growthlab.sg`
- **Benefits**: Faster, no proxy layer, direct connection
- **Use Case**: Production deployment

#### Mode 2: Proxy API Routes (Development)
- **Environment Variable**: `NEXT_PUBLIC_USE_GROWTHLAB_API=false` (or unset)
- **Behavior**: Uses Next.js API routes (`/api/*`) that proxy to GrowthLab
- **Benefits**: Better for development, allows local mocking
- **Use Case**: Development and testing

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file (or set in your deployment platform):

```env
# GrowthLab Main Platform API
NEXT_PUBLIC_GROWTHLAB_API_URL=https://api.growthlab.sg
NEXT_PUBLIC_GROWTHLAB_AUTH_URL=https://auth.growthlab.sg

# API Integration Mode
# Set to 'true' for production (direct API)
# Set to 'false' for development (proxy mode)
NEXT_PUBLIC_USE_GROWTHLAB_API=true

# Server-side API configuration (for Next.js API routes)
GROWTHLAB_API_URL=https://api.growthlab.sg
USE_GROWTHLAB_API=true

# Local API URL (for proxy mode)
NEXT_PUBLIC_API_URL=/api

# Environment
NODE_ENV=production
```

## Authentication

### Token Management

The platform expects authentication tokens from the GrowthLab main platform:

1. **Token Storage**: Tokens are stored in browser storage:
   - `localStorage.getItem('growthlab_auth_token')`
   - `localStorage.getItem('auth_token')`
   - `sessionStorage.getItem('growthlab_auth_token')`

2. **Token Passing**: Tokens are automatically included in all API requests:
   - Header: `Authorization: Bearer <token>`
   - Platform identifier: `X-Platform: growthlab-events`
   - Version: `X-Platform-Version: 1.0.0`

3. **Token Management**: The main GrowthLab platform should set tokens when users log in.

## API Endpoints

### User Management

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/users/me` | GET | Get current user profile | `GET /api/users/me` |
| `/api/users/me` | PUT | Update user profile | `PUT /api/users/me` |
| `/api/users/me/logo` | POST | Upload user logo | `POST /api/users/me/logo` |
| `/api/users/me/events` | GET | Get user's events | `GET /api/users/me/events` |

### Events Management

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/events` | GET | Get all events (with filters) | `GET /api/events` |
| `/api/events` | POST | Create new event | `POST /api/events` |
| `/api/events/[id]` | GET | Get event details | `GET /api/events/[id]` |
| `/api/events/[id]` | PUT | Update event | `PUT /api/events/[id]` |
| `/api/events/[id]` | DELETE | Delete event | `DELETE /api/events/[id]` |
| `/api/events/[id]/register` | POST | Register for event | `POST /api/events/[id]/register` |
| `/api/events/[id]/status` | PUT | Update event status | `PUT /api/events/[id]/status` |
| `/api/events/[id]/checkin` | GET | Get check-in data | `GET /api/events/[id]/checkin` |
| `/api/events/[id]/checkin` | POST | Check in attendee | `POST /api/events/[id]/checkin` |
| `/api/events/[id]/attendees` | GET | Get event attendees | `GET /api/events/[id]/attendees` |
| `/api/events/[id]/analytics` | GET | Get event analytics | `GET /api/events/[id]/analytics` |
| `/api/events/[id]/save` | POST | Save/unsave event | `POST /api/events/[id]/save` |
| `/api/events/[id]/tags` | GET | Get event tags | `GET /api/events/[id]/tags` |
| `/api/events/[id]/tags` | POST | Assign tags to event | `POST /api/events/[id]/tags` |

### Calendars

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/calendars` | GET | Get user's calendars | `GET /api/calendars` |
| `/api/calendars` | POST | Create calendar | `POST /api/calendars` |
| `/api/calendars/[id]` | GET | Get calendar details | `GET /api/calendars/[id]` |
| `/api/calendars/[id]/subscribe` | POST | Subscribe to calendar | `POST /api/calendars/[id]/subscribe` |
| `/api/calendars/[id]/subscribe` | DELETE | Unsubscribe from calendar | `DELETE /api/calendars/[id]/subscribe` |
| `/api/calendars/[id]/tags` | GET | Get calendar tags | `GET /api/calendars/[id]/tags` |
| `/api/calendars/[id]/tags` | POST | Create calendar tag | `POST /api/calendars/[id]/tags` |

### Networking

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/networking/namecard` | GET | Get virtual name card | `GET /api/networking/namecard` |
| `/api/networking/namecard` | PUT | Update virtual name card | `PUT /api/networking/namecard` |
| `/api/networking/contacts` | GET | Get contacts | `GET /api/networking/contacts` |
| `/api/networking/contacts` | POST | Exchange contacts | `POST /api/networking/contacts` |

### Demerits

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/demerits` | GET | Get user demerits | `GET /api/demerits` |
| `/api/demerits/appeals` | POST | Submit demerit appeal | `POST /api/demerits/appeals` |

### Payments

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/payments` | POST | Create payment | `POST /api/payments` |
| `/api/payments/discount` | POST | Apply discount code | `POST /api/payments/discount` |
| `/api/payments/refund` | POST | Process refund | `POST /api/payments/refund` |

### Notifications

| Endpoint | Method | Description | GrowthLab Endpoint |
|----------|--------|-------------|-------------------|
| `/api/notifications/preferences` | GET | Get notification preferences | `GET /api/notifications/preferences` |
| `/api/notifications/preferences` | PUT | Update preferences | `PUT /api/notifications/preferences` |
| `/api/notifications/reminders` | POST | Send reminder | `POST /api/notifications/reminders` |

## API Client Usage

### Direct API Mode

```typescript
import { growthlabApi } from '@/lib/growthlab-api';

// Get current user
const user = await growthlabApi.user.getCurrentUser();

// Get events
const events = await growthlabApi.events.getAllEvents({ status: 'upcoming' });

// Create event
const newEvent = await growthlabApi.events.createEvent({
  title: 'My Event',
  description: 'Event description',
  // ... other fields
});
```

### Unified Client (Auto-switching)

```typescript
import { apiClient } from '@/lib/api-client';

// Automatically uses GrowthLab API or local routes based on env
const user = await apiClient.getCurrentUser();
const events = await apiClient.getAllEvents({ status: 'upcoming' });
```

## Request/Response Format

### Standard Request Headers

```
Authorization: Bearer <token>
Content-Type: application/json
X-Platform: growthlab-events
X-Platform-Version: 1.0.0
```

### Standard Response Format

```typescript
{
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

## Error Handling

All API calls include comprehensive error handling:

- **Network Errors**: Returns `{ success: false, error: 'NETWORK_ERROR' }`
- **HTTP Errors**: Returns error with status code and message
- **Validation Errors**: Returns validation error details
- **Authentication Errors**: Returns 401 with authentication required message

## File Uploads

### User Logo Upload

```typescript
const formData = new FormData();
formData.append('logo', file);

const response = await fetch('/api/users/me/logo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

### Event Poster Upload

```typescript
const formData = new FormData();
formData.append('poster', imageFile);
formData.append('title', 'Event Title');
// ... other fields

const response = await fetch('/api/events', {
  method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  body: formData,
});
```

## CORS Configuration

CORS is configured in `next.config.js`:

- **Allowed Origins**: `*` (configurable)
- **Allowed Methods**: `GET, OPTIONS, PATCH, DELETE, POST, PUT`
- **Allowed Headers**: Includes `Authorization`, `X-Platform`, `Content-Type`, etc.

## Deployment Checklist

### Pre-Deployment

- [ ] Set environment variables in deployment platform
- [ ] Configure `NEXT_PUBLIC_USE_GROWTHLAB_API=true` for production
- [ ] Verify `NEXT_PUBLIC_GROWTHLAB_API_URL` is correct
- [ ] Test authentication token flow
- [ ] Verify CORS settings

### Post-Deployment

- [ ] Test API connectivity
- [ ] Verify authentication works
- [ ] Test file uploads
- [ ] Monitor error logs
- [ ] Verify all endpoints respond correctly

## Troubleshooting

### API Not Connecting

1. Check environment variables are set correctly
2. Verify `GROWTHLAB_API_URL` is accessible
3. Check authentication token is valid
4. Verify CORS settings allow requests

### Authentication Issues

1. Verify token is stored in `localStorage` or `sessionStorage`
2. Check token format: `Bearer <token>`
3. Verify token hasn't expired
4. Check token is being sent in headers

### File Upload Issues

1. Verify `Content-Type` is not set (browser sets it automatically)
2. Check file size limits (configured in `next.config.js`)
3. Verify authentication token is included
4. Check server-side body size limit

## Support

For integration support, refer to:
- `lib/growthlab-api.ts` - Direct API client
- `lib/api-client.ts` - Unified client
- `app/api/**/route.ts` - API route handlers

## Version

- **Platform Version**: 1.0.0
- **API Version**: Compatible with GrowthLab API v1
- **Last Updated**: 2025-01-XX
