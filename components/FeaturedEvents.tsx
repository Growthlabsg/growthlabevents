'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Event } from '@/types/event';
import { isFeaturedEvent } from '@/lib/featuredEvents';

interface FeaturedEventsProps {
  events: Event[];
}

export function FeaturedEvents({ events }: FeaturedEventsProps) {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Filter featured events
    const featured = events.filter(event => isFeaturedEvent(event.id));
    setFeaturedEvents(featured);
  }, [events]);

  if (featuredEvents.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Featured Events
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {featuredEvents.slice(0, 3).map((event) => {
          const eventDate = new Date(event.date);
          return (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-amber-400 dark:border-amber-500 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-200 shadow-lg hover:shadow-xl card-elegant overflow-hidden relative">
                {/* Featured Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </div>
                </div>

                <div className="w-full h-48 sm:h-52 bg-gradient-to-br from-amber-400 to-orange-500 relative">
                  <div className="absolute inset-0 flex flex-col justify-center text-white p-4 bg-gradient-to-br from-amber-600 to-orange-700">
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

                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2.5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{event.time} • {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{event.registeredCount} going</span>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-amber-50 dark:hover:bg-amber-900/20 flex-shrink-0">
                      View Details
                    </Button>
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

