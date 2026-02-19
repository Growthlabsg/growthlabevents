'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { sanitizeInput, validateLength } from '@/lib/security';

interface CreateCalendarModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCalendarModal({ onClose, onSuccess }: CreateCalendarModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!validateLength(formData.name, 1, 100)) {
      newErrors.name = 'Calendar name must be between 1 and 100 characters';
    }
    
    if (formData.description && !validateLength(formData.description, 0, 500)) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      description: formData.description ? sanitizeInput(formData.description) : '',
      visibility: formData.visibility,
    };
    
    // TODO: Call API to create calendar
    console.log('Creating calendar:', sanitizedData);
    
    // Simulate success
    setTimeout(() => {
      onSuccess();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Calendar
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Calendar Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="e.g., GrowthLab Events"
              maxLength={100}
              className={`w-full bg-white dark:bg-slate-700 border rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'
              }`}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              placeholder="Tell people what your calendar is about..."
              rows={4}
              maxLength={500}
              className={`w-full bg-white dark:bg-slate-700 border rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
              className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="public">Public - Anyone can discover and subscribe</option>
              <option value="private">Private - Only people with the link can access</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 btn-elegant"
            >
              Create Calendar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

