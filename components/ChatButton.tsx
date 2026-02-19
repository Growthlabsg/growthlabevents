'use client';

import { useState } from 'react';
import { ChatOverlay } from './ChatOverlay';

interface ChatButtonProps {
  currentEventId?: string;
  bottomOffset?: string; // For pages with mobile bottom nav
}

export function ChatButton({ currentEventId, bottomOffset }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Chat Button - mobile: above bottom nav, left of FAB (so it doesn't hide Me tab or profile). Desktop: bottom-right. */}
      <div
        className={`fixed z-[44] right-20 lg:right-4 ${
          bottomOffset
            ? bottomOffset
            : 'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+0.5rem)] lg:bottom-6'
        }`}
      >
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center justify-center text-slate-600 dark:text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 btn-elegant focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Open chats"
          title="Chats"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Chat Overlay */}
      <ChatOverlay 
        isOpen={isChatOpen} 
        onClose={() => {
          setIsChatOpen(false);
        }}
        currentEventId={currentEventId}
      />
    </>
  );
}

