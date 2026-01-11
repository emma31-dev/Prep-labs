/**
 * Resource type definitions for the Resources Upload feature
 */

// Category options for resources
export type ResourceCategory = 'math' | 'english' | 'science' | 'history' | 'geography' | 'other';

// Status of resource processing
export type ResourceStatus = 'pending' | 'processed' | 'failed';

// Individual image within a resource
export interface ResourceImage {
  id: number;
  url: string;
  filename: string;
  size_bytes: number;
  uploaded_at: string;
}

// Main resource entity matching database schema
export interface Resource {
  id: string;
  user_id: string;
  title: string;
  category: ResourceCategory;
  topic: string;
  description: string | null;
  images: ResourceImage[];
  status: ResourceStatus;
  created_at: string;
  updated_at: string;
}

// Input for creating a new resource
export interface CreateResourceInput {
  title: string;
  category: ResourceCategory;
  topic: string;
  description?: string;
  files: File[];
}

// Filters for querying resources
export interface ResourceFilters {
  category?: ResourceCategory;
  sortBy?: 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Track upload progress for individual files
export interface UploadProgress {
  fileIndex: number;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}
