'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';
import { getSavedEventIds } from '@/lib/savedEvents';

export default function SavedEventsPage() {
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSavedEventIds();
    setSavedEventIds(saved);
    setLoading(false);
  }, []);

  const savedEvents = mockEvents.filter(event => savedEventIds.includes(event.id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Saved Events
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Events you've bookmarked
            </p>
          </div>

          {savedEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No saved events
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Start saving events to see them here
              </p>
              <Link href="/events">
                <Button variant="primary">Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant overflow-hidden">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative">
                        <div className="absolute inset-0 flex flex-col justify-center text-white p-4 bg-gradient-to-br from-slate-800 to-slate-900">
                          <div className="text-xs font-bold mb-1">
                            {eventDate.toLocaleDateString('en-US', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }).toUpperCase()}
                          </div>
                          <div className="text-xs font-bold text-center leading-tight">
                            {event.title.toUpperCase()}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Saved
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {event.registeredCount} going
                          </span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

