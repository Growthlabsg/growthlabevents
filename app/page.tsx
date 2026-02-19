'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { ChatButton } from '@/components/ChatButton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-teal-50 via-white to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-16 sm:py-20 lg:py-28">
          <div className="container-elegant">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <span className="inline-block px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium mb-6">
                  GrowthLab Events Platform
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-tight tracking-tight">
                Create events that
                <span className="block text-teal-500 mt-2">bring people together</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
                Modern event management and ticketing platform. Simple, beautiful, and powerful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/create">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Event
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Events
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Discover
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-800">
          <div className="container-elegant">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Everything you need to manage events
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Powerful features, simple interface. Built for organizers who care about details.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Flexible Ticketing</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create paid or free tickets, set pricing, and manage registrations with ease. Support multiple ticket types and pricing tiers.
                </p>
              </div>
              
              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Guest Management</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Manage your guest list, send invites, and check in attendees seamlessly. QR code check-in and real-time updates.
                </p>
              </div>
              
              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Analytics & Insights</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track registrations, see how people find your events, and understand your audience with detailed analytics.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Calendar Management</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Organize multiple events in calendars, manage subscribers, and create recurring event series.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Event Chat</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Automatic chat groups for each event. Connect with attendees before, during, and after your events.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 card-elegant group">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-3">Secure & Reliable</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enterprise-grade security, reliable infrastructure, and comprehensive data protection for your events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container-elegant">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-500 mb-2">10K+</div>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-500 mb-2">50K+</div>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-500 mb-2">200+</div>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-500 mb-2">99.9%</div>
                <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24 lg:py-28 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700">
          <div className="container-elegant">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                Ready to create your first event?
              </h2>
              <p className="text-teal-50 text-lg sm:text-xl mb-8 sm:mb-10 leading-relaxed">
                Join thousands of organizers using GrowthLab Events to manage their events. Start free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/calendars">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View Calendars
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}
