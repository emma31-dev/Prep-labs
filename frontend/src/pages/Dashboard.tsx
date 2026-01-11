import { useState } from "react";
import { Sidebar, Header } from "../components/dashboard";
import ProfileContent from "../components/dashboard/ProfileContent";
import HomeContent from "../components/dashboard/HomeContent";
import CreateQuizContent from "../components/dashboard/CreateQuizContent";
import PreferencesContent from "../components/dashboard/PreferencesContent";
import ThemeContent from "../components/dashboard/ThemeContent";
import HistoryContent from "../components/dashboard/HistoryContent";
import ResourcesContent from "../components/dashboard/ResourcesContent";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "Home":
        return <HomeContent />;
      case "Profile":
        return <ProfileContent />;
      case "CreateQuiz":
        return <CreateQuizContent />;
      case "History":
        return <HistoryContent />;
      case "Bookmarked":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold" style={{ color: '#171717' }}>Bookmarked</h1>
            <p style={{ color: '#737373' }}>Your bookmarked items will appear here.</p>
          </div>
        );
      case "Resources":
        return <ResourcesContent />;
      case "Preference":
        return <PreferencesContent />;
      case "Theme":
        return <ThemeContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeView} 
        onItemClick={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;