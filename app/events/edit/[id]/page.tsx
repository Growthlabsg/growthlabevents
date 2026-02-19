'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EventStatusManager } from '@/components/EventStatusManager';
import { mockEvents } from '@/lib/mockData';
import { sanitizeInput, validateLength, validatePrice, validateDate } from '@/lib/security';

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const event = mockEvents.find(e => e.id === eventId);

  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    locationType: 'physical' as 'physical' | 'online' | 'hybrid',
    ticketType: 'free' as 'free' | 'paid',
    ticketPrice: 0,
    capacity: 'unlimited' as 'unlimited' | 'limited',
    capacityLimit: 100,
  });

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        eventName: event.title,
        description: event.description,
        startDate: event.date,
        startTime: event.time,
        endDate: event.date,
        endTime: event.time,
        location: event.location,
        locationType: event.locationType,
        ticketType: event.ticketTypes[0]?.price === 0 ? 'free' : 'paid',
        ticketPrice: event.ticketTypes[0]?.price || 0,
        capacity: event.totalCapacity ? 'limited' : 'unlimited',
        capacityLimit: event.totalCapacity || 100,
      });
    }
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event not found</h2>
            <Button onClick={() => router.push('/events')}>Go to Events</Button>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!validateLength(formData.eventName, 1, 200)) {
      alert('Event name must be between 1 and 200 characters.');
      return;
    }

    // Simulate API call
    alert('Event updated successfully!');
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Edit Event
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Update your event details
              </p>
            </div>

            {/* Event Status Manager */}
            {event && (
              <div className="mb-6">
                <EventStatusManager
                  eventId={event.id}
                  currentStatus={event.status}
                  onStatusChange={(newStatus) => {
                    // Update local state if needed
                    console.log('Status changed to:', newStatus);
                  }}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: sanitizeInput(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: sanitizeInput(e.target.value) })}
                      rows={4}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      maxLength={10000}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: sanitizeInput(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location Type
                    </label>
                    <select
                      value={formData.locationType}
                      onChange={(e) => setFormData({ ...formData, locationType: e.target.value as typeof formData.locationType })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="physical">Physical</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Ticket Type
                    </label>
                    <select
                      value={formData.ticketType}
                      onChange={(e) => setFormData({ ...formData, ticketType: e.target.value as typeof formData.ticketType })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  {formData.ticketType === 'paid' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Ticket Price ($)
                      </label>
                      <input
                        type="number"
                        value={formData.ticketPrice}
                        onChange={(e) => setFormData({ ...formData, ticketPrice: parseFloat(e.target.value) || 0 })}
                        min="0"
                        step="0.01"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Capacity
                    </label>
                    <select
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value as typeof formData.capacity })}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="unlimited">Unlimited</option>
                      <option value="limited">Limited</option>
                    </select>
                  </div>

                  {formData.capacity === 'limited' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Capacity Limit
                      </label>
                      <input
                        type="number"
                        value={formData.capacityLimit}
                        onChange={(e) => setFormData({ ...formData, capacityLimit: parseInt(e.target.value) || 100 })}
                        min="1"
                        max="100000"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/events/${eventId}`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton currentEventId={eventId} />
    </div>
  );
}

