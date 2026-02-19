// Saved events/bookmarks management

// In-memory storage for saved events (in production, use database)
let savedEventIds: Set<string> = new Set();

/**
 * Save/bookmark an event
 */
export function saveEvent(eventId: string): void {
  savedEventIds.add(eventId);
  // Sync with localStorage for persistence
  if (typeof window !== 'undefined') {
    const saved = Array.from(savedEventIds);
    localStorage.setItem('savedEvents', JSON.stringify(saved));
  }
}

/**
 * Unsave/unbookmark an event
 */
export function unsaveEvent(eventId: string): void {
  savedEventIds.delete(eventId);
  // Sync with localStorage
  if (typeof window !== 'undefined') {
    const saved = Array.from(savedEventIds);
    localStorage.setItem('savedEvents', JSON.stringify(saved));
  }
}

/**
 * Check if event is saved
 */
export function isEventSaved(eventId: string): boolean {
  return savedEventIds.has(eventId);
}

/**
 * Get all saved event IDs
 */
export function getSavedEventIds(): string[] {
  // Load from localStorage on client side
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('savedEvents');
      if (saved) {
        savedEventIds = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved events:', e);
    }
  }
  return Array.from(savedEventIds);
}

/**
 * Initialize saved events from localStorage
 */
export function initializeSavedEvents(): void {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('savedEvents');
      if (saved) {
        savedEventIds = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to initialize saved events:', e);
    }
  }
}

