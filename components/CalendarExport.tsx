'use client';

import { Button } from '@/components/ui/Button';
import { downloadICal, generateGoogleCalendarUrl, generateOutlookCalendarUrl } from '@/lib/calendarExport';
import { Event } from '@/types/event';

interface CalendarExportProps {
  event: Event;
}

export function CalendarExport({ event }: CalendarExportProps) {
  const handleExport = (type: 'ical' | 'google' | 'outlook') => {
    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // Default to 2 hours duration if no end time
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2);

    const calendarEvent = {
      title: event.title,
      description: event.description,
      startDate: eventDate,
      endDate: endDate,
      location: event.location,
      url: typeof window !== 'undefined' ? `${window.location.origin}/events/${event.id}` : undefined,
    };

    if (type === 'ical') {
      downloadICal(calendarEvent, `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`);
    } else if (type === 'google') {
      window.open(generateGoogleCalendarUrl(calendarEvent), '_blank');
    } else if (type === 'outlook') {
      window.open(generateOutlookCalendarUrl(calendarEvent), '_blank');
    }
  };

  return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Add to Calendar</p>
        
        {/* iCal Subscription Link */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 mb-3">
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Subscribe to Calendar</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Get automatic updates for this event
          </p>
          <a
            href={`/api/events/${event.id}/calendar.ics`}
            className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Subscribe via iCal
          </a>
        </div>
      <div className="flex flex-col gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('google')}
          className="w-full justify-start hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
        >
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm">Google Calendar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('outlook')}
          className="w-full justify-start hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
        >
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span className="text-sm">Outlook Calendar</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('ical')}
          className="w-full justify-start hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
        >
          <svg className="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">Download iCal</span>
        </Button>
      </div>
    </div>
  );
}

