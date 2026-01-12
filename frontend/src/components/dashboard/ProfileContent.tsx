import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom, setAuthAtom, accessTokenAtom } from "../../store/authAtoms";
import { ProfileCard, BasicDetails, TabsSection } from "./index";
import { uploadProfilePhoto } from "../../lib/supabase";
import { authService } from "../../services/authService";

const ProfileContent = () => {
  const [user] = useAtom(userAtom);
  const [accessToken] = useAtom(accessTokenAtom);
  const [, updateAuth] = useAtom(setAuthAtom);
  const [isUploading, setIsUploading] = useState(false);

  // Format the plan type for display
  const formatPlanType = (planType: string | undefined) => {
    if (!planType) return "Free";
    return planType.charAt(0).toUpperCase() + planType.slice(1);
  };

  const handleAvatarChange = async (file: File) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    setIsUploading(true);

    try {
      // Upload to Supabase storage
      const avatarUrl = await uploadProfilePhoto(file, user.id);

      // Update profile in backend
      const response = await authService.updateProfile(
        { userId: user.id, avatarUrl },
        accessToken || ""
      );

      if (response.success && response.user) {
        // Update local auth state with new user data
        updateAuth({
          user: {
            ...user,
            avatarUrl: response.user.avatarUrl,
          },
        });
        console.log('Avatar updated in auth state:', response.user.avatarUrl);
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const basicDetails = [
    { label: "Age", value: user?.age ? `${user.age} years` : "Not set" },
    { label: "Subscription", value: formatPlanType(user?.planType), badge: user?.planType !== 'free' },
    { label: "Email", value: user?.email || "Not set" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Card */}
      <ProfileCard
        name={user?.fullName || "User"}
        className={formatPlanType(user?.planType) + " Plan"}
        studentId={user?.id?.slice(0, 8).toUpperCase() || "N/A"}
        avatar={user?.avatarUrl || undefined}
        onAvatarChange={handleAvatarChange}
        isUploading={isUploading}
      />

      {/* Basic Details */}
      <BasicDetails details={basicDetails} />

      {/* Tabs Section with Progress Chart */}
      <TabsSection />
    </div>
  );
};

export default ProfileContent;
