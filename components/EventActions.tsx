'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { shareEvent, shareToTwitter, shareToFacebook, shareToLinkedIn, copyEventLink } from '@/lib/eventSharing';
import { isEventSaved, saveEvent, unsaveEvent } from '@/lib/savedEvents';
import { ReportEventModal } from './ReportEventModal';

interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  onReport?: () => void;
}

export function EventActions({ eventId, eventTitle, eventDescription, onReport }: EventActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    // Check if event is saved
    const checkSaved = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/save`);
        const data = await response.json();
        if (data.success) {
          setIsSaved(data.data.saved);
        }
      } catch (error) {
        console.error('Failed to check saved status:', error);
      }
    };
    checkSaved();
  }, [eventId]);

  // Close share menu when clicking outside
  useEffect(() => {
    if (!showShareMenu) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const handleSave = async () => {
    try {
      const action = isSaved ? 'unsave' : 'save';
      const response = await fetch(`/api/events/${eventId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (data.success) {
        setIsSaved(data.data.saved);
        if (isSaved) {
          unsaveEvent(eventId);
        } else {
          saveEvent(eventId);
        }
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleShare = () => {
    shareEvent(eventId, eventTitle, eventDescription);
  };

  const handleCopyLink = async () => {
    try {
      await copyEventLink(eventId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Save/Bookmark Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        className="hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
      >
        {isSaved ? (
          <>
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="whitespace-nowrap">Saved</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="whitespace-nowrap">Save</span>
          </>
        )}
      </Button>

      {/* Share Button */}
      <div className="relative share-menu-container">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="hover:bg-teal-50 dark:hover:bg-teal-900/20 flex items-center"
        >
          <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="whitespace-nowrap">Share</span>
        </Button>

        {showShareMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg z-50">
            <div className="p-2">
              <button
                onClick={() => {
                  handleShare();
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                Share via...
              </button>
              <button
                onClick={() => {
                  shareToTwitter(eventId, eventTitle);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                Twitter
              </button>
              <button
                onClick={() => {
                  shareToFacebook(eventId);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                Facebook
              </button>
              <button
                onClick={() => {
                  shareToLinkedIn(eventId, eventTitle, eventDescription);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                LinkedIn
              </button>
              <button
                onClick={() => {
                  handleCopyLink();
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowReportModal(true)}
        className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 flex items-center"
      >
        <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="whitespace-nowrap">Report</span>
      </Button>

      {/* Report Modal */}
      <ReportEventModal
        eventId={eventId}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}
