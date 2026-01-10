import { ProfileCard, BasicDetails, TabsSection } from "./index";

const ProfileContent = () => {
  const userData = {
    name: "Eleanor Pena",
    className: "Class VI",
    studentId: "F-6522",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  };

  const basicDetails = [
    { label: "Age", value: "23 years" },
    { label: "Subscription", value: "Pro", badge: true },
    { label: "Joined", value: "March 15, 2024" },
  ];

  return (
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
  );
};

export default ProfileContent;