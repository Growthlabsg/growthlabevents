// Waitlist management

// In-memory storage for waitlist (in production, use database)
const waitlistStore = new Map<string, Array<{
  userId: string;
  email: string;
  name: string;
  joinedAt: string;
  notified: boolean;
}>>();

/**
 * Add user to waitlist
 */
export function addToWaitlist(eventId: string, userId: string, email: string, name: string): void {
  if (!waitlistStore.has(eventId)) {
    waitlistStore.set(eventId, []);
  }

  const waitlist = waitlistStore.get(eventId)!;
  
  // Check if already on waitlist
  if (waitlist.some(entry => entry.userId === userId || entry.email === email)) {
    return;
  }

  waitlist.push({
    userId,
    email,
    name,
    joinedAt: new Date().toISOString(),
    notified: false,
  });

  // Sort by join time
  waitlist.sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
}

/**
 * Remove user from waitlist
 */
export function removeFromWaitlist(eventId: string, userId: string): void {
  const waitlist = waitlistStore.get(eventId);
  if (!waitlist) return;

  const index = waitlist.findIndex(entry => entry.userId === userId);
  if (index !== -1) {
    waitlist.splice(index, 1);
  }
}

/**
 * Get waitlist for event
 */
export function getWaitlist(eventId: string): Array<{
  userId: string;
  email: string;
  name: string;
  joinedAt: string;
  position: number;
}> {
  const waitlist = waitlistStore.get(eventId) || [];
  return waitlist.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }));
}

/**
 * Get user's position on waitlist
 */
export function getWaitlistPosition(eventId: string, userId: string): number | null {
  const waitlist = waitlistStore.get(eventId);
  if (!waitlist) return null;

  const index = waitlist.findIndex(entry => entry.userId === userId);
  return index === -1 ? null : index + 1;
}

/**
 * Check if user is on waitlist
 */
export function isOnWaitlist(eventId: string, userId: string): boolean {
  const waitlist = waitlistStore.get(eventId);
  if (!waitlist) return false;
  return waitlist.some(entry => entry.userId === userId);
}

/**
 * Get next user from waitlist (for when spot opens)
 */
export function getNextFromWaitlist(eventId: string): {
  userId: string;
  email: string;
  name: string;
} | null {
  const waitlist = waitlistStore.get(eventId);
  if (!waitlist || waitlist.length === 0) return null;

  return {
    userId: waitlist[0].userId,
    email: waitlist[0].email,
    name: waitlist[0].name,
  };
}

