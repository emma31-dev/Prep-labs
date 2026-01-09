import { useState } from "react";

const PreferencesContent = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#171717' }}>
          Preferences
        </h1>
        <p className="text-lg mt-2" style={{ color: '#737373' }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#171717' }}>
          Notifications
        </h2>
        
        <div className="space-y-4">
          {/* General Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                Enable Notifications
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Receive notifications about your account activity
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: notifications ? '#581c87' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                Email Notifications
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Receive email updates about your progress and achievements
              </p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: emailNotifications ? '#581c87' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                Push Notifications
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Receive push notifications on your device
              </p>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: pushNotifications ? '#581c87' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#171717' }}>
          Account
        </h2>
        
        <div className="space-y-4">
          <button 
            className="w-full text-left p-4 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e5e5e5' }}
          >
            <h3 className="font-medium" style={{ color: '#171717' }}>
              Change Password
            </h3>
            <p className="text-sm" style={{ color: '#737373' }}>
              Update your account password
            </p>
          </button>

          <button 
            className="w-full text-left p-4 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e5e5e5' }}
          >
            <h3 className="font-medium" style={{ color: '#171717' }}>
              Privacy Settings
            </h3>
            <p className="text-sm" style={{ color: '#737373' }}>
              Manage your privacy and data settings
            </p>
          </button>

          <button 
            className="w-full text-left p-4 rounded-lg border transition-colors hover:bg-red-50"
            style={{ borderColor: '#fecaca', color: '#dc2626' }}
          >
            <h3 className="font-medium">Delete Account</h3>
            <p className="text-sm" style={{ color: '#ef4444' }}>
              Permanently delete your account and all data
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesContent;