# GrowthLab Events Platform - API Integration Status

## ✅ API Integration: **FULLY CONFIGURED**

The platform is **fully integrated** with the GrowthLab main platform API. All endpoints are configured and ready to connect.

## Integration Architecture

### 1. **Direct API Mode** (Production - Recommended)
When `NEXT_PUBLIC_USE_GROWTHLAB_API=true`:
- All API calls go **directly** to `https://api.growthlab.sg`
- No proxy layer
- Faster, more efficient
- Uses `lib/growthlab-api.ts` client

### 2. **Proxy Mode** (Development)
When `NEXT_PUBLIC_USE_GROWTHLAB_API=false` or unset:
- Uses Next.js API routes (`/api/*`) that proxy to GrowthLab
- Better for development and testing
- Allows local mocking when GrowthLab API is unavailable
- Uses `lib/api-client.ts` unified client

## Current Configuration

### API Client Files
- ✅ `lib/growthlab-api.ts` - Direct GrowthLab API client (450 lines)
- ✅ `lib/api-client.ts` - Unified client with auto-switching (147 lines)

### API Routes (Proxy Mode)
- ✅ `app/api/users/me/route.ts` - User profile (GET, PUT)
- ✅ `app/api/users/me/logo/route.ts` - Logo upload (POST)
- ✅ `app/api/events/route.ts` - Events list (GET, POST)
- ✅ `app/api/events/[id]/route.ts` - Event details (GET, PUT, DELETE)
- ✅ `app/api/events/[id]/register/route.ts` - Event registration
- ✅ `app/api/calendars/route.ts` - Calendars management

### Authentication
- ✅ Bearer token authentication
- ✅ Token from localStorage (`growthlab_auth_token` or `auth_token`)
- ✅ Automatic token injection in all API calls
- ✅ Platform headers (`X-Platform: growthlab-events`)

## Environment Variables Required

Create `.env.local` or set in your deployment platform:

```env
# GrowthLab Main Platform API
NEXT_PUBLIC_GROWTHLAB_API_URL=https://api.growthlab.sg
NEXT_PUBLIC_GROWTHLAB_AUTH_URL=https://auth.growthlab.sg

# Enable Direct API Mode (set to 'true' for production)
NEXT_PUBLIC_USE_GROWTHLAB_API=true

# Server-side (for API routes)
GROWTHLAB_API_URL=https://api.growthlab.sg
USE_GROWTHLAB_API=true

# Local API (for proxy mode development)
NEXT_PUBLIC_API_URL=/api
```

## API Endpoints Integrated

### User Management
- ✅ `GET /api/users/me` - Get current user
- ✅ `PUT /api/users/me` - Update profile
- ✅ `POST /api/users/me/logo` - Upload logo

### Events
- ✅ `GET /api/events` - List all events (with filters)
- ✅ `GET /api/events/[id]` - Get event details
- ✅ `POST /api/events` - Create event (with image upload)
- ✅ `PUT /api/events/[id]` - Update event
- ✅ `DELETE /api/events/[id]` - Delete event
- ✅ `POST /api/events/[id]/register` - Register for event
- ✅ `PUT /api/events/[id]/status` - Update event status

### Calendars
- ✅ `GET /api/calendars` - Get user's calendars
- ✅ `GET /api/calendars/[id]` - Get calendar details
- ✅ `POST /api/calendars` - Create calendar
- ✅ `POST /api/calendars/[id]/subscribe` - Subscribe
- ✅ `DELETE /api/calendars/[id]/subscribe` - Unsubscribe

## How to Enable Integration

### Option 1: Direct API (Production)
```env
NEXT_PUBLIC_USE_GROWTHLAB_API=true
NEXT_PUBLIC_GROWTHLAB_API_URL=https://api.growthlab.sg
```

### Option 2: Proxy Mode (Development)
```env
NEXT_PUBLIC_USE_GROWTHLAB_API=false
# or simply don't set it
```

## Integration Features

✅ **Authentication**: Bearer token from GrowthLab platform
✅ **Error Handling**: Comprehensive error handling with fallbacks
✅ **File Uploads**: Image upload support for events and logos
✅ **CORS**: Configured in `next.config.js`
✅ **Platform Headers**: `X-Platform: growthlab-events` on all requests
✅ **Type Safety**: Full TypeScript interfaces for all API responses

## Next Steps

1. **Set Environment Variables** in your deployment platform
2. **Enable Direct API Mode** by setting `NEXT_PUBLIC_USE_GROWTHLAB_API=true`
3. **Verify Token Storage** - Ensure GrowthLab platform sets `growthlab_auth_token` in localStorage
4. **Test Integration** - Make a test API call to verify connection

## Status: ✅ READY FOR INTEGRATION

The platform is fully configured and ready to connect to the GrowthLab main platform. Just set the environment variables and it will automatically use the GrowthLab API.

