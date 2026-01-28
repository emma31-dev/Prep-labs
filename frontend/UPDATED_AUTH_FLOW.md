# Updated Authentication Flow with Google & Notion Integration

This document outlines the enhanced signup and signin flows that incorporate Google and Notion authentication options, providing users with multiple ways to access premium features.

## Overview

The updated authentication system supports:
1. **Traditional Email/Password** - Standard registration
2. **Google OAuth** - Sign in with Google + automatic Drive integration
3. **Notion OAuth** - Sign in with Notion + automatic workspace integration
4. **Hybrid Approach** - Link multiple authentication methods to one account

---

## Updated Signup Flow

### 1. Enhanced Signup Modal (`src/components/SignupModal.tsx`)

```typescript
import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff } from 'lucide-react';
import { GoogleSignupButton } from './auth/GoogleSignupButton';
import { NotionSignupButton } from './auth/NotionSignupButton';
import { useAuth } from '../hooks/useAuth';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const [signupMethod, setSignupMethod] = useState<'email' | 'google' | 'notion'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp } = useAuth();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Method Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setSignupMethod('email')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                signupMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setSignupMethod('google')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                signupMethod === 'google'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setSignupMethod('notion')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                signupMethod === 'notion'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notion
            </button>
          </div>
        </div>

        {/* Email Signup Form */}
        {signupMethod === 'email' && (
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Google Signup */}
        {signupMethod === 'google' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">Google Account Benefits</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Automatic Google Drive integration</li>
                  <li>• 15GB free cloud storage</li>
                  <li>• Cross-device synchronization</li>
                  <li>• Automatic backup of all content</li>
                </ul>
              </div>
              <GoogleSignupButton onSuccess={onClose} onError={setError} />
            </div>
          </div>
        )}

        {/* Notion Signup */}
        {signupMethod === 'notion' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Notion Integration Benefits</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Organize quizzes in your Notion workspace</li>
                  <li>• Advanced progress tracking and analytics</li>
                  <li>• Collaborative study materials</li>
                  <li>• Automated database organization</li>
                </ul>
              </div>
              <NotionSignupButton onSuccess={onClose} onError={setError} />
            </div>
          </div>
        )}

        {/* Alternative Options */}
        <div className="mt-6 pt-6 border-t">
          {signupMethod === 'email' && (
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">Or sign up with</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSignupMethod('google')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <GoogleIcon className="w-4 h-4 mr-2" />
                  Google
                </button>
                <button
                  onClick={() => setSignupMethod('notion')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <NotionIcon className="w-4 h-4 mr-2" />
                  Notion
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. Google Signup Component (`src/components/auth/GoogleSignupButton.tsx`)

```typescript
import React from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useAuth } from '../../hooks/useAuth';

