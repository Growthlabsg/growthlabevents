'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types/event';
import { getRecommendedEvents, getSimilarEvents } from '@/lib/eventRecommendations';
import { mockEvents } from '@/lib/mockData';

interface EventRecommendationsProps {
  currentEvent?: Event;
  userInterestedEvents?: string[];
  userId?: string;
}

export function EventRecommendations({ currentEvent, userInterestedEvents = [], userId = 'current-user' }: EventRecommendationsProps) {
  // Memoize the userInterestedEvents array to prevent unnecessary recomputations
  const userInterestedEventsKey = useMemo(() => {
    return userInterestedEvents.join(',');
  }, [userInterestedEvents]);

  // Use useMemo to compute recommendations based on stable dependencies
  // Only depend on stable values (IDs/keys), not the full objects/arrays
  const recommendations = useMemo(() => {
    if (currentEvent?.id) {
      // Get similar events - currentEvent is accessed from closure, which is fine
      return getSimilarEvents(currentEvent, mockEvents);
    } else {
      // Get general recommendations - userInterestedEvents is accessed from closure
      return getRecommendedEvents(mockEvents, userInterestedEvents, undefined, userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEvent?.id, userInterestedEventsKey, userId]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-10">
      <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-5 sm:mb-6">
        {currentEvent ? 'Similar Events' : 'Recommended for You'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {recommendations.map((event) => {
          const eventDate = new Date(event.date);
          return (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant overflow-hidden">
                <div className="w-full h-36 sm:h-40 bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  <div className="absolute inset-0 flex flex-col justify-center text-white p-3 sm:p-4 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="text-xs sm:text-sm font-bold mb-1.5">
                      {eventDate.toLocaleDateString('en-US', { 
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }).toUpperCase()}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2">
                      {event.title.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h4 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {event.registeredCount} going
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

