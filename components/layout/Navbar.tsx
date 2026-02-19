'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ThemeToggle';
import { Notifications } from '../Notifications';
import { SearchBar } from '../SearchBar';
import { ProfileDropdown } from '../ProfileDropdown';

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isEventsPage = pathname === '/events' || pathname?.startsWith('/events/');
  const isCalendarsPage = pathname === '/calendars';
  const isDiscoverPage = pathname === '/discover';
  const isSavedPage = pathname === '/events/saved';

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container-elegant">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-bold text-sm sm:text-base">G</span>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                GrowthLab
              </span>
              <span className="hidden xs:inline text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">Events</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              href="/events" 
              className={`transition-colors ${
                isEventsPage 
                  ? 'text-slate-900 dark:text-white font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Events
            </Link>
            <Link 
              href="/calendars" 
              className={`transition-colors ${
                isCalendarsPage 
                  ? 'text-slate-900 dark:text-white font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendars
            </Link>
            <Link 
              href="/discover" 
              className={`transition-colors ${
                isDiscoverPage 
                  ? 'text-slate-900 dark:text-white font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Discover
            </Link>
            <Link 
              href="/events/saved" 
              className={`transition-colors ${
                isSavedPage 
                  ? 'text-slate-900 dark:text-white font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Saved
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Link href="/create">
              <Button variant="primary" size="sm" className="text-xs sm:text-sm">Create Event</Button>
            </Link>
            <Notifications />
            <ThemeToggle />
            <SearchBar />
            <ProfileDropdown />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-4 space-y-3">
            <Link 
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isEventsPage 
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Events
            </Link>
            <Link 
              href="/calendars"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isCalendarsPage 
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Calendars
            </Link>
            <Link 
              href="/discover"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isDiscoverPage 
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Discover
            </Link>
            <Link 
              href="/events/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isSavedPage 
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Saved Events
            </Link>
            <div className="px-4 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <Link href="/create" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Create Event</Button>
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Search</span>
                <SearchBar />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Notifications</span>
                <Notifications />
              </div>
              <ProfileDropdown />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
