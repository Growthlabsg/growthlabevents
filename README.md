# GrowthLab Events - Event Management Platform

A modern event management and ticketing platform for GrowthLab, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎫 **Event Management**: Create, manage, and track events
- 🎟️ **Flexible Ticketing**: Support for paid and free tickets with multiple ticket types
- 👥 **Guest Management**: Track registrations and manage attendees
- 📊 **Dashboard & Analytics**: View event statistics and performance
- 🎨 **Modern UI**: Clean, minimalistic design with custom brand colors
- 📱 **Responsive**: Mobile-first design that works on all devices

## Brand Colors

- **Primary Teal**: #0F7377 (GrowthLab Teal)
- **Secondary Amber**: #F59E0B (GrowthLab Orange)
- **Slate/Gray**: #1E293B (Text & borders)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Custom components with brand colors
- **API**: RESTful API for GrowthLab platform integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
growthlab-events/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── events/            # Events pages
│   ├── create/            # Event creation page
│   └── dashboard/         # Dashboard page
├── components/            # React components
│   ├── ui/                # UI components (Button, Card, Input)
│   └── layout/            # Layout components (Navbar, Footer)
├── lib/                   # Utilities and mock data
├── types/                 # TypeScript type definitions
└── app/globals.css        # Global styles and brand colors
```

## Pages

- **Home** (`/`): Landing page with features and CTA
- **Events** (`/events`): Browse all events
- **Event Detail** (`/events/[id]`): View event details and register
- **Create Event** (`/create`): Create a new event
- **Dashboard** (`/dashboard`): Manage your events and view analytics
- **Settings** (`/settings`): User settings and preferences
- **Calendars** (`/calendars`): Manage event calendars
- **Discover** (`/discover`): Discover events and calendars

## API Integration

The platform provides RESTful API endpoints for integration with the main GrowthLab platform.

### Quick API Example

```typescript
// Fetch events
const response = await fetch('https://events.growthlab.sg/api/events', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const { data } = await response.json();
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API documentation and [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for integration instructions.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design System

The platform uses a comprehensive design system with:
- Custom color palette (Teal, Amber, Slate)
- Consistent border radius (8px default)
- Status colors (Success, Warning, Error, Info)
- Role-based colors for different user types
- Responsive breakpoints
- Smooth animations (fade-in, slide-up, pulse)

## License

MIT
