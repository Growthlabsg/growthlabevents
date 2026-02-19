'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';
import { apiClient } from '@/lib/api-client';
import { Event } from '@/types/event';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hosted' | 'attended'>('hosted');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.getCurrentUser();
        console.log('User API response:', response);
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          console.error('Failed to fetch user - response:', response);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Get hosted events (events where user is organizer)
  const hostedEvents = useMemo(() => {
    if (!user) return [];
    return mockEvents.filter(event => 
      event.organizer.name === 'GrowthLab Events' || 
      event.organizer.name === user.name ||
      event.organizer.name.toLowerCase().includes(user.name?.toLowerCase() || '')
    );
  }, [user]);

  // Get attended events (mock - in production, this would come from API)
  const attendedEvents = useMemo(() => {
    // For now, return some mock events as attended
    // In production, this would filter events where user is registered
    return mockEvents.filter(event => 
      event.status === 'past' && event.registeredCount > 0
    ).slice(0, 10);
  }, []);

  const hostedCount = hostedEvents.length;
  const attendedCount = attendedEvents.length;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400">User not found</p>
        </main>
      </div>
    );
  }

  const displayEvents = activeTab === 'hosted' ? hostedEvents : attendedEvents;
  const pastEvents = displayEvents.filter(e => e.status === 'past' || e.status === 'cancelled');
  const upcomingEvents = displayEvents.filter(e => e.status === 'upcoming' || e.status === 'live');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Profile Header */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
                  {user.logoUrl ? (
                    <img 
                      src={user.logoUrl} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                  {user.name || 'User'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  @{user.username || 'username'}
                </p>
                
                {/* Bio */}
                {user.bio && (
                  <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-line">
                    {user.bio}
                  </p>
                )}

                {/* Statistics */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {hostedCount}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">Hosted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {attendedCount}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">Attended</span>
                  </div>
                  {user.createdAt && (
                    <div className="text-slate-600 dark:text-slate-400 text-sm">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {user.instagram && (
                    <a
                      href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={`https://twitter.com/${user.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {user.youtube && (
                    <a
                      href={`https://youtube.com/@${user.youtube.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="YouTube"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                  {user.tiktok && (
                    <a
                      href={`https://tiktok.com/@${user.tiktok.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="TikTok"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={`https://linkedin.com${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                  {user.website && (
                    <a
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      aria-label="Website"
                    >
                      <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => setActiveTab('hosted')}
              className={`px-4 py-2.5 font-medium transition-all duration-200 relative ${
                activeTab === 'hosted'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Hosted Events
              {activeTab === 'hosted' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('attended')}
              className={`px-4 py-2.5 font-medium transition-all duration-200 relative ${
                activeTab === 'attended'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Attended Events
              {activeTab === 'attended' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Events List */}
          {pastEvents.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  Past Events
                </h2>
                {pastEvents.length > 3 && (
                  <button className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
                    View All
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {pastEvents.slice(0, 3).map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {event.imageUrl && (
                      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        By {event.organizer.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{formatTime(event.time)}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {event.imageUrl && (
                      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        By {event.organizer.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{formatTime(event.time)}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {displayEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No {activeTab === 'hosted' ? 'hosted' : 'attended'} events
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {activeTab === 'hosted' 
                  ? 'Start hosting events to see them here'
                  : 'Attend events to see them here'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <ChatButton />
    </div>
  );
}

