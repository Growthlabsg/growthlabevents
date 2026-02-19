// GrowthLab Main Platform API Integration
// This file handles all API calls to the GrowthLab main platform backend

const GROWTHLAB_API_URL = process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'https://api.growthlab.sg';
const GROWTHLAB_AUTH_URL = process.env.NEXT_PUBLIC_GROWTHLAB_AUTH_URL || 'https://auth.growthlab.sg';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  logo?: string;
  bio?: string;
  instagram?: string;
  website?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
  location: string;
  locationType: 'physical' | 'online' | 'hybrid';
  imageUrl?: string;
  imageMode?: 'theme' | 'upload';
  theme?: string;
  color?: string;
  style?: string;
  font?: string;
  display?: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
    logo?: string;
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
  visibility: 'public' | 'private';
  requireApproval: boolean;
  createdAt: string;
  updatedAt?: string;
  calendarId?: string;
  registrationQuestions?: Array<{
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    validation?: any;
  }>;
}

export interface CalendarData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  subscribers: number;
  isSubscribed?: boolean;
  settings?: {
    demeritSystemEnabled?: boolean;
    demeritPointsThreshold?: number;
  };
}

// Get authentication token from GrowthLab platform
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    // Try to get token from localStorage (set by main platform)
    const token = localStorage.getItem('growthlab_auth_token') || 
                  localStorage.getItem('auth_token') ||
                  sessionStorage.getItem('growthlab_auth_token');
    return token;
  }
  return null;
}

// Get auth headers for API requests
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add platform identifier
  headers['X-Platform'] = 'growthlab-events';
  headers['X-Platform-Version'] = '1.0.0';
  
  return headers;
}

// API client with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${GROWTHLAB_API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return {
          data: {} as T,
          success: true,
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        data: {} as T,
        success: false,
        message: data.message || `HTTP ${response.status}`,
        error: data.error || response.statusText,
      };
    }

    return {
      data: data.data || data,
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      data: {} as T,
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
      error: 'NETWORK_ERROR',
    };
  }
}

// User API
export const userApi = {
  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>('/api/users/me');
  },

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Upload user logo
  async uploadLogo(file: File): Promise<ApiResponse<{ logoUrl: string }>> {
    const formData = new FormData();
    formData.append('logo', file);
    
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'X-Platform': 'growthlab-events',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${GROWTHLAB_API_URL}/api/users/me/logo`, {
        method: 'POST',
        headers: headers as unknown as HeadersInit,
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          data: { logoUrl: '' },
          success: false,
          message: data.message || 'Failed to upload logo',
        };
      }

      return {
        data: { logoUrl: data.data?.logoUrl || data.logoUrl || '' },
        success: true,
      };
    } catch (error) {
      return {
        data: { logoUrl: '' },
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload logo',
      };
    }
  },

  // Get user's events
  async getUserEvents(userId?: string): Promise<ApiResponse<EventData[]>> {
    const endpoint = userId ? `/api/users/${userId}/events` : '/api/users/me/events';
    return apiRequest<EventData[]>(endpoint);
  },
};

// Events API
export const eventsApi = {
  // Get all events
  async getAllEvents(filters?: {
    status?: 'upcoming' | 'past';
    location?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<EventData[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString();
    return apiRequest<EventData[]>(`/api/events${query ? `?${query}` : ''}`);
  },

  // Get event by ID
  async getEventById(id: string): Promise<ApiResponse<EventData>> {
    return apiRequest<EventData>(`/api/events/${id}`);
  },

  // Create event
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
  }): Promise<ApiResponse<EventData>> {
    // Handle file upload separately if image is provided
    if (eventData.imageMode === 'upload' && eventData.uploadedImage) {
      const formData = new FormData();
      formData.append('title', eventData.title);
      formData.append('description', eventData.description);
      formData.append('startDate', eventData.startDate);
      formData.append('startTime', eventData.startTime);
      formData.append('endDate', eventData.endDate);
      formData.append('endTime', eventData.endTime);
      formData.append('location', eventData.location);
      formData.append('locationType', eventData.locationType);
      formData.append('visibility', eventData.visibility);
      formData.append('ticketType', eventData.ticketType);
      if (eventData.ticketPrice) formData.append('ticketPrice', eventData.ticketPrice.toString());
      formData.append('requireApproval', eventData.requireApproval.toString());
      formData.append('capacity', eventData.capacity);
      if (eventData.capacityLimit) formData.append('capacityLimit', eventData.capacityLimit.toString());
      if (eventData.theme) formData.append('theme', eventData.theme);
      if (eventData.color) formData.append('color', eventData.color);
      if (eventData.style) formData.append('style', eventData.style);
      if (eventData.font) formData.append('font', eventData.font);
      if (eventData.display) formData.append('display', eventData.display);
      formData.append('imageMode', 'upload');
      formData.append('poster', eventData.uploadedImage);
      if (eventData.registrationQuestions) {
        formData.append('registrationQuestions', JSON.stringify(eventData.registrationQuestions));
      }

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'X-Platform': 'growthlab-events',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${GROWTHLAB_API_URL}/api/events`, {
          method: 'POST',
          headers: headers as unknown as HeadersInit,
          body: formData,
        });

        const data = await response.json();
        
        if (!response.ok) {
          return {
            data: {} as EventData,
            success: false,
            message: data.message || 'Failed to create event',
          };
        }

        return {
          data: data.data || data,
          success: true,
        };
      } catch (error) {
        return {
          data: {} as EventData,
          success: false,
          message: error instanceof Error ? error.message : 'Failed to create event',
        };
      }
    }

    // Regular JSON request for theme-based events
    return apiRequest<EventData>('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        ...eventData,
        uploadedImage: undefined, // Don't send file in JSON
      }),
    });
  },

  // Update event
  async updateEvent(id: string, eventData: Partial<EventData>): Promise<ApiResponse<EventData>> {
    return apiRequest<EventData>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Register for event
  async registerForEvent(eventId: string, ticketTypeId: string, answers?: Record<string, any>): Promise<ApiResponse<{ registrationId: string }>> {
    return apiRequest<{ registrationId: string }>(`/api/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ ticketTypeId, answers }),
    });
  },

  // Update event status (going/interested/not going)
  async updateEventStatus(eventId: string, status: 'going' | 'interested' | 'not_going' | null): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/events/${eventId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Calendars API
export const calendarsApi = {
  // Get user's calendars
  async getMyCalendars(): Promise<ApiResponse<CalendarData[]>> {
    return apiRequest<CalendarData[]>('/api/calendars');
  },

  // Get calendar by ID
  async getCalendarById(id: string): Promise<ApiResponse<CalendarData>> {
    return apiRequest<CalendarData>(`/api/calendars/${id}`);
  },

  // Subscribe to calendar
  async subscribeToCalendar(calendarId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/calendars/${calendarId}/subscribe`, {
      method: 'POST',
    });
  },

  // Unsubscribe from calendar
  async unsubscribeFromCalendar(calendarId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/calendars/${calendarId}/subscribe`, {
      method: 'DELETE',
    });
  },
};

// Export all APIs
export const growthlabApi = {
  user: userApi,
  events: eventsApi,
  calendars: calendarsApi,
};

