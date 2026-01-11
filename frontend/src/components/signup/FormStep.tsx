import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { SignupFormData } from './SignupFlow';
import signupPromoImage from '/authImage.png';

// Eye icons
const EyeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

interface FormStepProps {
  formData: SignupFormData;
  onUpdateFormData: (data: Partial<SignupFormData>) => void;
  onNext: () => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  onSetUserId: (userId: string) => void;
  isLoading: boolean;
  error: string | null;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
}

export const FormStep: React.FC<FormStepProps> = ({
  formData,
  onUpdateFormData,
  onNext,
  onError,
  onLoading,
  onSetUserId,
  isLoading,
  error,
}) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    onUpdateFormData({ [field]: value });
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onLoading(true);
    onError('');

    try {
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (response.success && response.userId) {
        onSetUserId(response.userId);
        onNext();
      } else {
        onError(response.message || 'Signup failed');
      }
    } catch (err) {
      onError('An unexpected error occurred. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: '#faf5ff4d' }}>
      <div className="w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row" style={{ backgroundColor: '#ffffff' }}>
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#171717' }}>
              Create your account
            </h1>
            <p className="mb-8" style={{ color: '#737373' }}>
              Get started with your free account and start generating AI-powered tests.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-medium" style={{ color: '#171717' }}>
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="h-12"
                  style={{ backgroundColor: '#ffffff', borderColor: formErrors.fullName ? '#ef4444' : '#e5e5e5' }}
                  required
                  disabled={isLoading}
                />
                {formErrors.fullName && (
                  <p className="text-sm text-red-600">{formErrors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium" style={{ color: '#171717' }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-12"
                  style={{ backgroundColor: '#ffffff', borderColor: formErrors.email ? '#ef4444' : '#e5e5e5' }}
                  required
                  disabled={isLoading}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium" style={{ color: '#171717' }}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 8 characters)"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 pr-12"
                    style={{ backgroundColor: '#ffffff', borderColor: formErrors.password ? '#ef4444' : '#e5e5e5' }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#737373' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#171717'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#737373'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                style={{ backgroundColor: '#581c87', color: '#fafafa' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#e5e5e5' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ backgroundColor: '#ffffff', color: '#737373' }}>
                  or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-full flex items-center justify-center gap-3"
                style={{ borderColor: '#e5e5e5' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#faf5ff';
                  e.currentTarget.style.borderColor = '#fb923c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Continue with Google</span>
              </Button>
            </div>

            <p className="text-center mt-8" style={{ color: '#737373' }}>
              Already have an account?{" "}
              <Link 
                to="/auth/login"
                className="font-semibold hover:underline no-underline"
                style={{ color: '#581c87' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block w-1/2 relative">
          <img 
            src={signupPromoImage} 
            alt="Person working on laptop" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
