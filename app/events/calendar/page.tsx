'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { mockEvents } from '@/lib/mockData';

export default function EventsCalendarPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [period, setPeriod] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Event Calendar
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  View all events in calendar format
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('upcoming')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === 'upcoming'
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setPeriod('past')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    period === 'past'
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {currentMonth}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2">
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
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedDateEvents.map(event => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {event.time} • {event.location}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {mockEvents
                .filter(e => e.status === 'upcoming')
                .slice(0, 5)
                .map(event => {
                  const eventDate = new Date(event.date);
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1 mb-1">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                      </p>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

