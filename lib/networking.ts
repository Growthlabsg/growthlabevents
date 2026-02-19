// Advanced Networking Features - Virtual Name Cards, Contact Exchange, etc.

export interface VirtualNameCard {
  userId: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
    github?: string;
  };
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactExchangeRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  eventId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  message?: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  connectedAt: string;
  eventId?: string;
  notes?: string;
}

// In-memory storage (in production, use database)
const nameCards: Map<string, VirtualNameCard> = new Map();
const contactRequests: ContactExchangeRequest[] = [];
const connections: Connection[] = [];

// Create or update virtual name card
export function createOrUpdateNameCard(card: Omit<VirtualNameCard, 'createdAt' | 'updatedAt'>): VirtualNameCard {
  const existing = nameCards.get(card.userId);
  const now = new Date().toISOString();

  const nameCard: VirtualNameCard = {
    ...card,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  nameCards.set(card.userId, nameCard);
  return nameCard;
}

// Get virtual name card
export function getNameCard(userId: string): VirtualNameCard | null {
  return nameCards.get(userId) || null;
}

// Request contact exchange
export function requestContactExchange(
  fromUserId: string,
  toUserId: string,
  eventId?: string,
  message?: string
): ContactExchangeRequest {
  const request: ContactExchangeRequest = {
    id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    fromUserId,
    toUserId,
    eventId,
    status: 'pending',
    message,
    requestedAt: new Date().toISOString(),
  };

  contactRequests.push(request);
  return request;
}

// Respond to contact exchange request
export function respondToContactExchange(
  requestId: string,
  toUserId: string,
  status: 'approved' | 'rejected'
): ContactExchangeRequest {
  const request = contactRequests.find(r => r.id === requestId && r.toUserId === toUserId);
  if (!request) {
    throw new Error('Contact exchange request not found');
  }

  request.status = status;
  request.respondedAt = new Date().toISOString();

  // If approved, create a connection
  if (status === 'approved') {
    const connection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId1: request.fromUserId,
      userId2: request.toUserId,
      connectedAt: new Date().toISOString(),
      eventId: request.eventId,
    };
    connections.push(connection);
  }

  return request;
}

// Get contact exchange requests for a user
export function getContactRequests(userId: string, type: 'sent' | 'received' = 'received'): ContactExchangeRequest[] {
  if (type === 'sent') {
    return contactRequests.filter(r => r.fromUserId === userId);
  }
  return contactRequests.filter(r => r.toUserId === userId);
}

// Get connections for a user
export function getConnections(userId: string): Connection[] {
  return connections.filter(c => c.userId1 === userId || c.userId2 === userId);
}

// Get networking analytics
export function getNetworkingAnalytics(userId: string): {
  totalConnections: number;
  totalRequestsSent: number;
  totalRequestsReceived: number;
  pendingRequests: number;
  connectionsThisMonth: number;
} {
  const userConnections = getConnections(userId);
  const sentRequests = getContactRequests(userId, 'sent');
  const receivedRequests = getContactRequests(userId, 'received');
  const pending = receivedRequests.filter(r => r.status === 'pending').length;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  const connectionsThisMonth = userConnections.filter(c => new Date(c.connectedAt) >= thisMonth).length;

  return {
    totalConnections: userConnections.length,
    totalRequestsSent: sentRequests.length,
    totalRequestsReceived: receivedRequests.length,
    pendingRequests: pending,
    connectionsThisMonth,
  };
}