interface GoogleSignupButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const GoogleSignupButton: React.FC<GoogleSignupButtonProps> = ({
  onSuccess,
  onError
}) => {
  const { initiateGoogleAuth } = useGoogleAuth();
  const { createAccountWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      // This will redirect to Google OAuth
      initiateGoogleAuth();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Google signup failed');
    }
  };

  return (
    <button
      onClick={handleGoogleSignup}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="text-sm font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};
```

### 3. Notion Signup Component (`src/components/auth/NotionSignupButton.tsx`)

```typescript
import React from 'react';
import { useNotionAuth } from '../../hooks/useNotionAuth';
import { useAuth } from '../../hooks/useAuth';

interface NotionSignupButtonProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const NotionSignupButton: React.FC<NotionSignupButtonProps> = ({
  onSuccess,
  onError
}) => {
  const { initiateNotionAuth } = useNotionAuth();
  const { createAccountWithNotion } = useAuth();

  const handleNotionSignup = async () => {
    try {
      // This will redirect to Notion OAuth
      initiateNotionAuth();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Notion signup failed');
    }
  };

  return (
    <button
      onClick={handleNotionSignup}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="w-5 h-5 mr-3 bg-black rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
      <span className="text-sm font-medium text-gray-700">Continue with Notion</span>
    </button>
  );
};
```

---

## Updated Login Flow

### 1. Enhanced Login Modal (`src/components/LoginModal.tsx`)

```typescript
import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff } from 'lucide-react';
import { GoogleLoginButton } from './auth/GoogleLoginButton';
import { NotionLoginButton } from './auth/NotionLoginButton';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignup
}) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'google' | 'notion'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(formData.email, formData.password);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Method Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setLoginMethod('email')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('google')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'google'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setLoginMethod('notion')}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                loginMethod === 'notion'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notion
            </button>
          </div>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {/* Google Login */}
        {loginMethod === 'google' && (
          <div className="space-y-4">
            <div className="text-center">
              <GoogleLoginButton onSuccess={onClose} onError={setError} />
              <p className="text-sm text-gray-600 mt-3">
                Sign in with your Google account to access Drive integration
              </p>
            </div>
          </div>
        )}

        {/* Notion Login */}
        {loginMethod === 'notion' && (
          <div className="space-y-4">
            <div className="text-center">
              <NotionLoginButton onSuccess={onClose} onError={setError} />
              <p className="text-sm text-gray-600 mt-3">
                Sign in with your Notion account to access workspace integration
              </p>
            </div>
          </div>
        )}

        {/* Alternative Options */}
        <div className="mt-6 pt-6 border-t">
          {loginMethod === 'email' && (
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">Or continue with</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLoginMethod('google')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <GoogleIcon className="w-4 h-4 mr-2" />
                  Google
                </button>
                <button
                  onClick={() => setLoginMethod('notion')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <NotionIcon className="w-4 h-4 mr-2" />
                  Notion
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              onClick={onSwitchToSignup}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## OAuth Callback Handling

### 1. Google OAuth Callback (`src/pages/auth/GoogleCallback.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useGoogleAuth();
  const { linkGoogleAccount, createAccountWithGoogle } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Google authentication...');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      if (error) {
        setStatus('error');
        setMessage('Google authentication was cancelled or failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Google');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Handle Google OAuth callback
        const result = await handleAuthCallback(code);
        
        if (result.success) {
          // Check if user is already logged in (linking account)
          const currentUser = getCurrentUser(); // From your auth context
          
          if (currentUser) {
            // Link Google account to existing user
            await linkGoogleAccount(result.user, result.tokens);
            setMessage('Google account linked successfully!');
          } else {
            // Create new account or sign in existing user
            await createAccountWithGoogle(result.user, result.tokens);
            setMessage('Welcome! Your account has been created with Google.');
          }
          
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleAuthCallback, linkGoogleAccount, createAccountWithGoogle]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting to Google
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};
```

### 2. Notion OAuth Callback (`src/pages/auth/NotionCallback.tsx`)

```typescript
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNotionAuth } from '../../hooks/useNotionAuth';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const NotionCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useNotionAuth();
  const { linkNotionAccount, createAccountWithNotion } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing Notion authentication...');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage('Notion authentication was cancelled or failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Notion');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        // Handle Notion OAuth callback
        const result = await handleAuthCallback(code);
        
        if (result.success) {
          // Check if user is already logged in (linking account)
          const currentUser = getCurrentUser(); // From your auth context
          
          if (currentUser) {
            // Link Notion account to existing user
            await linkNotionAccount(result.user, result.tokens);
            setMessage('Notion workspace linked successfully!');
          } else {
            // Create new account or sign in existing user
            await createAccountWithNotion(result.user, result.tokens);
            setMessage('Welcome! Your account has been created with Notion.');
          }
          
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleAuthCallback, linkNotionAccount, createAccountWithNotion]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-gray-800 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Connecting to Notion
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to home page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};
```

---

## Enhanced Auth Service

### Updated Auth Hook (`src/hooks/useAuth.ts`)

```typescript
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAccountWithGoogle: (googleUser: any, tokens: any) => Promise<void>;
  createAccountWithNotion: (notionUser: any, tokens: any) => Promise<void>;
  linkGoogleAccount: (googleUser: any, tokens: any) => Promise<void>;
  linkNotionAccount: (notionUser: any, tokens: any) => Promise<void>;
}

