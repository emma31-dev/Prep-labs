const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Request/Response interfaces
 */
export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    age: number | null;
    planType: 'free' | 'pro' | 'premium';
    emailVerified: boolean;
  };
  session?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

export interface SignoutResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  userId: string;
  age?: number;
  avatarUrl?: string;
  planType?: 'free' | 'pro' | 'premium';
  fullName?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    age: number | null;
    planType: 'free' | 'pro' | 'premium';
    emailVerified: boolean;
  };
}

export interface SessionResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    age: number | null;
    planType: 'free' | 'pro' | 'premium';
    emailVerified: boolean;
  };
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}

/**
 * Auth service for communicating with backend authentication endpoints
 */
export const authService = {
  /**
   * Register a new user account
   */
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Authenticate user and get session tokens
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Sign out and invalidate current session
   */
  signout: async (accessToken: string): Promise<SignoutResponse> => {
    const response = await fetch(`${API_BASE}/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  /**
   * Update user profile information
   */
  updateProfile: async (data: UpdateProfileRequest, accessToken: string): Promise<UpdateProfileResponse> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Validate current session and get user profile
   */
  getSession: async (accessToken: string): Promise<SessionResponse> => {
    const response = await fetch(`${API_BASE}/auth/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  /**
   * Resend email verification link
   */
  resendVerification: async (email: string): Promise<ResendVerificationResponse> => {
    const response = await fetch(`${API_BASE}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};
