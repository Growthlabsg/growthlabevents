'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DEFAULT_DEMERIT_REASONS } from '@/lib/demeritSystem';

interface DemeritManagementPanelProps {
  calendarId: string;
  eventId?: string;
}

export function DemeritManagementPanel({ calendarId, eventId }: DemeritManagementPanelProps) {
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [points, setPoints] = useState(10);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // When reason changes, update points
    const selectedReason = DEFAULT_DEMERIT_REASONS.find(r => r.id === reason);
    if (selectedReason) {
      setPoints(selectedReason.points);
    }
  }, [reason]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !reason) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/demerits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          userId,
          reason,
          points,
          eventId,
          description: description || undefined,
          createdBy: 'admin', // In production, use actual admin user ID
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setUserId('');
          setReason('');
          setPoints(10);
          setDescription('');
        }, 2000);
      } else {
        alert('Failed to add demerit: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to add demerit:', error);
      alert('An error occurred while adding the demerit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Add Demerit</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-900 dark:text-white font-medium">Demerit added successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                User ID or Email
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID or email"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Demerit Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select a reason</option>
                {DEFAULT_DEMERIT_REASONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.points} pts)
                  </option>
                ))}
              </select>
            </div>

            {reason && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Default points for selected reason. You can adjust if needed.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="Add any additional context or details..."
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={!userId || !reason || submitting}
              className="w-full"
            >
              {submitting ? 'Adding Demerit...' : 'Add Demerit'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