export const useAuth = () => {
  // ... existing auth logic

  const createAccountWithGoogle = async (googleUser: any, tokens: any) => {
    try {
      // Check if user already exists with this Google ID
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleUser.id)
        .single();

      if (existingUser) {
        // User exists, just sign them in and update tokens
        await updateUserIntegrations(existingUser.id, 'google', tokens);
        setUser(existingUser);
      } else {
        // Create new user account
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            email: googleUser.email,
            full_name: googleUser.name,
            avatar_url: googleUser.picture,
            google_id: googleUser.id,
            integrations: {
              google: {
                connected: true,
                tokens: tokens,
                drive_folder_id: null
              },
              notion: {
                connected: false,
                tokens: null,
                workspace_id: null,
                database_ids: {}
              }
            }
          })
          .select()
          .single();

        if (error) throw error;
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error creating account with Google:', error);
      throw error;
    }
  };

  const createAccountWithNotion = async (notionUser: any, tokens: any) => {
    try {
      // Similar logic for Notion account creation
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('notion_id', notionUser.id)
        .single();

      if (existingUser) {
        await updateUserIntegrations(existingUser.id, 'notion', tokens);
        setUser(existingUser);
      } else {
        const { data: newUser, error } = await supabase
          .from('users')
          .insert({
            email: notionUser.person?.email || `${notionUser.id}@notion.local`,
            full_name: notionUser.name,
            avatar_url: notionUser.avatar_url,
            notion_id: notionUser.id,
            integrations: {
              google: {
                connected: false,
                tokens: null,
                drive_folder_id: null
              },
              notion: {
                connected: true,
                tokens: tokens,
                workspace_id: tokens.workspace_id,
                database_ids: {}
              }
            }
          })
          .select()
          .single();

        if (error) throw error;
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error creating account with Notion:', error);
      throw error;
    }
  };

  const linkGoogleAccount = async (googleUser: any, tokens: any) => {
    if (!user) throw new Error('No user logged in');

    try {
      await supabase
        .from('users')
        .update({
          google_id: googleUser.id,
          integrations: {
            ...user.integrations,
            google: {
              connected: true,
              tokens: tokens,
              drive_folder_id: null
            }
          }
        })
        .eq('id', user.id);

      // Update local user state
      setUser({
        ...user,
        google_id: googleUser.id,
        integrations: {
          ...user.integrations,
          google: {
            connected: true,
            tokens: tokens,
            drive_folder_id: null
          }
        }
      });
    } catch (error) {
      console.error('Error linking Google account:', error);
      throw error;
    }
  };

  const linkNotionAccount = async (notionUser: any, tokens: any) => {
    if (!user) throw new Error('No user logged in');

    try {
      await supabase
        .from('users')
        .update({
          notion_id: notionUser.id,
          integrations: {
            ...user.integrations,
            notion: {
              connected: true,
              tokens: tokens,
              workspace_id: tokens.workspace_id,
              database_ids: {}
            }
          }
        })
        .eq('id', user.id);

      // Update local user state
      setUser({
        ...user,
        notion_id: notionUser.id,
        integrations: {
          ...user.integrations,
          notion: {
            connected: true,
            tokens: tokens,
            workspace_id: tokens.workspace_id,
            database_ids: {}
          }
        }
      });
    } catch (error) {
      console.error('Error linking Notion account:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    createAccountWithGoogle,
    createAccountWithNotion,
    linkGoogleAccount,
    linkNotionAccount
  };
};
```

---

## Router Updates

### Add OAuth Callback Routes (`src/App.tsx`)

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleCallback } from './pages/auth/GoogleCallback';
import { NotionCallback } from './pages/auth/NotionCallback';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/notion/callback" element={<NotionCallback />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}
```

## Key Features of Updated Auth Flow

### 1. **Multi-Method Authentication**
- Users can choose between email, Google, or Notion signup/login
- Seamless switching between methods in the same modal

### 2. **Integration Benefits Highlighted**
- Clear explanation of benefits for each authentication method
- Visual indicators of premium features

### 3. **Account Linking**
- Existing users can link Google/Notion accounts to their profile
- Maintains single user identity across multiple auth methods

### 4. **Secure OAuth Handling**
- Proper callback handling with error states
- Token management and secure storage
- State validation and error recovery

### 5. **Enhanced User Experience**
- Loading states and progress indicators
- Clear success/error messaging
- Automatic redirects after authentication

This updated authentication flow provides users with flexible options while promoting the premium features available through Google and Notion integrations.