interface HeaderProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
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

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const Header = ({ 
  userName = "Priscilla Lily", 
  userRole = "Admin",
  userAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
}: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}>
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
      <div className="flex items-center gap-4">
        {/* Notification Icons */}
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: '#737373' }}
        >
          <BellIcon />
        </button>
        <button 
          className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          style={{ color: '#737373' }}
        >
          <MessageIcon />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: '#e5e5e5' }}>
          <img
            src={userAvatar}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: '#171717' }}>{userName}</span>
            <span className="text-xs" style={{ color: '#737373' }}>{userRole}</span>
          </div>
          <button style={{ color: '#737373' }}>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;