'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { validateEmail, sanitizeInput, validateLength } from '@/lib/security';
import { mockEvents } from '@/lib/mockData';
import { DemeritSystemSettings } from '@/components/DemeritSystemSettings';
import { AppealReviewPanel } from '@/components/AppealReviewPanel';
import { DemeritManagementPanel } from '@/components/DemeritManagementPanel';
import { DiscountCodeManager } from '@/components/DiscountCodeManager';
import { RefundManagement } from '@/components/RefundManagement';
import { NewsletterEditor } from '@/components/NewsletterEditor';
import { NewsletterList } from '@/components/NewsletterList';
import { SubscriberManagement } from '@/components/SubscriberManagement';
import { NotificationPreferencesPanel } from '@/components/NotificationPreferences';
import { EventTagManagement } from '@/components/EventTagManagement';
import { ChatButton } from '@/components/ChatButton';

type Tab = 'events' | 'people' | 'newsletters' | 'payment' | 'insights' | 'settings';

export default function CalendarManageEventsPage() {
  const params = useParams();
  const calendarId = params?.calendarId as string;
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'past'>('upcoming');
  
  // People tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [peopleFilter, setPeopleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recently-joined');
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);
  const [showCreateMembershipModal, setShowCreateMembershipModal] = useState(false);
  
  // Newsletter tab state
  const [showNewDraftModal, setShowNewDraftModal] = useState(false);
  
  // Settings tab state
  const [showDeleteCalendarModal, setShowDeleteCalendarModal] = useState(false);
  
  const router = useRouter();
  
  // Mock people data
  const allPeople = [
    { id: '1', name: 'Jelle van der Tas', email: 'jp@aivas.co', joinedDate: '7 Nov', status: 'active' },
    { id: '2', name: 'Andrea Tan', email: 'andrea.tantianlin@gmail.com', joinedDate: '6 Nov', status: 'active' },
    { id: '3', name: 'Pierre', email: 'linkpierrefoo@gmail.com', joinedDate: '6 Nov', status: 'active' },
  ];
  
  // Filter and sort people
  const filteredPeople = useMemo(() => {
    let filtered = [...allPeople];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(person => 
        person.name.toLowerCase().includes(query) || 
        person.email.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (peopleFilter !== 'all') {
      filtered = filtered.filter(person => person.status === peopleFilter);
    }
    
    // Sort
    if (sortBy === 'name-az') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-za') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.joinedDate.localeCompare(b.joinedDate));
    }
    
    return filtered;
  }, [searchQuery, peopleFilter, sortBy]);
  
  // Handlers
  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateLength(sanitized, 0, 100)) {
      setSearchQuery(sanitized);
    }
  };
  
  const handleExportPeople = () => {
    // TODO: Implement CSV export
    console.log('Exporting people...');
  };
  
  const handleAddPeople = () => {
    setShowAddPeopleModal(true);
  };
  
  const handleCreateMembership = () => {
    setShowCreateMembershipModal(true);
  };
  
  const handleNewDraft = () => {
    setShowNewDraftModal(true);
  };
  
  const handleDeleteCalendar = () => {
    setShowDeleteCalendarModal(true);
  };
  
  const confirmDeleteCalendar = () => {
    // TODO: Implement delete with confirmation
    console.log('Deleting calendar...');
    setShowDeleteCalendarModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                GrowthLab Events
              </h1>
              <Link href="/calendar/growthlab-sg">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Calendar Page
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700 mb-6">
              {[
                { id: 'events', label: 'Events' },
                { id: 'people', label: 'People' },
                { id: 'newsletters', label: 'Newsletters' },
                { id: 'payment', label: 'Payment' },
                { id: 'insights', label: 'Insights' },
                { id: 'settings', label: 'Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Events Section Header */}
            {activeTab === 'events' && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                    Events
                  </h2>
                  <Link href="/create">
                    <button className="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 transition-all duration-200 flex items-center justify-center text-white shadow-sm hover:shadow-md hover:scale-105">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </Link>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter('upcoming')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeFilter === 'upcoming'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveFilter('past')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeFilter === 'past'
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div>
            {activeTab === 'events' && (() => {
              // Filter events by calendar ID
              const calendarEvents = mockEvents.filter(event => 
                event.calendarId === calendarId || 
                (calendarId === '1' && event.organizer.name === 'GrowthLab Events')
              );
              
              // Filter by upcoming/past
              const filteredEvents = calendarEvents.filter(event => {
                if (activeFilter === 'upcoming') {
                  return event.status === 'upcoming' || event.status === 'live';
                } else {
                  return event.status === 'past' || event.status === 'cancelled';
                }
              });

              if (filteredEvents.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
                    {/* Empty State Icon */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center relative">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {/* Badge with count */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 dark:bg-slate-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                          <span className="text-white text-xs font-bold">{filteredEvents.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Empty State Text */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                      No {activeFilter === 'upcoming' ? 'Upcoming' : 'Past'} Events
                    </h3>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
                      This calendar has no {activeFilter === 'upcoming' ? 'upcoming' : 'past'} events.
                    </p>

                    {/* Add Event Button */}
                    <Link href="/create">
                      <Button variant="primary" size="lg" className="btn-elegant">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Event
                      </Button>
                    </Link>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {filteredEvents.map((event) => {
                    const eventDate = new Date(event.date);
                    const isUpcoming = new Date(event.date) >= new Date();
                    
                    return (
                      <div key={event.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm hover:shadow-lg card-elegant overflow-hidden">
                        <div className="p-6 sm:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <Link href={`/events/${event.id}`} className="flex-1 min-w-0">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                  {eventDate.toLocaleDateString('en-US', { day: 'numeric' })}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
                                    {event.title}
                                  </h3>
                                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                    {event.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      </svg>
                                      <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      <span>{event.registeredCount} registered</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                              <span className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium whitespace-nowrap ${
                                event.status === 'upcoming' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                event.status === 'live' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                event.status === 'past' ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' :
                                'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {event.status}
                              </span>
                              <Link href={`/events/${event.id}`}>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {activeTab === 'people' && (
              <div className="space-y-8 sm:space-y-10">
                {/* Memberships Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Memberships
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        Offer member-only events and ticket types, set up tiers and sell subscriptions.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-elegant"
                      onClick={handleCreateMembership}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create
                    </Button>
                  </div>

                  {/* Membership Tiers */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    {[
                      { name: 'Founding Circle', color: 'bg-purple-500' },
                      { name: 'Supporter', color: 'bg-slate-500' },
                      { name: 'VIP', color: 'bg-amber-500' },
                      { name: 'Premium', color: 'bg-blue-500' },
                      { name: 'All Access', color: 'bg-green-500' },
                    ].map((tier) => (
                      <div
                        key={tier.name}
                        className={`${tier.color} text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm`}
                      >
                        {tier.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* People Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                      People (129)
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={handleAddPeople}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add People
                      </Button>
                      <button 
                        onClick={handleExportPeople}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        title="Export CSV"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button 
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center text-slate-600 dark:text-slate-300"
                        title="More options"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search"
                        maxLength={100}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <select 
                      value={peopleFilter}
                      onChange={(e) => setPeopleFilter(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    >
                      <option value="all">All Members</option>
                      <option value="active">Active Members</option>
                      <option value="inactive">Inactive Members</option>
                    </select>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    >
                      <option value="recently-joined">Recently Joined</option>
                      <option value="name-az">Name A-Z</option>
                      <option value="name-za">Name Z-A</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>

                  {/* People List */}
                  <div className="space-y-3">
                    {filteredPeople.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-slate-600 dark:text-slate-400">No people found matching your search.</p>
                      </div>
                    ) : (
                      filteredPeople.map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-200 shadow-sm card-elegant"
                      >
                        {/* Profile Picture */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>

                        {/* Person Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 dark:text-white mb-1 truncate">
                            {person.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {person.email}
                          </p>
                        </div>

                        {/* Join Date */}
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                          {person.joinedDate}
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletters' && (
              <NewslettersTab calendarId={calendarId} />
            )}

            {activeTab === 'payment' && (
              <PaymentTab calendarId={calendarId} />
            )}

            {activeTab === 'insights' && (
              <InsightsTab calendarId={calendarId} />
            )}

            {activeTab === 'settings' && (
              <SettingsTab 
                calendarId={calendarId}
                onDeleteCalendar={handleDeleteCalendar}
                onConfirmDelete={confirmDeleteCalendar}
                showDeleteModal={showDeleteCalendarModal}
                onCloseDeleteModal={() => setShowDeleteCalendarModal(false)}
              />
            )}
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

// Payment Tab Component
function PaymentTab({ calendarId }: { calendarId: string }) {
  const [paymentMethods, setPaymentMethods] = useState({
    cards: true,
    solana: false,
    ideal: false,
    bancontact: false,
    paynow: true,
    przelewy24: false,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const salesHistory = [
    {
      id: '1',
      date: '7 Jun, 3:13 pm',
      event: 'Sweat Equity: Where Deals Happen in Motion',
      paymentMethod: 'Mastercard',
      lastFour: '7889',
      email: 'portfolio.engineer@gmail.com',
      amount: '$15.00',
      processor: 'Stripe',
    },
    {
      id: '2',
      date: '7 Jun, 3:13 pm',
      event: 'Sweat Equity: Where Deals Happen in Motion',
      paymentMethod: 'Visa',
      lastFour: '2958',
      email: 'emilyhbx01@gmail.com',
      amount: '$15.00',
      processor: 'Stripe',
    },
    {
      id: '3',
      date: '7 Jun, 3:13 pm',
      event: 'Sweat Equity: Where Deals Happen in Motion',
      paymentMethod: 'Visa',
      lastFour: '7882',
      email: 'junmingfu0504@gmail.com',
      amount: '$15.00',
      processor: 'Stripe',
    },
    {
      id: '4',
      date: '7 Jun, 3:13 pm',
      event: 'Sweat Equity: Where Deals Happen in Motion',
      paymentMethod: 'Visa',
      lastFour: '2544',
      email: 'siniya21@gmail.com',
      amount: '$20.00',
      processor: 'Stripe',
    },
    {
      id: '5',
      date: '7 Jun, 3:13 pm',
      event: 'Sweat Equity: Where Deals Happen in Motion',
      paymentMethod: 'Visa',
      lastFour: '6276',
      email: 'info@ipharmx.com',
      amount: '$20.00',
      processor: 'Stripe',
    },
  ];

  const payoutHistory = [
    {
      id: '1',
      date: '16 Jun',
      amount: '$75.36',
      status: 'completed',
      bank: 'DBS Bank/POSB.... 3086',
    },
  ];

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Ticket Sales Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Ticket Sales
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Stripe Account Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">stripe</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Stripe Account</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Your Stripe account is active and accepting payments.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Open Stripe
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Button>
          </div>

          {/* Sales Summary Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">$85</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Tickets Sold</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">5</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">$0</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Platform Fee</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">5%</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Platform fees are waived for all GrowthLab calendars.
            </p>
          </div>
        </div>
      </div>

      {/* Discount Codes Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Discount Codes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Create discount codes that can be applied to events managed by your calendar.
          </p>
        </div>
        <DiscountCodeManager calendarId={calendarId} />
      </div>

      {/* Payment Methods Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Payment Methods
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
          Choose accepted payment methods for your events and memberships.
        </p>
        <div className="space-y-4">
          {/* Cards */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">VISA</span>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">MC</span>
                  <span className="text-xs font-semibold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">AMEX</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">AP</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">GP</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Cards</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Major credit and debit cards, Apple Pay and Google Pay are always accepted.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                On
              </div>
            </div>
          </div>

          {/* Solana */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">SOL</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Solana</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Please verify your identity to accept crypto payments.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Verify
              </Button>
            </div>
          </div>

          {/* iDEAL */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">iDEAL</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">iDEAL</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Popular in the Netherlands.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Off</span>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Bancontact */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">BC</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Bancontact</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Popular in Belgium.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentMethods(prev => ({ ...prev, bancontact: !prev.bancontact }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  paymentMethods.bancontact ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paymentMethods.bancontact ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* PayNow */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">PN</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">PayNow</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Popular in Singapore.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentMethods(prev => ({ ...prev, paynow: !prev.paynow }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  paymentMethods.paynow ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    paymentMethods.paynow ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Przelewy24 */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">P24</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Przelewy24</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Popular in Poland.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Off</span>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoicing and Tax Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Invoicing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Invoicing
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Your seller information shown on guest invoices.
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-3">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Seller Name</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">GrowthLab Events</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Address</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">—</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Memo</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">—</p>
            </div>
          </div>
        </div>

        {/* Tax */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Tax
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Calculate and add taxes on top of ticket prices.
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Tax collection is available for all GrowthLab calendars.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Configure Taxes
            </Button>
          </div>
        </div>
      </div>

      {/* Refund Management Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Refund Management
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage refunds for completed payments. Select an event to view and process refunds.
          </p>
        </div>
        {/* Note: In production, you'd select an event first, then show refunds for that event */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select an event from the Events tab to manage refunds, or view all refunds below.
          </p>
        </div>
        {/* For now, show refund management for all events - in production, filter by selected event */}
        <RefundManagement eventId={calendarId} />
      </div>

      {/* Refund Policy Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Refund Policy
          </h2>
          <Button
            variant="primary"
            size="sm"
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            + Add
          </Button>
        </div>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          The refund policy is shown on event pages and the{' '}
          <Link href="#" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 underline">
            refund policy page
          </Link>
          .
        </p>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="font-medium text-slate-900 dark:text-white mb-1">No Refund Policy</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Let guests know what your refund policy is.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales History Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Sales History
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Download as CSV
          </Button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
          <div className="mb-4">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="space-y-4">
            {salesHistory.map((sale) => (
              <div key={sale.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{sale.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link href="#" className="font-medium text-slate-900 dark:text-white hover:text-teal-500 dark:hover:text-teal-400">
                        {sale.event}
                      </Link>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span>{sale.paymentMethod} •••• {sale.lastFour}</span>
                      <span>•</span>
                      <span>{sale.email}</span>
                      <span>•</span>
                      <Link href="#" className="hover:text-teal-500 dark:hover:text-teal-400">
                        {sale.processor}
                      </Link>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{sale.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payout History Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Payout History
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
          <div className="space-y-4">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{payout.date}</span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">{payout.amount}</span>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-400">
                    {payout.bank}
                  </Link>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Newsletters Tab Component
function NewslettersTab({ calendarId }: { calendarId: string }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingNewsletterId, setEditingNewsletterId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewDraft = () => {
    setEditingNewsletterId(null);
    setShowEditor(true);
  };

  const handleEdit = (newsletterId: string) => {
    setEditingNewsletterId(newsletterId);
    setShowEditor(true);
  };

  const handleSave = () => {
    setShowEditor(false);
    setEditingNewsletterId(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setEditingNewsletterId(null);
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            {editingNewsletterId ? 'Edit Newsletter' : 'Create Newsletter'}
          </h2>
          <Button variant="outline" onClick={handleCancel}>
            Back to List
          </Button>
        </div>
        <NewsletterEditor
          calendarId={calendarId}
          newsletterId={editingNewsletterId || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Newsletters
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Create and send newsletters to keep your subscribers informed about your events.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewDraft}
          className="flex-shrink-0"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Newsletter
        </Button>
      </div>

      {/* Newsletter List */}
      <div>
        <NewsletterList
          key={refreshKey}
          calendarId={calendarId}
          onEdit={handleEdit}
        />
      </div>

      {/* Subscriber Management */}
      <div>
        <SubscriberManagement calendarId={calendarId} />
      </div>
    </div>
  );
}

// Insights Tab Component
function InsightsTab({ calendarId }: { calendarId: string }) {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock data for the line graph
  const pageViewsData = [
    { date: 'Tue, 11 Nov', views: 1 },
    { date: 'Wed, 12 Nov', views: 0 },
    { date: 'Thu, 13 Nov', views: 3 },
    { date: 'Fri, 14 Nov', views: 0 },
    { date: 'Sat, 15 Nov', views: 2 },
  ];

  const maxViews = Math.max(...pageViewsData.map(d => d.views));
  const graphHeight = 120;
  const graphWidth = 100;

  // Calculate points for the line graph
  const points = pageViewsData.map((data, index) => {
    const x = (index / (pageViewsData.length - 1)) * graphWidth;
    const y = graphHeight - (data.views / maxViews) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Key Statistics Section */}
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Events */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">64</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">Events</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">0 last week</p>
          </div>

          {/* Tickets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">98</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">Tickets</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">0 last week</p>
          </div>

          {/* Subscribers */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">129</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">Subscribers</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">0 last week</p>
          </div>

          {/* Sales */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">US$66</p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-2">Sales</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">US$0 last week</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
          Only events created under this calendar count towards these stats.
        </p>
      </div>

      {/* Page Views Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Page Views
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              See recent page views of the calendar page.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/calendar/growthlab-sg">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Calendar Page
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Button>
            </Link>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
              <option value="90days">Past 90 Days</option>
            </select>
          </div>
        </div>

        {/* Line Graph */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <div className="relative">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight + 40}`}
              className="w-full h-48 sm:h-64"
              preserveAspectRatio="none"
            >
              {/* Y-axis labels */}
              {[0, 1, 2, 3].map((value) => {
                const y = graphHeight - (value / maxViews) * graphHeight;
                return (
                  <g key={value}>
                    <line
                      x1="0"
                      y1={y}
                      x2={graphWidth}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-200 dark:text-slate-700"
                      strokeDasharray="2,2"
                    />
                    <text
                      x="-5"
                      y={y + 4}
                      className="text-xs fill-slate-600 dark:fill-slate-400"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {pageViewsData.map((data, index) => {
                const x = (index / (pageViewsData.length - 1)) * graphWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={graphHeight + 20}
                    className="text-xs fill-slate-600 dark:fill-slate-400"
                    textAnchor="middle"
                  >
                    {data.date.split(',')[0]}
                  </text>
                );
              })}

              {/* Line graph */}
              <polyline
                points={points}
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {pageViewsData.map((data, index) => {
                const x = (index / (pageViewsData.length - 1)) * graphWidth;
                const y = graphHeight - (data.views / maxViews) * graphHeight;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#EC4899"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Page Views Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Page Views</h3>
          <div className="space-y-3">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">2</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">24 hours</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">9</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">7 days</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">151</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">30 days</p>
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sources</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">GrowthLab</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Meta Ad</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">11%</span>
            </div>
          </div>
        </div>

        {/* Cities */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Cities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Singapore, SG</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">44%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Jurong West, SG</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">33%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Mymensingh, BD</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">11%</span>
            </div>
          </div>
        </div>

        {/* Live Traffic */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Live Traffic</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Visitor from Direct</p>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Singapore</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">5m</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Visitor from Direct</p>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Singapore Embed</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">7m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UTM Sources */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">UTM Sources</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Set up a tracking link by adding <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-xs">?utm_source=your-link-name</code> to your URL.
          </p>
        </div>
      </div>

      {/* Appeal Review Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Appeal Reviews
        </h2>
        <AppealReviewPanel calendarId={calendarId} />
      </div>

      {/* Event Feedback Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Event Feedback
          </h2>
          <div className="flex items-center gap-3">
            <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>By Event</option>
              <option>By Date</option>
            </select>
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold text-center px-2">STARTUP SURGE KICKOFF</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                ROOFTOP SUNSET MIXER - Startup Surge Kickoff
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                7 Nov, 18:00
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">4.67</span>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">3 Responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
interface SettingsTabProps {
  calendarId: string;
  onDeleteCalendar: () => void;
  onConfirmDelete: () => void;
  showDeleteModal: boolean;
  onCloseDeleteModal: () => void;
}

function SettingsTab({ calendarId, onDeleteCalendar, onConfirmDelete, showDeleteModal, onCloseDeleteModal }: SettingsTabProps) {
  const [activeSetting, setActiveSetting] = useState<'display' | 'options' | 'admins' | 'tags' | 'embed' | 'sendlimit' | 'demerits' | 'notifications'>('display');
  const [eventVisibility, setEventVisibility] = useState('public');
  const [publicGuestList, setPublicGuestList] = useState(true);
  const [collectFeedback, setCollectFeedback] = useState(true);
  const [tintColor, setTintColor] = useState('green');
  const [description, setDescription] = useState('');
  
  const [admins, setAdmins] = useState([
    { id: '1', name: 'GrowthLab', email: 'growthlab.sg@gmail.com', avatar: null },
  ]);

  const tintColors = [
    { id: 'grey', color: 'bg-slate-400' },
    { id: 'pink', color: 'bg-pink-400' },
    { id: 'purple', color: 'bg-purple-400' },
    { id: 'lightblue', color: 'bg-blue-300' },
    { id: 'darkblue', color: 'bg-blue-600' },
    { id: 'green', color: 'bg-green-500' },
    { id: 'yellow', color: 'bg-yellow-400' },
    { id: 'orange', color: 'bg-orange-400' },
    { id: 'red', color: 'bg-red-400' },
  ];

  const settingsMenu = [
    { id: 'display', label: 'Display', icon: 'pencil' },
    { id: 'options', label: 'Options', icon: 'options' },
    { id: 'admins', label: 'Admins', icon: 'admins' },
    { id: 'tags', label: 'Tags', icon: 'tags' },
    { id: 'embed', label: 'Embed', icon: 'embed' },
    { id: 'sendlimit', label: 'Send Limit', icon: 'clock' },
    { id: 'demerits', label: 'Demerit System', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      {/* Left Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
          <nav className="space-y-1">
            {settingsMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSetting(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSetting === item.id
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {item.icon === 'pencil' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                )}
                {item.icon === 'options' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )}
                {item.icon === 'admins' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {item.icon === 'tags' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )}
                {item.icon === 'embed' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {item.icon === 'clock' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {item.icon === 'shield' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {item.icon === 'notifications' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeSetting === 'display' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Cover Image Section */}
            <div>
              <div className="relative bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden h-48 sm:h-64">
                <img
                  src="/placeholder-event.jpg"
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium text-slate-900 dark:text-white transition-colors">
                  Change Cover
                </button>
              </div>
              
              {/* Logo Upload */}
              <div className="mt-6 flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-amber-400 rounded-xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <svg className="w-3 h-3 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    GrowthLab Events
                  </h3>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a short description."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Customisation Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Customisation
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Tint Colour</p>
              <div className="flex items-center gap-3">
                {tintColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setTintColor(color.id)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${color.color} transition-all ${
                      tintColor === color.id
                        ? 'ring-4 ring-slate-300 dark:ring-slate-600 ring-offset-2 dark:ring-offset-slate-800 scale-110'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Public URL Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Public URL
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                growthlab.com/growthlab-events
              </p>
            </div>
          </div>
        )}

        {activeSetting === 'options' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Event Defaults Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Event Defaults
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Default settings for new events created on this calendar.
              </p>

              <div className="space-y-6">
                {/* Event Visibility */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Event Visibility
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Whether events are shown on the calendar page.
                  </p>
                  <select
                    value={eventVisibility}
                    onChange={(e) => setEventVisibility(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Public Guest List */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Public Guest List
                    </label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Whether to show guest list on event pages.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPublicGuestList(!publicGuestList)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      publicGuestList ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        publicGuestList ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Collect Feedback */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Collect Feedback
                    </label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Email guests after the event to collect feedback.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCollectFeedback(!collectFeedback)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      collectFeedback ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        collectFeedback ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
                Changing these defaults does not affect existing events. You can always change these settings for each individual event.
              </p>
            </div>

            {/* API Keys Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                API Keys
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Create API keys to send data to Zapier or use GrowthLab API.
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Create API keys to send data to Zapier or use the GrowthLab API.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Create API Key
                  </Button>
                </div>
              </div>
            </div>

            {/* Tracking Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Tracking
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Track event registrations and conversions from Google or Facebook ads.
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Track event registrations and conversions from Google or Facebook ads.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Configure Tracking
                </Button>
              </div>
            </div>

            {/* Calendar Status Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Calendar Status
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Mark the calendar as coming soon or archive it if it is no longer active.
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Active</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      The calendar is active and accepting subscriptions and event submissions.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Change Status
                </Button>
              </div>
            </div>

            {/* Permanently Delete Calendar */}
            <div>
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                onClick={onDeleteCalendar}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Permanently Delete Calendar
              </Button>
            </div>
            
            {/* Delete Calendar Confirmation Modal */}
            {showDeleteModal && (
              <DeleteCalendarModal
                calendarName="GrowthLab Events"
                onConfirm={onConfirmDelete}
                onCancel={onCloseDeleteModal}
              />
            )}
          </div>
        )}

        {activeSetting === 'admins' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  Admins
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Admins have full access to the calendar and can approve events.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Admin
              </Button>
            </div>

            {/* Admins List */}
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-amber-400 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 flex-shrink-0">
                      <span className="text-white font-bold text-sm sm:text-base">
                        {admin.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {admin.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {admin.email}
                      </p>
                    </div>
                    {admins.length > 1 && (
                      <button className="text-slate-400 hover:text-red-500 transition-colors p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSetting === 'tags' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Event Tags Section */}
            <EventTagManagement calendarId={calendarId} />

            {/* Member Tags Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Member Tags
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Organise your audience with member tags. These tags are only visible to admins.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Tag
                </Button>
              </div>

              {/* Empty State */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Tags
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    Tag members to better organise and communicate with them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSetting === 'embed' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Embed Events Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Embed Events
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                Have your own site? Embed your calendar to easily share a live view of your upcoming events.
              </p>

              {/* Preview Controls */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                {/* Theme Controls */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded bg-slate-100 dark:bg-slate-700">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-1">
                  <button className="p-2 rounded bg-slate-100 dark:bg-slate-700">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Filter Dropdown */}
                <select className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>All Events</option>
                  <option>Upcoming Events</option>
                  <option>Past Events</option>
                </select>
              </div>

              {/* Preview Area */}
              <div className="bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 sm:p-12 lg:p-16 min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-x-auto">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <svg className="w-24 h-24 sm:w-32 sm:h-32 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="absolute top-0 right-0 w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">0</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Upcoming Events
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Check back later for new events.
                  </p>
                </div>
              </div>
            </div>

            {/* Code to Copy Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Code to Copy
              </h2>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono whitespace-pre-wrap break-all">
{`<iframe
  src="https://growthlab.com/embed/calendar/cal-KNN5i0tlTsVqaaf/events"
  width="100%"
  height="450"
  frameborder="0"
  style="border: 1px solid #bfcbda88; border-radius: 4px; max-width: 100%;"
  allowfullscreen=""
  aria-hidden="false"
  tabindex="0"
></iframe>`}
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex-shrink-0"
                    onClick={() => {
                      const code = `<iframe
  src="https://growthlab.com/embed/calendar/cal-KNN5i0tlTsVqaaf/events"
  width="100%"
  height="450"
  frameborder="0"
  style="border: 1px solid #bfcbda88; border-radius: 4px; max-width: 100%;"
  allowfullscreen=""
  aria-hidden="false"
  tabindex="0"
></iframe>`;
                      navigator.clipboard.writeText(code);
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  The embed is responsive and will automatically adjust to fit your page. You can change the height attribute if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSetting === 'sendlimit' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Send Limit Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Send Limit
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                Your calendar has a weekly quota for sending invitations and newsletters. It resets every Monday.
              </p>

              {/* Usage Display */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">0</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Used</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">5,000 / 5,000</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Remaining</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Usage</h3>
              
              {/* Week Navigation */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-slate-900 dark:text-white">This Week</span>
                <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Empty State */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No Usage This Week
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
                    You haven't sent anything this week that counts towards your quota.
                  </p>
                </div>
              </div>
            </div>

            {/* Quota Explanation */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Only event invitations and newsletters sent through GrowthLab are subject to the quota. You will always get:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      Unlimited number of guests per event
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      Unlimited reminders and blasts to event guests
                    </span>
                  </li>
                </ul>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  Scheduled newsletters count towards the quota of the week when it is sent.
                </p>
              </div>
            </div>

            {/* Need More Sends Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Need more sends?</h3>
              
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Your calendar currently has 5,000 sends per week.
                </p>

                {/* Verify Calendar */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Verify Calendar</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">Verified</p>
                    </div>
                  </div>
                </div>

                {/* Send Limit Info */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Enhanced Send Limits</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        GrowthLab calendars include 5,000 to 100,000 sends per week based on your plan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSetting === 'demerits' && (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Demerit System
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Enable the demerit system to track and penalize users who register but don't attend, cancel late, or violate policies.
              </p>
              <div className="space-y-6">
                <DemeritSystemSettings calendarId={calendarId} />
                <DemeritManagementPanel calendarId={calendarId} />
              </div>
            </div>
          </div>
        )}

        {activeSetting === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Notification Preferences
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Manage your email reminders and notification preferences
              </p>
            </div>
            <NotificationPreferencesPanel userId="current-user" />
          </div>
        )}

        {activeSetting !== 'display' && activeSetting !== 'options' && activeSetting !== 'admins' && activeSetting !== 'tags' && activeSetting !== 'embed' && activeSetting !== 'sendlimit' && activeSetting !== 'demerits' && activeSetting !== 'notifications' && (
          <div className="text-center py-16">
            <p className="text-slate-600 dark:text-slate-400">
              {settingsMenu.find(m => m.id === activeSetting)?.label} settings coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Delete Calendar Modal Component
function DeleteCalendarModal({ 
  calendarName, 
  onConfirm, 
  onCancel 
}: { 
  calendarName: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === calendarName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Delete Calendar
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          This action cannot be undone. This will permanently delete the calendar "{calendarName}" and all associated data.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Type <span className="font-mono text-slate-900 dark:text-white">{calendarName}</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={calendarName}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={!isConfirmed}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}

