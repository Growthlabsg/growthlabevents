'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AppealSubmissionModal } from './AppealSubmissionModal';
import { Demerit, Appeal } from '@/lib/demeritSystem';

interface AppealWithDemerit extends Appeal {
  demerit?: Demerit | null;
}

interface UserDemeritsViewProps {
  userId: string;
}

export function UserDemeritsView({ userId }: UserDemeritsViewProps) {
  const [demerits, setDemerits] = useState<Demerit[]>([]);
  const [appeals, setAppeals] = useState<AppealWithDemerit[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDemerit, setSelectedDemerit] = useState<string | null>(null);
  const [showAppealModal, setShowAppealModal] = useState(false);

  useEffect(() => {
    fetchDemerits();
    fetchAppeals();
  }, [userId]);

  const fetchDemerits = async () => {
    try {
      const response = await fetch(`/api/demerits?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setDemerits(data.data.demerits || []);
        setTotalPoints(data.data.totalPoints || 0);
      }
    } catch (error) {
      console.error('Failed to fetch demerits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppeals = async () => {
    try {
      const response = await fetch(`/api/demerits/appeals?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setAppeals(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch appeals:', error);
    }
  };

  const handleSubmitAppeal = async (reason: string, description: string) => {
    if (!selectedDemerit) return;

    const response = await fetch('/api/demerits/appeals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit',
        demeritId: selectedDemerit,
        userId,
        reason,
        description,
      }),
    });

    const data = await response.json();
    if (data.success) {
      await fetchDemerits();
      await fetchAppeals();
    } else {
      throw new Error(data.message || 'Failed to submit appeal');
    }
  };

  const getAppealForDemerit = (demeritId: string): Appeal | undefined => {
    return appeals.find(a => a.demeritId === demeritId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'appealed':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'overturned':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'expired':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
    <div className="space-y-6">
      {/* Total Points Card */}
      <Card className="rounded-xl shadow-sm border-2 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Demerit Points</p>
            <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{totalPoints}</p>
            {totalPoints >= 50 && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {totalPoints >= 100
                  ? 'Account Suspended'
                  : totalPoints >= 75
                  ? 'Cannot create events'
                  : 'Cannot register for events'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Demerits List */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Demerit History</CardTitle>
        </CardHeader>
        <CardContent>
          {demerits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No demerits on record</p>
            </div>
          ) : (
            <div className="space-y-4">
              {demerits.map((demerit) => {
                const appeal = getAppealForDemerit(demerit.id);
                const canAppeal = demerit.status === 'active' && !appeal;

                return (
                  <div
                    key={demerit.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold">
                            -{demerit.points} pts
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demerit.status)}`}>
                            {demerit.status}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">
                          {demerit.reason}
                        </p>
                        {demerit.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {demerit.description}
                          </p>
                        )}
                        {demerit.eventId && (
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            Event ID: {demerit.eventId}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                          {new Date(demerit.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Appeal Status */}
                    {appeal && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              Appeal Status: <span className="capitalize">{appeal.status.replace('_', ' ')}</span>
                            </p>
                            {appeal.reviewNotes && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {appeal.reviewNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Appeal Button */}
                    {canAppeal && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDemerit(demerit.id);
                            setShowAppealModal(true);
                          }}
                          className="w-full sm:w-auto"
                        >
                          Submit Appeal
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

      {/* Appeal Submission Modal */}
      {showAppealModal && selectedDemerit && (
        <AppealSubmissionModal
          demeritId={selectedDemerit}
          isOpen={showAppealModal}
          onClose={() => {
            setShowAppealModal(false);
            setSelectedDemerit(null);
          }}
          onSubmit={handleSubmitAppeal}
        />
      )}
    </div>
  );
}

