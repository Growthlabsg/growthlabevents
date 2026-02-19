'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DiscountCodeInputProps {
  eventId: string;
  amount: number;
  onDiscountApplied: (discountAmount: number, finalAmount: number, code: string) => void;
  onError: (message: string) => void;
}

export function DiscountCodeInput({ eventId, amount, onDiscountApplied, onError }: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [applied, setApplied] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  const handleValidate = async () => {
    if (!code.trim()) {
      onError('Please enter a discount code');
      return;
    }

    setValidating(true);
    try {
      const response = await fetch(
        `/api/payments/discount?code=${encodeURIComponent(code)}&eventId=${eventId}&amount=${amount}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setApplied(true);
        setDiscountInfo({
          code: code.toUpperCase(),
          discountAmount: data.data.discountAmount,
          finalAmount: data.data.finalAmount,
        });
        onDiscountApplied(data.data.discountAmount, data.data.finalAmount, code.toUpperCase());
      } else {
        onError(data.message || 'Invalid discount code');
        setCode('');
      }
    } catch (error) {
      console.error('Failed to validate discount code:', error);
      onError('An error occurred while validating the code');
    } finally {
      setValidating(false);
    }
  };

  const handleRemove = () => {
    setApplied(false);
    setCode('');
    setDiscountInfo(null);
    onDiscountApplied(0, amount, '');
  };

  if (applied && discountInfo) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Discount Applied: <span className="font-mono">{discountInfo.code}</span>
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
              You saved ${discountInfo.discountAmount.toFixed(2)}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="border-green-500 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Have a discount code?
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
          placeholder="Enter code"
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Button
          variant="outline"
          onClick={handleValidate}
          disabled={!code.trim() || validating}
          className="flex-shrink-0"
        >
          {validating ? '...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}

