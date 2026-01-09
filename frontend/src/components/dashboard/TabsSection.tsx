import { useState } from "react";
import ProgressChart from "./ProgressChart";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "progress", label: "Progress" },
  { id: "attendance", label: "Attendance" },
  { id: "fees", label: "Fees History" },
  { id: "school", label: "School Info" },
];

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("progress");

  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <ProgressChart />;
      case "attendance":
        return (
          <div className="p-8 text-center" style={{ color: '#737373' }}>
            <p>Attendance records will be displayed here.</p>
          </div>
        );
      case "fees":
        return (
          <div className="p-8 text-center" style={{ color: '#737373' }}>
            <p>Fees history will be displayed here.</p>
          </div>
        );
      case "school":
        return (
          <div className="p-8 text-center" style={{ color: '#737373' }}>
            <p>School information will be displayed here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      {/* Tab Headers */}
      <div className="flex border-b" style={{ borderColor: '#e5e5e5' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-6 py-4 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab.id ? '#581c87' : '#737373',
              backgroundColor: activeTab === tab.id ? '#faf5ff' : 'transparent',
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#581c87' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabsSection;