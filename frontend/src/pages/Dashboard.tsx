import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Header } from "../components/dashboard";
import ProfileContent from "../components/dashboard/ProfileContent";
import HomeContent from "../components/dashboard/HomeContent";
import CreateQuizContent from "../components/dashboard/CreateQuizContent";
import PreferencesContent from "../components/dashboard/PreferencesContent";
import ThemeContent from "../components/dashboard/ThemeContent";
import HistoryContent from "../components/dashboard/HistoryContent";
import ResourcesContent from "../components/dashboard/ResourcesContent";
import QuizzesContent from "../components/dashboard/QuizzesContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewHistory, setViewHistory] = useState<string[]>(["Home"]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Map URL paths to view names
  const pathToView: Record<string, string> = {
    '/dashboard': 'Home',
    '/dashboard/home': 'Home',
    '/dashboard/profile': 'Profile',
    '/dashboard/create-quiz': 'CreateQuiz',
    '/dashboard/history': 'History',
    '/dashboard/quizzes': 'Quizzes',
    '/dashboard/resources': 'Resources',
    '/dashboard/preferences': 'Preference',
    '/dashboard/theme': 'Theme',
  };

  // Map view names to URL paths
  const viewToPath: Record<string, string> = {
    'Home': '/dashboard/home',
    'Profile': '/dashboard/profile',
    'CreateQuiz': '/dashboard/create-quiz',
    'History': '/dashboard/history',
    'Quizzes': '/dashboard/quizzes',
    'Resources': '/dashboard/resources',
    'Preference': '/dashboard/preferences',
    'Theme': '/dashboard/theme',
  };

  // Get current view from URL
  const getCurrentView = () => {
    return pathToView[location.pathname] || 'Home';
  };

  const activeView = getCurrentView();

  // Update view history when location changes
  useEffect(() => {
    const currentView = getCurrentView();
    setViewHistory((prev) => {
      // If navigating to Home, reset the breadcrumb trail
      if (currentView === 'Home') {
        return ['Home'];
      }
      // If navigating to a view already in history (other than Home), truncate to that point
      const existingIndex = prev.indexOf(currentView);
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }
      // Otherwise add to history, keeping max 4 items
      const newHistory = [...prev, currentView];
      return newHistory.slice(-4);
    });
    // Clear search when changing views
    setSearchQuery('');
  }, [location.pathname]);

  // Redirect to home if on base dashboard path
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      navigate('/dashboard/home', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Track view changes for navigation
  const handleViewChange = (newView: string) => {
    const path = viewToPath[newView] || '/dashboard/home';
    navigate(path);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeView} 
        onItemClick={handleViewChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          currentView={activeView}
          viewHistory={viewHistory}
          onNavigate={handleViewChange}
          onSearch={handleSearch}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/home" element={<HomeContent />} />
            <Route path="/profile" element={<ProfileContent />} />
            <Route path="/create-quiz" element={<CreateQuizContent />} />
            <Route path="/history" element={<HistoryContent />} />
            <Route path="/quizzes" element={<QuizzesContent />} />
            <Route path="/resources" element={<ResourcesContent searchQuery={searchQuery} />} />
            <Route path="/preferences" element={<PreferencesContent />} />
            <Route path="/theme" element={<ThemeContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;