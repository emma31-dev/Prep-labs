import type { Resource, ResourceCategory, ResourceStatus } from '../../types/resource';

interface ResourceCardProps {
  resource: Resource;
}

// Category badge colors (purple/orange alternating per design)
const CATEGORY_STYLES: Record<ResourceCategory, { bg: string; text: string }> = {
  math: { bg: '#faf5ff', text: '#581c87' },
  english: { bg: '#fff7ed', text: '#ea580c' },
  science: { bg: '#faf5ff', text: '#581c87' },
  history: { bg: '#fff7ed', text: '#ea580c' },
  geography: { bg: '#faf5ff', text: '#581c87' },
  other: { bg: '#f5f5f5', text: '#737373' },
};

// Status indicator styles
const STATUS_STYLES: Record<ResourceStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: '#fef3c7', text: '#d97706', label: 'Pending' },
  processed: { bg: '#dcfce7', text: '#16a34a', label: 'Processed' },
  failed: { bg: '#fef2f2', text: '#dc2626', label: 'Failed' },
};

// Category labels
const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  math: 'Math',
  english: 'English',
  science: 'Science',
  history: 'History',
  geography: 'Geography',
  other: 'Other',
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const categoryStyle = CATEGORY_STYLES[resource.category];
  const statusStyle = STATUS_STYLES[resource.status];
  const thumbnailUrl = resource.images?.[0]?.url;
  const imageCount = resource.images?.length || 0;

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
      style={{ backgroundColor: '#ffffff', borderColor: '#f5f5f5' }}
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Image count badge */}
        {imageCount > 0 && (
          <div
            className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {imageCount}
          </div>
        )}

        {/* Status indicator */}
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {statusStyle.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <span
          className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-2"
          style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
        >
          {CATEGORY_LABELS[resource.category]}
        </span>

        {/* Title */}
        <h3
          className="font-bold text-sm mb-1 line-clamp-1"
          style={{ color: '#171717' }}
          title={resource.title}
        >
          {resource.title}
        </h3>

        {/* Topic */}
        <p
          className="text-xs line-clamp-1"
          style={{ color: '#737373' }}
          title={resource.topic}
        >
          {resource.topic}
        </p>
      </div>
    </div>
  );
};

export default ResourceCard;
