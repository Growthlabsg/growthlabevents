'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_DEMERIT_REASONS } from '@/lib/demeritSystem';

interface DemeritSystemWarningProps {
  calendarId?: string;
}

export function DemeritSystemWarning({ calendarId }: DemeritSystemWarningProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [pointsThreshold, setPointsThreshold] = useState(50);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!calendarId) {
      setLoading(false);
      return;
    }

    const checkDemeritSystem = async () => {
      try {
        const response = await fetch(`/api/demerits?calendarId=${calendarId}`);
        const data = await response.json();
        if (data.success && data.data.settings) {
          setIsEnabled(data.data.settings.enabled);
          setPointsThreshold(data.data.settings.pointsThreshold || 50);
        }
      } catch (error) {
        console.error('Failed to check demerit system:', error);
      } finally {
        setLoading(false);
      }
    };

    checkDemeritSystem();
  }, [calendarId]);

  if (loading || !isEnabled || dismissed || !calendarId) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-base sm:text-lg mb-2">
                Demerit System Active
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                This event organizer uses a demerit system to ensure event quality. Please be aware of the following:
              </p>
              
              <div className="space-y-2 mb-3">
                <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  <strong>⚠️ Important:</strong> You may receive demerit points for:
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-800 dark:text-amber-300 ml-2">
                  {DEFAULT_DEMERIT_REASONS.slice(0, 3).map((reason) => (
                    <li key={reason.id}>
                      <strong>{reason.name}</strong> ({reason.points} points) - {reason.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 mt-3">
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium mb-1">
                  Restriction Threshold: {pointsThreshold} points
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Accumulating {pointsThreshold}+ points may restrict your ability to register for future events.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex-shrink-0"
              aria-label="Dismiss warning"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

