import { toast } from "sonner";

// Base API URL - environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Types
export interface EventData {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  category: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  tags?: string[];
  isPrivate?: boolean;
  invitedEmails?: string[];
  university?: string;
  registrationDeadline?: Date | string;
  allowCancellation?: boolean;
  cancellationDeadlineHours?: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  category: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  status: "draft" | "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  isPrivate: boolean;
  invitedEmails?: string[];
  university?: string;
  registrationDeadline?: string;
  allowCancellation: boolean;
  cancellationDeadlineHours: number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  event: EventResponse;
  user: {
    id: string;
    name: string;
    email: string;
  };
  registrationDate: string;
  status: "registered" | "attended" | "cancelled";
  ticketCode: string;
  qrCode?: string;
  paymentStatus?: "pending" | "completed" | "failed" | "refunded";
  paymentAmount?: number;
  cancellationDate?: string;
  cancellationReason?: string;
}

// API client with error handling
const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const token = localStorage.getItem("accessToken");

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint}`;
    console.log("Making API request to:", url);
    console.log("Request options:", { ...options, headers });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("API response status:", response.status);
    console.log("API response headers:", Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log("API response data:", data);

    if (!response.ok) {
      // Handle 401 errors (Invalid token) by attempting token refresh
      if (response.status === 401 && data.message === "Invalid token") {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            // Try to refresh the token
            const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              const newAccessToken = refreshData.data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);

              // Retry the original request with the new token
              const newHeaders = {
                ...headers,
                Authorization: `Bearer ${newAccessToken}`,
              };

              const retryResponse = await fetch(url, {
                ...options,
                headers: newHeaders,
              });

              const retryData = await retryResponse.json();

              if (retryResponse.ok) {
                return retryData;
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }
        
        // If token refresh failed or no refresh token, clear storage and don't show error
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login page
        window.location.href = "/login";
        return;
      }
      
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    console.error("API client error:", error);
    // Don't show toast errors for authentication-related issues or certain API errors
    if (!error.message?.includes("Invalid token") && 
        !error.message?.includes("Not authenticated") &&
        !error.message?.includes("User not found")) {
      // Only show user-friendly errors, not technical ones
      if (error.message && error.message !== "An error occurred") {
        toast.error(error.message);
      }
    }
    throw error;
  }
};

// Events API functions
export const eventApi = {
  // Create a new event
  createEvent: async (eventData: EventData): Promise<EventResponse> => {
    const response = await apiClient("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
    return response.data;
  },

  // Get all events with optional filters
  getEvents: async (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      tags?: string[];
      university?: string;
      isPrivate?: boolean;
    } = {}
  ): Promise<{
    events: EventResponse[];
    total: number;
    pages: number;
    currentPage: number;
  }> => {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.university) queryParams.append("university", params.university);
    if (params.isPrivate !== undefined) queryParams.append("isPrivate", params.isPrivate.toString());
    if (params.tags && params.tags.length > 0) {
      queryParams.append("tags", params.tags.join(","));
    }

    const queryString = queryParams.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient(endpoint);
    return response.data;
  },

  // Get event by ID
  getEvent: async (id: string): Promise<EventResponse> => {
    const response = await apiClient(`/events/${id}`);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, updateData: Partial<EventData>): Promise<EventResponse> => {
    const response = await apiClient(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await apiClient(`/events/${id}`, {
      method: "DELETE",
    });
  },

  // Get events created by the current user
  getUserEvents: async (): Promise<EventResponse[]> => {
    const response = await apiClient("/events/user/events");
    return response.data;
  },

  // Get event categories
  getEventCategories: async (): Promise<string[]> => {
    const response = await apiClient("/events/categories");
    return response.data;
  },

  // Register for an event
  registerForEvent: async (eventId: string): Promise<EventRegistration> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient(`/registrations/${eventId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Cancel event registration
  cancelRegistration: async (eventId: string, reason?: string): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    await apiClient(`/registrations/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
  },

  // Get user's event registrations
  getUserRegistrations: async (): Promise<EventRegistration[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient("/registrations/user/my-events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Check if user is registered for an event
  checkRegistrationStatus: async (eventId: string): Promise<{ isRegistered: boolean }> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient(`/registrations/${eventId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get event registrations (for organizers)
  getEventRegistrations: async (eventId: string): Promise<EventRegistration[]> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient(`/registrations/${eventId}/attendees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Get event statistics
  getEventStats: async (
    eventId: string
  ): Promise<{
    totalRegistrations: number;
    attendedCount: number;
    cancelledCount: number;
    pendingPayments: number;
  }> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient(`/registrations/${eventId}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Verify ticket
  verifyTicket: async (
    ticketCode: string
  ): Promise<{
    valid: boolean;
    registration?: EventRegistration;
    message: string;
  }> => {
    const token = localStorage.getItem("accessToken");
    const response = await apiClient("/registrations/verify-ticket", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ticketCode }),
    });
    return response.data;
  },
};
