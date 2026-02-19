'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';
import { sanitizeInput, validateLength } from '@/lib/security';

interface Category {
  name: string;
  count: number;
  icon: string;
  iconColor: string;
  slug: string;
}

interface FeaturedCalendar {
  id: string;
  name: string;
  description: string;
  location?: string;
  icon: string;
  iconBg: string;
  subscribers: number;
  subscribed?: boolean;
}

interface PopularEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  organizer: string;
  imageColor: string;
  imageText?: string;
  registeredCount: number;
  price: string;
}

const popularEvents: PopularEvent[] = [
  {
    id: '1',
    title: 'Tune Into Your Voice, Connect Within And Beyond',
    date: 'Tomorrow',
    time: '7:30 pm',
    organizer: 'Live Your Mark',
    imageColor: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    registeredCount: 45,
    price: 'Free',
  },
  {
    id: '2',
    title: 'KAMPUNG SPIRIT : BACE',
    date: 'Thu, 20 Nov',
    time: '5:30 pm',
    location: '67 Ayer Rajah Crescent',
    organizer: 'BACE',
    imageColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
    imageText: 'KAMPUNG SPIRIT',
    registeredCount: 32,
    price: 'Free',
  },
  {
    id: '3',
    title: 'Build Club Singapore: AI × Marketing – Building Go-To-Market Systems',
    date: 'Thu, 20 Nov',
    time: '6:30 pm',
    organizer: 'Build Club',
    imageColor: 'bg-gradient-to-br from-red-500 to-rose-600',
    imageText: 'AI × Marketing',
    registeredCount: 89,
    price: 'Free',
  },
  {
    id: '4',
    title: 'Explore Maps & Location',
    date: 'Thu, 20 Nov',
    time: '6:30 pm',
    location: '1 Fusionopolis Walk',
    organizer: 'Tech Community',
    imageColor: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600',
    imageText: 'Swift',
    registeredCount: 12,
    price: 'Free',
  },
  {
    id: '5',
    title: 'KIDPRENEURS KOLLEKTIVE : A Family Christmas Market',
    date: 'Sat, 29 Nov',
    time: '11:00 am',
    location: 'Guoco Midtown',
    organizer: 'Kidpreneurs',
    imageColor: 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-600',
    imageText: 'christmas party.',
    registeredCount: 156,
    price: 'Free',
  },
];

const categories: Category[] = [
  { name: 'Tech', count: 3000, icon: 'dots', iconColor: 'bg-gradient-to-br from-yellow-400 to-amber-500', slug: 'tech' },
  { name: 'Food & Drink', count: 19, icon: 'bowl', iconColor: 'bg-gradient-to-br from-orange-400 to-orange-600', slug: 'food-drink' },
  { name: 'AI', count: 2000, icon: 'brain', iconColor: 'bg-gradient-to-br from-pink-500 to-rose-600', slug: 'ai' },
  { name: 'Arts & Culture', count: 1000, icon: 'palette', iconColor: 'bg-gradient-to-br from-green-400 to-emerald-600', slug: 'arts-culture' },
  { name: 'Climate', count: 525, icon: 'globe', iconColor: 'bg-gradient-to-br from-teal-400 to-cyan-600', slug: 'climate' },
  { name: 'Fitness', count: 814, icon: 'running', iconColor: 'bg-gradient-to-br from-orange-500 to-red-600', slug: 'fitness' },
  { name: 'Wellness', count: 1000, icon: 'lotus', iconColor: 'bg-gradient-to-br from-blue-400 to-indigo-600', slug: 'wellness' },
  { name: 'Crypto', count: 1000, icon: 'bitcoin', iconColor: 'bg-gradient-to-br from-purple-500 to-violet-600', slug: 'crypto' },
];

