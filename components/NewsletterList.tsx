'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Newsletter } from '@/lib/newsletters';
import Link from 'next/link';

interface NewsletterListProps {
  calendarId: string;
  onEdit?: (newsletterId: string) => void;
  onDelete?: (newsletterId: string) => void;
}

export function NewsletterList({ calendarId, onEdit, onDelete }: NewsletterListProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletters();
  }, [calendarId]);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`/api/newsletters?calendarId=${calendarId}`);
      const data = await response.json();
      if (data.success) {
        setNewsletters(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (newsletterId: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const response = await fetch(`/api/newsletters?newsletterId=${newsletterId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchNewsletters();
        if (onDelete) {
          onDelete(newsletterId);
        }
      } else {
        alert('Failed to delete newsletter: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to delete newsletter:', error);
      alert('An error occurred');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            Sent
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
            Scheduled
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
            Draft
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsletters.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No Newsletters
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create your first newsletter to keep subscribers informed about your events.
          </p>
        </div>
      ) : (
        newsletters.map((newsletter) => (
          <Card key={newsletter.id} className="rounded-xl shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {newsletter.title}
                    </h3>
                    {getStatusBadge(newsletter.status)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Subject: {newsletter.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Created: {new Date(newsletter.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    {newsletter.sentAt && (
                      <> • Sent: {new Date(newsletter.sentAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}</>
                    )}
                  </p>
                  {newsletter.status === 'sent' && (
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>{newsletter.recipientCount} recipients</span>
                      <span>{newsletter.openCount} opens</span>
                      <span>{newsletter.clickCount} clicks</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {onEdit && newsletter.status !== 'sent' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(newsletter.id)}
                      className="flex-shrink-0"
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && newsletter.status !== 'sent' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(newsletter.id)}
                      className="flex-shrink-0 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

