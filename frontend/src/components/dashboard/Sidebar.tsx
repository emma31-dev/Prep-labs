import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const QuizIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const Sidebar = ({ activeItem = "Home", onItemClick, isOpen = false, onClose }: SidebarProps) => {
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const { logout } = useAuth();

  const navItems: NavItem[] = [
    { icon: <HomeIcon />, label: "Home", id: "Home" },
    { icon: <ProfileIcon />, label: "Profile", id: "Profile" },
    { icon: <QuizIcon />, label: "Create Quiz", id: "CreateQuiz" },
    { icon: <HistoryIcon />, label: "History", id: "History" },
    { icon: <BookmarkIcon />, label: "Bookmarked", id: "Bookmarked" },
    { icon: <FolderIcon />, label: "Resources", id: "Resources" },
  ];

  const settingsItems = [
    { label: "Theme", id: "Theme" },
    { label: "Logout", id: "Logout" },
    { label: "Preference", id: "Preference" },
  ];

  const handleItemClick = (itemId: string) => {
    // Handle logout separately
    if (itemId === "Logout") {
      logout();
      return;
    }
    
    if (onItemClick) {
      onItemClick(itemId);
    }
    // Close sidebar on mobile after selection
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-56 h-screen flex flex-col border-r
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <img 
            src="/logo.png" 
            alt="Prep Labs Logo" 
            className="h-10 w-auto"
          />
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            style={{ color: '#737373' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleItemClick(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left"
                style={{
                  backgroundColor: activeItem === item.id ? '#faf5ff' : 'transparent',
                  color: activeItem === item.id ? '#581c87' : '#737373',
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
          
          {/* Settings with submenu */}
          <li>
            <button
              onClick={() => setSettingsExpanded(!settingsExpanded)}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{ color: '#737373' }}
            >
              <div className="flex items-center gap-3">
                <SettingsIcon />
                <span className="font-medium">Settings</span>
              </div>
              <ChevronIcon expanded={settingsExpanded} />
            </button>
            
            {settingsExpanded && (
              <ul className="ml-8 mt-1 space-y-1">
                {settingsItems.map((subItem) => (
                  <li key={subItem.label}>
                    <button
                      onClick={() => handleItemClick(subItem.id)}
                      className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm"
                      style={{ 
                        color: activeItem === subItem.id ? '#581c87' : '#737373',
                        backgroundColor: activeItem === subItem.id ? '#faf5ff' : 'transparent',
                      }}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
      </aside>
    </>
  );
};

export default Sidebar;