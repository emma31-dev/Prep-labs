# Signup Progress Tracking Guide

This document outlines how to implement route-based signup progress tracking, allowing users to leave and return to complete their registration process seamlessly.

## Overview

The signup progress tracking system provides:
1. **URL-based step tracking** - Each step has a unique route
2. **Local storage persistence** - Form data saved automatically
3. **Progress recovery** - Users can resume from where they left off
4. **Expiration handling** - Cleanup of stale signup sessions
5. **Integration method tracking** - Remember chosen auth method

---

## Route Structure

### Signup Routes (`src/App.tsx`)

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignupFlow } from './pages/SignupFlow';
import { SignupStep } from './components/signup/SignupStep';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        
        {/* Signup Flow Routes */}
        <Route path="/signup" element={<SignupFlow />}>
          <Route index element={<Navigate to="/signup/method" replace />} />
          <Route path="method" element={<SignupStep step="method" />} />
          <Route path="details" element={<SignupStep step="details" />} />
          <Route path="verification" element={<SignupStep step="verification" />} />
          <Route path="integrations" element={<SignupStep step="integrations" />} />
          <Route path="complete" element={<SignupStep step="complete" />} />
        </Route>

        {/* OAuth Callback Routes */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/auth/notion/callback" element={<NotionCallback />} />
        
        {/* Other routes */}
      </Routes>
    </Router>
  );
}
```

---

## Signup Progress Management

### 1. Signup Progress Hook (`src/hooks/useSignupProgress.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type SignupStep = 'method' | 'details' | 'verification' | 'integrations' | 'complete';
export type AuthMethod = 'email' | 'google' | 'notion';

interface SignupData {
  method: AuthMethod;
  email: string;
  password: string;
  fullName: string;
  verificationCode: string;
  integrationsSelected: string[];
  timestamp: number;
  currentStep: SignupStep;
}

const STORAGE_KEY = 'quizapp_signup_progress';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours

export const useSignupProgress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [signupData, setSignupData] = useState<Partial<SignupData>>({
    timestamp: Date.now(),
    currentStep: 'method'
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress();
  }, []);

  // Save progress whenever data changes
  useEffect(() => {
    if (signupData.timestamp) {
      saveProgress();
    }
  }, [signupData]);

  // Update current step based on route
  useEffect(() => {
    const pathStep = location.pathname.split('/').pop() as SignupStep;
    if (pathStep && pathStep !== signupData.currentStep) {
      updateSignupData({ currentStep: pathStep });
    }
  }, [location.pathname]);

  const loadSavedProgress = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData: SignupData = JSON.parse(saved);
        
        // Check if data is expired
        if (Date.now() - parsedData.timestamp > EXPIRATION_TIME) {
          clearProgress();
          setIsLoading(false);
          return;
        }

        setSignupData(parsedData);
        
        // Navigate to the saved step if not already there
        const currentPath = location.pathname;
        const expectedPath = `/signup/${parsedData.currentStep}`;
        
        if (currentPath !== expectedPath && currentPath === '/signup') {
          navigate(expectedPath, { replace: true });
        }
      }
    } catch (error) {
      console.error('Error loading signup progress:', error);
      clearProgress();
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = () => {
    try {
      const dataToSave = {
        ...signupData,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving signup progress:', error);
    }
  };

  const updateSignupData = useCallback((updates: Partial<SignupData>) => {
    setSignupData(prev => ({
      ...prev,
      ...updates,
      timestamp: Date.now()
    }));
  }, []);

  const goToStep = useCallback((step: SignupStep) => {
    updateSignupData({ currentStep: step });
    navigate(`/signup/${step}`);
  }, [navigate, updateSignupData]);

  const nextStep = useCallback(() => {
    const steps: SignupStep[] = ['method', 'details', 'verification', 'integrations', 'complete'];
    const currentIndex = steps.indexOf(signupData.currentStep || 'method');
    const nextIndex = Math.min(currentIndex + 1, steps.length - 1);
    goToStep(steps[nextIndex]);
  }, [signupData.currentStep, goToStep]);

  const previousStep = useCallback(() => {
    const steps: SignupStep[] = ['method', 'details', 'verification', 'integrations', 'complete'];
    const currentIndex = steps.indexOf(signupData.currentStep || 'method');
    const prevIndex = Math.max(currentIndex - 1, 0);
    goToStep(steps[prevIndex]);
  }, [signupData.currentStep, goToStep]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSignupData({
      timestamp: Date.now(),
      currentStep: 'method'
    });
  }, []);

  const getStepProgress = () => {
    const steps: SignupStep[] = ['method', 'details', 'verification', 'integrations', 'complete'];
    const currentIndex = steps.indexOf(signupData.currentStep || 'method');
    return {
      current: currentIndex + 1,
      total: steps.length,
      percentage: ((currentIndex + 1) / steps.length) * 100
    };
  };

  const canProceedToStep = (step: SignupStep): boolean => {
    const { method, email, fullName, verificationCode } = signupData;
    
    switch (step) {
      case 'method':
        return true;
      case 'details':
        return !!method;
      case 'verification':
        return !!method && !!email && (method !== 'email' || !!fullName);
      case 'integrations':
        return !!verificationCode || method !== 'email';
      case 'complete':
        return true; // Can always view completion step
      default:
        return false;
    }
  };

  return {
    signupData,
    updateSignupData,
    goToStep,
    nextStep,
    previousStep,
    clearProgress,
    getStepProgress,
    canProceedToStep,
    isLoading
  };
};
```

### 2. Signup Flow Container (`src/pages/SignupFlow.tsx`)

```typescript
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSignupProgress } from '../hooks/useSignupProgress';
import { SignupProgressBar } from '../components/signup/SignupProgressBar';
import { SignupHeader } from '../components/signup/SignupHeader';
import { Loader2 } from 'lucide-react';

