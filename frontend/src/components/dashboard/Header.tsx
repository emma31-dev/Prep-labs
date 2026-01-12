import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
  currentView?: string;
  viewHistory?: string[];
  onNavigate?: (view: string) => void;
  onSearch?: (query: string) => void;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// Map view IDs to display names
const viewLabels: Record<string, string> = {
  Home: 'Home',
  Profile: 'Profile',
  CreateQuiz: 'Create Quiz',
  History: 'History',
  Bookmarked: 'Bookmarked',
  Resources: 'Resources',
  Preference: 'Settings',
  Theme: 'Theme',
};

const Header = ({
  userName,
  userAvatar,
  onMenuClick,
  currentView = "Home",
  viewHistory = [],
  onNavigate,
  onSearch,
}: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use auth user data if available, fallback to props
  const displayName = user?.fullName || userName || "User";
  const displayAvatar = user?.avatarUrl || userAvatar;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = () => {
    setShowUserMenu(false);
    logout();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}>
      {/* Left Section - Mobile Menu + Breadcrumb */}
      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: '#737373' }}
        >
          <MenuIcon />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1 text-sm">
          {viewHistory.slice(0, -1).map((view, index) => (
            <div key={`${view}-${index}`} className="flex items-center gap-1">
              <button
                onClick={() => onNavigate?.(view)}
                className="hover:underline transition-colors"
                style={{ color: '#737373' }}
              >
                {viewLabels[view] || view}
              </button>
              <span style={{ color: '#d4d4d4' }}>
                <ChevronRight />
              </span>
            </div>
          ))}
          <span className="font-medium" style={{ color: '#171717' }}>
            {viewLabels[currentView] || currentView}
          </span>
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Bar - Only show on Resources view */}
        {currentView === 'Resources' && (
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: '#737373' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ borderColor: '#e5e5e5' }}
            />
          </div>
        )}

        {/* Notification Icon */}
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 relative"
          style={{ color: '#737373' }}
          title="Notifications"
        >
          <BellIcon />
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>

        {/* User Profile - With Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 md:pl-4 border-l hover:bg-gray-50 rounded-lg p-2 transition-colors"
            style={{ borderColor: '#e5e5e5' }}
          >
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: '#581c87' }}
              >
                {getInitials(displayName)}
              </div>
            )}
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div 
              className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
              style={{ borderColor: '#e5e5e5' }}
            >
              <div className="p-3 border-b" style={{ borderColor: '#e5e5e5' }}>
                <p className="text-sm font-medium" style={{ color: '#171717' }}>{displayName}</p>
                <p className="text-xs" style={{ color: '#737373' }}>{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: '#ef4444' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