const featuredCalendars: FeaturedCalendar[] = [
  {
    id: '1',
    name: 'Reading Rhythms Global',
    description: 'Not a book club. A reading party. Read with friends to live music & curated playlists!',
    icon: 'circles',
    iconBg: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    subscribers: 12450,
    subscribed: false,
  },
  {
    id: '2',
    name: 'Build Club',
    description: 'Sydney · The best place in the world to learn AI. Curated with 💜 by the Build Club team',
    location: 'Sydney',
    icon: 'build',
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
    subscribers: 8900,
    subscribed: false,
  },
  {
    id: '3',
    name: 'South Park Commons',
    description: 'South Park Commons helps you get from -1 to 0. To learn more or apply, visit southparkcommons.com.',
    icon: 'mountain',
    iconBg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    subscribers: 5600,
    subscribed: false,
  },
  {
    id: '4',
    name: 'Design Buddies',
    description: 'Events for designers and all creatives across SF, online, and the world! Hosted curated by Design Buddies, the world\'s largest design community (https://designbuddies.community). Founded by Grace Ling',
    icon: 'bunny',
    iconBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
    subscribers: 23400,
    subscribed: true,
  },
  {
    id: '5',
    name: 'ADPList',
    description: 'Your favorite all-things happening at ADPList! We feature local meetups, ADPList chapter events, and official events from ADPList HQ.',
    icon: 'smiley',
    iconBg: 'bg-gradient-to-br from-slate-900 to-black',
    subscribers: 18900,
    subscribed: false,
  },
  {
    id: '6',
    name: 'Cursor Community',
    description: 'Cursor community meetups, hackathons, workshops taking place around the world. Learn more here: cursor.com/community',
    icon: 'geometric',
    iconBg: 'bg-gradient-to-br from-slate-700 to-slate-800',
    subscribers: 11200,
    subscribed: false,
  },
  {
    id: '7',
    name: 'The AI Collective',
    description: 'The world\'s largest AI community: 100,000+ pioneers – founders, researchers, operators, & investors – exploring the technological frontier. We are the human side of AI.',
    icon: 'ai',
    iconBg: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600',
    subscribers: 45600,
    subscribed: false,
  },
];

const CategoryIcon = ({ icon, color }: { icon: string; color: string }) => {
  const iconClass = `w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`;
  
  switch (icon) {
    case 'dots':
      return (
        <div className={iconClass}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      );
    case 'bowl':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M8 10h8v2H8z"/>
          </svg>
        </div>
      );
    case 'brain':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M9 10h6v4H9z"/>
          </svg>
        </div>
      );
    case 'palette':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5 11 5.67 11 6.5 10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5 16 5.67 16 6.5 15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9 19 9.67 19 10.5 18.33 12 17.5 12z"/>
          </svg>
        </div>
      );
    case 'globe':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
      );
    case 'running':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .5-2.1c1.1 0 2.1-.4 2.8-1.1l1.4-1.4c-.6-.6-1.4-1.1-2.3-1.3l-.5-.1c-.3-.1-.6-.1-.9-.1l-2.1.1c-.4 0-.7.1-1 .3l-1.4.9c-.5.3-.8.8-.8 1.4v4.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-2.1l1.1 1.1-1.1 4.9z"/>
          </svg>
        </div>
      );
    case 'lotus':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </div>
      );
    case 'bitcoin':
      return (
        <div className={iconClass}>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-2.61 0-1.83-.81-2.58-2.35-2.58l-2.22-.03V8.05l2.32-.03c1.64 0 2.27-.72 2.27-2.21 0-1.63-.83-2.13-2.12-2.13-1.9 0-2.48 1.07-2.6 1.97H6.91c.15-2.15 1.66-3.95 4.24-4.22V2h2.67v1.95c1.86.24 3.15 1.4 3.4 3.24h-1.98c-.26-1.05-1.14-1.86-2.42-1.86-1.76 0-2.4 1.02-2.4 2.1 0 1.4.88 2.06 2.17 2.06l1.62.03v3.86l-1.58.04c-1.9 0-2.48 1.11-2.48 2.4 0 1.56.99 2.13 2.38 2.13z"/>
          </svg>
        </div>
      );
    default:
      return <div className={iconClass}></div>;
  }
};

const CalendarIcon = ({ icon, bg }: { icon: string; bg: string }) => {
  const iconClass = `w-16 h-16 ${bg} rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg`;
  
  switch (icon) {
    case 'circles':
      return (
        <div className={iconClass}>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
          </div>
        </div>
      );
    case 'build':
      return (
        <div className={iconClass}>
          <div className="text-white font-bold text-xs text-center px-2 leading-tight">
            000<br />BUILD<br />CLUB
          </div>
        </div>
      );
    case 'mountain':
      return (
        <div className={iconClass}>
          <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 3.84L18.5 20h-13L12 5.84z"/>
          </svg>
        </div>
      );
    case 'bunny':
      return (
        <div className={iconClass}>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="w-7 h-7 bg-pink-500 rounded-full"></div>
          </div>
        </div>
      );
    case 'smiley':
      return (
        <div className={iconClass}>
          <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S6 13.17 6 14s.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      );
    case 'geometric':
      return (
        <div className={iconClass}>
          <div className="w-9 h-9 border-3 border-white rotate-45"></div>
        </div>
      );
    case 'ai':
      return (
        <div className={iconClass}>
          <div className="text-white font-bold text-xl">AI</div>
        </div>
      );
    default:
      return <div className={iconClass}></div>;
  }
};

