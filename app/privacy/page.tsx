'use client';

import { HorizontalNav } from '@/components/layout/HorizontalNav';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Privacy Policy
            </h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                GrowthLab Events respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                Information We Collect
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We collect information that you provide directly to us, such as when you create an account, register for an event, or contact us for support.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">
                Data Security
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

