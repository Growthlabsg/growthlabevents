import { Event } from '@/types/event';

// Generate dates - Today is Sunday, Nov 16, 2024
const today = new Date();
today.setDate(16); // Set to 16th
today.setMonth(10); // November (0-indexed, so 10 = November)
today.setFullYear(2024);
today.setHours(0, 0, 0, 0);

const date18Nov = new Date(2024, 10, 18); // November 18, 2024
const date19Nov = new Date(2024, 10, 19); // November 19, 2024

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'AI Robotics Hackathon',
    description: 'Join us for an innovative AI and robotics hackathon. Build cutting-edge solutions with industry experts.',
    date: formatDate(today),
    time: '14:00',
    location: 'Antler',
    locationType: 'physical',
    organizer: {
      name: 'Drift (godrift_ai)',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: '1', name: 'General Admission', price: 0, quantity: 100, sold: 67 },
    ],
    totalCapacity: 100,
    registeredCount: 67,
    status: 'upcoming',
    createdAt: '2024-11-01',
    imageUrl: '/event-thumbnails/ai-robotics.jpg',
  },
  {
    id: '2',
    title: 'Singapore AI Showcase (Nov 2025)',
    description: 'Explore the latest AI innovations and network with industry leaders.',
    date: formatDate(date18Nov),
    time: '18:30',
    location: 'National Library / Lee Kong Chian Reference Library',
    locationType: 'physical',
    organizer: {
      name: 'Menlo Research, yip jia qi, Warren Low & Yong Qua...',
    },
    ticketTypes: [
      { id: '2', name: 'General Admission', price: 0, quantity: 200, sold: 145 },
    ],
    totalCapacity: 200,
    registeredCount: 145,
    status: 'upcoming',
    createdAt: '2024-11-05',
    imageUrl: '/event-thumbnails/ai-showcase.jpg',
  },
  {
    id: '3',
    title: 'AI Vibe & Connect',
    description: 'Connect with AI enthusiasts and professionals. Networking and discussions.',
    date: formatDate(date19Nov),
    time: '18:30',
    location: 'SGInnovate',
    locationType: 'physical',
    organizer: {
      name: 'Claire Toh & TechFin Global',
    },
    ticketTypes: [
      { id: '3', name: 'Free Ticket', price: 0, quantity: 80, sold: 52 },
    ],
    totalCapacity: 80,
    registeredCount: 52,
    status: 'upcoming',
    createdAt: '2024-10-28',
    imageUrl: '/event-thumbnails/ai-vibe.jpg',
  },
  {
    id: 'growthlab-1',
    title: 'GrowthLab Startup Pitch Night',
    description: 'Join us for an exciting evening of startup pitches, networking, and innovation. Watch emerging startups present their ideas to a panel of investors and industry experts. Perfect opportunity to connect with entrepreneurs, investors, and tech enthusiasts.',
    date: formatDate(new Date(2024, 10, 25)), // November 25, 2024
    time: '19:00',
    location: 'GrowthLab HQ, Marina Bay',
    locationType: 'physical',
    organizer: {
      name: 'GrowthLab Events',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: 'gl1', name: 'Early Bird', price: 25, quantity: 50, sold: 42 },
      { id: 'gl2', name: 'General Admission', price: 35, quantity: 100, sold: 78 },
      { id: 'gl3', name: 'VIP', price: 75, quantity: 20, sold: 15 },
    ],
    totalCapacity: 170,
    registeredCount: 135,
    status: 'upcoming',
    createdAt: '2024-11-10',
    imageUrl: '/event-thumbnails/growthlab-pitch.jpg',
    calendarId: '1', // Belongs to GrowthLab Events calendar
  },
  {
    id: 'growthlab-2',
    title: 'ROOFTOP SUNSET MIXER - Startup Surge Kickoff',
    description: 'Join us for an exclusive rooftop networking event to kick off Startup Surge. Connect with founders, investors, and innovators while enjoying sunset views.',
    date: formatDate(new Date(2024, 10, 7)), // November 7, 2024
    time: '18:00',
    location: 'Skysuites @ Anson',
    locationType: 'physical',
    organizer: {
      name: 'GrowthLab Events',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: 'gl2-1', name: 'General Admission', price: 0, quantity: 100, sold: 85 },
    ],
    totalCapacity: 100,
    registeredCount: 85,
    status: 'past',
    createdAt: '2024-10-15',
    imageUrl: '/event-thumbnails/rooftop-mixer.jpg',
    calendarId: '1',
  },
  {
    id: 'growthlab-3',
    title: 'Sweat Equity: Where Deals Happen in Motion',
    description: 'A unique networking event combining fitness and business. Join us for beach activities followed by networking sessions.',
    date: formatDate(new Date(2024, 8, 7)), // September 7, 2024
    time: '09:00',
    location: 'Siloso Beach',
    locationType: 'physical',
    organizer: {
      name: 'GrowthLab Events',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: 'gl3-1', name: 'Early Bird', price: 20, quantity: 50, sold: 48 },
      { id: 'gl3-2', name: 'General Admission', price: 30, quantity: 100, sold: 92 },
    ],
    totalCapacity: 150,
    registeredCount: 140,
    status: 'past',
    createdAt: '2024-08-20',
    imageUrl: '/event-thumbnails/sweat-equity.jpg',
    calendarId: '1',
  },
  {
    id: 'growthlab-4',
    title: 'Sweat Equity: Where Deals Happen in Motion',
    description: 'A unique networking event combining fitness and business. Join us for beach activities followed by networking sessions.',
    date: formatDate(new Date(2024, 7, 31)), // August 31, 2024
    time: '09:00',
    location: 'Siloso Beach',
    locationType: 'physical',
    organizer: {
      name: 'GrowthLab Events',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: 'gl4-1', name: 'Early Bird', price: 20, quantity: 50, sold: 45 },
      { id: 'gl4-2', name: 'General Admission', price: 30, quantity: 100, sold: 88 },
    ],
    totalCapacity: 150,
    registeredCount: 133,
    status: 'past',
    createdAt: '2024-07-25',
    imageUrl: '/event-thumbnails/sweat-equity.jpg',
    calendarId: '1',
  },
  {
    id: 'growthlab-5',
    title: 'Founder Fireside Chat: Scaling Your Startup',
    description: 'An intimate conversation with successful founders sharing their journey of scaling startups. Q&A session included.',
    date: formatDate(new Date(2024, 9, 15)), // October 15, 2024
    time: '19:30',
    location: 'GrowthLab HQ, Marina Bay',
    locationType: 'physical',
    organizer: {
      name: 'GrowthLab Events',
      avatar: '/avatar1.jpg',
    },
    ticketTypes: [
      { id: 'gl5-1', name: 'General Admission', price: 0, quantity: 60, sold: 60 },
    ],
    totalCapacity: 60,
    registeredCount: 60,
    status: 'past',
    createdAt: '2024-09-20',
    imageUrl: '/event-thumbnails/fireside-chat.jpg',
    calendarId: '1',
  },
];

