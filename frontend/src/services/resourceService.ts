import { supabase } from '../lib/supabase';
import type {
  Resource,
  ResourceImage,
  ResourceFilters,
  CreateResourceInput,
} from '../types/resource';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const BUCKET_NAME = 'resources';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

/**
 * Validate file type and size
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PNG, JPG, JPEG, WEBP files are allowed' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File exceeds 5MB limit' };
  }
  return { valid: true };
};

/**
 * Upload a single image to Supabase storage
 */
export const uploadImage = async (
  file: File,
  resourceId: string,
  userId: string,
  fileIndex: number
): Promise<ResourceImage> => {
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const fileName = `${fileIndex + 1}_${file.name}`;
  const filePath = `${userId}/${resourceId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    id: fileIndex + 1,
    url: urlData.publicUrl,
    filename: file.name,
    size_bytes: file.size,
    uploaded_at: new Date().toISOString(),
  };
};


/**
 * Create a new resource with uploaded images via backend API
 */
export const createResource = async (
  input: CreateResourceInput,
  userId: string,
  accessToken?: string
): Promise<Resource> => {
  // Generate a temporary ID for organizing uploads
  const resourceId = crypto.randomUUID();

  // Upload all images to Supabase storage first
  const uploadedImages: ResourceImage[] = [];
  for (let i = 0; i < input.files.length; i++) {
    const image = await uploadImage(input.files[i], resourceId, userId, i);
    uploadedImages.push(image);
  }

  // Get access token from localStorage if not provided
  const token = accessToken || getStoredAccessToken();
  
  if (!token) {
    // Clean up uploaded files on auth failure
    for (const img of uploadedImages) {
      const filePath = `${userId}/${resourceId}/${img.id}_${img.filename}`;
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }
    throw new Error('Authentication required. Please ensure you are logged in.');
  }

  // Create resource record via backend API
  const response = await fetch(`${API_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: input.title,
      category: input.category,
      topic: input.topic,
      description: input.description || null,
      images: uploadedImages,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    // Clean up uploaded files on failure
    for (const img of uploadedImages) {
      const filePath = `${userId}/${resourceId}/${img.id}_${img.filename}`;
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }
    throw new Error(data.message || 'Failed to create resource');
  }

  return data.resource as Resource;
};

/**
 * Fetch user's resources with optional filters via backend API
 */
export const getResources = async (
  _userId: string,
  filters?: ResourceFilters,
  accessToken?: string
): Promise<Resource[]> => {
  const token = accessToken || getStoredAccessToken();
  
  // If no token, return empty array (user might not be fully logged in yet)
  if (!token) {
    return [];
  }

  // Build query params
  const params = new URLSearchParams();
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  if (filters?.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  const queryString = params.toString();
  const url = `${API_URL}/resources${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch resources');
  }

  return data.resources as Resource[];
};


/**
 * Get a single resource by ID via backend API
 */
export const getResource = async (
  resourceId: string,
  accessToken?: string
): Promise<Resource> => {
  const token = accessToken || getStoredAccessToken();
  
  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch resource');
  }

  return data.resource as Resource;
};

/**
 * Delete a resource and its associated storage files via backend API
 */
export const deleteResource = async (
  resourceId: string,
  accessToken?: string
): Promise<void> => {
  const token = accessToken || getStoredAccessToken();
  
  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete resource');
  }
};

/**
 * Update a resource via backend API
 */
export const updateResource = async (
  resourceId: string,
  updates: {
    title?: string;
    category?: string;
    topic?: string;
    description?: string;
    status?: string;
  },
  accessToken?: string
): Promise<Resource> => {
  const token = accessToken || getStoredAccessToken();
  
  if (!token) {
    throw new Error('Session expired. Please login again.');
  }

  const response = await fetch(`${API_URL}/resources/${resourceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update resource');
  }

  return data.resource as Resource;
};

/**
 * Helper to get stored access token from localStorage
 * Jotai atomWithStorage stores the auth state directly
 */
const getStoredAccessToken = (): string | null => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      // Jotai atomWithStorage stores the value directly
      return parsed.accessToken || null;
    }
  } catch {
    // Ignore parse errors
  }
  return null;
};

/**
 * Resource service object for convenient imports
 */
export const resourceService = {
  validateFile,
  uploadImage,
  createResource,
  getResources,
  getResource,
  deleteResource,
  updateResource,
};
