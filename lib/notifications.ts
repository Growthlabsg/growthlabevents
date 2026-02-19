// Email Reminders and Notification Preferences

export interface NotificationPreferences {
  userId: string;
  emailReminders: {
    enabled: boolean;
    daysBefore: number[]; // e.g., [1, 7] for 1 day and 7 days before
    hoursBefore: number[]; // e.g., [2] for 2 hours before
  };
  eventNotifications: {
    newEvents: boolean;
    eventUpdates: boolean;
    eventCancellations: boolean;
    eventReminders: boolean;
    waitlistOpenings: boolean;
  };
  socialNotifications: {
    newFollowers: boolean;
    newMessages: boolean;
    contactRequests: boolean;
  };
  marketingEmails: {
    newsletters: boolean;
    promotions: boolean;
    recommendations: boolean;
  };
}

export interface EmailReminder {
  id: string;
  eventId: string;
  userId: string;
  reminderType: 'days' | 'hours';
  reminderValue: number; // e.g., 1 day or 2 hours
  sentAt?: string;
  scheduledFor: string; // ISO date string
  status: 'pending' | 'sent' | 'cancelled';
}

// In-memory storage (in production, use database)
const notificationPreferences: Map<string, NotificationPreferences> = new Map();
const emailReminders: EmailReminder[] = [];

// Get default notification preferences
function getDefaultPreferences(userId: string): NotificationPreferences {
  return {
    userId,
    emailReminders: {
      enabled: true,
      daysBefore: [1, 7], // 1 day and 7 days before
      hoursBefore: [2], // 2 hours before
    },
    eventNotifications: {
      newEvents: true,
      eventUpdates: true,
      eventCancellations: true,
      eventReminders: true,
      waitlistOpenings: true,
    },
    socialNotifications: {
      newFollowers: true,
      newMessages: true,
      contactRequests: true,
    },
    marketingEmails: {
      newsletters: true,
      promotions: false,
      recommendations: true,
    },
  };
}

// Get notification preferences for user
export function getNotificationPreferences(userId: string): NotificationPreferences {
  if (!notificationPreferences.has(userId)) {
    const defaults = getDefaultPreferences(userId);
    notificationPreferences.set(userId, defaults);
    return defaults;
  }
  return notificationPreferences.get(userId)!;
}

// Update notification preferences
export function updateNotificationPreferences(
  userId: string,
  updates: Partial<NotificationPreferences>
): NotificationPreferences {
  const current = getNotificationPreferences(userId);
  const updated = {
    ...current,
    ...updates,
    emailReminders: {
      ...current.emailReminders,
      ...(updates.emailReminders || {}),
    },
    eventNotifications: {
      ...current.eventNotifications,
      ...(updates.eventNotifications || {}),
    },
    socialNotifications: {
      ...current.socialNotifications,
      ...(updates.socialNotifications || {}),
    },
    marketingEmails: {
      ...current.marketingEmails,
      ...(updates.marketingEmails || {}),
    },
  };
  notificationPreferences.set(userId, updated);
  return updated;
}

// Schedule email reminder for event
export function scheduleEmailReminder(
  eventId: string,
  userId: string,
  eventDate: string,
  eventTime: string
): EmailReminder[] {
  const preferences = getNotificationPreferences(userId);
  
  if (!preferences.emailReminders.enabled) {
    return [];
  }

  const reminders: EmailReminder[] = [];
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);

  // Schedule day-based reminders
  for (const days of preferences.emailReminders.daysBefore) {
    const reminderDate = new Date(eventDateTime);
    reminderDate.setDate(reminderDate.getDate() - days);
    
    if (reminderDate > new Date()) {
      const reminder: EmailReminder = {
        id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        userId,
        reminderType: 'days',
        reminderValue: days,
        scheduledFor: reminderDate.toISOString(),
        status: 'pending',
      };
      reminders.push(reminder);
      emailReminders.push(reminder);
    }
  }

  // Schedule hour-based reminders
  for (const hours of preferences.emailReminders.hoursBefore) {
    const reminderDate = new Date(eventDateTime);
    reminderDate.setHours(reminderDate.getHours() - hours);
    
    if (reminderDate > new Date()) {
      const reminder: EmailReminder = {
        id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        userId,
        reminderType: 'hours',
        reminderValue: hours,
        scheduledFor: reminderDate.toISOString(),
        status: 'pending',
      };
      reminders.push(reminder);
      emailReminders.push(reminder);
    }
  }

  return reminders;
}

// Get reminders for user
export function getUserReminders(userId: string): EmailReminder[] {
  return emailReminders.filter(r => r.userId === userId);
}

// Get reminders for event
export function getEventReminders(eventId: string): EmailReminder[] {
  return emailReminders.filter(r => r.eventId === eventId);
}

// Mark reminder as sent
export function markReminderSent(reminderId: string): boolean {
  const reminder = emailReminders.find(r => r.id === reminderId);
  if (!reminder) return false;
  reminder.status = 'sent';
  reminder.sentAt = new Date().toISOString();
  return true;
}

// Cancel reminders for event
export function cancelEventReminders(eventId: string): number {
  let cancelled = 0;
  emailReminders.forEach(reminder => {
    if (reminder.eventId === eventId && reminder.status === 'pending') {
      reminder.status = 'cancelled';
      cancelled++;
    }
  });
  return cancelled;
}

