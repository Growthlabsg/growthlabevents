'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Newsletter } from '@/lib/newsletters';

interface NewsletterEditorProps {
  calendarId: string;
  newsletterId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export function NewsletterEditor({ calendarId, newsletterId, onSave, onCancel }: NewsletterEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
  });
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'sent'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (newsletterId) {
      fetchNewsletter();
    }
  }, [newsletterId]);

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/newsletters?newsletterId=${newsletterId}`);
      const data = await response.json();
      if (data.success && data.data) {
        const newsletter = data.data;
        setFormData({
          title: newsletter.title || '',
          subject: newsletter.subject || '',
          content: newsletter.content || '',
        });
        setStatus(newsletter.status || 'draft');
        setScheduledAt(newsletter.scheduledAt || '');
      }
    } catch (error) {
      console.error('Failed to fetch newsletter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.subject || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const action = newsletterId ? 'update' : 'create';
      const response = await fetch('/api/newsletters', {
        method: action === 'create' ? 'POST' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          ...(newsletterId && { newsletterId }),
          calendarId,
          title: formData.title,
          subject: formData.subject,
          content: formData.content,
          status: status === 'scheduled' ? 'scheduled' : 'draft',
          scheduledAt: status === 'scheduled' && scheduledAt ? scheduledAt : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (onSave) {
          onSave();
        } else {
          alert('Newsletter saved successfully');
        }
      } else {
        alert('Failed to save newsletter: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save newsletter:', error);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!newsletterId) {
      alert('Please save the newsletter first');
      return;
    }

    if (!confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          newsletterId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('sent');
        alert(`Newsletter sent successfully to ${data.data.recipientCount} subscribers`);
        if (onSave) {
          onSave();
        }
      } else {
        alert('Failed to send newsletter: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to send newsletter:', error);
      alert('An error occurred while sending');
    } finally {
      setSending(false);
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
        <CardTitle>{newsletterId ? 'Edit Newsletter' : 'Create Newsletter'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Newsletter Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Monthly Event Updates"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Check out our upcoming events!"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Content *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={12}
            placeholder="Write your newsletter content here..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You can use HTML for formatting
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'scheduled' | 'sent')}
              disabled={status === 'sent'}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              {status === 'sent' && <option value="sent">Sent</option>}
            </select>
          </div>

          {status === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!formData.title || !formData.subject || !formData.content || saving}
            className="flex-1 sm:flex-none"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          {newsletterId && status !== 'sent' && (
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || !formData.title || !formData.subject || !formData.content}
              className="flex-1 sm:flex-none"
            >
              {sending ? 'Sending...' : 'Send Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