// Mock attendees for events
export const mockAttendees: Record<string, Array<{ id: string; name: string; avatar?: string; email?: string }>> = {
  '1': [
    { id: 'a1', name: 'John Doe', avatar: '/avatars/john.jpg' },
    { id: 'a2', name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
    { id: 'a3', name: 'Bob Johnson', avatar: '/avatars/bob.jpg' },
    { id: 'a4', name: 'Alice Brown', avatar: '/avatars/alice.jpg' },
    { id: 'a5', name: 'Charlie Wilson', avatar: '/avatars/charlie.jpg' },
  ],
  '2': [
    { id: 'b1', name: 'David Lee', avatar: '/avatars/david.jpg' },
    { id: 'b2', name: 'Emma Davis', avatar: '/avatars/emma.jpg' },
    { id: 'b3', name: 'Frank Miller', avatar: '/avatars/frank.jpg' },
    { id: 'b4', name: 'Grace Taylor', avatar: '/avatars/grace.jpg' },
    { id: 'b5', name: 'Henry White', avatar: '/avatars/henry.jpg' },
  ],
  '3': [
    { id: 'c1', name: 'Ivy Chen', avatar: '/avatars/ivy.jpg' },
    { id: 'c2', name: 'Jack Liu', avatar: '/avatars/jack.jpg' },
    { id: 'c3', name: 'Kate Wong', avatar: '/avatars/kate.jpg' },
    { id: 'c4', name: 'Liam Tan', avatar: '/avatars/liam.jpg' },
    { id: 'c5', name: 'Mia Lim', avatar: '/avatars/mia.jpg' },
  ],
  'growthlab-1': [
    { id: 'gl1', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    { id: 'gl2', name: 'Michael Chen', email: 'michael.chen@example.com' },
    { id: 'gl3', name: 'Emily Rodriguez', email: 'emily.r@example.com' },
    { id: 'gl4', name: 'David Kim', email: 'david.kim@example.com' },
    { id: 'gl5', name: 'Lisa Wang', email: 'lisa.wang@example.com' },
    { id: 'gl6', name: 'James Taylor', email: 'james.t@example.com' },
    { id: 'gl7', name: 'Sophie Brown', email: 'sophie.b@example.com' },
    { id: 'gl8', name: 'Alex Martinez', email: 'alex.m@example.com' },
  ],
};

// Mock user event status (going/interested/not going)
export const mockUserEventStatus: Record<string, 'going' | 'interested' | 'not_going' | null> = {
  '1': 'going',
  '2': 'going',
  '3': null,
};
