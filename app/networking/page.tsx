'use client';

import { useState } from 'react';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { ChatButton } from '@/components/ChatButton';
import { VirtualNameCard } from '@/components/VirtualNameCard';
import { NetworkingAnalytics } from '@/components/NetworkingAnalytics';
import { ContactRequestsPanel } from '@/components/ContactRequestsPanel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'requests'>('overview');

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Networking
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect with event attendees and build your network
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'directory'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Directory
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Requests
            </button>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Virtual Name Card */}
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Your Virtual Name Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <VirtualNameCard userId="current-user" editable={true} />
                </CardContent>
              </Card>

              {/* Networking Analytics */}
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Networking Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <NetworkingAnalytics userId="current-user" />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="space-y-6 sm:space-y-8">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>All Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    Browse your network connections. You can find attendees from specific events in the event detail pages.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Received Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactRequestsPanel userId="current-user" type="received" />
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Sent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactRequestsPanel userId="current-user" type="sent" />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

