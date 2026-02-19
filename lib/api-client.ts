// Unified API Client for GrowthLab Events Platform
// This client handles both local API routes and GrowthLab main platform integration

import { growthlabApi, getAuthToken } from './growthlab-api';

// Check if we should use GrowthLab API directly or local API routes
const USE_GROWTHLAB_API = process.env.NEXT_PUBLIC_USE_GROWTHLAB_API === 'true';
const LOCAL_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper to determine which API to use
function getApiUrl(endpoint: string): string {
  if (USE_GROWTHLAB_API) {
    // Use GrowthLab main platform API
    return `${process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'https://api.growthlab.sg'}${endpoint}`;
  }
  // Use local API routes (which will proxy to GrowthLab)
  return `${LOCAL_API_URL}${endpoint}`;
}

// Unified API client
export const apiClient = {
  // User operations
  async getCurrentUser() {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.user.getCurrentUser();
    }
    try {
      const response = await fetch(getApiUrl('/users/me'), {
        headers: {
          'Authorization': `Bearer ${getAuthToken() || 'mock-token'}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If 401, try without token in development
        if (response.status === 401) {
          const retryResponse = await fetch(getApiUrl('/users/me'), {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  async updateProfile(profileData: any) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.user.updateProfile(profileData);
    }
    const response = await fetch(getApiUrl('/users/me'), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  async uploadLogo(file: File) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.user.uploadLogo(file);
    }
    const formData = new FormData();
    formData.append('logo', file);
    const response = await fetch(getApiUrl('/users/me/logo'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
      },
      body: formData,
    });
    return response.json();
  },

  // Event operations
  async getAllEvents(filters?: any) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.events.getAllEvents(filters);
    }
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.category) params.append('category', filters.category);
    const query = params.toString();
    const response = await fetch(getApiUrl(`/events${query ? `?${query}` : ''}`), {
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async getEventById(id: string) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.events.getEventById(id);
    }
    const response = await fetch(getApiUrl(`/events/${id}`), {
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  async createEvent(eventData: any) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.events.createEvent(eventData);
    }
    const response = await fetch(getApiUrl('/events'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  async registerForEvent(eventId: string, ticketTypeId: string, answers?: any) {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.events.registerForEvent(eventId, ticketTypeId, answers);
    }
    const response = await fetch(getApiUrl(`/events/${eventId}/register`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticketTypeId, answers }),
    });
    return response.json();
  },

  // Calendar operations
  async getMyCalendars() {
    if (USE_GROWTHLAB_API) {
      return growthlabApi.calendars.getMyCalendars();
    }
    const response = await fetch(getApiUrl('/calendars'), {
      headers: {
        'Authorization': `Bearer ${getAuthToken() || ''}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
};

// Export GrowthLab API for direct access if needed
export { growthlabApi };

