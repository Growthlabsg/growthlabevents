'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { mockEvents } from '@/lib/mockData';

interface Collaboration {
  eventId: string;
  eventTitle: string;
  collaboratorId: string;
  collaboratorName: string;
  role: 'co-host' | 'partner' | 'sponsor';
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
}

export default function EventsCollaboratePage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    fetchAllCollaborations();
  }, []);

  const fetchAllCollaborations = async () => {
    try {
      // Fetch collaborations for all user's events
      const myEvents = mockEvents.filter(e => e.organizer.name === 'GrowthLab Events');
      const allCollaborations: Collaboration[] = [];

      for (const event of myEvents) {
        try {
          const response = await fetch(`/api/events/${event.id}/collaborate`);
          const data = await response.json();
          if (data.success && data.data.collaborations) {
            data.data.collaborations.forEach((collab: any) => {
              allCollaborations.push({
                ...collab,
                eventId: event.id,
                eventTitle: event.title,
              });
            });
          }
        } catch (error) {
          console.error(`Failed to fetch collaborations for event ${event.id}:`, error);
        }
      }

      setCollaborations(allCollaborations);
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (eventId: string, collaboratorId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/events/${eventId}/collaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          collaboratorId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchAllCollaborations();
      } else {
        alert(data.message || `Failed to ${action} collaboration request`);
      }
    } catch (error) {
      console.error(`Failed to ${action} collaboration:`, error);
      alert(`Failed to ${action} collaboration request`);
    }
  };

  const filteredCollaborations = collaborations.filter(collab => {
    if (filter === 'all') return true;
    return collab.status === filter;
  });

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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Collaborations
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage collaboration requests and partnerships
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {(['all', 'pending', 'accepted', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Collaborations List */}
          {filteredCollaborations.length === 0 ? (
            <Card className="rounded-xl shadow-sm">
              <CardContent className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No collaborations found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {filter === 'all' ? 'You don\'t have any collaborations yet' : `No ${filter} collaborations`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCollaborations.map((collab) => (
                <Card key={`${collab.eventId}-${collab.collaboratorId}`} className="rounded-xl shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">
                              {collab.collaboratorName}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                              {collab.role}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            collab.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                            collab.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}>
                            {collab.status}
                          </span>
                        </div>
                        <div className="mt-3">
                          <Link href={`/events/${collab.eventId}`} className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                            {collab.eventTitle}
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Requested {new Date(collab.requestedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {collab.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRespondToRequest(collab.eventId, collab.collaboratorId, 'accept')}
                            className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRespondToRequest(collab.eventId, collab.collaboratorId, 'reject')}
                            className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

