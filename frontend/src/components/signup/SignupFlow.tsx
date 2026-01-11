import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAuthAtom, authAtom } from '../../store/authAtoms';
import { FormStep } from './FormStep';
import { VerificationStep } from './VerificationStep';
import { ProfileStep } from './ProfileStep';
import { PlanStep } from './PlanStep';

export type SignupStep = 'form' | 'verification' | 'profile' | 'plan';

export interface SignupFormData {
  email: string;
  password: string;
  fullName: string;
}

export interface SignupProfileData {
  age: number | null;
  avatarUrl: string | null;
  avatarFile: File | null;
}

export interface SignupFlowState {
  currentStep: SignupStep;
  formData: SignupFormData;
  profileData: SignupProfileData;
  selectedPlan: 'free' | 'pro' | 'premium' | null;
  userId: string | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: SignupFlowState = {
  currentStep: 'form',
  formData: {
    email: '',
    password: '',
    fullName: '',
  },
  profileData: {
    age: null,
    avatarUrl: null,
    avatarFile: null,
  },
  selectedPlan: null,
  userId: null,
  error: null,
  isLoading: false,
};

export const SignupFlow: React.FC = () => {
  const [state, setState] = useState<SignupFlowState>(initialState);
  const [, updateAuth] = useAtom(setAuthAtom);
  const [authState] = useAtom(authAtom);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam && ['form', 'verification', 'profile', 'plan'].includes(stepParam)) {
      if (stepParam === 'profile' && authState.isAuthenticated && authState.user?.emailVerified) {
        updateState({ 
          currentStep: 'profile' as SignupStep,
          userId: authState.user.id,
          formData: {
            email: authState.user.email,
            password: '',
            fullName: authState.user.fullName,
          }
        });
      } else if (stepParam === 'form' || stepParam === 'verification') {
        updateState({ currentStep: stepParam as SignupStep });
      }
    }
  }, [searchParams, authState]);

  const updateState = (updates: Partial<SignupFlowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const goToStep = (step: SignupStep) => {
    updateState({ currentStep: step, error: null });
  };

  const setError = (error: string) => {
    updateState({ error, isLoading: false });
  };

  const setLoading = (isLoading: boolean) => {
    updateState({ isLoading });
  };

  const updateFormData = (formData: Partial<SignupFormData>) => {
    updateState({ formData: { ...state.formData, ...formData } });
  };

  const updateProfileData = (profileData: Partial<SignupProfileData>) => {
    updateState({ profileData: { ...state.profileData, ...profileData } });
  };

  const setUserId = (userId: string) => {
    updateState({ userId });
  };

  const setSelectedPlan = (plan: 'free' | 'pro' | 'premium') => {
    updateState({ selectedPlan: plan });
  };

  const completeSignup = (user: any, session: any) => {
    updateAuth({
      isAuthenticated: true,
      isLoading: false,
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    navigate('/dashboard');
  };

  // Form step has its own full-page layout
  if (state.currentStep === 'form') {
    return (
      <FormStep
        formData={state.formData}
        onUpdateFormData={updateFormData}
        onNext={() => goToStep('verification')}
        onError={setError}
        onLoading={setLoading}
        onSetUserId={setUserId}
        isLoading={state.isLoading}
        error={state.error}
      />
    );
  }

  // Other steps use the card layout with progress indicator
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'verification':
        return (
          <VerificationStep
            email={state.formData.email}
            onNext={() => goToStep('profile')}
            onError={setError}
            onLoading={setLoading}
            isLoading={state.isLoading}
            error={state.error}
          />
        );
      case 'profile':
        return (
          <ProfileStep
            profileData={state.profileData}
            userId={state.userId}
            onUpdateProfileData={updateProfileData}
            onNext={() => goToStep('plan')}
            onError={setError}
            onLoading={setLoading}
            isLoading={state.isLoading}
            error={state.error}
          />
        );
      case 'plan':
        return (
          <PlanStep
            selectedPlan={state.selectedPlan}
            userId={state.userId}
            profileData={{
              age: state.profileData.age,
              avatarUrl: state.profileData.avatarUrl,
            }}
            onSelectPlan={setSelectedPlan}
            onComplete={completeSignup}
            onError={setError}
            onLoading={setLoading}
            isLoading={state.isLoading}
            error={state.error}
          />
        );
      default:
        return null;
    }
  };

  const stepNumber = state.currentStep === 'verification' ? 2 : state.currentStep === 'profile' ? 3 : 4;
  const stepName = state.currentStep === 'verification' ? 'Verify Email' : state.currentStep === 'profile' ? 'Profile' : 'Plan';
  const progressWidth = state.currentStep === 'verification' ? 50 : state.currentStep === 'profile' ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#faf5ff4d' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#737373' }}>
                Step {stepNumber} of 4
              </span>
              <span className="text-sm font-medium" style={{ color: '#171717' }}>
                {stepName}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressWidth}%`, backgroundColor: '#581c87' }}
              />
            </div>
          </div>

          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};
