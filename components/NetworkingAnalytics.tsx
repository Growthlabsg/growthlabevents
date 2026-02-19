'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface NetworkingAnalyticsProps {
  userId: string;
}

export function NetworkingAnalytics({ userId }: NetworkingAnalyticsProps) {
  const [analytics, setAnalytics] = useState<{
    totalConnections: number;
    totalRequestsSent: number;
    totalRequestsReceived: number;
    pendingRequests: number;
    connectionsThisMonth: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch connections
      const connectionsRes = await fetch(`/api/networking/contacts?userId=${userId}&type=connections`);
      const connectionsData = await connectionsRes.json();
      const connections = connectionsData.success ? connectionsData.data : [];

      // Fetch sent requests
      const sentRes = await fetch(`/api/networking/contacts?userId=${userId}&type=sent`);
      const sentData = await sentRes.json();
      const sentRequests = sentData.success ? sentData.data : [];

      // Fetch received requests
      const receivedRes = await fetch(`/api/networking/contacts?userId=${userId}&type=received`);
      const receivedData = await receivedRes.json();
      const receivedRequests = receivedData.success ? receivedData.data : [];

      // Calculate analytics
      const pending = receivedRequests.filter((r: any) => r.status === 'pending').length;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const connectionsThisMonth = connections.filter((c: any) => 
        new Date(c.connectedAt) >= thisMonth
      ).length;

      setAnalytics({
        totalConnections: connections.length,
        totalRequestsSent: sentRequests.length,
        totalRequestsReceived: receivedRequests.length,
        pendingRequests: pending,
        connectionsThisMonth,
      });
    } catch (error) {
      console.error('Failed to fetch networking analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          Networking Analytics
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Connections */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Connections</p>
              <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics.totalConnections}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {analytics.connectionsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Requests Sent */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Requests Sent</p>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics.totalRequestsSent}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Contact exchange requests
            </p>
          </CardContent>
        </Card>

        {/* Requests Received */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">Requests Received</p>
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {analytics.totalRequestsReceived}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {analytics.pendingRequests} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Growth Chart Placeholder */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Connection Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Connection growth chart coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

