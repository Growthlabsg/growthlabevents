'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EventActions } from '@/components/EventActions';
import { CreateCalendarModal } from '@/components/CreateCalendarModal';
import { ChatButton } from '@/components/ChatButton';
import { sanitizeInput, validateLength } from '@/lib/security';

interface Calendar {
  id: string;
  name: string;
  logo: string;
  logoBg: string;
  subscribers: number;
  totalEvents: number;
  upcomingEvents?: CalendarEvent[];
  description?: string;
  createdAt: string;
  lastEventDate?: string;
  status: 'active' | 'archived' | 'draft';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

const myCalendars: Calendar[] = [
  {
    id: '1',
    name: 'GrowthLab Events',
    logo: 'GrowthLab',
    logoBg: 'bg-gradient-to-br from-teal-500 to-teal-600',
    subscribers: 129,
    totalEvents: 45,
    description: 'Building the "LinkedIn for Startups" - Weekly events, workshops, and networking',
    createdAt: '2024-01-15',
    lastEventDate: '2024-11-20',
    status: 'active',
  },
];

const subscribedCalendars: Calendar[] = [
  {
    id: '2',
    name: 'Lorong AI',
    logo: 'Lorong AI',
    logoBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    subscribers: 245,
    totalEvents: 78,
    description: 'AI community events and co-working sessions',
    createdAt: '2023-06-10',
    lastEventDate: '2024-11-17',
    status: 'active',
    upcomingEvents: [
      {
        id: '1',
        title: 'Lorong AI: Co-Working Mondays',
        date: 'Mon, 17 Nov',
        time: '12:00 pm',
      },
      {
        id: '2',
        title: 'Tech Talk for Leaders: AI Risk Assessment',
        date: 'Mon, 17 Nov',
        time: '2:00 pm',
      },
    ],
  },
  {
    id: '3',
    name: 'Collective',
    logo: 'C',
    logoBg: 'bg-gradient-to-br from-slate-800 to-slate-900',
    subscribers: 189,
    totalEvents: 32,
    description: 'Masterclasses and workshops for builders',
    createdAt: '2023-09-20',
    lastEventDate: '2024-11-19',
    status: 'active',
    upcomingEvents: [
      {
        id: '3',
        title: 'Build AI Agents on OpenAI TOD Masterclass',
        date: 'Wed, 19 Nov',
        time: '6:00 pm',
      },
    ],
  },
];

export default function CalendarsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'my' | 'subscribed'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'subscribers' | 'events' | 'recent'>('name');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);

  // Filter and search calendars
  const filteredCalendars = useMemo(() => {
    let calendars: Calendar[] = [];
    
    if (filter === 'all' || filter === 'my') {
      calendars = [...calendars, ...myCalendars];
    }
    if (filter === 'all' || filter === 'subscribed') {
      calendars = [...calendars, ...subscribedCalendars];
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      calendars = calendars.filter(cal =>
        cal.name.toLowerCase().includes(query) ||
        cal.description?.toLowerCase().includes(query)
      );
    }

    // Sort
    calendars.sort((a, b) => {
      switch (sortBy) {
        case 'subscribers':
          return b.subscribers - a.subscribers;
        case 'events':
          return b.totalEvents - a.totalEvents;
        case 'recent':
          return new Date(b.lastEventDate || b.createdAt).getTime() - new Date(a.lastEventDate || a.createdAt).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return calendars;
  }, [searchQuery, filter, sortBy]);

  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateLength(sanitized, 0, 100)) {
      setSearchQuery(sanitized);
    }
  };

  const handleCreateCalendar = () => {
    setShowCreateModal(true);
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplicate calendar:', id);
    // TODO: Implement duplicate
  };

  const handleExport = (id: string) => {
    console.log('Export calendar:', id);
    // TODO: Implement export
  };

  const handleDelete = (id: string) => {
    console.log('Delete calendar:', id);
    // TODO: Implement delete
  };

  const handleShare = (id: string) => {
    const calendar = [...myCalendars, ...subscribedCalendars].find(c => c.id === id);
    if (calendar) {
      const url = `${window.location.origin}/calendar/${calendar.name.toLowerCase().replace(/\s+/g, '-')}`;
      navigator.clipboard.writeText(url);
      alert('Calendar link copied to clipboard!');
    }
  };

  const totalSubscribers = myCalendars.reduce((sum, cal) => sum + cal.subscribers, 0);
  const totalEvents = myCalendars.reduce((sum, cal) => sum + cal.totalEvents, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Calendars
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your calendars and discover new ones
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleCreateCalendar}
                  className="btn-elegant whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Calendar
                </Button>
              </div>
            </div>

            {/* Statistics */}
            {filter === 'all' || filter === 'my' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">My Calendars</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{myCalendars.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Subscribers</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubscribers.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEvents}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Subscribed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{subscribedCalendars.length}</p>
                </div>
              </div>
            ) : null}

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative min-w-0">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search calendars..."
                  maxLength={100}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'my' | 'subscribed')}
                  className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                >
                  <option value="all">All Calendars</option>
                  <option value="my">My Calendars</option>
                  <option value="subscribed">Subscribed</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'subscribers' | 'events' | 'recent')}
                  className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                >
                  <option value="name">Sort by Name</option>
                  <option value="subscribers">Sort by Subscribers</option>
                  <option value="events">Sort by Events</option>
                  <option value="recent">Sort by Recent</option>
                </select>
                <div className="flex bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden shadow-sm">
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
          </div>

          {/* Calendars Display */}
          {(() => {
            // Separate calendars based on filter
            const myFiltered = filter === 'all' || filter === 'my' 
              ? myCalendars.filter(cal => {
                  if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    return cal.name.toLowerCase().includes(query) || cal.description?.toLowerCase().includes(query);
                  }
                  return true;
                })
              : [];
            
            const subscribedFiltered = filter === 'all' || filter === 'subscribed'
              ? subscribedCalendars.filter(cal => {
                  if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    return cal.name.toLowerCase().includes(query) || cal.description?.toLowerCase().includes(query);
                  }
                  return true;
                })
              : [];

            // Sort each section
            const sortCalendars = (cals: Calendar[]) => {
              const sorted = [...cals];
              sorted.sort((a, b) => {
                switch (sortBy) {
                  case 'subscribers':
                    return b.subscribers - a.subscribers;
                  case 'events':
                    return b.totalEvents - a.totalEvents;
                  case 'recent':
                    return new Date(b.lastEventDate || b.createdAt).getTime() - new Date(a.lastEventDate || a.createdAt).getTime();
                  default:
                    return a.name.localeCompare(b.name);
                }
              });
              return sorted;
            };

            const sortedMy = sortCalendars(myFiltered);
            const sortedSubscribed = sortCalendars(subscribedFiltered);

            if (sortedMy.length === 0 && sortedSubscribed.length === 0) {
              return (
                <div className="text-center py-16 sm:py-20">
                  <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No calendars found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first calendar to get started'}
                  </p>
                  {!searchQuery && (
                    <Button variant="primary" onClick={handleCreateCalendar}>
                      Create Calendar
                    </Button>
                  )}
                </div>
              );
            }

            return (
              <div className="space-y-12">
                {/* My Calendars Section */}
                {sortedMy.length > 0 && (
                  <section>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                        My Calendars
                      </h2>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCreateCalendar}
                        className="btn-elegant whitespace-nowrap flex-shrink-0"
                      >
                        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create
                      </Button>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {sortedMy.map((calendar) => (
                          <div
                            key={calendar.id}
                            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant"
                          >
                            <Link href={`/calendar/manage/${calendar.id}/events`}>
                              <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between mb-4 gap-3">
                                  <div className={`w-14 h-14 ${calendar.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                                    {calendar.logo.length > 2 ? calendar.logo.substring(0, 2).toUpperCase() : calendar.logo}
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleShare(calendar.id);
                                      }}
                                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Share calendar"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleExport(calendar.id);
                                      }}
                                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Export calendar"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                                  {calendar.name}
                                </h3>
                                {calendar.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                    {calendar.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{calendar.subscribers.toLocaleString()} Subscribers</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{calendar.totalEvents}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedMy.map((calendar) => (
                          <div
                            key={calendar.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 card-elegant"
                          >
                            <div className="flex items-start gap-4 sm:gap-6">
                              <div className={`w-16 h-16 ${calendar.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md`}>
                                {calendar.logo.length > 2 ? calendar.logo.substring(0, 2).toUpperCase() : calendar.logo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2 gap-3">
                                  <Link href={`/calendar/manage/${calendar.id}/events`} className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                      {calendar.name}
                                    </h3>
                                  </Link>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleShare(calendar.id);
                                      }}
                                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Share calendar"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleExport(calendar.id);
                                      }}
                                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                      title="Export calendar"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                {calendar.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                    {calendar.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{calendar.subscribers.toLocaleString()} subscribers</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{calendar.totalEvents} events</span>
                                  </div>
                                  <Link href={`/calendar/manage/${calendar.id}/events`}>
                                    <Button variant="outline" size="sm" className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                                      Manage →
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Subscribed Calendars Section */}
                {sortedSubscribed.length > 0 && (
                  <section>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-6">
                      Subscribed Calendars
                    </h2>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {sortedSubscribed.map((calendar) => (
                          <div
                            key={calendar.id}
                            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant"
                          >
                            <Link href={`/calendar/${calendar.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className={`w-14 h-14 ${calendar.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md`}>
                                    {calendar.logo.length > 2 ? calendar.logo.substring(0, 2).toUpperCase() : calendar.logo}
                                  </div>
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-lg">
                                  {calendar.name}
                                </h3>
                                {calendar.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                    {calendar.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{calendar.subscribers.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{calendar.totalEvents}</span>
                                  </div>
                                </div>
                                {calendar.upcomingEvents && calendar.upcomingEvents.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Upcoming Events</p>
                                    {calendar.upcomingEvents.slice(0, 2).map((event) => (
                                      <div key={event.id} className="mb-2 last:mb-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                          {event.title}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                          {event.date}, {event.time}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-4">
                                  <Button variant="outline" size="sm" className="w-full border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                                    View Calendar →
                                  </Button>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedSubscribed.map((calendar) => (
                          <div
                            key={calendar.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 card-elegant"
                          >
                            <div className="flex items-start gap-4 sm:gap-6">
                              <div className={`w-16 h-16 ${calendar.logoBg} rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md`}>
                                {calendar.logo.length > 2 ? calendar.logo.substring(0, 2).toUpperCase() : calendar.logo}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link href={`/calendar/${calendar.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    {calendar.name}
                                  </h3>
                                </Link>
                                {calendar.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                                    {calendar.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 mt-4">
                                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{calendar.subscribers.toLocaleString()} subscribers</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{calendar.totalEvents} events</span>
                                  </div>
                                </div>
                                {calendar.upcomingEvents && calendar.upcomingEvents.length > 0 && (
                                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Upcoming Events</p>
                                    <div className="space-y-2">
                                      {calendar.upcomingEvents.slice(0, 2).map((event) => (
                                        <div key={event.id} className="flex items-center justify-between text-sm">
                                          <span className="text-slate-900 dark:text-white font-medium truncate">{event.title}</span>
                                          <span className="text-slate-600 dark:text-slate-400 ml-4 flex-shrink-0">{event.date}, {event.time}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="mt-4">
                                  <Link href={`/calendar/${calendar.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <Button variant="outline" size="sm" className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                                      View Calendar →
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </div>
            );
          })()}

          {/* Create Calendar Modal */}
          {showCreateModal && (
            <CreateCalendarModal
              onClose={() => setShowCreateModal(false)}
              onSuccess={() => {
                setShowCreateModal(false);
                // TODO: Refresh calendar list
              }}
            />
          )}
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

