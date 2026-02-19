'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ContactExchangeRequest as ContactRequest } from '@/lib/networking';

interface ContactRequestsPanelProps {
  userId: string;
  type?: 'sent' | 'received';
}

export function ContactRequestsPanel({ userId, type = 'received' }: ContactRequestsPanelProps) {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [userId, type]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/networking/contacts?userId=${userId}&type=${type}`);
      const data = await response.json();
      if (data.success) {
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/networking/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          requestId,
          toUserId: userId,
          status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchRequests();
      } else {
        alert('Failed to respond: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to respond to request:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const otherRequests = requests.filter(r => r.status !== 'pending');

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>
          {type === 'sent' ? 'Sent Requests' : 'Received Requests'} ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No {type === 'sent' ? 'sent' : 'received'} requests
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Pending ({pendingRequests.length})
                </h3>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white mb-1">
                            {type === 'sent' ? `To: User ${request.toUserId}` : `From: User ${request.fromUserId}`}
                          </p>
                          {request.message && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {request.message}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(request.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {type === 'received' && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRespond(request.id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRespond(request.id, 'rejected')}
                            className="flex-1 border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      {type === 'sent' && (
                        <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
                          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            Waiting for response...
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Requests */}
            {otherRequests.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  {type === 'sent' ? 'History' : 'Responded'}
                </h3>
                <div className="space-y-3">
                  {otherRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-4 rounded-lg border ${
                        request.status === 'approved'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {type === 'sent' ? `To: User ${request.toUserId}` : `From: User ${request.fromUserId}`}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                request.status === 'approved'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          {request.message && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {request.message}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(request.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                            {request.respondedAt && (
                              <> • Responded: {new Date(request.respondedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

