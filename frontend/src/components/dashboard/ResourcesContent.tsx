import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { resourceService } from '../../services/resourceService';
import type { Resource, ResourceCategory, ResourceFilters as ResourceFiltersType } from '../../types/resource';
import ResourceUploadModal from './ResourceUploadModal';
import ResourceFiltersComponent from './ResourceFilters';
import ResourceCard from './ResourceCard';

const ResourcesContent = () => {
  const { user, isAuthenticated, isLoading: authLoading, accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch resources
  const fetchResources = useCallback(async () => {
    // Don't fetch if auth is still loading
    if (authLoading) return;
    
    // If not authenticated, don't try to fetch
    if (!isAuthenticated || !user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filters: ResourceFiltersType = {
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        sortBy,
        sortOrder,
      };
      const data = await resourceService.getResources(user.id, filters, accessToken || undefined);
      setResources(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load resources';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, accessToken, authLoading, isAuthenticated, categoryFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleUploadSuccess = () => {
    fetchResources();
  };

  // Handle opening upload modal - no auth check needed since dashboard is protected
  const handleOpenUploadModal = () => {
    setIsModalOpen(true);
  };

  const handleFilterChange = (category: ResourceCategory | 'all') => {
    setCategoryFilter(category);
  };

  const handleSortChange = (newSortBy: 'created_at' | 'title', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>
          Resources
        </h1>
        <button
          onClick={handleOpenUploadModal}
          className="px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#581c87' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Resource
        </button>
      </div>

      {/* Filters */}
      <ResourceFiltersComponent
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onCategoryChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg
            className="animate-spin"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#581c87"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      ) : error ? (
        <div
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: '#fef2f2' }}
        >
          <p style={{ color: '#dc2626' }}>{error}</p>
          <button
            onClick={fetchResources}
            className="mt-3 px-4 py-2 rounded-lg font-medium text-sm"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            Try Again
          </button>
        </div>
      ) : resources.length === 0 ? (
        <div
          className="p-12 rounded-2xl text-center"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#faf5ff' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#581c87" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: '#171717' }}>
            {categoryFilter !== 'all' ? 'No resources found' : 'No resources yet'}
          </h3>
          <p className="text-sm mb-6" style={{ color: '#737373' }}>
            {categoryFilter !== 'all'
              ? 'Try changing the filter or upload a new resource.'
              : 'Upload your study materials to get started.'}
          </p>
          <button
            onClick={handleOpenUploadModal}
            className="px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#581c87' }}
          >
            Upload Resource
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <ResourceUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default ResourcesContent;
