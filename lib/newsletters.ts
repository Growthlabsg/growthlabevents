// Newsletter System - Creation, Subscriber Management, Campaigns

export interface Newsletter {
  id: string;
  calendarId: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  calendarId: string;
  email: string;
  name?: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  isActive: boolean;
  tags?: string[];
}

export interface NewsletterCampaign {
  id: string;
  newsletterId: string;
  sentAt: string;
  recipientCount: number;
  deliveredCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
}

// In-memory storage (in production, use database)
const newsletters: Newsletter[] = [];
const subscribers: NewsletterSubscriber[] = [];
const campaigns: NewsletterCampaign[] = [];

// Create newsletter
export function createNewsletter(
  calendarId: string,
  title: string,
  subject: string,
  content: string
): Newsletter {
  const newsletter: Newsletter = {
    id: `newsletter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    calendarId,
    title,
    subject,
    content,
    status: 'draft',
    recipientCount: 0,
    openCount: 0,
    clickCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  newsletters.push(newsletter);
  return newsletter;
}

// Update newsletter
export function updateNewsletter(
  newsletterId: string,
  updates: Partial<Pick<Newsletter, 'title' | 'subject' | 'content' | 'status' | 'scheduledAt'>>
): Newsletter | null {
  const newsletter = newsletters.find(n => n.id === newsletterId);
  if (!newsletter) return null;

  Object.assign(newsletter, updates);
  newsletter.updatedAt = new Date().toISOString();
  return newsletter;
}

// Get newsletter by ID
export function getNewsletter(newsletterId: string): Newsletter | null {
  return newsletters.find(n => n.id === newsletterId) || null;
}

// Get newsletters for calendar
export function getNewsletters(calendarId: string): Newsletter[] {
  return newsletters.filter(n => n.calendarId === calendarId);
}

// Delete newsletter
export function deleteNewsletter(newsletterId: string): boolean {
  const index = newsletters.findIndex(n => n.id === newsletterId);
  if (index === -1) return false;
  newsletters.splice(index, 1);
  return true;
}

// Subscribe to newsletter
export function subscribeToNewsletter(
  calendarId: string,
  email: string,
  name?: string
): NewsletterSubscriber {
  // Check if already subscribed
  const existing = subscribers.find(
    s => s.calendarId === calendarId && s.email.toLowerCase() === email.toLowerCase() && s.isActive
  );

  if (existing) {
    return existing;
  }

  // If unsubscribed before, reactivate
  const unsubscribed = subscribers.find(
    s => s.calendarId === calendarId && s.email.toLowerCase() === email.toLowerCase() && !s.isActive
  );

  if (unsubscribed) {
    unsubscribed.isActive = true;
    unsubscribed.unsubscribedAt = undefined;
    return unsubscribed;
  }

  // Create new subscriber
  const subscriber: NewsletterSubscriber = {
    id: `subscriber-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    calendarId,
    email: email.toLowerCase(),
    name,
    subscribedAt: new Date().toISOString(),
    isActive: true,
  };

  subscribers.push(subscriber);
  return subscriber;
}

// Unsubscribe from newsletter
export function unsubscribeFromNewsletter(calendarId: string, email: string): boolean {
  const subscriber = subscribers.find(
    s => s.calendarId === calendarId && s.email.toLowerCase() === email.toLowerCase()
  );

  if (!subscriber) return false;

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date().toISOString();
  return true;
}

// Get subscribers for calendar
export function getSubscribers(calendarId: string, activeOnly: boolean = true): NewsletterSubscriber[] {
  return subscribers.filter(
    s => s.calendarId === calendarId && (!activeOnly || s.isActive)
  );
}

// Get subscriber count
export function getSubscriberCount(calendarId: string): number {
  return subscribers.filter(s => s.calendarId === calendarId && s.isActive).length;
}

// Send newsletter (simulate sending)
export function sendNewsletter(newsletterId: string): NewsletterCampaign | null {
  const newsletter = getNewsletter(newsletterId);
  if (!newsletter) return null;

  const calendarSubscribers = getSubscribers(newsletter.calendarId, true);
  const recipientCount = calendarSubscribers.length;

  const campaign: NewsletterCampaign = {
    id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    newsletterId,
    sentAt: new Date().toISOString(),
    recipientCount,
    deliveredCount: recipientCount, // Simulated
    openCount: Math.floor(recipientCount * 0.3), // Simulated 30% open rate
    clickCount: Math.floor(recipientCount * 0.1), // Simulated 10% click rate
    bounceCount: 0,
    unsubscribeCount: 0,
  };

  campaigns.push(campaign);

  // Update newsletter
  newsletter.status = 'sent';
  newsletter.sentAt = campaign.sentAt;
  newsletter.recipientCount = recipientCount;

  return campaign;
}

// Get campaigns for newsletter
export function getNewsletterCampaigns(newsletterId: string): NewsletterCampaign[] {
  return campaigns.filter(c => c.newsletterId === newsletterId);
}

// Get campaign analytics
export function getCampaignAnalytics(campaignId: string): NewsletterCampaign | null {
  return campaigns.find(c => c.id === campaignId) || null;
}

