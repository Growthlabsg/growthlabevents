'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface UserRestrictionsBannerProps {
  userId: string;
}

// Calculate restrictions based on total points
function calculateRestrictions(totalPoints: number): {
  totalPoints: number;
  restrictions: string[];
  notifications: string[];
} {
  const restrictions: string[] = [];
  const notifications: string[] = [];

  if (totalPoints >= 50) {
    restrictions.push('cannot_register_events');
    notifications.push('You have reached 50 demerit points. Event registration is restricted.');
  }

  if (totalPoints >= 75) {
    restrictions.push('cannot_create_events');
    notifications.push('You have reached 75 demerit points. Event creation is restricted.');
  }

  if (totalPoints >= 100) {
    restrictions.push('account_suspended');
    notifications.push('You have reached 100 demerit points. Your account has been suspended.');
  }

  return {
    totalPoints,
    restrictions,
    notifications,
  };
}

export function UserRestrictionsBanner({ userId }: UserRestrictionsBannerProps) {
  const [restrictions, setRestrictions] = useState<{
    totalPoints: number;
    restrictions: string[];
    notifications: string[];
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchRestrictions = async () => {
      try {
        const response = await fetch(`/api/demerits?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          const totalPoints = data.data.totalPoints || 0;
          if (totalPoints >= 50) {
            const userRestrictions = calculateRestrictions(totalPoints);
            setRestrictions(userRestrictions);
          } else {
            setRestrictions(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch restrictions:', error);
        // Silently fail - don't show restrictions if API fails
        setRestrictions(null);
      }
    };

    if (userId) {
      fetchRestrictions();
      // Check every 30 seconds
      const interval = setInterval(fetchRestrictions, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  if (!restrictions || restrictions.restrictions.length === 0 || dismissed) {
    return null;
  }

  const getRestrictionMessage = (restriction: string) => {
    switch (restriction) {
      case 'cannot_register_events':
        return 'You cannot register for new events due to demerit points.';
      case 'cannot_create_events':
        return 'You cannot create events due to demerit points.';
      case 'account_suspended':
        return 'Your account has been suspended due to demerit points.';
      default:
        return 'Your account has restrictions due to demerit points.';
    }
  };

  const getSeverity = () => {
    if (restrictions.restrictions.includes('account_suspended')) {
      return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
    }
    if (restrictions.restrictions.includes('cannot_create_events')) {
      return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
    }
    return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200';
  };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 mb-6 ${getSeverity()}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold text-base sm:text-lg">
              Account Restrictions Active
            </h3>
          </div>
          <div className="space-y-1 mb-3">
            <p className="text-sm">
              <strong>Total Points:</strong> {restrictions.totalPoints}
            </p>
            {restrictions.restrictions.map((restriction, index) => (
              <p key={index} className="text-sm">
                • {getRestrictionMessage(restriction)}
              </p>
            ))}
          </div>
          {restrictions.notifications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-sm font-medium mb-1">Notifications:</p>
              {restrictions.notifications.map((notification, index) => (
                <p key={index} className="text-sm">{notification}</p>
              ))}
            </div>
          )}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/settings?tab=demerits'}
              className="text-sm"
            >
              View Demerits & Appeal
            </Button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-current/70 hover:text-current p-1 rounded-lg hover:bg-current/10 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

