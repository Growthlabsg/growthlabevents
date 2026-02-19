'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  type: 'event' | 'calendar' | 'user';
  title: string;
  subtitle?: string;
  url: string;
}

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Get recent searches from localStorage
const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save search to recent searches
const saveRecentSearch = (query: string) => {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(q => q.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore errors
  }
};

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results - in production, fetch from API
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'event' as const,
        title: 'AI Robotics Hackathon',
        subtitle: 'Tech Event • Tomorrow',
        url: '/events/1',
      },
      {
        id: '2',
        type: 'event' as const,
        title: 'Singapore AI Showcase',
        subtitle: 'Tech Event • Nov 20',
        url: '/events/2',
      },
      {
        id: '3',
        type: 'calendar' as const,
        title: 'GrowthLab Events',
        subtitle: 'Calendar • 129 subscribers',
        url: '/calendar/manage/1/events',
      },
      {
        id: '4',
        type: 'user' as const,
        title: 'John Doe',
        subtitle: 'User Profile',
        url: '/users/4',
      },
    ].filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
  };

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
      // Generate suggestions based on query
      if (query.trim()) {
        const recent = getRecentSearches();
        const filtered = recent.filter(q => 
          q.toLowerCase().includes(query.toLowerCase()) && 
          q.toLowerCase() !== query.toLowerCase()
        );
        setSuggestions(filtered.slice(0, 3));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowDown' && isOpen && results.length > 0) {
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (event.key === 'ArrowUp' && isOpen && results.length > 0) {
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (event.key === 'Enter' && query.trim()) {
        event.preventDefault();
        if (isOpen && results[selectedIndex]) {
          saveRecentSearch(query);
          router.push(results[selectedIndex].url);
        } else {
          saveRecentSearch(query);
          router.push(`/events/search?q=${encodeURIComponent(query)}`);
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex, router]);

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'event':
        return (
          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search events, calendars..."
          className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (query || results.length > 0 || suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
          {query ? (
            results.length === 0 ? (
              <div className="p-4">
                <div className="text-center text-slate-500 dark:text-slate-400 mb-2">
                  No results found
                </div>
                {suggestions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">Suggestions</p>
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(suggestion);
                          performSearch(suggestion);
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    saveRecentSearch(query);
                    router.push(`/events/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg"
                >
                  View all search results →
                </button>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      saveRecentSearch(query);
                      router.push(result.url);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-start gap-3 ${
                      index === selectedIndex ? 'bg-slate-50 dark:bg-slate-700' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setQuery(search);
                          performSearch(search);
                        }}
                        className="w-full px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {search}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = recentSearches.filter((_, i) => i !== idx);
                            setRecentSearches(updated);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['AI Events', 'Networking', 'Workshops', 'Hackathons'].map((popular) => (
                    <button
                      key={popular}
                      onClick={() => {
                        setQuery(popular);
                        performSearch(popular);
                      }}
                      className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

