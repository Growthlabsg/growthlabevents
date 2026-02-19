'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';

export default function PublicCalendarPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [period, setPeriod] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const filters = ['fitness', 'founder', 'pickleball', 'sports', 'startups'];
  
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toISOString().split('T')[0] === dateStr && 
             (period === 'upcoming' ? event.status === 'upcoming' : event.status === 'past');
    });
  };

  // Calendar generation
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      const events = getEventsForDate(date);
      days.push({ day, isCurrentMonth: false, date, eventCount: events.length });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = getEventsForDate(date);
      days.push({ day, isCurrentMonth: true, date, eventCount: events.length });
    }
    
    // Add next month's leading days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const events = getEventsForDate(date);
      days.push({ day, isCurrentMonth: false, date, eventCount: events.length });
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  const currentMonth = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCalendarMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  }, [selectedDate, period]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Banner Section */}
      <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900">
          <img
            src="/placeholder-event.jpg"
            alt="GrowthLab Events Banner"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        {/* Logo Overlay */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-amber-400 rounded-xl flex items-center justify-center border-2 border-white shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">G</span>
            </div>
            <div className="text-white">
              <h1 className="text-xl sm:text-2xl font-bold">GrowthLab</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                GrowthLab Events
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Times in SGT — {currentTime}
                </p>
                <div className="flex items-center gap-2">
                  <button className="text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441c.795 0 1.439-.645 1.439-1.44s-.644-1.439-1.439-1.439z"/>
                    </svg>
                  </button>
                  <button className="text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button className="text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                  <button className="text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.89 2.89 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </button>
                  <button className="text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <Link href="/calendar/manage/cal-KNN5iOtITsVqaaf/events">
              <Button
                variant="primary"
                size="sm"
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Manage
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Events */}
          <div className="lg:col-span-2">
            {/* Events Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Events</h2>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
                  <button
                    onClick={() => setPeriod('upcoming')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      period === 'upcoming'
                        ? 'bg-teal-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setPeriod('past')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      period === 'past'
                        ? 'bg-teal-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <Link href="/create">
                  <Button variant="primary" size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                    + Add Event
                  </Button>
                </Link>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Events Content */}
            {period === 'upcoming' ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                    Why not create a new event now?
                  </p>
                  <Link href="/create">
                    <Button variant="primary" size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                      Create Event
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Past Events</h3>
                <p className="text-slate-600 dark:text-slate-400">No past events to display.</p>
              </div>
            )}
          </div>

          {/* Right Column - Calendar Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{currentMonth}</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={index} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayData, index) => {
                  const isToday = dayData.date.toDateString() === new Date().toDateString();
                  const isSelected = selectedDate && dayData.date.toDateString() === selectedDate.toDateString();
                  const hasEvents = dayData.eventCount > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(dayData.date)}
                      className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-colors relative ${
                        !dayData.isCurrentMonth
                          ? 'text-slate-400 dark:text-slate-600'
                          : isSelected
                          ? 'bg-teal-500 text-white font-semibold'
                          : isToday
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-semibold border-2 border-teal-500'
                          : hasEvents
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-600'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{dayData.day}</span>
                      {hasEvents && dayData.isCurrentMonth && (
                        <span className={`absolute bottom-1 text-xs ${
                          isSelected ? 'text-white' : 'text-teal-500'
                        }`}>
                          {dayData.eventCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Selected Date Events Preview */}
              {selectedDate && selectedDateEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedDateEvents.map(event => (
                      <Link 
                        key={event.id} 
                        href={`/events/${event.id}`}
                        className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">
                          {event.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {event.time}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

