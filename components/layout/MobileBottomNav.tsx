'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/events',
      label: 'Events',
      icon: (
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: '/discover',
      label: 'Discover',
      icon: (
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      href: '/events/saved',
      label: 'Saved',
      icon: (
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      href: '/dashboard',
      label: 'Me',
      icon: (
        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/events') return pathname === '/events' || pathname?.startsWith('/events/');
    if (href === '/dashboard') return pathname === '/dashboard' || pathname?.startsWith('/dashboard/') || pathname === '/profile' || pathname === '/settings';
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-700 backdrop-blur-md safe-area-inset-bottom">
      <div className="flex items-stretch justify-around" style={{ minHeight: '4.5rem' }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`touch-manipulation flex flex-col items-center justify-center flex-1 gap-0.5 min-h-[44px] py-2 transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${
                active ? 'text-teal-500 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px] sm:text-xs font-medium truncate max-w-full px-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
