# GrowthLab API Integration Guide

## Overview
This platform is designed to integrate with the GrowthLab backend API. All API calls are centralized in `lib/api.ts`.

## API Structure

### Events API (`eventsApi`)
- `getAllEvents(filters?)` - Get all events with optional filters
- `getEventById(id)` - Get a specific event
- `registerForEvent(eventId, ticketTypeId)` - Register for an event
- `updateEventStatus(eventId, status)` - Update user's going/interested status

### Calendars API (`calendarsApi`)
- `getMyCalendars()` - Get user's calendars
- `subscribeToCalendar(calendarId)` - Subscribe to a calendar

### Auth API (`authApi`)
- `login(email, password)` - User login
- `getCurrentUser()` - Get current authenticated user

## Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=https://api.growthlab.sg
NEXT_PUBLIC_AUTH_ENABLED=true
```

## Integration Steps

1. **Update API Base URL**: Set `NEXT_PUBLIC_API_URL` in `.env.local`

2. **Uncomment API Calls**: In `lib/api.ts`, uncomment the actual fetch calls and remove mock returns

3. **Add Authentication**: Implement `getAuthToken()` to retrieve JWT from GrowthLab auth system

4. **Update Components**: Replace mock data imports with API calls:
   ```typescript
   // Before
   import { mockEvents } from '@/lib/mockData';
   
   // After
   import { eventsApi } from '@/lib/api';
   const { data: events } = await eventsApi.getAllEvents();
   ```

5. **Error Handling**: Add proper error handling and loading states

## API Endpoints (Expected)

### Events
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/register` - Register for event
- `PUT /api/events/:id/status` - Update event status

### Calendars
- `GET /api/calendars` - Get user calendars
- `POST /api/calendars/:id/subscribe` - Subscribe to calendar

### Auth
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Mock Data

Currently using mock data from `lib/mockData.ts`. This will be replaced with API calls once the backend is ready.

