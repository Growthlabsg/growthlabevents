// Demerit System - Track user demerits and manage restrictions

export interface DemeritReason {
  id: string;
  name: string;
  points: number;
  description: string;
}

export interface Demerit {
  id: string;
  userId: string;
  eventId?: string;
  reason: string;
  points: number;
  description?: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'appealed' | 'overturned' | 'expired';
  appealId?: string;
}

export interface Appeal {
  id: string;
  demeritId: string;
  userId: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface UserRestriction {
  userId: string;
  totalPoints: number;
  restrictions: string[];
  restrictedUntil?: string;
  notifications: string[];
}

// In-memory storage (in production, use database)
const demerits: Demerit[] = [];
const appeals: Appeal[] = [];
const userRestrictions: Map<string, UserRestriction> = new Map();
const demeritSettings: Map<string, { enabled: boolean; pointsThreshold: number }> = new Map();

// Default demerit reasons
export const DEFAULT_DEMERIT_REASONS: DemeritReason[] = [
  {
    id: 'no-show',
    name: 'No-Show',
    points: 10,
    description: 'Registered for event but did not attend',
  },
  {
    id: 'late-cancellation',
    name: 'Late Cancellation',
    points: 5,
    description: 'Cancelled registration less than 24 hours before event',
  },
  {
    id: 'inappropriate-behavior',
    name: 'Inappropriate Behavior',
    points: 20,
    description: 'Inappropriate behavior at event',
  },
  {
    id: 'spam',
    name: 'Spam',
    points: 15,
    description: 'Spam or fraudulent activity',
  },
  {
    id: 'violation',
    name: 'Policy Violation',
    points: 25,
    description: 'Violated event or platform policies',
  },
];

// Enable/disable demerit system for a calendar
export function setDemeritSystemEnabled(calendarId: string, enabled: boolean, pointsThreshold: number = 50): void {
  demeritSettings.set(calendarId, { enabled, pointsThreshold });
}

// Check if demerit system is enabled for a calendar
export function isDemeritSystemEnabled(calendarId: string): boolean {
  return demeritSettings.get(calendarId)?.enabled ?? false;
}

// Get demerit settings for a calendar
export function getDemeritSettings(calendarId: string): { enabled: boolean; pointsThreshold: number } {
  return demeritSettings.get(calendarId) ?? { enabled: false, pointsThreshold: 50 };
}

// Add a demerit to a user
export function addDemerit(
  userId: string,
  reason: string,
  points: number,
  eventId?: string,
  description?: string,
  createdBy: string = 'system'
): Demerit {
  const demerit: Demerit = {
    id: `demerit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    eventId,
    reason,
    points,
    description,
    createdAt: new Date().toISOString(),
    createdBy,
    status: 'active',
  };

  demerits.push(demerit);
  updateUserRestrictions(userId);

  return demerit;
}

// Get all demerits for a user
export function getUserDemerits(userId: string): Demerit[] {
  return demerits.filter(d => d.userId === userId);
}

// Get active demerits for a user
export function getActiveDemerits(userId: string): Demerit[] {
  return demerits.filter(d => d.userId === userId && d.status === 'active');
}

// Get total points for a user
export function getUserTotalPoints(userId: string): number {
  return getActiveDemerits(userId).reduce((sum, d) => sum + d.points, 0);
}

// Get demerit by ID
export function getDemeritById(demeritId: string): Demerit | undefined {
  return demerits.find(d => d.id === demeritId);
}

// Submit an appeal
export function submitAppeal(
  demeritId: string,
  userId: string,
  reason: string,
  description: string
): Appeal {
  const demerit = getDemeritById(demeritId);
  if (!demerit || demerit.userId !== userId) {
    throw new Error('Demerit not found or access denied');
  }

  if (demerit.status !== 'active') {
    throw new Error('Only active demerits can be appealed');
  }

  const appeal: Appeal = {
    id: `appeal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    demeritId,
    userId,
    reason,
    description,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  appeals.push(appeal);
  demerit.status = 'appealed';
  demerit.appealId = appeal.id;

  return appeal;
}

// Review an appeal
export function reviewAppeal(
  appealId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  reviewNotes?: string
): Appeal {
  const appeal = appeals.find(a => a.id === appealId);
  if (!appeal) {
    throw new Error('Appeal not found');
  }

  appeal.status = status;
  appeal.reviewedAt = new Date().toISOString();
  appeal.reviewedBy = reviewedBy;
  appeal.reviewNotes = reviewNotes;

  const demerit = getDemeritById(appeal.demeritId);
  if (demerit) {
    if (status === 'approved') {
      demerit.status = 'overturned';
    } else {
      demerit.status = 'active';
    }
    updateUserRestrictions(demerit.userId);
  }

  return appeal;
}

// Get appeals for a user
export function getUserAppeals(userId: string): Appeal[] {
  return appeals.filter(a => a.userId === userId);
}

// Get pending appeals
export function getPendingAppeals(): Appeal[] {
  return appeals.filter(a => a.status === 'pending');
}

// Get appeal by ID
export function getAppealById(appealId: string): Appeal | undefined {
  return appeals.find(a => a.id === appealId);
}

// Update user restrictions based on points
function updateUserRestrictions(userId: string): void {
  const totalPoints = getUserTotalPoints(userId);
  const restrictions: string[] = [];
  const notifications: string[] = [];

  if (totalPoints >= 50) {
    restrictions.push('cannot_register_events');
    notifications.push('You have reached 50 demerit points. Event registration is restricted.');
  }

  if (totalPoints >= 75) {
    restrictions.push('cannot_create_events');
    notifications.push('You have reached 75 demerit points. Event creation is restricted.');
  }

  if (totalPoints >= 100) {
    restrictions.push('account_suspended');
    notifications.push('You have reached 100 demerit points. Your account has been suspended.');
  }

  userRestrictions.set(userId, {
    userId,
    totalPoints,
    restrictions,
    notifications,
  });
}

// Get user restrictions
export function getUserRestrictions(userId: string): UserRestriction | null {
  return userRestrictions.get(userId) || null;
}

// Check if user has restriction
export function hasRestriction(userId: string, restriction: string): boolean {
  const restrictions = getUserRestrictions(userId);
  return restrictions?.restrictions.includes(restriction) ?? false;
}

// Clear expired demerits (demerits older than 1 year)
export function clearExpiredDemerits(): void {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  demerits.forEach(demerit => {
    if (new Date(demerit.createdAt) < oneYearAgo && demerit.status === 'active') {
      demerit.status = 'expired';
      updateUserRestrictions(demerit.userId);
    }
  });
}

// Get demerit statistics
export function getDemeritStats(calendarId?: string): {
  totalDemerits: number;
  activeDemerits: number;
  totalAppeals: number;
  pendingAppeals: number;
  usersWithRestrictions: number;
} {
  const filteredDemerits = calendarId
    ? demerits.filter(d => d.eventId && d.eventId.includes(calendarId))
    : demerits;

  return {
    totalDemerits: filteredDemerits.length,
    activeDemerits: filteredDemerits.filter(d => d.status === 'active').length,
    totalAppeals: appeals.length,
    pendingAppeals: appeals.filter(a => a.status === 'pending').length,
    usersWithRestrictions: Array.from(userRestrictions.values()).filter(r => r.restrictions.length > 0).length,
  };
}

