import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { supabase } from '../lib/supabase';
import { setAuthAtom } from '../store/authAtoms';
import { authService } from '../services/authService';

/**
 * Email verification callback page
 * Handles the email verification process when users click the verification link
 * Shows success message and instructs user to return to original tab
 */
const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [, updateAuth] = useAtom(setAuthAtom);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Supabase can send different URL formats
        // Format 1: ?token_hash=xxx&type=signup
        // Format 2: ?token=xxx&type=signup
        // Format 3: Hash fragment #access_token=xxx&type=signup
        
        const tokenHash = searchParams.get('token_hash') || searchParams.get('token');
        const type = searchParams.get('type');

        console.log('Verification params:', { tokenHash: !!tokenHash, type });

        // Check if we have hash fragment params (Supabase sometimes uses this)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          // Handle hash-based verification (implicit flow)
          console.log('Using hash-based verification');
          
          const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
          
          if (userError || !user) {
            throw new Error(userError?.message || 'Failed to get user from token');
          }

          updateAuth({
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: user.id,
              email: user.email!,
              fullName: user.user_metadata?.full_name || '',
              avatarUrl: null,
              age: null,
              planType: 'free',
              emailVerified: true,
            },
            accessToken: accessToken,
            refreshToken: refreshToken || '',
          });

          setStatus('success');
          return;
        }

        if (!tokenHash) {
          // No token found - check if user is already verified via session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email_confirmed_at) {
            setStatus('success');
            return;
          }
          
          throw new Error('Invalid verification link - no token found');
        }

        // Verify the email with Supabase using OTP
        console.log('Verifying with OTP...');
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type === 'email' ? 'email' : 'signup'
        });

        if (verifyError) {
          console.error('OTP verification error:', verifyError);
          throw new Error(verifyError.message);
        }

        if (!data.user || !data.session) {
          throw new Error('Verification failed - no user or session returned');
        }

        // Update the auth atom with the verified session
        updateAuth({
          isAuthenticated: true,
          isLoading: false,
          user: {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name || '',
            avatarUrl: null,
            age: null,
            planType: 'free',
            emailVerified: true,
          },
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        });

        setStatus('success');

      } catch (err) {
        console.error('Email verification error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleEmailVerification();
  }, [searchParams, updateAuth]);

  const handleResendVerification = async () => {
    try {
      setStatus('verifying');
      setError(null);

      const email = searchParams.get('email');
      if (!email) {
        throw new Error('Email not found. Please try signing up again.');
      }

      await authService.resendVerification(email);
      setStatus('success');
      setError('Verification email sent! Please check your inbox.');
    } catch (err) {
      console.error('Resend verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
      setStatus('error');
    }
  };

  const handleCloseTab = () => {
    // Try to close the tab (works if opened via window.open)
    window.close();
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#581c87' }}></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#171717' }}>Verifying your email...</h2>
            <p style={{ color: '#737373' }}>Please wait while we confirm your email address.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            {/* Success checkmark animation */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6" style={{ backgroundColor: '#dcfce7' }}>
              <svg className="h-10 w-10" style={{ color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#171717' }}>
              Email Verified!
            </h2>
            
            <p className="text-lg mb-6" style={{ color: '#737373' }}>
              Your email has been successfully verified.
            </p>

            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#f3e8ff', border: '1px solid #d8b4fe' }}>
              <div className="flex items-start">
                <svg className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-left" style={{ color: '#581c87' }}>
                  You can now close this tab and return to the signup page to complete your profile setup.
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseTab}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mb-3"
              style={{ backgroundColor: '#581c87' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
            >
              Close this tab
            </button>

            <p className="text-xs" style={{ color: '#a3a3a3' }}>
              If the tab doesn't close automatically, please close it manually and return to your signup.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6" style={{ backgroundColor: '#fee2e2' }}>
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-3" style={{ color: '#171717' }}>Verification Failed</h2>
            <p className="text-red-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{ backgroundColor: '#581c87' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
              >
                Resend verification email
              </button>
              <button
                onClick={handleCloseTab}
                className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
                style={{ borderColor: '#e5e5e5', color: '#171717' }}
              >
                Close this tab
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#faf5ff4d' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
