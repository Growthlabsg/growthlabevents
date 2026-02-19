// Payment Integration - Stripe, Discount Codes, Refunds

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  eventId?: string;
  calendarId?: string;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  eventId: string;
  userId: string;
  ticketTypeId: string;
  quantity: number;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  discountCodeId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  stripePaymentIntentId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

// In-memory storage (in production, use database)
const discountCodes: DiscountCode[] = [];
const payments: Payment[] = [];
const refunds: Refund[] = [];

// Create discount code
export function createDiscountCode(
  code: string,
  type: 'percentage' | 'fixed',
  value: number,
  eventId?: string,
  calendarId?: string,
  maxUses?: number,
  validFrom?: string,
  validUntil?: string
): DiscountCode {
  const discount: DiscountCode = {
    id: `discount-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    code: code.toUpperCase(),
    type,
    value,
    eventId,
    calendarId,
    maxUses,
    usedCount: 0,
    validFrom: validFrom || new Date().toISOString(),
    validUntil: validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 year
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  discountCodes.push(discount);
  return discount;
}

// Get discount code by code string
export function getDiscountCode(code: string, eventId?: string): DiscountCode | null {
  const now = new Date();
  const discount = discountCodes.find(
    d =>
      d.code.toUpperCase() === code.toUpperCase() &&
      d.isActive &&
      new Date(d.validFrom) <= now &&
      new Date(d.validUntil) >= now &&
      (!d.maxUses || d.usedCount < d.maxUses) &&
      (!d.eventId || d.eventId === eventId)
  );

  return discount || null;
}

// Validate discount code
export function validateDiscountCode(
  code: string,
  eventId: string,
  amount: number
): { valid: boolean; discount?: DiscountCode; discountAmount?: number; message?: string } {
  const discount = getDiscountCode(code, eventId);

  if (!discount) {
    return { valid: false, message: 'Invalid or expired discount code' };
  }

  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    return { valid: false, message: 'Discount code has reached maximum uses' };
  }

  const now = new Date();
  if (new Date(discount.validFrom) > now || new Date(discount.validUntil) < now) {
    return { valid: false, message: 'Discount code is not valid at this time' };
  }

  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = (amount * discount.value) / 100;
  } else {
    discountAmount = Math.min(discount.value, amount);
  }

  return { valid: true, discount, discountAmount };
}

// Apply discount code (increment usage)
export function applyDiscountCode(code: string, eventId: string): boolean {
  const discount = discountCodes.find(
    d => d.code.toUpperCase() === code.toUpperCase() && (!d.eventId || d.eventId === eventId)
  );

  if (discount && discount.isActive) {
    discount.usedCount++;
    return true;
  }

  return false;
}

// Get all discount codes for an event or calendar
export function getDiscountCodes(eventId?: string, calendarId?: string): DiscountCode[] {
  return discountCodes.filter(
    d =>
      (!eventId || d.eventId === eventId) &&
      (!calendarId || d.calendarId === calendarId)
  );
}

// Create payment
export function createPayment(
  eventId: string,
  userId: string,
  ticketTypeId: string,
  quantity: number,
  amount: number,
  discountCodeId?: string,
  discountAmount: number = 0,
  stripePaymentIntentId?: string
): Payment {
  const payment: Payment = {
    id: `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    eventId,
    userId,
    ticketTypeId,
    quantity,
    amount,
    discountAmount,
    finalAmount: amount - discountAmount,
    discountCodeId,
    status: 'pending',
    stripePaymentIntentId,
    createdAt: new Date().toISOString(),
  };

  payments.push(payment);
  return payment;
}

// Update payment status
export function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  stripePaymentIntentId?: string
): Payment | null {
  const payment = payments.find(p => p.id === paymentId);
  if (!payment) return null;

  payment.status = status;
  if (status === 'completed' && !payment.completedAt) {
    payment.completedAt = new Date().toISOString();
  }
  if (stripePaymentIntentId) {
    payment.stripePaymentIntentId = stripePaymentIntentId;
  }

  return payment;
}

// Get payment by ID
export function getPayment(paymentId: string): Payment | null {
  return payments.find(p => p.id === paymentId) || null;
}

// Get payments for user
export function getUserPayments(userId: string): Payment[] {
  return payments.filter(p => p.userId === userId);
}

// Get payments for event
export function getEventPayments(eventId: string): Payment[] {
  return payments.filter(p => p.eventId === eventId);
}

// Create refund
export function createRefund(
  paymentId: string,
  amount: number,
  reason: string
): Refund {
  const payment = getPayment(paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }

  if (payment.status === 'refunded') {
    throw new Error('Payment already fully refunded');
  }

  if (amount > payment.finalAmount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }

  const refund: Refund = {
    id: `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentId,
    amount,
    reason,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  };

  refunds.push(refund);

  // Update payment status
  const totalRefunded = refunds
    .filter(r => r.paymentId === paymentId && r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  if (totalRefunded + amount >= payment.finalAmount) {
    payment.status = 'refunded';
  } else if (totalRefunded + amount > 0) {
    payment.status = 'partially_refunded';
  }

  return refund;
}

// Process refund
export function processRefund(
  refundId: string,
  processedBy: string
): Refund | null {
  const refund = refunds.find(r => r.id === refundId);
  if (!refund) return null;

  refund.status = 'completed';
  refund.processedAt = new Date().toISOString();
  refund.processedBy = processedBy;

  // Update payment status
  const payment = getPayment(refund.paymentId);
  if (payment) {
    const totalRefunded = refunds
      .filter(r => r.paymentId === payment.id && r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);

    if (totalRefunded >= payment.finalAmount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }
  }

  return refund;
}

// Get refunds for payment
export function getPaymentRefunds(paymentId: string): Refund[] {
  return refunds.filter(r => r.paymentId === paymentId);
}

// Get all refunds
export function getAllRefunds(eventId?: string): Refund[] {
  if (!eventId) return refunds;

  const eventPaymentIds = getEventPayments(eventId).map(p => p.id);
  return refunds.filter(r => eventPaymentIds.includes(r.paymentId));
}

