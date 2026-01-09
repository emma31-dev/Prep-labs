import { Sidebar, Header, ProfileCard, BasicDetails, TabsSection } from "../components/dashboard";

const Dashboard = () => {
  // Sample user data - in real app this would come from API/state
  const userData = {
    name: "Eleanor Pena",
    className: "Class VI",
    studentId: "F-6522",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  };

  const basicDetails = [
    { label: "Gender", value: "Female" },
    { label: "Date of Birth", value: "02-05-2001" },
    { label: "Religion", value: "Christian" },
    { label: "Blood Group", value: "B+" },
    { label: "Address", value: "TA-107 Newyork" },
    { label: "Father", value: "John Pena", subValue: "+1603-965-4668" },
    { label: "Mother", value: "Sarah Pena", subValue: "+123 99885567" },
  ];

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <Sidebar activeItem="Profile" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          userName="Priscilla Lily"
          userRole="Admin"
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Card */}
            <ProfileCard
              name={userData.name}
              className={userData.className}
              studentId={userData.studentId}
              avatar={userData.avatar}
            />

            {/* Basic Details */}
            <BasicDetails details={basicDetails} />

            {/* Tabs Section with Progress Chart */}
            <TabsSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;