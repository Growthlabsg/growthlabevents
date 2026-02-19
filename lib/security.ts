/**
 * Security utilities for input validation, sanitization, and protection
 */

// XSS Prevention - Sanitize HTML
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// SQL Injection Prevention - Validate and escape
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

// Input length validation
export function validateLength(input: string, min: number, max: number): boolean {
  if (typeof input !== 'string') return false;
  return input.length >= min && input.length <= max;
}

// Sanitize file name
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') return '';
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .substring(0, 255);
}

// Validate calendar ID format
export function validateCalendarId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 100;
}

// Validate event ID format
export function validateEventId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 100;
}

// Rate limiting helper (client-side check)
export function checkRateLimit(action: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const key = `rate_limit_${action}`;
  const now = Date.now();
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ count: 1, resetAt: now + windowMs }));
    return true;
  }
  
  const data = JSON.parse(stored);
  
  if (now > data.resetAt) {
    localStorage.setItem(key, JSON.stringify({ count: 1, resetAt: now + windowMs }));
    return true;
  }
  
  if (data.count >= maxAttempts) {
    return false;
  }
  
  data.count++;
  localStorage.setItem(key, JSON.stringify(data));
  return true;
}

// CSRF Token generation (for forms)
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validate price input
export function validatePrice(price: number | string): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 1000000;
}

// Validate date input
export function validateDate(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Sanitize text for display
export function sanitizeText(text: string, maxLength: number = 10000): string {
  if (typeof text !== 'string') return '';
  return sanitizeInput(text.substring(0, maxLength));
}

