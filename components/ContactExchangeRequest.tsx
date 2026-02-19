'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ContactExchangeRequestProps {
  userId: string;
  targetUserId: string;
  eventId?: string;
  onRequestSent?: () => void;
}

export function ContactExchangeRequest({ userId, targetUserId, eventId, onRequestSent }: ContactExchangeRequestProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/networking/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          fromUserId: userId,
          toUserId: targetUserId,
          eventId,
          message: message.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        setMessage('');
        if (onRequestSent) {
          onRequestSent();
        }
      } else {
        setError(data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Failed to send contact request:', error);
      setError('An error occurred while sending the request');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            Contact exchange request sent!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Send a message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError('');
          }}
          rows={3}
          placeholder="Hi! I'd like to connect with you..."
          maxLength={500}
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {message.length}/500 characters
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleSend}
        disabled={sending}
        className="w-full"
      >
        {sending ? 'Sending...' : 'Request Contact Exchange'}
      </Button>
    </div>
  );
}

