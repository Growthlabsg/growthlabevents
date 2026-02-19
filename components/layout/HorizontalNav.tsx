'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Search,
  Network,
  Home,
  Menu,
  X,
  ChevronUp,
} from 'lucide-react';
import { Notifications } from '../Notifications';
import { ThemeToggle } from '../ThemeToggle';
import { ProfileDropdown } from '../ProfileDropdown';
import { MobileBottomNav } from './MobileBottomNav';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  matchPattern?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    matchPattern: (path) => path === '/dashboard' || path === '/',
  },
  {
    href: '/events',
    label: 'Events',
    icon: Calendar,
    matchPattern: (path) => path === '/events' || path?.startsWith('/events/'),
  },
  {
    href: '/calendars',
    label: 'Calendars',
    icon: Users,
    matchPattern: (path) => path === '/calendars' || path?.startsWith('/calendar/'),
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: Search,
    matchPattern: (path) => path === '/discover',
  },
  {
    href: '/networking',
    label: 'Networking',
    icon: Network,
    matchPattern: (path) => path === '/networking' || path?.startsWith('/networking/'),
  },
];

export const HorizontalNav = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      // Always show nav on top, or show after scrolling
      setIsVisible(true);
      // Show scroll to top button after scrolling down
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (item: NavItem): boolean => {
    if (item.matchPattern) {
      return item.matchPattern(pathname || '');
    }
    return pathname === item.href;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={clsx(
          'hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        )}
      >
        <div className="flex items-center gap-2">
          {/* Home Button */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:scale-105 active:scale-95 transition-all"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Navigation Pills */}
          <div className="flex items-center gap-0.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg rounded-full px-1.5 py-1 border border-gray-200 dark:border-slate-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    active
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className={active ? '' : 'hidden xl:inline'}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg rounded-full px-1.5 py-1 border border-gray-200 dark:border-slate-700">
            <Notifications />
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar - App-style compact header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm safe-area-inset-top"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-3 py-2.5 gap-2 min-h-[52px]">
          {/* Home Button */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 active:scale-95 transition-all"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </Link>

          {/* Quick Nav - First 3 items - Centered */}
          <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-full text-xs font-medium transition-all touch-manipulation min-h-[44px]',
                    active
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 active:bg-slate-200 dark:active:bg-slate-600'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex-shrink-0 flex items-center gap-1">
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Floating Menu Button - above bottom nav */}
      <div className="lg:hidden fixed right-4 z-[45] bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+0.5rem)]" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-14 h-14 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all touch-manipulation"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute bottom-16 right-0 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="my-2 border-t border-gray-200 dark:border-slate-700" />

              {/* Theme Toggle in Mobile Menu */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top - above bottom nav on mobile */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed left-4 w-12 h-12 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 transition-all z-[45] animate-in fade-in slide-in-from-bottom-2 duration-200 touch-manipulation bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+0.5rem)] lg:bottom-4"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* Mobile: bottom tab bar (app-style navigation) */}
      <MobileBottomNav />

      {/* Spacer for mobile fixed header */}
      <div className="lg:hidden h-14" />
      
      {/* Spacer for desktop fixed floating nav */}
      <div className="hidden lg:block h-20" />
    </>
  );
};
