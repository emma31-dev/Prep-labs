import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Authentication features may not work.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Upload a profile photo to Supabase storage bucket
 * @param file - The image file to upload (PNG, JPG, JPEG, max 5MB)
 * @param userId - The user's ID for organizing storage
 * @returns The public URL of the uploaded image
 */
export const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
  // Validate file type
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a PNG, JPG, or JPEG image.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
