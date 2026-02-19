'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Fixed deterministic trend data to avoid hydration mismatch
  // These values are the same on server and client
  const revenueTrend = useMemo(() => [
    { date: 'Day 1', value: 747 },
    { date: 'Day 2', value: 720 },
    { date: 'Day 3', value: 1001 },
    { date: 'Day 4', value: 1237 },
    { date: 'Day 5', value: 1275 },
    { date: 'Day 6', value: 661 },
    { date: 'Day 7', value: 962 },
  ], []);
  
  const attendeesTrend = useMemo(() => [
    { date: 'Day 1', value: 45 },
    { date: 'Day 2', value: 52 },
    { date: 'Day 3', value: 38 },
    { date: 'Day 4', value: 61 },
    { date: 'Day 5', value: 55 },
    { date: 'Day 6', value: 42 },
    { date: 'Day 7', value: 48 },
  ], []);
  
  // Get user's events (in production, this would come from API)
  const myEvents = useMemo(() => mockEvents.slice(0, 5), []);
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalEvents = myEvents.length;
    const totalAttendees = myEvents.reduce((sum, event) => sum + event.registeredCount, 0);
    const totalRevenue = myEvents.reduce((sum, event) => 
      sum + event.ticketTypes.reduce((tSum, ticket) => tSum + (ticket.price * ticket.sold), 0), 0
    );
    const upcomingEvents = myEvents.filter(e => e.status === 'upcoming' || e.status === 'live').length;
    const pastEvents = myEvents.filter(e => e.status === 'past').length;
    
    // Calculate growth (mock data)
    const revenueGrowth = 12.5;
    const attendeesGrowth = 8.3;
    const eventsGrowth = 15.0;
    
    return {
      totalEvents,
      totalAttendees,
      totalRevenue,
      upcomingEvents,
      pastEvents,
      revenueGrowth,
      attendeesGrowth,
      eventsGrowth,
    };
  }, [myEvents]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'live':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'past':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Overview of your events and performance
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
                <Link href="/create">
                  <Button variant="primary" size="sm" className="shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <AnalyticsCard
              title="Total Events"
              value={stats.totalEvents}
              change={{ value: stats.eventsGrowth, isPositive: true }}
              icon={
                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <AnalyticsCard
              title="Total Attendees"
              value={stats.totalAttendees}
              change={{ value: stats.attendeesGrowth, isPositive: true }}
              icon={
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <AnalyticsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={{ value: stats.revenueGrowth, isPositive: true }}
              icon={
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={revenueTrend}
            />
            <AnalyticsCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              icon={
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-10">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-center card-elegant">
              <div className="text-2xl sm:text-3xl font-bold text-teal-500 mb-1">
                {stats.upcomingEvents}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Upcoming
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-center card-elegant">
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
                {myEvents.filter(e => e.status === 'live').length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Live Now
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-center card-elegant">
              <div className="text-2xl sm:text-3xl font-bold text-amber-500 mb-1">
                {stats.pastEvents}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Completed
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-center card-elegant">
              <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1">
                {Math.round((stats.totalAttendees / stats.totalEvents) || 0)}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Avg. Attendees
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm card-elegant">
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Recent Events
                </h2>
                <Link href="/events">
                  <Button variant="ghost" size="sm" className="text-teal-500 hover:text-teal-600 dark:hover:text-teal-400">
                    View All →
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              {myEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No events yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Create your first event to get started
                  </p>
                  <Link href="/create">
                    <Button variant="primary">Create Event</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event) => {
                    const eventRevenue = event.ticketTypes.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0);
                    return (
                      <div
                        key={event.id}
                        className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-200 hover:shadow-md card-elegant"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <Link href={`/events/${event.id}`}>
                                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors line-clamp-2">
                                    {event.title}
                                  </h3>
                                </Link>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                                  {event.description}
                                </p>
                              </div>
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getEventStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatTime(event.time)}</span>
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

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="font-medium text-slate-900 dark:text-white">{event.registeredCount}</span>
                                <span>registered</span>
                              </div>
                              {eventRevenue > 0 && (
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-medium text-slate-900 dark:text-white">${eventRevenue.toLocaleString()}</span>
                                  <span>revenue</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 sm:flex-col sm:gap-2">
                            <Link href={`/events/${event.id}`}>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                                View
                              </Button>
                            </Link>
                            {event.status === 'upcoming' || event.status === 'live' ? (
                              <Link href={`/calendar/manage/${event.calendarId || '1'}/events`}>
                                <Button variant="primary" size="sm" className="w-full sm:w-auto">
                                  Manage
                                </Button>
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}
