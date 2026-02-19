'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';
import { sanitizeInput, validateLength } from '@/lib/security';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'popularity'>('date');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Extract categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    mockEvents.forEach(event => {
      if (event.title.toLowerCase().includes('ai')) cats.add('AI & Tech');
      if (event.title.toLowerCase().includes('hackathon')) cats.add('Hackathon');
      if (event.title.toLowerCase().includes('showcase')) cats.add('Showcase');
      if (event.title.toLowerCase().includes('connect') || event.title.toLowerCase().includes('networking')) cats.add('Networking');
    });
    return Array.from(cats);
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let events = mockEvents.filter(e => e.status === 'upcoming');

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      events = events.filter(event => {
        const title = event.title.toLowerCase();
        const desc = event.description.toLowerCase();
        return title.includes(selectedCategory.toLowerCase()) || desc.includes(selectedCategory.toLowerCase());
      });
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
  }, [searchQuery, selectedCategory, sortBy]);

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
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Search Results
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mb-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search events, organizers, locations..."
                  maxLength={100}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Category:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>

            {/* Results Count */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Results */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try adjusting your search or filters
              </p>
              <Link href="/events">
                <Button variant="outline">Browse All Events</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
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

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading search results...</p>
          </div>
        </main>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}

