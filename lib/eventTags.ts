// Event Tags Management

export interface EventTag {
  id: string;
  name: string;
  color: string;
  calendarId?: string;
  eventCount: number;
  createdAt: string;
}

// In-memory storage (in production, use database)
const eventTags: Map<string, EventTag[]> = new Map(); // calendarId -> tags
const eventTagAssignments: Map<string, string[]> = new Map(); // eventId -> tagIds

// Create a new tag
export function createEventTag(
  name: string,
  color: string = '#ef4444',
  calendarId?: string
): EventTag {
  const tag: EventTag = {
    id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    color,
    calendarId,
    eventCount: 0,
    createdAt: new Date().toISOString(),
  };

  const key = calendarId || 'global';
  if (!eventTags.has(key)) {
    eventTags.set(key, []);
  }
  eventTags.get(key)!.push(tag);
  return tag;
}

// Get tags for a calendar
export function getEventTags(calendarId?: string): EventTag[] {
  const key = calendarId || 'global';
  return eventTags.get(key) || [];
}

// Get all tags (across all calendars)
export function getAllEventTags(): EventTag[] {
  const allTags: EventTag[] = [];
  eventTags.forEach(tags => {
    allTags.push(...tags);
  });
  return allTags;
}

// Get tags for an event
export function getEventTagsForEvent(eventId: string): EventTag[] {
  const tagIds = eventTagAssignments.get(eventId) || [];
  const allTags = getAllEventTags();
  return allTags.filter(tag => tagIds.includes(tag.id));
}

// Assign tags to an event
export function assignTagsToEvent(eventId: string, tagIds: string[]): void {
  eventTagAssignments.set(eventId, tagIds);
  
  // Update event counts
  const allTags = getAllEventTags();
  allTags.forEach(tag => {
    const eventsWithTag = Array.from(eventTagAssignments.entries())
      .filter(([_, ids]) => ids.includes(tag.id))
      .length;
    tag.eventCount = eventsWithTag;
  });
}

// Remove tag from event
export function removeTagFromEvent(eventId: string, tagId: string): void {
  const currentTags = eventTagAssignments.get(eventId) || [];
  eventTagAssignments.set(eventId, currentTags.filter(id => id !== tagId));
  
  // Update event count
  const allTags = getAllEventTags();
  const tag = allTags.find(t => t.id === tagId);
  if (tag) {
    const eventsWithTag = Array.from(eventTagAssignments.entries())
      .filter(([_, ids]) => ids.includes(tagId))
      .length;
    tag.eventCount = eventsWithTag;
  }
}

// Delete a tag
export function deleteEventTag(tagId: string, calendarId?: string): boolean {
  const key = calendarId || 'global';
  const tags = eventTags.get(key);
  if (!tags) return false;

  const index = tags.findIndex(t => t.id === tagId);
  if (index === -1) return false;

  tags.splice(index, 1);
  
  // Remove tag from all events
  eventTagAssignments.forEach((tagIds, eventId) => {
    eventTagAssignments.set(eventId, tagIds.filter(id => id !== tagId));
  });

  return true;
}

// Update tag
export function updateEventTag(
  tagId: string,
  updates: Partial<Pick<EventTag, 'name' | 'color'>>,
  calendarId?: string
): EventTag | null {
  const key = calendarId || 'global';
  const tags = eventTags.get(key);
  if (!tags) return null;

  const tag = tags.find(t => t.id === tagId);
  if (!tag) return null;

  Object.assign(tag, updates);
  return tag;
}

