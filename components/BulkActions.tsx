'use client';

import { useState } from 'react';
import { Button } from './ui/Button';

interface BulkActionsProps {
  selectedCount: number;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onBulkDelete?: () => void;
  onBulkExport?: () => void;
  onBulkArchive?: () => void;
}

export function BulkActions({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onBulkDelete,
  onBulkExport,
  onBulkArchive,
}: BulkActionsProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl px-4 py-3 flex items-center gap-4">
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {selectedCount} selected
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="text-xs"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkArchive}
            className="text-xs"
          >
            Archive
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="text-xs border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </Button>
            {showMenu && (
              <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg p-2 min-w-[200px]">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 px-2">
                  Delete {selectedCount} items?
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMenu(false)}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onBulkDelete?.();
                      setShowMenu(false);
                    }}
                    className="flex-1 text-xs bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onDeselectAll}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            title="Deselect all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

