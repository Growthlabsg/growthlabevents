'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Payment, Refund } from '@/lib/payments';

interface RefundManagementProps {
  eventId: string;
}

export function RefundManagement({ eventId }: RefundManagementProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [refundForm, setRefundForm] = useState({
    amount: '',
    reason: '',
  });
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      const [paymentsRes, refundsRes] = await Promise.all([
        fetch(`/api/payments?eventId=${eventId}`),
        fetch(`/api/payments/refund?eventId=${eventId}`),
      ]);

      const paymentsData = await paymentsRes.json();
      const refundsData = await refundsRes.json();

      if (paymentsData.success) {
        setPayments(paymentsData.data || []);
      }
      if (refundsData.success) {
        setRefunds(refundsData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefund = async (paymentId: string) => {
    if (!refundForm.amount || !refundForm.reason.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(refundForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setProcessing(paymentId);
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          paymentId,
          amount,
          reason: refundForm.reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setSelectedPayment(null);
        setRefundForm({ amount: '', reason: '' });
        alert('Refund requested successfully');
      } else {
        alert('Failed to request refund: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to request refund:', error);
      alert('An error occurred');
    } finally {
      setProcessing(null);
    }
  };

  const handleProcessRefund = async (refundId: string) => {
    if (!confirm('Are you sure you want to process this refund?')) return;

    setProcessing(refundId);
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process',
          refundId,
          processedBy: 'admin', // In production, use actual admin user ID
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Refund processed successfully');
      } else {
        alert('Failed to process refund: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to process refund:', error);
      alert('An error occurred');
    } finally {
      setProcessing(null);
    }
  };

  const getPaymentRefunds = (paymentId: string): Refund[] => {
    return refunds.filter(r => r.paymentId === paymentId);
  };

  const getTotalRefunded = (paymentId: string): number => {
    return getPaymentRefunds(paymentId)
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const getRefundableAmount = (payment: Payment): number => {
    const totalRefunded = getTotalRefunded(payment.id);
    return payment.finalAmount - totalRefunded;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const completedPayments = payments.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Refund Management</CardTitle>
        </CardHeader>
        <CardContent>
          {completedPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No completed payments to refund</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedPayments.map((payment) => {
                const paymentRefunds = getPaymentRefunds(payment.id);
                const totalRefunded = getTotalRefunded(payment.id);
                const refundableAmount = getRefundableAmount(payment);
                const isSelected = selectedPayment === payment.id;

                return (
                  <div
                    key={payment.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            Payment #{payment.id.slice(-8)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'refunded'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                : payment.status === 'partially_refunded'
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            }`}
                          >
                            {payment.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <p>Amount: ${payment.finalAmount.toFixed(2)}</p>
                          {totalRefunded > 0 && (
                            <p>Refunded: ${totalRefunded.toFixed(2)}</p>
                          )}
                          <p>Refundable: ${refundableAmount.toFixed(2)}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {new Date(payment.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      {refundableAmount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPayment(isSelected ? null : payment.id)}
                          className="flex-shrink-0"
                        >
                          {isSelected ? 'Cancel' : 'Request Refund'}
                        </Button>
                      )}
                    </div>

                    {/* Refund Form */}
                    {isSelected && refundableAmount > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Refund Amount (Max: ${refundableAmount.toFixed(2)})
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            max={refundableAmount}
                            step="0.01"
                            value={refundForm.amount}
                            onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Reason *
                          </label>
                          <textarea
                            value={refundForm.reason}
                            onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                            rows={3}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            placeholder="Reason for refund..."
                            required
                          />
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => handleRequestRefund(payment.id)}
                          disabled={!refundForm.amount || !refundForm.reason.trim() || processing === payment.id}
                          className="w-full sm:w-auto"
                        >
                          {processing === payment.id ? 'Processing...' : 'Request Refund'}
                        </Button>
                      </div>
                    )}

                    {/* Refund History */}
                    {paymentRefunds.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          Refund History
                        </h4>
                        <div className="space-y-2">
                          {paymentRefunds.map((refund) => (
                            <div
                              key={refund.id}
                              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-900 dark:text-white">
                                      ${refund.amount.toFixed(2)}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        refund.status === 'completed'
                                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                          : refund.status === 'failed'
                                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                      }`}
                                    >
                                      {refund.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                    {refund.reason}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    Requested: {new Date(refund.requestedAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    {refund.processedAt && (
                                      <> • Processed: {new Date(refund.processedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                      })}</>
                                    )}
                                  </p>
                                </div>
                                {refund.status === 'pending' && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleProcessRefund(refund.id)}
                                    disabled={processing === refund.id}
                                    className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    {processing === refund.id ? 'Processing...' : 'Process'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

