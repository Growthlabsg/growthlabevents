'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Terms of Service
            </h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                By accessing and using GrowthLab Events, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                Use of Service
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                You agree to use GrowthLab Events only for lawful purposes and in accordance with these Terms of Service.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                User Accounts
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

