import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * User profile interface matching the backend schema
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  age: number | null;
  planType: 'free' | 'pro' | 'premium';
  emailVerified: boolean;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

/**
 * Default auth state for initialization
 */
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  accessToken: null,
  refreshToken: null,
};

/**
 * Main auth atom with localStorage persistence
 * Stores the complete authentication state including user data and tokens
 */
export const authAtom = atomWithStorage<AuthState>('auth', defaultAuthState);

/**
 * Derived atom for accessing just the user object
 */
export const userAtom = atom((get) => get(authAtom).user);

/**
 * Derived atom for checking authentication status
 */
export const isAuthenticatedAtom = atom((get) => get(authAtom).isAuthenticated);

/**
 * Derived atom for checking loading status
 */
export const isLoadingAtom = atom((get) => get(authAtom).isLoading);

/**
 * Derived atom for accessing the access token
 */
export const accessTokenAtom = atom((get) => get(authAtom).accessToken);

/**
 * Write-only atom for updating auth state after login
 */
export const setAuthAtom = atom(
  null,
  (get, set, update: Partial<AuthState>) => {
    const current = get(authAtom);
    set(authAtom, { ...current, ...update });
  }
);

/**
 * Write-only atom for clearing auth state on logout
 */
export const clearAuthAtom = atom(null, (_get, set) => {
  set(authAtom, {
    ...defaultAuthState,
    isLoading: false,
  });
});
