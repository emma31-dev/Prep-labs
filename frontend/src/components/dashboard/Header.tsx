interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onMenuClick?: () => void;
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

const Header = ({ 
  userName = "Priscilla Lily",
  userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
  onMenuClick
}: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}>
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-100 mr-2"
        style={{ color: '#737373' }}
      >
        <MenuIcon />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="What do you want to find?"
            className="w-full h-10 pl-4 pr-10 rounded-lg border text-sm"
            style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff', color: '#171717' }}
          />
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: '#737373' }}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Icon */}
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 relative"
          style={{ color: '#737373' }}
          title="Notifications"
        >
          <BellIcon />
          {/* Optional notification dot */}
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#ef4444' }}
          />
        </button>

        {/* User Profile - Simplified */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l" style={{ borderColor: '#e5e5e5' }}>
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <span className="hidden md:block text-sm font-medium" style={{ color: '#171717' }}>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;