export default function DiscoverPage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState('Asia & Pacific');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subscribedCalendars, setSubscribedCalendars] = useState<Set<string>>(
    new Set(featuredCalendars.filter(c => c.subscribed).map(c => c.id))
  );

  const regions = ['Asia & Pacific', 'Africa', 'Europe', 'North America', 'South America'];

  const cities = {
    'Asia & Pacific': [
      { name: 'Bangkok', events: 11, icon: 'temple', iconColor: 'bg-gradient-to-br from-orange-400 to-orange-600', subscribed: false },
      { name: 'Bengaluru', events: 17, icon: 'temple', iconColor: 'bg-gradient-to-br from-yellow-400 to-amber-500', subscribed: false },
      { name: 'Brisbane', events: 4, icon: 'bridge', iconColor: 'bg-gradient-to-br from-blue-400 to-blue-600', subscribed: false },
      { name: 'Dubai', events: 5, icon: 'skyscraper', iconColor: 'bg-gradient-to-br from-purple-400 to-purple-600', subscribed: false },
      { name: 'Ho Chi Minh City', events: 3, icon: 'building', iconColor: 'bg-gradient-to-br from-red-400 to-red-600', subscribed: false },
      { name: 'Hong Kong', events: 5, icon: 'flower', iconColor: 'bg-gradient-to-br from-blue-300 to-blue-500', subscribed: false },
      { name: 'Honolulu', events: 1, icon: 'rainbow', iconColor: 'bg-gradient-to-br from-blue-400 to-cyan-500', subscribed: false },
      { name: 'Jakarta', events: 4, icon: 'monument', iconColor: 'bg-gradient-to-br from-amber-600 to-amber-700', subscribed: false },
      { name: 'Kuala Lumpur', events: 4, icon: 'building', iconColor: 'bg-gradient-to-br from-purple-400 to-purple-600', subscribed: false },
      { name: 'Manila', events: 2, icon: 'building', iconColor: 'bg-gradient-to-br from-blue-300 to-blue-500', subscribed: false },
      { name: 'Melbourne', events: 8, icon: 'building', iconColor: 'bg-gradient-to-br from-green-400 to-green-600', subscribed: false },
      { name: 'Mumbai', events: 5, icon: 'building', iconColor: 'bg-gradient-to-br from-orange-400 to-orange-600', subscribed: false },
      { name: 'New Delhi', events: 5, icon: 'building', iconColor: 'bg-gradient-to-br from-red-400 to-red-600', subscribed: false },
      { name: 'Seoul', events: 3, icon: 'traditional', iconColor: 'bg-gradient-to-br from-blue-400 to-blue-600', subscribed: false },
      { name: 'Singapore', events: 0, icon: 'leaf', iconColor: 'bg-gradient-to-br from-green-400 to-emerald-600', subscribed: true },
      { name: 'Sydney', events: 21, icon: 'opera', iconColor: 'bg-gradient-to-br from-yellow-400 to-amber-500', subscribed: false },
      { name: 'Taipei', events: 10, icon: 'building', iconColor: 'bg-gradient-to-br from-purple-400 to-purple-600', subscribed: false },
      { name: 'Tel Aviv-Yafo', events: 9, icon: 'building', iconColor: 'bg-gradient-to-br from-orange-400 to-orange-600', subscribed: false },
      { name: 'Tokyo', events: 16, icon: 'building', iconColor: 'bg-gradient-to-br from-pink-400 to-pink-600', subscribed: false },
    ],
    'Africa': [],
    'Europe': [],
    'North America': [],
    'South America': [],
  };

  // Filter popular events based on search
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return popularEvents;
    
    const query = searchQuery.toLowerCase();
    return popularEvents.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.organizer.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    if (validateLength(sanitized, 0, 100)) {
      setSearchQuery(sanitized);
    }
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/events/category/${category.slug}`);
  };

  const handleCalendarSubscribe = (calendarId: string) => {
    setSubscribedCalendars(prev => {
      const newSet = new Set(prev);
      if (newSet.has(calendarId)) {
        newSet.delete(calendarId);
      } else {
        newSet.add(calendarId);
      }
      return newSet;
    });
  };

  const handleCityClick = (cityName: string) => {
    router.push(`/events?location=${encodeURIComponent(cityName)}`);
  };

  const handleViewAllEvents = () => {
    router.push('/events');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          <div className="container-elegant relative py-12 sm:py-16 lg:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
                Discover Amazing Events
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Explore popular events, browse by category, or discover community calendars from around the world
              </p>

              {/* Enhanced Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search events, organizers, locations..."
                    maxLength={100}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-lg hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Popular Events Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Popular Events
                </h2>
                <span className="px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full shadow-sm">
                  Singapore
                </span>
                {searchQuery && (
                  <span className="px-4 py-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 rounded-full shadow-sm">
                    {filteredEvents.length} results
                  </span>
                )}
              </div>
              <button 
                onClick={handleViewAllEvents}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold text-sm flex items-center gap-2 transition-all duration-200 hover:gap-3 group"
              >
                View All
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  No events found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your search query
                </p>
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl card-elegant transform hover:-translate-y-1">
                      {/* Event Image */}
                      <div className={`aspect-video ${event.imageColor} flex items-center justify-center relative overflow-hidden`}>
                        {event.imageText ? (
                          <div className="text-white font-bold text-xl p-6 text-center drop-shadow-lg">
                            {event.imageText}
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30"></div>
                        )}
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl text-xs font-bold text-slate-900 dark:text-white shadow-lg">
                          {event.price}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      
                      {/* Event Details */}
                      <div className="p-5 sm:p-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">{event.date}, {event.time}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{event.organizer}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{event.registeredCount} going</span>
                          </div>
                          <Button variant="outline" size="sm" className="hover:bg-teal-50 dark:hover:bg-teal-900/20 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Browse by Category Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Browse by Category
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Find events that match your interests
                </p>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filter
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category)}
                  className={`p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-300 text-left group card-elegant transform hover:-translate-y-1 hover:shadow-xl ${
                    selectedCategory === category.slug
                      ? 'border-teal-500 dark:border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg'
                      : 'border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 shadow-md hover:shadow-xl'
                  }`}
                >
                  <CategoryIcon icon={category.icon} color={category.iconColor} />
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-4 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {category.count >= 1000 
                      ? `${(category.count / 1000).toFixed(1)}K Events`
                      : `${category.count} Events`}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Featured Calendars Section */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Featured Calendars
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Discover amazing communities and their events
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredCalendars.map((calendar) => {
                const isSubscribed = subscribedCalendars.has(calendar.id);
                return (
                  <div
                    key={calendar.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6 sm:p-7 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 card-elegant shadow-md hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-5 mb-5">
                      <CalendarIcon icon={calendar.icon} bg={calendar.iconBg} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1.5">
                          {calendar.name}
                        </h3>
                        {calendar.location && (
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            {calendar.location}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">
                          {calendar.subscribers.toLocaleString()} subscribers
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed">
                      {calendar.description}
                    </p>
                    <Button 
                      variant={isSubscribed ? "primary" : "outline"}
                      size="sm" 
                      className={`w-full font-semibold transition-all duration-200 ${
                        isSubscribed 
                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-md hover:shadow-lg' 
                          : 'border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-600'
                      }`}
                      onClick={() => handleCalendarSubscribe(calendar.id)}
                    >
                      {isSubscribed ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Subscribed
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Explore Local Events Section */}
          <section className="mb-12 sm:mb-16">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Explore Local Events
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Find events in cities around the world
              </p>
            </div>
            
            {/* Region Filters */}
            <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm ${
                    selectedRegion === region
                      ? 'bg-teal-500 text-white shadow-md hover:shadow-lg'
                      : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Cities Grid */}
            {cities[selectedRegion as keyof typeof cities]?.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  No cities available
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Check back later for events in this region
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {cities[selectedRegion as keyof typeof cities]?.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city.name)}
                    className="p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 text-left group card-elegant shadow-md hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 ${city.iconColor} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {city.subscribed ? (
                        <span className="text-teal-600 dark:text-teal-400 font-semibold">Subscribed</span>
                      ) : (
                        `${city.events} ${city.events === 1 ? 'Event' : 'Events'}`
                      )}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Chat Button */}
      <ChatButton bottomOffset="bottom-24 lg:bottom-6" />
      
      {/* Spacer for mobile floating menu */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
