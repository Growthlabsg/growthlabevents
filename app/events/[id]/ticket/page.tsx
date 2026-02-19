'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { QRCode } from '@/components/QRCode';
import { mockEvents } from '@/lib/mockData';
import { generateEventRegistrationQR, generateRegistrationId } from '@/lib/qrCodeGenerator';

export default function EventTicketPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const event = mockEvents.find(e => e.id === eventId);
  
  const [registrationId] = useState(() => generateRegistrationId());
  const [attendeeName, setAttendeeName] = useState('John Doe');
  const [attendeeEmail, setAttendeeEmail] = useState('john.doe@example.com');
  const [ticketType, setTicketType] = useState(event?.ticketTypes[0]?.id || '');

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event not found</h2>
            <Link href="/events">
              <Button>Go to Events</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const qrCodeValue = generateEventRegistrationQR(
    event.id,
    registrationId,
    attendeeName,
    attendeeEmail
  );

  const selectedTicket = event.ticketTypes.find(t => t.id === ticketType);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Registration Confirmed!
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
                You're all set for {event.title}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Main Ticket Card */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-xl shadow-lg border-2 border-teal-500">
                  <CardHeader className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-t-xl">
                    <CardTitle className="text-2xl sm:text-3xl text-white">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <div className="space-y-6">
                      {/* Event Details */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">
                              {new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{event.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">{event.location}</p>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 capitalize">{event.locationType} event</p>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Information */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-base sm:text-lg">Ticket Information</h3>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{selectedTicket?.name || 'General Admission'}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Registration ID: {registrationId}</p>
                            </div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {selectedTicket?.price === 0 ? 'Free' : `$${selectedTicket?.price}`}
                            </p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              <strong>Attendee:</strong> {attendeeName}
                            </p>
                            {attendeeEmail && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                <strong>Email:</strong> {attendeeEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <strong>Important:</strong> Bring this QR code to the event for check-in. You can also access it anytime from your account.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* QR Code Sidebar */}
              <div className="lg:col-span-1">
                <Card className="rounded-xl shadow-lg sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-center">Check-in QR Code</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                        <QRCode 
                          value={qrCodeValue}
                          size={200}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center">
                        Show this QR code at the event entrance for quick check-in
                      </p>
                      <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const canvas = document.querySelector('canvas');
                            if (canvas) {
                              const url = canvas.toDataURL();
                              const link = document.createElement('a');
                              link.download = `ticket-${event.id}-${registrationId}.png`;
                              link.href = url;
                              link.click();
                            }
                          }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/events/${event.id}`}>
                <Button variant="outline" className="w-full sm:w-auto">
                  View Event Details
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="primary" className="w-full sm:w-auto">
                  Browse More Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton currentEventId={eventId} />
    </div>
  );
}

