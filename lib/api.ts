// API integration for GrowthLab platform
// This file will handle all API calls to the GrowthLab backend
// For client-side components, use the GrowthLab API client from lib/growthlab-api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const GROWTHLAB_API_URL = process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'https://api.growthlab.sg';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationType: 'physical' | 'online' | 'hybrid';
  imageUrl?: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
    sold: number;
    description?: string;
  }>;
  totalCapacity?: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'past' | 'cancelled';
  createdAt: string;
  attendees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  userStatus?: 'going' | 'interested' | 'not_going' | null;
}

// Events API
export const eventsApi = {
  // Get all events
  async getAllEvents(filters?: {
    status?: 'upcoming' | 'past';
    location?: string;
    category?: string;
  }): Promise<ApiResponse<EventResponse[]>> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/api/events`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    // });
    // return response.json();
    
    // For now, return mock data
    return {
      data: [],
      success: true,
    };
  },

  // Get event by ID
  async getEventById(id: string): Promise<ApiResponse<EventResponse>> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
    // return response.json();
    
    return {
      data: {} as EventResponse,
      success: true,
    };
  },

  // Register for event
  async registerForEvent(eventId: string, ticketTypeId: string): Promise<ApiResponse<{ registrationId: string }>> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify({ ticketTypeId }),
    // });
    // return response.json();
    
    return {
      data: { registrationId: 'mock-registration-id' },
      success: true,
    };
  },

  // Update event status (going/interested/not going)
  async updateEventStatus(eventId: string, status: 'going' | 'interested' | 'not_going' | null): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/status`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify({ status }),
    // });
    // return response.json();
    
    return {
      data: undefined,
      success: true,
    };
  },

  // Create new event
  async createEvent(eventData: {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    location: string;
    locationType: 'physical' | 'online' | 'hybrid';
    visibility: 'public' | 'private';
    ticketType: 'free' | 'paid';
    ticketPrice?: number;
    requireApproval: boolean;
    capacity: 'unlimited' | 'limited';
    capacityLimit?: number;
    theme?: string;
    color?: string;
    style?: string;
    font?: string;
    display?: string;
    imageMode?: 'theme' | 'upload';
    uploadedImage?: File | null;
    imagePreview?: string | null;
    registrationQuestions?: Array<{
      type: string;
      label: string;
      placeholder?: string;
      required: boolean;
      options?: string[];
      validation?: any;
    }>;
    [key: string]: any; // Allow additional properties
  }): Promise<ApiResponse<EventResponse>> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}/api/events`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`,
    //   },
    //   body: JSON.stringify(eventData),
    // });
    // return response.json();
    
    return {
      data: {
        id: `event-${Date.now()}`,
        title: eventData.title,
        description: eventData.description,
        date: eventData.startDate,
        time: eventData.startTime,
        location: eventData.location,
        locationType: eventData.locationType,
        organizer: {
          id: 'current-user',
          name: 'Current User',
        },
        ticketTypes: [{
          id: '1',
          name: eventData.ticketType === 'free' ? 'Free' : 'Paid',
          price: eventData.ticketPrice || 0,
          quantity: eventData.capacity === 'limited' ? eventData.capacityLimit : undefined,
          sold: 0,
        }],
        totalCapacity: eventData.capacity === 'limited' ? eventData.capacityLimit : undefined,
        registeredCount: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      } as EventResponse,
      success: true,
    };
  },
};

// Calendars API
export const calendarsApi = {
  // Get user's calendars
  async getMyCalendars(): Promise<ApiResponse<any[]>> {
    // TODO: Replace with actual API call
    return {
      data: [],
      success: true,
    };
  },

  // Subscribe to calendar
  async subscribeToCalendar(calendarId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call
    return {
      data: undefined,
      success: true,
    };
  },
};

// Auth API (for GrowthLab integration)
export const authApi = {
  // Login
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    // TODO: Replace with actual API call
    return {
      data: { token: 'mock-token', user: {} },
      success: true,
    };
  },

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<any>> {
    // TODO: Replace with actual API call
    return {
      data: {},
      success: true,
    };
  },
};

// Helper function to get auth token (to be implemented)
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

