# GrowthLab Events Platform - Deployment Guide

## Overview

This guide covers deploying the GrowthLab Events platform and integrating it with the GrowthLab main platform.

## Prerequisites

- Node.js 18+ and npm/yarn
- GrowthLab main platform API access
- Environment variables configured

## Environment Configuration

Create a `.env.local` file (or set environment variables in your deployment platform):

```env
# GrowthLab Main Platform API
NEXT_PUBLIC_GROWTHLAB_API_URL=https://api.growthlab.sg
NEXT_PUBLIC_GROWTHLAB_AUTH_URL=https://auth.growthlab.sg

# Events API (local routes)
NEXT_PUBLIC_API_URL=/api

# Enable GrowthLab API integration
USE_GROWTHLAB_API=true

# Environment
NODE_ENV=production
```

## API Integration Modes

### Mode 1: Direct GrowthLab API (Recommended for Production)

Set `USE_GROWTHLAB_API=true` to connect directly to GrowthLab main platform:

- All API calls go directly to `https://api.growthlab.sg`
- Requires authentication token from GrowthLab platform
- No local API routes needed

### Mode 2: Proxy via Local API Routes (Development/Staging)

Set `USE_GROWTHLAB_API=false` to use local API routes that proxy to GrowthLab:

- API calls go to `/api/*` routes
- Local routes proxy requests to GrowthLab API
- Useful for development and testing

## Authentication

The platform expects authentication tokens from the GrowthLab main platform:

1. **Token Storage**: Tokens are stored in `localStorage` or `sessionStorage` with key `growthlab_auth_token` or `auth_token`
2. **Token Passing**: Tokens are automatically included in API requests via `Authorization: Bearer <token>` header
3. **Token Management**: The main GrowthLab platform should set tokens when users log in

## API Endpoints

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/me/logo` - Upload user logo

### Event Endpoints

- `GET /api/events` - Get all events (with filters)
- `GET /api/events/[id]` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event
- `POST /api/events/[id]/register` - Register for event
- `POST /api/events/[id]/checkin` - Check in attendee

### Calendar Endpoints

- `GET /api/calendars` - Get user calendars
- `GET /api/calendars/[id]` - Get calendar details
- `POST /api/calendars/[id]/subscribe` - Subscribe to calendar

## Building for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

## Deployment Platforms

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Vercel Configuration:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t growthlab-events .
docker run -p 3000:3000 --env-file .env.local growthlab-events
```

## Integration with GrowthLab Main Platform

### 1. Embedding Events

Add to your main platform:

```html
<iframe 
  src="https://events.growthlab.sg/events" 
  width="100%" 
  height="600px"
  frameborder="0"
></iframe>
```

### 2. API Integration

Use the GrowthLab Events API from your main platform:

```typescript
// Fetch events
const response = await fetch('https://events.growthlab.sg/api/events', {
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json',
  },
});

const { data: events } = await response.json();
```

### 3. Authentication Flow

1. User logs into main GrowthLab platform
2. Main platform sets `growthlab_auth_token` in localStorage
3. Events platform reads token and includes in API requests
4. GrowthLab API validates token and returns user data

## Health Check

The platform includes a health check endpoint:

```bash
curl https://events.growthlab.sg/api/health
```

Response:
```json
{
  "success": true,
  "status": "healthy",
  "service": "GrowthLab Events API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Monitoring

### Error Tracking

Set up error tracking (e.g., Sentry):

```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Analytics

Add analytics tracking:

```env
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Security Checklist

- [ ] Environment variables are set securely
- [ ] API tokens are stored securely (httpOnly cookies recommended)
- [ ] CORS is configured correctly
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] File uploads are validated and sanitized
- [ ] HTTPS is enabled in production

## Troubleshooting

### API Connection Issues

1. Check `NEXT_PUBLIC_GROWTHLAB_API_URL` is correct
2. Verify authentication token is being sent
3. Check CORS settings on GrowthLab API
4. Review network requests in browser DevTools

### Build Errors

1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 18+)

### Runtime Errors

1. Check browser console for client-side errors
2. Check server logs for API errors
3. Verify all environment variables are set
4. Ensure API endpoints are accessible

## Support

For issues or questions:
- Check API documentation: `API_DOCUMENTATION.md`
- Review integration guide: `INTEGRATION_GUIDE.md`
- Contact GrowthLab platform team

