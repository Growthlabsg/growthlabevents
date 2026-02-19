'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Chat {
  id: string;
  name: string;
  type: 'event' | 'group' | 'direct';
  avatar?: string;
  icon?: string;
  iconBg?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread?: number;
  eventId?: string;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentEventId?: string;
}

export function ChatOverlay({ isOpen, onClose, currentEventId }: ChatOverlayProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mock chat data - in production, fetch from API
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        name: 'OS',
        type: 'direct',
        icon: 'dot',
        iconBg: 'bg-pink-500',
        lastMessage: 'sure',
        lastMessageTime: '7d',
      },
      {
        id: '2',
        name: 'AI Builders',
        type: 'group',
        icon: 'ai',
        iconBg: 'bg-black',
        lastMessage: 'I have around 2000+ startups i...',
        lastMessageTime: '10d',
      },
      {
        id: '3',
        name: 'ROOFTOP SUNSET MIXER – St...',
        type: 'event',
        eventId: 'event-1',
        avatar: '/event-thumbnails/startup-surge.jpg',
        lastMessage: 'https://linktr.ee/GrowthLab.sg',
        lastMessageTime: '13d',
      },
      {
        id: '4',
        name: 'Manus AI',
        type: 'direct',
        icon: 'm',
        iconBg: 'bg-white border border-slate-300',
        lastMessage: 'Heyy',
        lastMessageTime: '129d',
      },
      {
        id: '5',
        name: 'Alan Chan',
        type: 'direct',
        avatar: '/avatars/alan.jpg',
        lastMessage: 'Hey hey',
        lastMessageTime: '129d',
      },
      {
        id: '6',
        name: 'Xin Yi Yap',
        type: 'direct',
        avatar: '/avatars/xinyi.jpg',
        lastMessage: 'If we wanna demo our produc....',
        lastMessageTime: '140d',
      },
      {
        id: '7',
        name: 'Sweat Equity: Where Deals Hap...',
        type: 'event',
        eventId: 'event-2',
        avatar: '/event-thumbnails/sweat-equity.jpg',
        lastMessage: 'Or call me if you are not sure ...',
        lastMessageTime: '161d',
      },
    ];

    // If viewing a specific event, prioritize that event's chat
    if (currentEventId) {
      // Remove existing chat for this event if it exists
      const filteredChats = mockChats.filter(c => c.eventId !== currentEventId);
      
      // Add event chat to the top
      filteredChats.unshift({
        id: `event-${currentEventId}`,
        name: 'Event Chat',
        type: 'event',
        eventId: currentEventId,
        lastMessage: 'Welcome to the event chat!',
        lastMessageTime: 'now',
      });
      
      setChats(filteredChats);
    } else {
      setChats(mockChats);
    }
  }, [currentEventId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Chat Overlay */}
      <div className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Chats</h2>
            <button
              onClick={() => {
                // Minimize to bottom right
                onClose();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
              aria-label="Minimize"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            aria-label="Close"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400">No chats yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat.id);
                    // In production, navigate to chat detail or open chat window
                  }}
                  className="w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left flex items-start gap-3 group"
                >
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0 relative">
                    {chat.avatar ? (
                      <img 
                        src={chat.avatar} 
                        alt={chat.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        chat.icon === 'm' ? 'text-black bg-white border border-slate-300' : 'text-white'
                      } ${chat.iconBg || 'bg-gradient-to-br from-teal-400 to-amber-400'} ${chat.avatar ? 'hidden' : ''}`}
                    >
                      {chat.icon === 'dot' ? (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      ) : chat.icon === 'ai' ? (
                        <span className="text-xs font-bold">AI</span>
                      ) : chat.icon === 'm' ? (
                        <span className="text-xs font-bold">M</span>
                      ) : (
                        <span className="text-sm font-semibold">
                          {chat.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {chat.type === 'event' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-500 ml-2 flex-shrink-0">
                        {chat.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer - New Chat Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>
      </div>
    </>
  );
}

