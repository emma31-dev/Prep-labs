import React, { useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { uploadProfilePhoto } from '../../lib/supabase';
import { userAtom } from '../../store/authAtoms';
import type { SignupProfileData } from './SignupFlow';

interface ProfileStepProps {
  profileData: SignupProfileData;
  userId: string | null;
  onUpdateProfileData: (data: Partial<SignupProfileData>) => void;
  onNext: () => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
  error: string | null;
}

interface ProfileErrors {
  age?: string;
  photo?: string;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  profileData,
  userId,
  onUpdateProfileData,
  onNext,
  onError,
  onLoading,
  isLoading,
  error,
}) => {
  const [authUser] = useAtom(userAtom);
  const effectiveUserId = userId || authUser?.id;
  
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const errors: ProfileErrors = {};
    if (profileData.age === null || profileData.age === undefined) {
      errors.age = 'Age is required';
    } else if (profileData.age < 13 || profileData.age > 120) {
      errors.age = 'Age must be between 13 and 120';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAgeChange = (value: string) => {
    const age = value === '' ? null : parseInt(value, 10);
    onUpdateProfileData({ age });
    if (profileErrors.age) {
      setProfileErrors(prev => ({ ...prev, age: undefined }));
    }
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setProfileErrors(prev => ({ ...prev, photo: 'Invalid file type. Please upload a PNG, JPG, or JPEG image.' }));
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setProfileErrors(prev => ({ ...prev, photo: 'File size exceeds 5MB limit.' }));
      return;
    }

    setProfileErrors(prev => ({ ...prev, photo: undefined }));

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onUpdateProfileData({ avatarFile: file });
  };

  const handlePhotoUpload = async () => {
    if (!profileData.avatarFile || !effectiveUserId) return;
    setUploadingPhoto(true);
    onError('');
    try {
      const avatarUrl = await uploadProfilePhoto(profileData.avatarFile, effectiveUserId);
      onUpdateProfileData({ avatarUrl });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
      setProfileErrors(prev => ({ ...prev, photo: errorMessage }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    onUpdateProfileData({ avatarFile: null, avatarUrl: null });
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onLoading(true);
    onError('');

    try {
      // Try to upload photo if one is selected, but don't block on failure
      if (profileData.avatarFile && !profileData.avatarUrl) {
        try {
          await handlePhotoUpload();
        } catch (uploadErr) {
          console.warn('Photo upload failed, continuing without photo:', uploadErr);
          // Continue without the photo - it's optional
        }
      }
      onNext();
    } catch (err) {
      onError('Failed to process profile. Please try again.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#171717' }}>Complete your profile</h2>
        <p className="mt-2 text-sm" style={{ color: '#737373' }}>
          Tell us a bit about yourself
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium" style={{ color: '#171717' }}>
            Age
          </label>
          <div className="mt-1">
            <input
              id="age"
              name="age"
              type="number"
              min="13"
              max="120"
              required
              value={profileData.age || ''}
              onChange={(e) => handleAgeChange(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
              style={{ 
                borderColor: profileErrors.age ? '#ef4444' : '#e5e5e5',
                backgroundColor: '#ffffff'
              }}
              placeholder="Enter your age"
            />
            {profileErrors.age && (
              <p className="mt-2 text-sm text-red-600">{profileErrors.age}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
            Profile Photo (Optional)
          </label>
          
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {photoPreview || profileData.avatarUrl ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  style={{ border: '2px solid #d8b4fe' }}
                  src={photoPreview || profileData.avatarUrl || ''}
                  alt="Profile preview"
                />
              ) : (
                <div 
                  className="h-20 w-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#f3e8ff', border: '2px solid #d8b4fe' }}
                >
                  <svg className="h-8 w-8" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                onChange={handlePhotoSelect}
                className="hidden"
                id="photo-upload"
              />
              
              <div className="flex space-x-2">
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md bg-white hover:bg-gray-50"
                  style={{ borderColor: '#e5e5e5', color: '#171717' }}
                >
                  {profileData.avatarFile || profileData.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                </label>
                
                {(profileData.avatarFile || profileData.avatarUrl) && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md bg-white hover:bg-gray-50"
                    style={{ borderColor: '#e5e5e5', color: '#171717' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <p className="mt-1 text-xs" style={{ color: '#737373' }}>
                PNG, JPG, JPEG up to 5MB
              </p>
            </div>
          </div>

          {profileErrors.photo && (
            <p className="mt-2 text-sm text-red-600">{profileErrors.photo}</p>
          )}

          {uploadingPhoto && (
            <div className="mt-2 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" style={{ color: '#581c87' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm" style={{ color: '#737373' }}>Uploading photo...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading || uploadingPhoto}
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
                Processing...
              </div>
            ) : (
              'Continue to Plan Selection'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
