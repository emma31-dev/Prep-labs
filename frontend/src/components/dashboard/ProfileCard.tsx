import { useRef, useState } from 'react';

interface ProfileCardProps {
  name: string;
  className?: string;
  studentId: string;
  avatar?: string | null;
  onAvatarChange?: (file: File) => Promise<void>;
  isUploading?: boolean;
}

const ProfileCard = ({ 
  name = "User",
  className = "Free Plan",
  studentId = "N/A",
  avatar,
  onAvatarChange,
  isUploading = false
}: ProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Get initials for avatar fallback
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PNG, JPG, or JPEG image');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    if (onAvatarChange) {
      try {
        await onAvatarChange(file);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAvatarClick = () => {
    if (!isUploading && onAvatarChange) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className="rounded-2xl p-6 flex items-center gap-6"
      style={{ 
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
      }}
    >
      {/* Avatar with upload */}
      <div className="relative group">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className={`w-28 h-28 rounded-full object-cover border-4 ${onAvatarChange ? 'cursor-pointer' : ''}`}
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={handleAvatarClick}
          />
        ) : (
          <div 
            className={`w-28 h-28 rounded-full flex items-center justify-center border-4 text-3xl font-bold ${onAvatarChange ? 'cursor-pointer' : ''}`}
            style={{ 
              borderColor: 'rgba(255,255,255,0.3)',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#ffffff'
            }}
            onClick={handleAvatarClick}
          >
            {getInitials(name)}
          </div>
        )}

        {/* Upload overlay */}
        {onAvatarChange && (
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="text-xs text-red-300 bg-red-900/50 px-2 py-1 rounded">
              {uploadError}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-white">
        <h1 className="text-3xl font-semibold mb-1">{name}</h1>
        <p className="text-white/80 text-lg">
          {className} <span className="mx-2">|</span> ID: {studentId}
        </p>
        {onAvatarChange && (
          <p className="text-white/60 text-sm mt-1">Click avatar to change photo</p>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
