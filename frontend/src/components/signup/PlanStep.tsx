import React from 'react';
import { useAtom } from 'jotai';
import { authService } from '../../services/authService';
import { accessTokenAtom, userAtom } from '../../store/authAtoms';

interface ProfileData {
  age: number | null;
  avatarUrl: string | null;
}

interface PlanStepProps {
  selectedPlan: 'free' | 'pro' | 'premium' | null;
  userId: string | null;
  profileData?: ProfileData;
  onSelectPlan: (plan: 'free' | 'pro' | 'premium') => void;
  onComplete: (user: any, session: any) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

interface PlanOption {
  id: 'free' | 'pro' | 'premium';
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const planOptions: PlanOption[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['Basic quiz access', 'Progress tracking', 'Community support', 'Mobile app access']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99/month',
    description: 'For serious learners',
    features: ['Everything in Free', 'Unlimited quiz attempts', 'Advanced analytics', 'Priority support', 'Custom study plans', 'Offline access'],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99/month',
    description: 'For power users',
    features: ['Everything in Pro', 'AI-powered recommendations', 'Personal coaching', '1-on-1 tutoring sessions', 'Advanced reporting', 'Team collaboration']
  }
];

export const PlanStep: React.FC<PlanStepProps> = ({
  selectedPlan,
  userId,
  profileData,
  onSelectPlan,
  onComplete,
  onError,
  onLoading,
  isLoading,
  error,
}) => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [authUser] = useAtom(userAtom);
  
  // Use userId from props or fall back to auth state
  const effectiveUserId = userId || authUser?.id;

  const handleSubmit = async () => {
    if (!selectedPlan) {
      onError('Please select a plan to continue');
      return;
    }
    
    if (!effectiveUserId) {
      onError('User session not found. Please try logging in again.');
      return;
    }

    onLoading(true);
    onError('');

    try {
      // Build update payload with profile data and plan
      const updatePayload: {
        userId: string;
        planType: 'free' | 'pro' | 'premium';
        age?: number;
        avatarUrl?: string;
      } = {
        userId: effectiveUserId,
        planType: selectedPlan,
      };

      // Include age if provided
      if (profileData?.age) {
        updatePayload.age = profileData.age;
      }

      // Include avatarUrl if provided
      if (profileData?.avatarUrl) {
        updatePayload.avatarUrl = profileData.avatarUrl;
      }

      const response = await authService.updateProfile(
        updatePayload,
        accessToken || ''
      );

      if (response.success && response.user) {
        const session = {
          accessToken: accessToken || '',
          refreshToken: '',
          expiresAt: Date.now() + 3600000,
        };
        onComplete(response.user, session);
      } else {
        onError(response.message || 'Failed to update plan');
      }
    } catch (err) {
      onError('An unexpected error occurred. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#171717' }}>Choose your plan</h2>
        <p className="mt-2 text-sm" style={{ color: '#737373' }}>
          Select the plan that best fits your learning goals
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {planOptions.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-lg border-2 p-4 cursor-pointer transition-all"
            style={{
              borderColor: selectedPlan === plan.id ? '#581c87' : '#e5e5e5',
              backgroundColor: selectedPlan === plan.id ? '#faf5ff' : '#ffffff',
              boxShadow: plan.popular ? '0 0 0 2px rgba(88, 28, 135, 0.3)' : 'none'
            }}
            onClick={() => onSelectPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#581c87' }}>
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={plan.id}
                  name="plan"
                  type="radio"
                  checked={selectedPlan === plan.id}
                  onChange={() => onSelectPlan(plan.id)}
                  className="h-4 w-4"
                  style={{ accentColor: '#581c87' }}
                />
              </div>

              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={plan.id} className="font-medium cursor-pointer" style={{ color: '#171717' }}>
                    {plan.name}
                  </label>
                  <span className="text-lg font-bold" style={{ color: '#171717' }}>
                    {plan.price}
                  </span>
                </div>
                
                <p className="text-sm mt-1" style={{ color: '#737373' }}>
                  {plan.description}
                </p>

                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm" style={{ color: '#737373' }}>
                      <svg className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md p-4 mb-6" style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe' }}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm" style={{ color: '#581c87' }}>
              You can change your plan anytime from your account settings. 
              {selectedPlan !== 'free' && ' Payment processing will be handled in the next step.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !selectedPlan}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#581c87' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Completing setup...
            </div>
          ) : (
            `Complete Setup with ${selectedPlan ? planOptions.find(p => p.id === selectedPlan)?.name : 'Selected'} Plan`
          )}
        </button>
      </div>

      {selectedPlan === 'free' && (
        <div className="mt-4 text-center">
          <p className="text-xs" style={{ color: '#737373' }}>
            No payment required for the Free plan
          </p>
        </div>
      )}
    </div>
  );
};
