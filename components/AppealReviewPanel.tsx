'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Appeal, Demerit } from '@/lib/demeritSystem';

interface AppealReviewPanelProps {
  calendarId: string;
}

interface AppealWithDemerit extends Appeal {
  demerit?: Demerit | null;
}

export function AppealReviewPanel({ calendarId }: AppealReviewPanelProps) {
  const [appeals, setAppeals] = useState<AppealWithDemerit[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchPendingAppeals();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingAppeals, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingAppeals = async () => {
    try {
      const response = await fetch('/api/demerits/appeals?pending=true');
      const data = await response.json();
      if (data.success) {
        setAppeals(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch appeals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (appealId: string, status: 'approved' | 'rejected') => {
    setReviewing(appealId);
    try {
      const response = await fetch('/api/demerits/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          appealId,
          status,
          reviewedBy: 'admin', // In production, use actual admin user ID
          reviewNotes: reviewNotes || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPendingAppeals();
        setReviewNotes('');
        setReviewing(null);
      } else {
        alert('Failed to review appeal: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to review appeal:', error);
      alert('An error occurred while reviewing the appeal');
    } finally {
      setReviewing(null);
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
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Appeals ({appeals.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPendingAppeals}
            className="flex-shrink-0"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {appeals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">No pending appeals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appeals.map((appeal) => {
              const demerit = appeal.demerit;
              const isReviewing = reviewing === appeal.id;

              return (
                <div
                  key={appeal.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                          Pending Review
                        </span>
                      </div>
                      {demerit && (
                        <div className="mb-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Demerit: {demerit.reason} (-{demerit.points} pts)
                          </p>
                          {demerit.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {demerit.description}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-2">
                        Appeal Reason: {appeal.reason}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {appeal.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Submitted: {new Date(appeal.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Review Actions */}
                  {isReviewing ? (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Review Notes (Optional)
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                          placeholder="Add notes about your decision..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReviewing(null);
                            setReviewNotes('');
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReview(appeal.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleReview(appeal.id, 'rejected')}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReviewing(appeal.id);
                          setReviewNotes('');
                        }}
                        className="w-full sm:w-auto"
                      >
                        Review Appeal
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

