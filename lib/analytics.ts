// Advanced Analytics - Performance Metrics, Export Functions

export interface EventAnalytics {
  eventId: string;
  totalViews: number;
  uniqueViews: number;
  registrations: number;
  checkIns: number;
  checkOuts: number;
  currentAttendees: number;
  revenue: number;
  averageTicketPrice: number;
  conversionRate: number;
  viewsByDate: Array<{ date: string; views: number }>;
  registrationsByDate: Array<{ date: string; registrations: number }>;
  topReferrers: Array<{ source: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

export interface CalendarAnalytics {
  calendarId: string;
  totalEvents: number;
  totalRegistrations: number;
  totalRevenue: number;
  averageEventRevenue: number;
  averageRegistrationsPerEvent: number;
  eventsByMonth: Array<{ month: string; count: number; revenue: number }>;
  topEvents: Array<{ eventId: string; title: string; registrations: number; revenue: number }>;
}

// In-memory storage (in production, use database)
const eventAnalytics: Map<string, EventAnalytics> = new Map();
const calendarAnalytics: Map<string, CalendarAnalytics> = new Map();

// Track event view
export function trackEventView(eventId: string, userId?: string): void {
  const analytics = eventAnalytics.get(eventId) || createDefaultEventAnalytics(eventId);
  analytics.totalViews++;
  if (userId) {
    // In production, track unique views properly
    analytics.uniqueViews++;
  }
  
  const today = new Date().toISOString().split('T')[0];
  const viewEntry = analytics.viewsByDate.find(v => v.date === today);
  if (viewEntry) {
    viewEntry.views++;
  } else {
    analytics.viewsByDate.push({ date: today, views: 1 });
  }
  
  eventAnalytics.set(eventId, analytics);
}

// Track event registration
export function trackEventRegistration(eventId: string): void {
  const analytics = eventAnalytics.get(eventId) || createDefaultEventAnalytics(eventId);
  analytics.registrations++;
  
  const today = new Date().toISOString().split('T')[0];
  const regEntry = analytics.registrationsByDate.find(r => r.date === today);
  if (regEntry) {
    regEntry.registrations++;
  } else {
    analytics.registrationsByDate.push({ date: today, registrations: 1 });
  }
  
  eventAnalytics.set(eventId, analytics);
}

// Get event analytics
export function getEventAnalytics(eventId: string, mockData?: {
  registeredCount: number;
  totalCapacity: number;
  revenue: number;
  checkIns: number;
  checkOuts: number;
}): EventAnalytics {
  let analytics = eventAnalytics.get(eventId);
  
  if (!analytics) {
    analytics = createDefaultEventAnalytics(eventId);
  }
  
  // Merge with mock data if provided
  if (mockData) {
    analytics.registrations = mockData.registeredCount;
    analytics.checkIns = mockData.checkIns || 0;
    analytics.checkOuts = mockData.checkOuts || 0;
    analytics.currentAttendees = analytics.checkIns - analytics.checkOuts;
    analytics.revenue = mockData.revenue || 0;
    analytics.averageTicketPrice = mockData.registeredCount > 0 
      ? analytics.revenue / mockData.registeredCount 
      : 0;
    analytics.conversionRate = analytics.totalViews > 0
      ? (analytics.registrations / analytics.totalViews) * 100
      : 0;
  }
  
  return analytics;
}

// Get calendar analytics
export function getCalendarAnalytics(calendarId: string, events: Array<{
  id: string;
  title: string;
  registeredCount: number;
  revenue?: number;
}>): CalendarAnalytics {
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);
  
  const analytics: CalendarAnalytics = {
    calendarId,
    totalEvents,
    totalRegistrations,
    totalRevenue,
    averageEventRevenue: totalEvents > 0 ? totalRevenue / totalEvents : 0,
    averageRegistrationsPerEvent: totalEvents > 0 ? totalRegistrations / totalEvents : 0,
    eventsByMonth: [], // Would be calculated from event dates
    topEvents: events
      .map(e => ({
        eventId: e.id,
        title: e.title,
        registrations: e.registeredCount,
        revenue: e.revenue || 0,
      }))
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 5),
  };
  
  calendarAnalytics.set(calendarId, analytics);
  return analytics;
}

// Create default event analytics
function createDefaultEventAnalytics(eventId: string): EventAnalytics {
  return {
    eventId,
    totalViews: 0,
    uniqueViews: 0,
    registrations: 0,
    checkIns: 0,
    checkOuts: 0,
    currentAttendees: 0,
    revenue: 0,
    averageTicketPrice: 0,
    conversionRate: 0,
    viewsByDate: [],
    registrationsByDate: [],
    topReferrers: [],
    topLocations: [],
  };
}

// Export attendance data to CSV
export function exportAttendanceToCSV(
  eventId: string,
  attendees: Array<{
    id: string;
    name: string;
    email?: string;
    checkedInAt?: string;
    checkedOutAt?: string;
  }>
): string {
  const headers = ['Name', 'Email', 'Checked In', 'Checked Out', 'Status'];
  const rows = attendees.map(attendee => [
    attendee.name,
    attendee.email || '',
    attendee.checkedInAt ? new Date(attendee.checkedInAt).toLocaleString() : '',
    attendee.checkedOutAt ? new Date(attendee.checkedOutAt).toLocaleString() : '',
    attendee.checkedInAt && !attendee.checkedOutAt ? 'Present' : attendee.checkedOutAt ? 'Checked Out' : 'Not Checked In',
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

// Export event analytics to CSV
export function exportEventAnalyticsToCSV(analytics: EventAnalytics): string {
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Views', analytics.totalViews.toString()],
    ['Unique Views', analytics.uniqueViews.toString()],
    ['Registrations', analytics.registrations.toString()],
    ['Check-ins', analytics.checkIns.toString()],
    ['Check-outs', analytics.checkOuts.toString()],
    ['Current Attendees', analytics.currentAttendees.toString()],
    ['Revenue', `$${analytics.revenue.toFixed(2)}`],
    ['Average Ticket Price', `$${analytics.averageTicketPrice.toFixed(2)}`],
    ['Conversion Rate', `${analytics.conversionRate.toFixed(2)}%`],
  ];
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

