import type { ResourceCategory } from '../../types/resource';

interface ResourceFiltersProps {
  categoryFilter: ResourceCategory | 'all';
  sortBy: 'created_at' | 'title';
  sortOrder: 'asc' | 'desc';
  onCategoryChange: (category: ResourceCategory | 'all') => void;
  onSortChange: (sortBy: 'created_at' | 'title', sortOrder: 'asc' | 'desc') => void;
}

const CATEGORIES: { value: ResourceCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'math', label: 'Math' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS: { value: string; label: string; sortBy: 'created_at' | 'title'; sortOrder: 'asc' | 'desc' }[] = [
  { value: 'newest', label: 'Newest', sortBy: 'created_at', sortOrder: 'desc' },
  { value: 'oldest', label: 'Oldest', sortBy: 'created_at', sortOrder: 'asc' },
  { value: 'a-z', label: 'A-Z', sortBy: 'title', sortOrder: 'asc' },
  { value: 'z-a', label: 'Z-A', sortBy: 'title', sortOrder: 'desc' },
];

const ResourceFilters = ({
  categoryFilter,
  sortBy,
  sortOrder,
  onCategoryChange,
  onSortChange,
}: ResourceFiltersProps) => {
  // Get current sort value
  const getCurrentSortValue = () => {
    const option = SORT_OPTIONS.find(
      (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
    );
    return option?.value || 'newest';
  };

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      onSortChange(option.sortBy, option.sortOrder);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" style={{ color: '#737373' }}>
          Category:
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as ResourceCategory | 'all')}
          className="px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors"
          style={{
            borderColor: '#e5e5e5',
            color: '#171717',
            backgroundColor: '#ffffff',
            '--tw-ring-color': '#9333ea',
          } as React.CSSProperties}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium" style={{ color: '#737373' }}>
          Sort:
        </label>
        <select
          value={getCurrentSortValue()}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors"
          style={{
            borderColor: '#e5e5e5',
            color: '#171717',
            backgroundColor: '#ffffff',
            '--tw-ring-color': '#9333ea',
          } as React.CSSProperties}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ResourceFilters;
