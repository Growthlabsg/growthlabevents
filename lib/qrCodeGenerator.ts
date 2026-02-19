// QR Code generation utilities for GrowthLab Events

/**
 * Generate QR code value for event registration
 * Format: event:eventId:registrationId:attendeeName:attendeeEmail
 */
export function generateEventRegistrationQR(
  eventId: string,
  registrationId: string,
  attendeeName: string,
  attendeeEmail?: string
): string {
  const parts = [
    'event',
    eventId,
    registrationId,
    attendeeName,
    attendeeEmail || ''
  ];
  return parts.join(':');
}

/**
 * Parse event registration QR code
 */
export function parseEventRegistrationQR(qrCode: string): {
  type: 'event' | 'user' | 'invalid';
  eventId?: string;
  registrationId?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  username?: string;
} {
  const parts = qrCode.split(':');
  
  if (parts.length >= 4 && parts[0] === 'event') {
    return {
      type: 'event',
      eventId: parts[1],
      registrationId: parts[2],
      attendeeName: parts[3],
      attendeeEmail: parts[4] || undefined,
    };
  }
  
  if (parts.length === 3 && parts[0] === 'user') {
    return {
      type: 'user',
      username: parts[1],
      attendeeName: parts[2],
    };
  }
  
  return { type: 'invalid' };
}

/**
 * Generate registration ID
 */
export function generateRegistrationId(): string {
  return `reg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

