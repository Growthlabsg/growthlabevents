'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';
import { sanitizeInput, validateLength } from '@/lib/security';

const categoryMap: Record<string, { name: string; description: string; icon: string }> = {
  'pitch-nights': {
    name: 'Pitch Nights',
    description: 'Showcase your startup and connect with investors',
    icon: '🎤',
  },
  'workshops': {
    name: 'Workshops',
    description: 'Learn new skills and grow your expertise',
    icon: '🔧',
  },
  'networking': {
    name: 'Networking',
    description: 'Connect with like-minded professionals',
    icon: '🤝',
  },
  'demo-days': {
    name: 'Demo Days',
    description: 'See the latest innovations and product launches',
    icon: '🚀',
  },
  'hackathons': {
    name: 'Hackathons',
    description: 'Build, compete, and innovate',
    icon: '💻',
  },
  'fireside-chats': {
    name: 'Fireside Chats',
    description: 'Intimate conversations with industry leaders',
    icon: '🔥',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.category as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'popularity'>('date');

  const category = categoryMap[categorySlug] || {
    name: categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'Events in this category',
    icon: '📅',
  };

  // Filter events by category
  const categoryEvents = useMemo(() => {
    let events = mockEvents.filter(event => {
      const title = event.title.toLowerCase();
      const desc = event.description.toLowerCase();
      const categoryName = category.name.toLowerCase();
      
      return title.includes(categoryName.toLowerCase()) ||
             desc.includes(categoryName.toLowerCase()) ||
             title.includes(categorySlug.replace('-', ' ')) ||
             desc.includes(categorySlug.replace('-', ' '));
    });

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.name.toLowerCase().includes(query)
      );
    }

    // Sort
    events.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return b.registeredCount - a.registeredCount;
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    return events;
  }, [categorySlug, category.name, searchQuery, sortBy]);

  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateLength(sanitized, 0, 100)) {
      setSearchQuery(sanitized);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl sm:text-5xl">{category.icon}</div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {category.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search events..."
                  maxLength={100}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {categoryEvents.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery ? 'Try adjusting your search' : `No events in ${category.name} category`}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-xl card-elegant overflow-hidden">
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
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                            {category.name}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                            {event.ticketTypes[0]?.price === 0 ? 'Free' : `$${event.ticketTypes[0]?.price}`}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.time} • {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{event.registeredCount} going</span>
                          </div>
                          <Button variant="outline" size="sm" className="hover:bg-teal-50 dark:hover:bg-teal-900/20">
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

