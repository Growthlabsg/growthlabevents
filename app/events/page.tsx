'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { UserRestrictionsBanner } from '@/components/UserRestrictionsBanner';
import { mockEvents, mockAttendees, mockUserEventStatus } from '@/lib/mockData';
import { eventsApi } from '@/lib/api';
import { sanitizeInput, validateLength } from '@/lib/security';
import { getSavedEventIds } from '@/lib/savedEvents';

type ViewMode = 'timeline' | 'grid' | 'list';
type SortOption = 'date' | 'title' | 'popularity' | 'capacity';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
  const [userStatuses, setUserStatuses] = useState<Record<string, 'going' | 'interested' | 'not_going' | null>>(mockUserEventStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>('all');
  
  // Extract unique categories and locations from events
  const categories = useMemo(() => {
    const cats = new Set<string>();
    mockEvents.forEach(event => {
      // Extract category from title or description
      if (event.title.toLowerCase().includes('ai')) cats.add('AI & Tech');
      if (event.title.toLowerCase().includes('hackathon')) cats.add('Hackathon');
      if (event.title.toLowerCase().includes('showcase')) cats.add('Showcase');
      if (event.title.toLowerCase().includes('connect') || event.title.toLowerCase().includes('networking')) cats.add('Networking');
    });
    return Array.from(cats);
  }, []);

  const locations = useMemo(() => {
    const locs = new Set<string>();
    mockEvents.forEach(event => {
      if (event.location) locs.add(event.location);
    });
    return Array.from(locs);
  }, []);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let events = mockEvents;
    
    // Filter by tab
    if (activeTab === 'upcoming') {
      events = events.filter(e => e.status === 'upcoming' || e.status === 'live');
    } else if (activeTab === 'past') {
      events = events.filter(e => e.status === 'past' || e.status === 'cancelled');
    } else if (activeTab === 'saved') {
      const savedIds = getSavedEventIds();
      events = events.filter(e => savedIds.includes(e.id));
    }

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

    // Location filter
    if (selectedLocation) {
      events = events.filter(event => event.location === selectedLocation);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      events = events.filter(event => {
        if (!event.tags || event.tags.length === 0) return false;
        return selectedTags.some(tag => event.tags!.includes(tag));
      });
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      events = events.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        switch (dateRange) {
          case 'today':
            return eventDate.getTime() === now.getTime();
          case 'week':
            const weekFromNow = new Date(now);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return eventDate >= now && eventDate <= weekFromNow;
          case 'month':
            const monthFromNow = new Date(now);
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            return eventDate >= now && eventDate <= monthFromNow;
          case 'year':
            const yearFromNow = new Date(now);
            yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
            return eventDate >= now && eventDate <= yearFromNow;
          default:
            return true;
        }
      });
    }

    // Sort
    events.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return b.registeredCount - a.registeredCount;
        case 'capacity':
          const aCapacity = a.totalCapacity || 0;
          const bCapacity = b.totalCapacity || 0;
          return bCapacity - aCapacity;
        case 'date':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

    return events;
  }, [activeTab, searchQuery, selectedCategory, selectedLocation, selectedTags, dateRange, sortBy]);

  // Group events by date for timeline view
  const groupedEvents = useMemo(() => {
    if (viewMode !== 'timeline') return {};
    
    return filteredEvents.reduce((acc, event) => {
      const date = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(date);
      eventDate.setHours(0, 0, 0, 0);
      
      let displayKey: string;
      if (eventDate.getTime() === today.getTime()) {
        displayKey = `Today ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
      } else {
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        displayKey = `${day} ${month} ${weekday}`;
      }
      
      if (!acc[displayKey]) {
        acc[displayKey] = [];
      }
      acc[displayKey].push(event);
      return acc;
    }, {} as Record<string, typeof filteredEvents>);
  }, [filteredEvents, viewMode]);

  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateLength(sanitized, 0, 100)) {
      setSearchQuery(sanitized);
    }
  };

  const handleGoingClick = async (eventId: string) => {
    const currentStatus = userStatuses[eventId];
    const newStatus = currentStatus === 'going' ? null : 'going';
    
    setUserStatuses(prev => ({ ...prev, [eventId]: newStatus }));
    
    try {
      await eventsApi.updateEventStatus(eventId, newStatus || 'not_going');
      
      // If user is going, automatically join the event chat
      if (newStatus === 'going') {
        // In production, this would call an API to join the event chat
        console.log(`User joined chat for event ${eventId}`);
        // Note: Chat can be opened via the ChatButton component
      }
    } catch (error) {
      setUserStatuses(prev => ({ ...prev, [eventId]: currentStatus }));
      console.error('Failed to update event status:', error);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getEventCategory = (event: typeof mockEvents[0]) => {
    if (event.title.toLowerCase().includes('hackathon')) return 'Hackathon';
    if (event.title.toLowerCase().includes('showcase')) return 'Showcase';
    if (event.title.toLowerCase().includes('connect') || event.title.toLowerCase().includes('networking')) return 'Networking';
    return 'AI & Tech';
  };

  const getPriceDisplay = (event: typeof mockEvents[0]) => {
    const freeTickets = event.ticketTypes.filter(t => t.price === 0);
    const paidTickets = event.ticketTypes.filter(t => t.price > 0);
    
    if (freeTickets.length > 0 && paidTickets.length === 0) return 'Free';
    if (paidTickets.length > 0 && freeTickets.length === 0) {
      const minPrice = Math.min(...paidTickets.map(t => t.price));
      return `$${minPrice}`;
    }
    return 'Free - Paid';
  };

  const hasActiveFilters = selectedCategory || selectedLocation || dateRange !== 'all' || searchQuery.trim();

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLocation(null);
    setDateRange('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* User Restrictions Banner */}
          <UserRestrictionsBanner userId="current-user" />
          
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Events
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover and join amazing events
                </p>
              </div>
              <Link href="/create">
                <Button variant="primary" size="sm" className="shadow-sm hover:shadow-md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Button>
              </Link>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 mb-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2.5 font-medium transition-all duration-200 relative hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-lg ${
                  activeTab === 'upcoming'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Upcoming
                {activeTab === 'upcoming' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2.5 font-medium transition-all duration-200 relative hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-lg ${
                  activeTab === 'past'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Past
                {activeTab === 'past' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2.5 font-medium transition-all duration-200 relative hover:bg-slate-50 dark:hover:bg-slate-800 rounded-t-lg flex items-center gap-2 ${
                  activeTab === 'saved'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Saved
                {activeTab === 'saved' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search events, organizers, locations..."
                  maxLength={100}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="popularity">Sort by Popularity</option>
                  <option value="capacity">Sort by Capacity</option>
                </select>
                <div className="flex bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-2 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 ${
                      viewMode === 'timeline'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                    title="Timeline view"
                    aria-label="Timeline view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 ${
                      viewMode === 'grid'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                    title="Grid view"
                    aria-label="Grid view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 ${
                      viewMode === 'list'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                    title="List view"
                    aria-label="List view"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Category Filters */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Category:</span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
                          selectedCategory === category
                            ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-sm'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Filters */}
              {locations.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Location:</span>
                  <select
                    value={selectedLocation || ''}
                    onChange={(e) => setSelectedLocation(e.target.value || null)}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Date:</span>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 active:scale-95 ml-auto"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Featured Events */}
          <FeaturedEvents events={filteredEvents} />

          {/* Events Display */}
          {filteredEvents.length === 0 ? (
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
                {hasActiveFilters ? 'Try adjusting your filters' : `No ${activeTab} events available`}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : viewMode === 'timeline' ? (
            /* Timeline View */
            <div className="relative">
              <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700"></div>
              
              <div className="space-y-8 sm:space-y-12">
                {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
                  <div key={dateKey} className="relative pl-12 sm:pl-20">
                    <div className="absolute left-0 top-0">
                      <div className="w-16 sm:w-20 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                        {dateKey}
                      </div>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-teal-500 rounded-full border-2 sm:border-4 border-white dark:border-slate-900 -ml-1.5 sm:-ml-2 mt-2 shadow-md"></div>
                    </div>

                    <div className="space-y-6">
                      {dateEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const attendees = mockAttendees[event.id] || [];
                        const userStatus = userStatuses[event.id] || null;
                        const isGoing = userStatus === 'going';
                        const remainingAttendees = event.registeredCount - Math.min(5, attendees.length);
                        const capacityPercent = event.totalCapacity ? (event.registeredCount / event.totalCapacity) * 100 : 0;
                        
                        return (
                          <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant">
                            <div className="p-5 sm:p-6">
                              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                      {formatTime(event.time)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                                      {getEventCategory(event)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                                      {getPriceDisplay(event)}
                                    </span>
                                  </div>
                                  
                                  <Link href={`/events/${event.id}`}>
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                      {event.title}
                                    </h2>
                                  </Link>
                                  
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                    {event.description}
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <span className="truncate">{event.organizer.name}</span>
                                    </div>
                                    {event.location && (
                                      <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="truncate">{event.location}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-4">
                                    <Button 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleGoingClick(event.id);
                                      }}
                                      variant={isGoing ? "primary" : "outline"}
                                      size="sm"
                                      className={`${
                                        isGoing 
                                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm hover:shadow-md' 
                                          : 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
                                      }`}
                                    >
                                      {isGoing ? (
                                        <>
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          Going
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                          Going
                                        </>
                                      )}
                                    </Button>
                                    
                                    {event.registeredCount > 0 && (
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center -space-x-2">
                                          {attendees.slice(0, 5).map((attendee) => (
                                            <div
                                              key={attendee.id}
                                              className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-medium shadow-sm"
                                              title={attendee.name}
                                            >
                                              {attendee.avatar ? (
                                                <img src={attendee.avatar} alt={attendee.name} className="w-full h-full rounded-full object-cover" />
                                              ) : (
                                                attendee.name.charAt(0).toUpperCase()
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                          {event.registeredCount} {event.registeredCount === 1 ? 'attendee' : 'attendees'}
                                        </span>
                                        {remainingAttendees > 0 && (
                                          <span className="text-sm text-slate-500 dark:text-slate-500">
                                            +{remainingAttendees} more
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {event.totalCapacity && (
                                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex-1 w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                          <div 
                                            className={`h-1.5 rounded-full transition-all ${
                                              capacityPercent >= 90 ? 'bg-red-500' : 
                                              capacityPercent >= 70 ? 'bg-amber-500' : 
                                              'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                                          ></div>
                                        </div>
                                        <span>{event.registeredCount}/{event.totalCapacity}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Event Thumbnail */}
                                <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0 relative order-first sm:order-last shadow-md">
                                  {event.id === '1' ? (
                                    <div className="absolute inset-0 flex flex-col justify-between text-white p-4 bg-gradient-to-br from-purple-700 to-pink-700">
                                      <div className="text-right text-xs font-mono opacity-80">
                                        &lt;&gt;drift
                                      </div>
                                      <div className="flex flex-col items-center">
                                        <div className="text-xs font-bold mb-1">
                                          {eventDate.toLocaleDateString('en-US', { 
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          }).toUpperCase()}
                                        </div>
                                        <div className="text-xs font-bold text-center leading-tight mb-1">
                                          AI*ROBOTICS<br />HACKATHON
                                        </div>
                                        <div className="text-xs font-bold">
                                          {event.location.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                  ) : event.id === '2' ? (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white">
                                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                                        <div className="text-xs font-bold text-slate-800 mb-1">
                                          {eventDate.toLocaleDateString('en-US', { 
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                          }).toUpperCase()}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-700 text-center">
                                          {event.title.split('(')[0].toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col justify-center text-white p-4 bg-gradient-to-br from-slate-800 to-slate-900">
                                      <div className="text-xs font-bold mb-1">
                                        {eventDate.toLocaleDateString('en-US', { 
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric'
                                        }).toUpperCase()}
                                      </div>
                                      <div className="text-xs font-bold text-center leading-tight">
                                        {eventDate.toLocaleDateString('en-US', { day: 'numeric' })} SGINNOVATE AI
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                const attendees = mockAttendees[event.id] || [];
                const userStatus = userStatuses[event.id] || null;
                const isGoing = userStatus === 'going';
                const capacityPercent = event.totalCapacity ? (event.registeredCount / event.totalCapacity) * 100 : 0;
                
                return (
                  <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-xl card-elegant overflow-hidden">
                    {/* Thumbnail */}
                    <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative">
                      {event.id === '1' ? (
                        <div className="absolute inset-0 flex flex-col justify-between text-white p-4 bg-gradient-to-br from-purple-700 to-pink-700">
                          <div className="text-right text-xs font-mono opacity-80">
                            &lt;&gt;drift
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-xs font-bold mb-1">
                              {eventDate.toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }).toUpperCase()}
                            </div>
                            <div className="text-xs font-bold text-center leading-tight mb-1">
                              AI*ROBOTICS<br />HACKATHON
                            </div>
                            <div className="text-xs font-bold">
                              {event.location.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ) : event.id === '2' ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white">
                          <div className="absolute inset-0 flex flex-col justify-end p-4">
                            <div className="text-xs font-bold text-slate-800 mb-1">
                              {eventDate.toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              }).toUpperCase()}
                            </div>
                            <div className="text-xs font-semibold text-slate-700 text-center">
                              {event.title.split('(')[0].toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col justify-center text-white p-4 bg-gradient-to-br from-slate-800 to-slate-900">
                          <div className="text-xs font-bold mb-1">
                            {eventDate.toLocaleDateString('en-US', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }).toUpperCase()}
                          </div>
                          <div className="text-xs font-bold text-center leading-tight">
                            {eventDate.toLocaleDateString('en-US', { day: 'numeric' })} SGINNOVATE AI
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                          {getEventCategory(event)}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full">
                          {getPriceDisplay(event)}
                        </span>
                      </div>

                      <Link href={`/events/${event.id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatTime(event.time)} • {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
                        <div className="flex items-center gap-2">
                          {attendees.slice(0, 3).map((attendee) => (
                            <div
                              key={attendee.id}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-medium"
                              title={attendee.name}
                            >
                              {attendee.avatar ? (
                                <img src={attendee.avatar} alt={attendee.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                attendee.name.charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {event.registeredCount}
                          </span>
                        </div>
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleGoingClick(event.id);
                          }}
                          variant={isGoing ? "primary" : "outline"}
                          size="sm"
                          className={`${
                            isGoing 
                              ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm hover:shadow-md' 
                              : 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
                          }`}
                        >
                          {isGoing ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Going
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Join
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.date);
                const attendees = mockAttendees[event.id] || [];
                const userStatus = userStatuses[event.id] || null;
                const isGoing = userStatus === 'going';
                
                return (
                  <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant">
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
                          {event.id === '1' ? (
                            <div className="absolute inset-0 flex flex-col justify-between text-white p-3 bg-gradient-to-br from-purple-700 to-pink-700 text-xs">
                              <div className="text-right font-mono opacity-80">&lt;&gt;drift</div>
                              <div className="text-center font-bold">AI*ROBOTICS</div>
                            </div>
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full">
                              {getEventCategory(event)}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {formatTime(event.time)} • {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <Link href={`/events/${event.id}`}>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                              {event.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="truncate">{event.organizer.name}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center -space-x-2">
                                {attendees.slice(0, 3).map((attendee) => (
                                  <div
                                    key={attendee.id}
                                    className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-medium"
                                    title={attendee.name}
                                  >
                                    {attendee.avatar ? (
                                      <img src={attendee.avatar} alt={attendee.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      attendee.name.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                ))}
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {event.registeredCount} {event.registeredCount === 1 ? 'attendee' : 'attendees'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg">
                            {getPriceDisplay(event)}
                          </span>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleGoingClick(event.id);
                            }}
                            variant={isGoing ? "primary" : "outline"}
                            size="sm"
                            className={`${
                              isGoing 
                                ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm hover:shadow-md' 
                                : 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
                            }`}
                          >
                            {isGoing ? (
                              <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Going
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Join
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Chat Button */}
      <ChatButton bottomOffset="bottom-24 lg:bottom-6" />
      
      {/* Spacer for mobile floating menu */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
