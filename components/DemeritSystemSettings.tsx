'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DEFAULT_DEMERIT_REASONS } from '@/lib/demeritSystem';

interface DemeritSystemSettingsProps {
  calendarId: string;
}

export function DemeritSystemSettings({ calendarId }: DemeritSystemSettingsProps) {
  const [enabled, setEnabled] = useState(false);
  const [pointsThreshold, setPointsThreshold] = useState(50);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/demerits?calendarId=${calendarId}`);
        const data = await response.json();
        if (data.success && data.data.settings) {
          setEnabled(data.data.settings.enabled);
          setPointsThreshold(data.data.settings.pointsThreshold);
        }
      } catch (error) {
        console.error('Failed to fetch demerit settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [calendarId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/demerits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'configure',
          calendarId,
          enabled,
          pointsThreshold,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Demerit system settings saved successfully');
      } else {
        alert('Failed to save settings: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('An error occurred while saving settings');
    } finally {
      setSaving(false);
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
        <CardTitle>Demerit System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              Enable Demerit System
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track and penalize users who register but don't attend, cancel late, or violate policies
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {enabled && (
          <>
            {/* Points Threshold */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Points Threshold for Restrictions
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={pointsThreshold}
                  onChange={(e) => setPointsThreshold(parseInt(e.target.value) || 50)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Users reaching this threshold will face restrictions (default: 50 points)
                </p>
              </div>
            </div>

            {/* Demerit Reasons */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Demerit Reasons & Points
              </h3>
              <div className="space-y-2">
                {DEFAULT_DEMERIT_REASONS.map((reason) => (
                  <div
                    key={reason.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {reason.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {reason.description}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
                      {reason.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Restriction Levels */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                Restriction Levels
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-amber-900 dark:text-amber-300 text-sm">
                      50+ Points
                    </span>
                    <span className="text-xs text-amber-700 dark:text-amber-400">Warning</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Cannot register for new events
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-orange-900 dark:text-orange-300 text-sm">
                      75+ Points
                    </span>
                    <span className="text-xs text-orange-700 dark:text-orange-400">Severe</span>
                  </div>
                  <p className="text-xs text-orange-800 dark:text-orange-300">
                    Cannot create events
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-red-900 dark:text-red-300 text-sm">
                      100+ Points
                    </span>
                    <span className="text-xs text-red-700 dark:text-red-400">Suspended</span>
                  </div>
                  <p className="text-xs text-red-800 dark:text-red-300">
                    Account suspended
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

