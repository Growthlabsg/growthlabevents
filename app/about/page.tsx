'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              About GrowthLab Events
            </h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                GrowthLab Events is a modern event management and ticketing platform designed to help organizers create, manage, and promote their events effortlessly.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Built as part of the GrowthLab platform, we provide powerful tools for event organizers while maintaining simplicity and elegance in design.
              </p>
              <div className="mt-8">
                <Link href="/contact">
                  <Button variant="primary">Get in Touch</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

