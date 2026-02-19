# GrowthLab Events API Documentation

This document describes the API endpoints for integrating the GrowthLab Events platform into the main GrowthLab platform.

## Base URL

```
https://events.growthlab.sg/api
```

Or for local development:
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Include the authorization token in the request headers:

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

#### GET /api/health

Check API health status.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "service": "GrowthLab Events API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Events

#### GET /api/events

Get all events with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (`upcoming`, `past`)
- `location` (optional): Filter by location
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "event-1",
      "title": "Event Title",
      "description": "Event description",
      "date": "2024-01-15",
      "time": "10:00 AM",
      "location": "Singapore",
      "locationType": "physical",
      "organizer": {
        "id": "user-1",
        "name": "Organizer Name"
      },
      "ticketTypes": [],
      "registeredCount": 0,
      "status": "upcoming",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST /api/events

Create a new event.

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event description",
  "startDate": "2024-01-15",
  "startTime": "10:00 AM",
  "endDate": "2024-01-15",
  "endTime": "12:00 PM",
  "location": "Singapore",
  "locationType": "physical",
  "visibility": "public",
  "ticketTypes": [
    {
      "name": "General Admission",
      "price": 0,
      "quantity": 100
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event-1",
    "title": "Event Title",
    ...
  },
  "message": "Event created successfully"
}
```

#### GET /api/events/[id]

Get a specific event by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "event-1",
    "title": "Event Title",
    ...
  }
}
```

#### PUT /api/events/[id]

Update an event.

**Request Body:** (same as POST /api/events)

**Response:**
```json
{
  "success": true,
  "message": "Event updated successfully"
}
```

#### DELETE /api/events/[id]

Delete an event.

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### POST /api/events/[id]/register

Register for an event.

**Request Body:**
```json
{
  "ticketTypeId": "ticket-1",
  "answers": {
    "question-1": "Answer"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "reg-1"
  },
  "message": "Successfully registered for event"
}
```

#### POST /api/events/[id]/checkin

Check in an attendee.

**Request Body:**
```json
{
  "registrationId": "reg-1"
}
```

Or:
```json
{
  "qrCode": "qr-code-string"
}
```

Or:
```json
{
  "email": "attendee@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkedIn": true,
    "checkedInAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Successfully checked in"
}
```

---

### Calendars

#### GET /api/calendars

Get user's calendars.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "calendar-1",
      "name": "Calendar Name",
      "slug": "calendar-slug"
    }
  ]
}
```

#### POST /api/calendars

Create a new calendar.

**Request Body:**
```json
{
  "name": "Calendar Name",
  "slug": "calendar-slug"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "calendar-1",
    "name": "Calendar Name",
    "slug": "calendar-slug",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Calendar created successfully"
}
```

---

### Users

#### GET /api/users/me

Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-1",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/users/me

Update current user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "User bio",
  "website": "https://example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

### Authentication

#### POST /api/auth/login

Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-1",
      "name": "User Name",
      "email": "user@example.com"
    }
  },
  "message": "Login successful"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Integration Guide

### 1. Environment Variables

Set the following environment variables:

```env
GROWTHLAB_API_URL=https://api.growthlab.sg
NEXT_PUBLIC_API_URL=https://events.growthlab.sg/api
```

### 2. Authentication

The API uses Bearer token authentication. Include the token from the main GrowthLab platform:

```javascript
const response = await fetch('https://events.growthlab.sg/api/events', {
  headers: {
    'Authorization': `Bearer ${growthlabToken}`,
    'Content-Type': 'application/json',
  },
});
```

### 3. CORS

The API supports CORS for cross-origin requests from the main GrowthLab platform.

### 4. Rate Limiting

API requests are rate-limited. Check response headers for rate limit information:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

---

## Next Steps

1. Replace mock implementations with actual GrowthLab API calls
2. Add authentication middleware
3. Implement rate limiting
4. Add request validation
5. Set up error logging and monitoring

