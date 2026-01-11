import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  userAtom,
  isAuthenticatedAtom,
  isLoadingAtom,
  accessTokenAtom,
  setAuthAtom,
  clearAuthAtom,
} from '../store/authAtoms';
import {
  authService,
  type LoginRequest,
  type UpdateProfileRequest,
} from '../services/authService';

/**
 * Custom hook for authentication operations and state management
 * Provides login, logout, updateProfile functions and handles session restoration
 */
export const useAuth = () => {
  const user = useAtomValue(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const accessToken = useAtomValue(accessTokenAtom);
  const updateAuthState = useSetAtom(setAuthAtom);
  const clearAuth = useSetAtom(clearAuthAtom);
  const navigate = useNavigate();

  /**
   * Login function that authenticates user and updates auth state
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      updateAuthState({ isLoading: true });
      
      const response = await authService.login(credentials);
      
      if (response.success && response.user && response.session) {
        // Update auth state with user data and session tokens
        updateAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: response.user,
          accessToken: response.session.accessToken,
          refreshToken: response.session.refreshToken,
        });
        
        // Redirect to dashboard on successful login
        navigate('/dashboard');
        
        return { success: true, message: response.message };
      } else {
        updateAuthState({ isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      updateAuthState({ isLoading: false });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, [updateAuthState, navigate]);

  /**
   * Logout function that clears auth state and redirects to landing page
   */
  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        // Call backend signout endpoint to invalidate session
        await authService.signout(accessToken);
      }
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error('Signout error:', error);
    } finally {
      // Clear auth state and redirect to landing page
      clearAuth();
      navigate('/');
    }
  }, [accessToken, clearAuth, navigate]);

  /**
   * Update profile function that updates user profile and refreshes auth state
   */
  const updateProfile = useCallback(async (profileData: Omit<UpdateProfileRequest, 'userId'>) => {
    if (!user || !accessToken) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      updateAuthState({ isLoading: true });
      
      const response = await authService.updateProfile(
        { ...profileData, userId: user.id },
        accessToken
      );
      
      if (response.success && response.user) {
        // Update auth state with updated user data
        updateAuthState({
          isLoading: false,
          user: { ...user, ...response.user },
        });
        
        return { success: true, message: response.message };
      } else {
        updateAuthState({ isLoading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      updateAuthState({ isLoading: false });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  }, [user, accessToken, updateAuthState]);

  /**
   * Session restoration effect - runs on app load to check for existing session
   */
  useEffect(() => {
    const restoreSession = async () => {
      // If already authenticated or no access token, skip restoration
      if (isAuthenticated || !accessToken) {
        updateAuthState({ isLoading: false });
        return;
      }

      try {
        // Validate existing session with backend
        const response = await authService.getSession(accessToken);
        
        if (response.success && response.user) {
          // Session is valid, update auth state with fresh user data
          updateAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: response.user,
          });
        } else {
          // Session is invalid, clear auth state
          clearAuth();
        }
      } catch (error) {
        // Session validation failed, clear auth state
        console.error('Session restoration failed:', error);
        clearAuth();
      }
    };

    // Only run session restoration if currently loading
    if (isLoading) {
      restoreSession();
    }
  }, [isLoading, isAuthenticated, accessToken, updateAuthState, clearAuth]);

  return {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    
    // Auth actions
    login,
    logout,
    updateProfile,
  };
};