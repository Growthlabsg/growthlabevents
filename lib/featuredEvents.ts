// Featured events management

import { Event } from '@/types/event';

// In-memory storage for featured events (in production, use database)
let featuredEventIds: Set<string> = new Set();

/**
 * Mark an event as featured
 */
export function setFeaturedEvent(eventId: string, featured: boolean): void {
  if (featured) {
    featuredEventIds.add(eventId);
  } else {
    featuredEventIds.delete(eventId);
  }
}

/**
 * Check if an event is featured
 */
export function isFeaturedEvent(eventId: string): boolean {
  return featuredEventIds.has(eventId);
}

/**
 * Get all featured event IDs
 */
export function getFeaturedEventIds(): string[] {
  return Array.from(featuredEventIds);
}

/**
 * Get featured events from event list
 */
export function getFeaturedEvents(events: Event[]): Event[] {
  return events.filter(event => isFeaturedEvent(event.id));
}

/**
 * Get non-featured events from event list
 */
export function getNonFeaturedEvents(events: Event[]): Event[] {
  return events.filter(event => !isFeaturedEvent(event.id));
}

