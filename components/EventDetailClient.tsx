'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EventActions } from '@/components/EventActions';
import { EventLocationMap } from '@/components/EventLocationMap';
import { Event } from '@/types/event';

interface EventDetailClientProps {
  event: Event;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  return (
    <>
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl mb-2 dark:text-white break-words">{event.title}</CardTitle>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">by {event.organizer.name}</p>
            </div>
            <span className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium whitespace-nowrap flex-shrink-0 ${
              event.status === 'upcoming' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
              event.status === 'live' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {event.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start sm:items-center text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-teal-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-base sm:text-lg">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-0.5">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-start sm:items-center text-slate-700 dark:text-slate-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 sm:mr-4 text-teal-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-base sm:text-lg">{event.location}</p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 capitalize mt-0.5">{event.locationType} event</p>
              </div>
            </div>

            {/* Location Map */}
            {event.locationType === 'physical' || event.locationType === 'hybrid' ? (
              <div className="pt-2">
                <EventLocationMap location={event.location} locationType={event.locationType} />
              </div>
            ) : null}

            {/* Registration Questions */}
            {event.registrationQuestions && event.registrationQuestions.length > 0 && (
              <div className="pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-white mb-3">
                  Registration Information Required
                </h3>
                <div className="space-y-3">
                  {event.registrationQuestions.map((question, index) => (
                    <div key={question.id || index} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {question.label}
                        </span>
                        {question.required && (
                          <span className="text-xs text-red-600 dark:text-red-400">*</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">
                        {question.type} {question.required ? '(Required)' : '(Optional)'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg sm:text-xl text-slate-800 dark:text-white mb-3">About this event</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{event.description}</p>
            </div>

            {/* Event Actions */}
            <div className="pt-5 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
              <EventActions 
                eventId={event.id}
                eventTitle={event.title}
                eventDescription={event.description}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

