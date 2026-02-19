'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AppealSubmissionModalProps {
  demeritId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, description: string) => Promise<void>;
}

export function AppealSubmissionModal({ demeritId, isOpen, onClose, onSubmit }: AppealSubmissionModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(reason, description);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason('');
        setDescription('');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit appeal:', error);
      alert('Failed to submit appeal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
            Submit Appeal
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
            <p className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">Appeal submitted successfully</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">Your appeal is under review. You'll be notified of the decision.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                Reason for Appeal
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              >
                <option value="">Select a reason</option>
                <option value="mistake">Mistake or Error</option>
                <option value="unfair">Unfair Assessment</option>
                <option value="extenuating">Extenuating Circumstances</option>
                <option value="evidence">New Evidence</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                Additional Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                placeholder="Please provide details about why you believe this demerit should be overturned..."
                required
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
                disabled={!reason || !description.trim() || submitting}
                className="flex-1 w-full sm:w-auto"
              >
                {submitting ? 'Submitting...' : 'Submit Appeal'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

