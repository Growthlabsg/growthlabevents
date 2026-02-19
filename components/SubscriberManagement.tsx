'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { NewsletterSubscriber } from '@/lib/newsletters';

interface SubscriberManagementProps {
  calendarId: string;
}

export function SubscriberManagement({ calendarId }: SubscriberManagementProps) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, [calendarId]);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch(`/api/newsletters/subscribers?calendarId=${calendarId}`);
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data.subscribers || []);
        setSubscriberCount(data.data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubscriber.email.trim()) {
      alert('Please enter an email address');
      return;
    }

    setAdding(true);
    try {
      const response = await fetch('/api/newsletters/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'subscribe',
          calendarId,
          email: newSubscriber.email,
          name: newSubscriber.name || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSubscribers();
        setNewSubscriber({ email: '', name: '' });
        setShowAddForm(false);
      } else {
        alert('Failed to add subscriber: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      alert('An error occurred');
    } finally {
      setAdding(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) return;

    try {
      const response = await fetch('/api/newsletters/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unsubscribe',
          calendarId,
          email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchSubscribers();
      } else {
        alert('Failed to unsubscribe: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      alert('An error occurred');
    }
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscribers ({subscriberCount})</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage your newsletter subscribers
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : '+ Add Subscriber'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Subscriber Form */}
        {showAddForm && (
          <form onSubmit={handleAddSubscriber} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                placeholder="subscriber@example.com"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!newSubscriber.email || adding}
              className="w-full sm:w-auto"
            >
              {adding ? 'Adding...' : 'Add Subscriber'}
            </Button>
          </form>
        )}

        {/* Search */}
        {subscribers.length > 0 && (
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscribers..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}

        {/* Subscribers List */}
        {filteredSubscribers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              {searchQuery ? 'No subscribers found' : 'No subscribers yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSubscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                    {subscriber.name || subscriber.email}
                  </p>
                  {subscriber.name && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {subscriber.email}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Subscribed: {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {subscriber.isActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnsubscribe(subscriber.email)}
                    className="flex-shrink-0 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Unsubscribe
                  </Button>
                ) : (
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
                    Unsubscribed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

