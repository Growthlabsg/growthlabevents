'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ReportEventModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportEventModal({ eventId, isOpen, onClose }: ReportEventModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${eventId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setReason('');
          setDescription('');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to report event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Report Event
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 sm:py-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">Report submitted successfully</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">Thank you for helping us keep the community safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                Reason for reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              >
                <option value="">Select a reason</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inappropriate content</option>
                <option value="misleading">Misleading information</option>
                <option value="duplicate">Duplicate event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                Additional details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                placeholder="Please provide more information..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!reason || submitting}
                className="flex-1 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

