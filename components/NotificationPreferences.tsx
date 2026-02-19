'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { NotificationPreferences } from '@/lib/notifications';

interface NotificationPreferencesProps {
  userId?: string;
}

export function NotificationPreferencesPanel({ userId = 'current-user' }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`/api/notifications/preferences?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setPreferences(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preferences,
          userId: userId, // Override userId from preferences if needed
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(data.data);
        alert('Notification preferences saved successfully');
      } else {
        alert('Failed to save preferences: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (path: string[], value: any) => {
    if (!preferences) return;

    const updated = { ...preferences };
    let current: any = updated;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]] = { ...current[path[i]] };
    }

    current[path[path.length - 1]] = value;
    setPreferences(updated);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 dark:text-slate-400">Failed to load preferences</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Reminders */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Email Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Enable Email Reminders</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive email reminders before events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailReminders.enabled}
                onChange={(e) => updatePreference(['emailReminders', 'enabled'], e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {preferences.emailReminders.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Remind me (days before)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 7, 14].map((days) => (
                    <label key={days} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.emailReminders.daysBefore.includes(days)}
                        onChange={(e) => {
                          const current = preferences.emailReminders.daysBefore;
                          const updated = e.target.checked
                            ? [...current, days]
                            : current.filter(d => d !== days);
                          updatePreference(['emailReminders', 'daysBefore'], updated);
                        }}
                        className="mr-2 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {days} {days === 1 ? 'day' : 'days'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Remind me (hours before)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 6, 12].map((hours) => (
                    <label key={hours} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.emailReminders.hoursBefore.includes(hours)}
                        onChange={(e) => {
                          const current = preferences.emailReminders.hoursBefore;
                          const updated = e.target.checked
                            ? [...current, hours]
                            : current.filter(h => h !== hours);
                          updatePreference(['emailReminders', 'hoursBefore'], updated);
                        }}
                        className="mr-2 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {hours} {hours === 1 ? 'hour' : 'hours'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Event Notifications */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Event Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.eventNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {key === 'newEvents' && 'Get notified about new events'}
                  {key === 'eventUpdates' && 'Get notified when events are updated'}
                  {key === 'eventCancellations' && 'Get notified when events are cancelled'}
                  {key === 'eventReminders' && 'Get notified about upcoming events'}
                  {key === 'waitlistOpenings' && 'Get notified when waitlist spots open'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(['eventNotifications', key], e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Notifications */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Social Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.socialNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {key === 'newFollowers' && 'Get notified when someone follows you'}
                  {key === 'newMessages' && 'Get notified about new messages'}
                  {key === 'contactRequests' && 'Get notified about contact exchange requests'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(['socialNotifications', key], e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Marketing Emails */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Marketing Emails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.marketingEmails).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {key === 'newsletters' && 'Receive newsletters from event organizers'}
                  {key === 'promotions' && 'Receive promotional offers and discounts'}
                  {key === 'recommendations' && 'Receive event recommendations'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(['marketingEmails', key], e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}