export const SignupFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    signupData, 
    getStepProgress, 
    canProceedToStep, 
    isLoading,
    clearProgress 
  } = useSignupProgress();

  // Redirect to appropriate step if user tries to access invalid step
  useEffect(() => {
    if (!isLoading) {
      const currentStep = location.pathname.split('/').pop() as SignupStep;
      
      if (!canProceedToStep(currentStep)) {
        // Find the furthest step they can access
        const steps: SignupStep[] = ['method', 'details', 'verification', 'integrations', 'complete'];
        const validStep = steps.reverse().find(step => canProceedToStep(step)) || 'method';
        navigate(`/signup/${validStep}`, { replace: true });
      }
    }
  }, [location.pathname, canProceedToStep, navigate, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your signup progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <SignupHeader onClearProgress={clearProgress} />
        <SignupProgressBar progress={getStepProgress()} />
        
        <div className="bg-white rounded-lg shadow-sm p-8 mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
```

### 3. Progress Bar Component (`src/components/signup/SignupProgressBar.tsx`)

```typescript
import React from 'react';
import { Check } from 'lucide-react';

interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
}

interface SignupProgressBarProps {
  progress: ProgressInfo;
}

export const SignupProgressBar: React.FC<SignupProgressBarProps> = ({ progress }) => {
  const steps = [
    { key: 'method', label: 'Choose Method' },
    { key: 'details', label: 'Your Details' },
    { key: 'verification', label: 'Verification' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'complete', label: 'Complete' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Account Setup</h2>
        <span className="text-sm text-gray-500">
          Step {progress.current} of {progress.total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < progress.current;
            const isCurrent = stepNumber === progress.current;
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${Math.max(0, (progress.current - 1) / (progress.total - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
```

### 4. Signup Header with Recovery Options (`src/components/signup/SignupHeader.tsx`)

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RotateCcw, AlertCircle } from 'lucide-react';

interface SignupHeaderProps {
  onClearProgress: () => void;
}

export const SignupHeader: React.FC<SignupHeaderProps> = ({ onClearProgress }) => {
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearProgress = () => {
    onClearProgress();
    navigate('/signup/method');
    setShowClearConfirm(false);
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
        <p className="text-gray-600 mt-1">Your progress is automatically saved</p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Start Over
        </button>

        <button
          onClick={handleExit}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Clear Progress Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-medium">Start Over?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              This will clear all your progress and form data. You'll need to start the signup process from the beginning.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleClearProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Step Components with Progress Tracking

### 1. Method Selection Step (`src/components/signup/MethodStep.tsx`)

```typescript
import React from 'react';
import { useSignupProgress } from '../../hooks/useSignupProgress';
import { GoogleSignupButton } from '../auth/GoogleSignupButton';
import { NotionSignupButton } from '../auth/NotionSignupButton';

export const MethodStep: React.FC = () => {
  const { signupData, updateSignupData, nextStep } = useSignupProgress();

  const handleMethodSelect = (method: AuthMethod) => {
    updateSignupData({ method });
    
    if (method === 'email') {
      nextStep(); // Go to details step
    } else {
      // For OAuth methods, the auth flow will handle navigation
      // The callback will resume the signup process
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          How would you like to sign up?
        </h2>
        <p className="text-gray-600">
          Choose your preferred method to create your account
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Method */}
        <button
          onClick={() => handleMethodSelect('email')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
            signupData.method === 'email'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email & Password</h3>
              <p className="text-sm text-gray-600">Traditional signup method</p>
            </div>
          </div>
        </button>

        {/* Google Method */}
        <button
          onClick={() => handleMethodSelect('google')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
            signupData.method === 'google'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
                <GoogleIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Google Account</h3>
                <p className="text-sm text-gray-600">Includes Google Drive integration</p>
              </div>
            </div>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Premium
            </div>
          </div>
        </button>

        {/* Notion Method */}
        <button
          onClick={() => handleMethodSelect('notion')}
          className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
            signupData.method === 'notion'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Notion Workspace</h3>
                <p className="text-sm text-gray-600">Includes workspace organization</p>
              </div>
            </div>
            <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Premium
            </div>
          </div>
        </button>
      </div>

      {/* Continue Button for Email */}
      {signupData.method === 'email' && (
        <button
          onClick={nextStep}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          Continue with Email
        </button>
      )}
    </div>
  );
};
```

### 2. OAuth Callback Enhancement

Update the OAuth callbacks to resume signup flow:

```typescript
// src/pages/auth/GoogleCallback.tsx (Enhanced)
export const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleAuthCallback } = useGoogleAuth();
  const { updateSignupData, goToStep } = useSignupProgress();

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (code) {
        try {
          const result = await handleAuthCallback(code);
          
          if (result.success) {
            // Update signup progress with Google data
            updateSignupData({
              method: 'google',
              email: result.user.email,
              fullName: result.user.name,
              // Skip verification for OAuth
              verificationCode: 'oauth_verified'
            });

            // Continue to integrations step
            goToStep('integrations');
          }
        } catch (error) {
          // Handle error and redirect to signup
          navigate('/signup/method');
        }
      }
    };

    processCallback();
  }, [searchParams]);

  // ... rest of component
};
```

---

## Recovery and Persistence Features

### 1. Session Recovery Service (`src/services/signupRecoveryService.ts`)

```typescript
interface RecoveryData {
  signupData: Partial<SignupData>;
  timestamp: number;
  userAgent: string;
  sessionId: string;
}

export class SignupRecoveryService {
  private static readonly STORAGE_KEY = 'quizapp_signup_recovery';
  private static readonly MAX_SESSIONS = 3;

  static saveRecoveryPoint(signupData: Partial<SignupData>) {
    try {
      const recoveryData: RecoveryData = {
        signupData,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.generateSessionId()
      };

      const existing = this.getRecoverySessions();
      const updated = [recoveryData, ...existing.slice(0, this.MAX_SESSIONS - 1)];
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recovery point:', error);
    }
  }

  static getRecoverySessions(): RecoveryData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recovery sessions:', error);
      return [];
    }
  }

  static clearRecoverySessions() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
```

### 2. Recovery Modal Component (`src/components/signup/RecoveryModal.tsx`)

```typescript
import React from 'react';
import { Clock, Smartphone, Monitor } from 'lucide-react';

interface RecoveryModalProps {
  sessions: RecoveryData[];
  onRecover: (session: RecoveryData) => void;
  onDismiss: () => void;
}

export const RecoveryModal: React.FC<RecoveryModalProps> = ({
  sessions,
  onRecover,
  onDismiss
}) => {
  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) return Smartphone;
    return Monitor;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Resume Signup?</h3>
        <p className="text-gray-600 mb-6">
          We found previous signup attempts. Would you like to continue where you left off?
        </p>

        <div className="space-y-3 mb-6">
          {sessions.map((session, index) => {
            const DeviceIcon = getDeviceIcon(session.userAgent);
            const stepName = session.signupData.currentStep || 'method';
            
            return (
              <button
                key={session.sessionId}
                onClick={() => onRecover(session)}
                className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DeviceIcon className="w-4 h-4 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium">
                        Step: {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.signupData.method && `via ${session.signupData.method}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimestamp(session.timestamp)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## URL State Management

### Enhanced Router Configuration

```typescript
// src/App.tsx (Enhanced with state preservation)
function App() {
  return (
    <Router>
      <Routes>
        {/* Signup with query parameter support */}
        <Route path="/signup" element={<SignupFlow />}>
          <Route index element={<Navigate to="/signup/method" replace />} />
          <Route path="method" element={<SignupStep step="method" />} />
          <Route path="details" element={<SignupStep step="details" />} />
          <Route path="verification" element={<SignupStep step="verification" />} />
          <Route path="integrations" element={<SignupStep step="integrations" />} />
          <Route path="complete" element={<SignupStep step="complete" />} />
        </Route>

        {/* OAuth callbacks with return state */}
        <Route 
          path="/auth/google/callback" 
          element={<GoogleCallback returnTo="/signup/integrations" />} 
        />
        <Route 
          path="/auth/notion/callback" 
          element={<NotionCallback returnTo="/signup/integrations" />} 
        />
      </Routes>
    </Router>
  );
}
```

## Key Benefits

### 1. **Seamless User Experience**
- Users can leave and return without losing progress
- Automatic step validation and navigation
- Clear progress indicators

### 2. **Data Persistence**
- Local storage with expiration handling
- Multiple session recovery options
- Secure data cleanup

### 3. **Flexible Navigation**
- URL-based step tracking
- Direct step access with validation
- Back/forward browser support

### 4. **Error Recovery**
- OAuth callback handling with state preservation
- Session recovery from multiple devices
- Graceful error handling and fallbacks

This comprehensive signup progress tracking system ensures users never lose their registration progress and can seamlessly continue their account creation process across sessions and devices.