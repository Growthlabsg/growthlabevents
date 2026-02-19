'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ContactExchangeRequest } from './ContactExchangeRequest';

interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

interface AttendeeDirectoryProps {
  eventId: string;
  currentUserId?: string;
}

export function AttendeeDirectory({ eventId, currentUserId = 'current-user' }: AttendeeDirectoryProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState<string | null>(null);

  useEffect(() => {
    // Fetch attendees
    const fetchAttendees = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/attendees`);
        const data = await response.json();
        if (data.success) {
          setAttendees(data.data.attendees || []);
        }
      } catch (error) {
        console.error('Failed to fetch attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactExchange = (attendeeId: string) => {
    // In production, this would trigger a contact exchange request
    console.log('Requesting contact exchange with:', attendeeId);
    // You could show a modal or notification here
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Attendee Directory <span className="text-slate-500 dark:text-slate-400 font-normal">({attendees.length})</span>
        </h3>
        
        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attendees..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Attendees List */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery ? 'No attendees found' : 'No attendees yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAttendees.map((attendee) => (
            <div
              key={attendee.id}
              className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-sm sm:text-base font-medium flex-shrink-0">
                  {attendee.avatar ? (
                    <img src={attendee.avatar} alt={attendee.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    attendee.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {attendee.name}
                  </p>
                  {attendee.email && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {attendee.email}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAttendee(selectedAttendee === attendee.id ? null : attendee.id)}
                  className="flex-shrink-0 hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="hidden sm:inline whitespace-nowrap">Connect</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </div>
              {/* Contact Exchange Request */}
              {selectedAttendee === attendee.id && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <ContactExchangeRequest
                    userId={currentUserId}
                    targetUserId={attendee.id}
                    eventId={eventId}
                    onRequestSent={() => {
                      setSelectedAttendee(null);
                      handleContactExchange(attendee.id);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
          )}
        </div>
      );
    }

