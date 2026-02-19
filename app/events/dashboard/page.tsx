'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';

export default function EventsDashboardPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Get user's events (in production, this would come from API)
  const myEvents = useMemo(() => {
    // Filter events where user is organizer
    return mockEvents.filter(e => e.organizer.name === 'GrowthLab Events');
  }, []);

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

  // Filter events by time range
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return myEvents.filter(event => {
      const eventDate = new Date(event.date);
      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return eventDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return eventDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return eventDate >= yearAgo;
        default:
          return true;
      }
    });
  }, [myEvents, timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Event Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Overview of your events, attendees, and revenue
                </p>
              </div>
              <Link href="/create">
                <Button variant="primary" className="w-full sm:w-auto">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </Button>
              </Link>
            </div>

            {/* Time Range Filter */}
            <div className="flex gap-2">
              {(['week', 'month', 'year', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Events</p>
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.totalEvents}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{stats.eventsGrowth}% from last period
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Attendees</p>
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.totalAttendees.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{stats.attendeesGrowth}% from last period
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</p>
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{stats.revenueGrowth}% from last period
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upcoming Events</p>
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.upcomingEvents}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {stats.pastEvents} past events
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Events</CardTitle>
                <Link href="/events/manage">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No events found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Create your first event to get started
                  </p>
                  <Link href="/create">
                    <Button variant="primary">Create Event</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.slice(0, 5).map((event) => {
                    const eventDate = new Date(event.date);
                    const revenue = event.ticketTypes.reduce((sum, ticket) => sum + (ticket.price * ticket.sold), 0);
                    
                    return (
                      <Link key={event.id} href={`/events/${event.id}`}>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-500 dark:hover:border-teal-500 transition-all cursor-pointer">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  {event.registeredCount} attendees
                                </span>
                                {revenue > 0 && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatCurrency(revenue)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                event.status === 'upcoming' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                event.status === 'live' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}>
                                {event.status}
                              </span>
                              <Link href={`/events/${event.id}/analytics`}>
                                <Button variant="outline" size="sm">
                                  Analytics
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

