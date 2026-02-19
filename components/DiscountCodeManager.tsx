'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DiscountCode } from '@/lib/payments';

interface DiscountCodeManagerProps {
  eventId?: string;
  calendarId?: string;
}

export function DiscountCodeManager({ eventId, calendarId }: DiscountCodeManagerProps) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    maxUses: '',
    validFrom: '',
    validUntil: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDiscountCodes();
  }, [eventId, calendarId]);

  const fetchDiscountCodes = async () => {
    try {
      const params = new URLSearchParams();
      if (eventId) params.append('eventId', eventId);
      if (calendarId) params.append('calendarId', calendarId);

      const response = await fetch(`/api/payments/discount?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setDiscountCodes(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch discount codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/payments/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          code: formData.code.toUpperCase(),
          type: formData.type,
          value: formData.value,
          eventId,
          calendarId,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
          validFrom: formData.validFrom || undefined,
          validUntil: formData.validUntil || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchDiscountCodes();
        setShowCreateForm(false);
        setFormData({
          code: '',
          type: 'percentage',
          value: 10,
          maxUses: '',
          validFrom: '',
          validUntil: '',
        });
      } else {
        alert('Failed to create discount code: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to create discount code:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (code: DiscountCode) => {
    const now = new Date();
    const validFrom = new Date(code.validFrom);
    const validUntil = new Date(code.validUntil);

    if (!code.isActive) {
      return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">Inactive</span>;
    }

    if (now < validFrom) {
      return <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">Upcoming</span>;
    }

    if (now > validUntil) {
      return <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">Expired</span>;
    }

    if (code.maxUses && code.usedCount >= code.maxUses) {
      return <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">Max Uses Reached</span>;
    }

    return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">Active</span>;
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
        <div className="flex items-center justify-between">
          <CardTitle>Discount Codes</CardTitle>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create Code'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Value *
                </label>
                <input
                  type="number"
                  min="0"
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formData.type === 'percentage' ? '% off' : 'amount off'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max Uses (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  placeholder="Unlimited"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Valid From (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Valid Until (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.code || saving}
              className="w-full sm:w-auto"
            >
              {saving ? 'Creating...' : 'Create Discount Code'}
            </Button>
          </form>
        )}

        {/* Discount Codes List */}
        {discountCodes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">No discount codes created yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {discountCodes.map((code) => (
              <div
                key={code.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                        {code.code}
                      </span>
                      {getStatusBadge(code)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>
                        {code.type === 'percentage' ? `${code.value}%` : `$${code.value.toFixed(2)}`} off
                      </span>
                      {code.maxUses && (
                        <span>
                          {code.usedCount} / {code.maxUses} uses
                        </span>
                      )}
                      {!code.maxUses && code.usedCount > 0 && (
                        <span>{code.usedCount} uses</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      Valid: {new Date(code.validFrom).toLocaleDateString()} - {new Date(code.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

