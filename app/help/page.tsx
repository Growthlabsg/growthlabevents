'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Help Center
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Find answers to common questions and learn how to use GrowthLab Events.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Getting Started
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Learn how to create your first event, set up tickets, and manage attendees.
                </p>
                <Link href="/create">
                  <Button variant="outline" size="sm">Create Your First Event</Button>
                </Link>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Event Management
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Discover how to manage events, calendars, and guest lists effectively.
                </p>
                <Link href="/calendars">
                  <Button variant="outline" size="sm">View Calendars</Button>
                </Link>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Need More Help?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Contact our support team for additional assistance.
                </p>
                <Link href="/contact">
                  <Button variant="primary" size="sm">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

