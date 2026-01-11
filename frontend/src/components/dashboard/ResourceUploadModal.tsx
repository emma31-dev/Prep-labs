import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { resourceService, validateFile } from '../../services/resourceService';
import type { ResourceCategory, UploadProgress, CreateResourceInput } from '../../types/resource';

interface ResourceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: { value: ResourceCategory; label: string }[] = [
  { value: 'math', label: 'Math' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'other', label: 'Other' },
];

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ResourceUploadModal = ({ isOpen, onClose, onSuccess }: ResourceUploadModalProps) => {
  const { user, accessToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceCategory | ''>('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');

  // File state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});


  // Validate form fields
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length > 255) {
      errors.title = 'Title must be 255 characters or less';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!topic.trim()) {
      errors.topic = 'Topic is required';
    } else if (topic.length > 255) {
      errors.topic = 'Topic must be 255 characters or less';
    }

    if (description.length > 1000) {
      errors.description = 'Description must be 1000 characters or less';
    }

    if (selectedFiles.length === 0) {
      errors.files = 'At least one image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check max files limit
      if (selectedFiles.length + newFiles.length >= MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} images allowed`);
        return;
      }

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        return;
      }

      // Check for duplicates
      const isDuplicate = selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (isDuplicate) {
        errors.push(`${file.name}: File already selected`);
        return;
      }

      newFiles.push(file);
    });

    setFileErrors(errors);
    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setFormErrors((prev) => ({ ...prev, files: '' }));
    }
  }, [selectedFiles]);

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileErrors([]);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Check authentication before proceeding
    if (!user) {
      setUploadError('Please login to upload resources.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Initialize progress tracking
    const initialProgress: UploadProgress[] = selectedFiles.map((file, index) => ({
      fileIndex: index,
      fileName: file.name,
      progress: 0,
      status: 'pending',
    }));
    setUploadProgress(initialProgress);

    try {
      const input: CreateResourceInput = {
        title: title.trim(),
        category: category as ResourceCategory,
        topic: topic.trim(),
        description: description.trim() || undefined,
        files: selectedFiles,
      };

      // Update progress as files upload
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: 'uploading', progress: 50 } : p
          )
        );
      }

      await resourceService.createResource(input, user.id, accessToken || undefined);

      // Mark all as complete
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, status: 'complete', progress: 100 }))
      );

      setUploadSuccess(true);

      // Close modal and refresh after short delay
      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      
      setUploadProgress((prev) =>
        prev.map((p) => (p.status === 'uploading' ? { ...p, status: 'error' } : p))
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setTitle('');
    setCategory('');
    setTopic('');
    setDescription('');
    setSelectedFiles([]);
    setFileErrors([]);
    setFormErrors({});
    setUploadProgress([]);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl mx-4"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}
        >
          <h2 className="text-xl font-bold" style={{ color: '#171717' }}>
            Upload Resource
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ color: '#737373' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {uploadSuccess && (
            <div
              className="p-4 rounded-lg flex items-center gap-3"
              style={{ backgroundColor: '#dcfce7' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: '#16a34a' }}>Resource uploaded successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div
              className="p-4 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: '#fef2f2' }}
            >
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span style={{ color: '#dc2626' }}>{uploadError}</span>
              </div>
              <button
                onClick={() => setUploadError(null)}
                className="text-sm font-medium px-3 py-1 rounded"
                style={{ color: '#dc2626', backgroundColor: '#fee2e2' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
              Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="Enter resource title"
              disabled={isUploading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50"
              style={{
                borderColor: formErrors.title ? '#dc2626' : '#e5e5e5',
                '--tw-ring-color': '#9333ea',
              } as React.CSSProperties}
            />
            {formErrors.title && (
              <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{formErrors.title}</p>
            )}
            <p className="mt-1 text-xs" style={{ color: '#737373' }}>{title.length}/255</p>
          </div>


          {/* Category and Topic Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
                Category <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                disabled={isUploading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: formErrors.category ? '#dc2626' : '#e5e5e5',
                  '--tw-ring-color': '#9333ea',
                  color: category ? '#171717' : '#737373',
                } as React.CSSProperties}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{formErrors.category}</p>
              )}
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
                Topic <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={255}
                placeholder="Enter topic"
                disabled={isUploading}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50"
                style={{
                  borderColor: formErrors.topic ? '#dc2626' : '#e5e5e5',
                  '--tw-ring-color': '#9333ea',
                } as React.CSSProperties}
              />
              {formErrors.topic && (
                <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{formErrors.topic}</p>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
              Description <span style={{ color: '#737373' }}>(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              placeholder="Enter a description for your resource"
              rows={3}
              disabled={isUploading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 resize-none disabled:opacity-50"
              style={{
                borderColor: formErrors.description ? '#dc2626' : '#e5e5e5',
                '--tw-ring-color': '#9333ea',
              } as React.CSSProperties}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{formErrors.description}</p>
            )}
            <p className="mt-1 text-xs" style={{ color: '#737373' }}>{description.length}/1000</p>
          </div>


          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#171717' }}>
              Images <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-orange-400 hover:bg-orange-50"
              style={{
                borderColor: formErrors.files ? '#dc2626' : '#e5e5e5',
                backgroundColor: '#fafafa',
                pointerEvents: isUploading ? 'none' : 'auto',
                opacity: isUploading ? 0.5 : 1,
              }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#fff7ed' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="font-medium" style={{ color: '#171717' }}>
                Drop images here or click to browse
              </p>
              <p className="text-sm mt-1" style={{ color: '#737373' }}>
                Max {MAX_FILES} images, {MAX_FILE_SIZE / (1024 * 1024)}MB each (PNG, JPG, JPEG, WEBP)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            {formErrors.files && (
              <p className="mt-1 text-sm" style={{ color: '#dc2626' }}>{formErrors.files}</p>
            )}
          </div>

          {/* File Errors */}
          {fileErrors.length > 0 && (
            <div className="space-y-1">
              {fileErrors.map((error, index) => (
                <p key={index} className="text-sm" style={{ color: '#dc2626' }}>
                  {error}
                </p>
              ))}
            </div>
          )}


          {/* Image Previews */}
          {selectedFiles.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: '#171717' }}>
                Selected Images ({selectedFiles.length}/{MAX_FILES})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedFiles.map((file, index) => {
                  const progress = uploadProgress.find((p) => p.fileIndex === index);
                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group rounded-lg overflow-hidden border"
                      style={{ borderColor: '#e5e5e5' }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover"
                      />
                      {/* Remove Button */}
                      {!isUploading && (
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      )}
                      {/* Progress Overlay */}
                      {progress && progress.status === 'uploading' && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        >
                          <svg
                            className="animate-spin"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                        </div>
                      )}
                      {/* Complete Overlay */}
                      {progress && progress.status === 'complete' && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(22, 163, 74, 0.5)' }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      {/* File Info */}
                      <div className="p-2" style={{ backgroundColor: '#fafafa' }}>
                        <p className="text-xs truncate" style={{ color: '#171717' }}>
                          {file.name}
                        </p>
                        <p className="text-xs" style={{ color: '#737373' }}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Upload Progress */}
          {isUploading && uploadProgress.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: '#171717' }}>
                Uploading...
              </p>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#e5e5e5' }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: '#581c87',
                    width: `${
                      (uploadProgress.filter((p) => p.status === 'complete').length /
                        uploadProgress.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isUploading || uploadSuccess}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#581c87' }}
          >
            {isUploading ? 'Uploading...' : uploadSuccess ? 'Uploaded!' : 'Upload Resource'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadModal;
