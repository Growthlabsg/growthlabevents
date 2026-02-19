export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationType: 'physical' | 'online' | 'hybrid';
  imageUrl?: string;
  theme?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  ticketTypes: TicketType[];
  totalCapacity?: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'past' | 'cancelled' | 'postponed';
  createdAt: string;
  visibility?: 'public' | 'private';
  requireApproval?: boolean;
  timezone?: string;
  registrationQuestions?: RegistrationQuestion[];
  calendarId?: string; // Calendar this event belongs to
  tags?: string[]; // Event tags for filtering
  postponedTo?: { // New date/time if event is postponed
    date: string;
    time: string;
  };
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  sold: number;
  description?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface RegistrationQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'email' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
