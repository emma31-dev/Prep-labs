import React, { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';
import { setAuthAtom } from '../../store/authAtoms';

interface VerificationStepProps {
  email: string;
  onNext: () => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  onNext,
  onError,
  onLoading,
  isLoading,
  error,
}) => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [, updateAuth] = useAtom(setAuthAtom);
  const [isVerified, setIsVerified] = useState(false);

  // Poll for verification status
  const checkVerificationStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email_confirmed_at) {
        setIsVerified(true);
        
        // Update auth state
        updateAuth({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata?.full_name || '',
            avatarUrl: null,
            age: null,
            planType: 'free',
            emailVerified: true,
          },
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        });
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking verification status:', err);
      return false;
    }
  }, [updateAuth]);

  // Poll every 3 seconds for verification status
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const verified = await checkVerificationStatus();
      if (verified) {
        clearInterval(pollInterval);
      }
    }, 3000);

    // Initial check
    checkVerificationStatus();

    return () => clearInterval(pollInterval);
  }, [checkVerificationStatus]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;

    onLoading(true);
    onError('');
    setResendSuccess(false);

    try {
      const response = await authService.resendVerification(email);
      if (response.success) {
        setResendSuccess(true);
        setResendCooldown(60);
      } else {
        onError(response.message || 'Failed to resend verification email');
      }
    } catch (err) {
      onError('An unexpected error occurred. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  const handleContinue = async () => {
    // Check verification one more time before proceeding
    const verified = await checkVerificationStatus();
    if (verified || isVerified) {
      onNext();
    } else {
      onError('Please verify your email before continuing. Check your inbox and click the verification link.');
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full" style={{ backgroundColor: isVerified ? '#dcfce7' : '#f3e8ff' }}>
          {isVerified ? (
            <svg className="h-6 w-6" style={{ color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-6 w-6" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {isVerified ? (
          <>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#16a34a' }}>Email Verified!</h2>
            <p className="text-sm mb-4" style={{ color: '#737373' }}>
              Your email has been verified. Click continue to set up your profile.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#171717' }}>Check your email</h2>
            <p className="text-sm mb-4" style={{ color: '#737373' }}>
              We've sent a verification link to:
            </p>
            <p className="text-sm font-medium mb-6" style={{ color: '#171717' }}>
              {email}
            </p>
          </>
        )}
      </div>

      <div className="space-y-4">
        {!isVerified && (
          <div className="rounded-md p-4" style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe' }}>
            <div className="text-sm" style={{ color: '#581c87' }}>
              <p className="font-medium mb-1">Next steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>This page will automatically update when verified</li>
              </ol>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <div className="text-sm text-green-700">
              ✓ Email verified successfully! You can now continue.
            </div>
          </div>
        )}

        {resendSuccess && !isVerified && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">
              Verification email sent successfully! Please check your inbox.
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {!isVerified && (
          <div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading || resendCooldown > 0}
              className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: '#e5e5e5', color: '#171717' }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend verification email'
              )}
            </button>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!isVerified}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: isVerified ? '#16a34a' : '#581c87' }}
            onMouseEnter={(e) => {
              if (isVerified) {
                e.currentTarget.style.backgroundColor = '#15803d';
              } else {
                e.currentTarget.style.backgroundColor = '#6b21a8';
              }
            }}
            onMouseLeave={(e) => {
              if (isVerified) {
                e.currentTarget.style.backgroundColor = '#16a34a';
              } else {
                e.currentTarget.style.backgroundColor = '#581c87';
              }
            }}
          >
            {isVerified ? 'Continue to Profile Setup →' : 'Waiting for verification...'}
          </button>
        </div>

        {!isVerified && (
          <div className="text-xs" style={{ color: '#737373' }}>
            <p>
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                className="underline disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: '#581c87' }}
              >
                resend it
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
