'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface EventStatusManagerProps {
  eventId: string;
  currentStatus: 'upcoming' | 'live' | 'past' | 'cancelled' | 'postponed';
  onStatusChange?: (newStatus: string) => void;
}

export function EventStatusManager({ eventId, currentStatus, onStatusChange }: EventStatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postponedDate, setPostponedDate] = useState('');
  const [postponedTime, setPostponedTime] = useState('');

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'cancelled' || newStatus === 'postponed') {
      setShowConfirm(true);
      setSelectedStatus(newStatus);
      return;
    }

    await updateStatus(newStatus);
  };

  const updateStatus = async (newStatus: string, postponedTo?: { date: string; time: string }) => {
    setSubmitting(true);
    try {
      const body: any = { status: newStatus };
      if (newStatus === 'postponed' && postponedTo) {
        body.postponedTo = postponedTo;
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success) {
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
        setShowConfirm(false);
        setPostponedDate('');
        setPostponedTime('');
        alert(`Event status updated to ${newStatus}`);
      } else {
        alert(data.message || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update event status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = () => {
    if (selectedStatus === 'postponed') {
      if (!postponedDate || !postponedTime) {
        alert('Please select a new date and time for the postponed event');
        return;
      }
      updateStatus(selectedStatus, { date: postponedDate, time: postponedTime });
    } else {
      updateStatus(selectedStatus);
    }
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Event Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Current Status: <span className="font-medium capitalize">{currentStatus}</span>
          </p>
          <div className="space-y-2">
            {(['upcoming', 'live', 'cancelled', 'postponed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={status === currentStatus || submitting}
                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  status === currentStatus
                    ? 'bg-teal-500 text-white cursor-not-allowed'
                    : status === 'cancelled' || status === 'postponed'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status === currentStatus && ' (Current)'}
              </button>
            ))}
          </div>
        </div>

        {showConfirm && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-3">
              Are you sure you want to {selectedStatus === 'cancelled' ? 'cancel' : 'postpone'} this event?
            </p>
            
            {selectedStatus === 'postponed' && (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={postponedDate}
                    onChange={(e) => setPostponedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={postponedTime}
                    onChange={(e) => setPostponedTime(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedStatus(currentStatus);
                  setPostponedDate('');
                  setPostponedTime('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                disabled={submitting || (selectedStatus === 'postponed' && (!postponedDate || !postponedTime))}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {submitting ? 'Updating...' : 'Confirm'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

