'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { EventAnalyticsDashboard } from '@/components/EventAnalyticsDashboard';
import { mockEvents } from '@/lib/mockData';

export default function EventAnalyticsPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const event = mockEvents.find(e => e.id === eventId);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/analytics`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchAnalytics();
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event not found</h2>
            <Link href="/events">
              <Button>Go to Events</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Event Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {event.title}
                </p>
              </div>
              <Link href={`/events/${eventId}`}>
                <Button variant="outline">View Event</Button>
              </Link>
            </div>
          </div>

          {/* Enhanced Analytics Dashboard */}
          <EventAnalyticsDashboard eventId={eventId} />

          {/* Additional Analytics - Ticket Type Breakdown */}
          {analytics && analytics.ticketTypes && analytics.ticketTypes.length > 0 && (
            <Card className="rounded-xl shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Ticket Sales by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.ticketTypes.map((ticket: any) => (
                    <div key={ticket.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{ticket.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            ${ticket.price === 0 ? 'Free' : ticket.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {ticket.sold} sold
                          </div>
                          {ticket.revenue > 0 && (
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              ${ticket.revenue.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      {ticket.quantity && (
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full transition-all"
                            style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton currentEventId={eventId} />
    </div>
  );
}

