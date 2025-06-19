import { toast } from "sonner";

// Base API URL - can be moved to environment variables
const API_URL = "http://localhost:5000/api";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  location?: string;
  phone?: string;
  bio?: string;
  interests?: string;
  preferredLanguage?: string;
}

export interface AuthResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  phone?: string;
  bio?: string;
  interests?: string;
  preferredLanguage?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: "general" | "technical" | "partnerships" | "careers";
}

// API client with error handling
const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || "An error occurred");
    throw error;
  }
};

// Authentication functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    return apiClient("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyEmail: async (token: string): Promise<{ status: string; message: string }> => {
    return apiClient("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  verifyEmailByCode: async (email: string, code: string): Promise<{ status: string; message: string }> => {
    return apiClient("/auth/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });
  },

  resendVerificationEmail: async (email: string): Promise<{ status: string; message: string }> => {
    return apiClient("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    return apiClient("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return;
    }

    return apiClient("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await apiClient("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  updateUserProfile: async (updateData: UpdateProfileData): Promise<UserProfile> => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await apiClient("/user/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    return response.data;
  },
};

// Message functions
export const messageApi = {
  sendMessage: async (messageData: ContactMessage): Promise<{ status: string; message: string }> => {
    return apiClient("/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },
};
