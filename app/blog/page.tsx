'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Blog
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Tips, guides, and updates about event management and GrowthLab Events.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Coming Soon
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our blog is currently under development. Check back soon for helpful articles and updates!
                </p>
                <Link href="/events">
                  <Button variant="outline" size="sm">Browse Events</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

