'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function APIPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              API Documentation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Integrate GrowthLab Events into your applications using our RESTful API.
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  API Overview
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Our API allows you to programmatically create events, manage calendars, and interact with the GrowthLab Events platform.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Getting Started
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  API documentation is currently being developed. For API access, please contact our support team.
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

