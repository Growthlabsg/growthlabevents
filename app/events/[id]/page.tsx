import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CalendarExport } from '@/components/CalendarExport';
import { AttendeeDirectory } from '@/components/AttendeeDirectory';
import { EventDetailClient } from '@/components/EventDetailClient';
import { CheckInManagement } from '@/components/CheckInManagement';
import { EventRecommendations } from '@/components/EventRecommendations';
import { DemeritSystemWarning } from '@/components/DemeritSystemWarning';
import { EventCollaboration } from '@/components/EventCollaboration';
import { ChatButton } from '@/components/ChatButton';
import { mockEvents } from '@/lib/mockData';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = mockEvents.find(e => e.id === id);
  
  if (!event) {
    notFound();
  }
  
  const isSoldOut = Boolean(event.totalCapacity && event.registeredCount >= event.totalCapacity);
  const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
  const hasFreeTickets = event.ticketTypes.some(t => t.price === 0);
  
  return (
    <div className="min-h-screen flex flex-col">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="bg-gradient-to-br from-teal-400 to-teal-600 h-64"></div>
        
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 pb-8 sm:pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Demerit System Warning */}
              {event.calendarId && (
                <DemeritSystemWarning calendarId={event.calendarId} />
              )}
              
              <EventDetailClient event={event} />

              {/* Check-in Management (Host View) */}
              {event.organizer.name === 'GrowthLab Events' && (
                <Card className="rounded-xl shadow-sm mt-6 border-2 border-teal-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Check-in Management</CardTitle>
                      <span className="px-3 py-1 text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full">
                        Host View
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CheckInManagement eventId={event.id} eventTitle={event.title} />
                  </CardContent>
                </Card>
              )}

              {/* Attendee Directory */}
              {event.registeredCount > 0 && (
                <Card className="rounded-xl shadow-sm mt-6">
                  <CardHeader>
                    <CardTitle>Attendees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AttendeeDirectory eventId={event.id} />
                  </CardContent>
                </Card>
              )}

              {/* Event Collaboration */}
              <EventCollaboration eventId={event.id} isOrganizer={event.organizer.name === 'GrowthLab Events'} />
            </div>
            
            {/* Sidebar - Tickets */}
            <div className="lg:col-span-1">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {event.ticketTypes.map((ticket) => {
                      const isSoldOut = ticket.quantity && ticket.sold >= ticket.quantity;
                      const remaining = ticket.quantity ? ticket.quantity - ticket.sold : null;
                      
                      return (
                        <div key={ticket.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-white">{ticket.name}</h4>
                              {ticket.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ticket.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-800 dark:text-white">
                                {ticket.price === 0 ? 'Free' : `$${ticket.price}`}
                              </p>
                            </div>
                          </div>
                          {remaining !== null && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {isSoldOut ? 'Sold out' : `${remaining} remaining`}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Link href={`/events/${event.id}/ticket`} className="w-full block">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      disabled={isSoldOut}
                    >
                      {isSoldOut ? 'Sold Out' : 'Register Now'}
                    </Button>
                  </Link>
                  
                  <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>{event.registeredCount} people registered</p>
                    {event.totalCapacity && (
                      <p>{event.totalCapacity - event.registeredCount} spots remaining</p>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <CalendarExport event={event} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Similar Events Section - Full Width */}
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <EventRecommendations currentEvent={event} />
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton currentEventId={event.id} />
    </div>
  );
}

