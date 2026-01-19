import { useAtom } from 'jotai';
import { notificationSettingsAtom } from '../../store/settingsAtoms';
import { useThemeColors } from '../../hooks/useTheme';
import SettingsExport from './SettingsExport';

const PreferencesContent = () => {
  const [notifications, setNotifications] = useAtom(notificationSettingsAtom);
  const colors = useThemeColors();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>
          Preferences
        </h1>
        <p className="text-lg mt-2" style={{ color: colors.textSecondary }}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.surface }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
          Notifications
        </h2>
        
        <div className="space-y-4">
          {/* General Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: colors.text }}>
                Enable Notifications
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Receive notifications about your account activity
              </p>
            </div>
            <button
              onClick={() => setNotifications({ enabled: !notifications.enabled })}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: notifications.enabled ? colors.primary : colors.border }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: colors.text }}>
                Email Notifications
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Receive email updates about your progress and achievements
              </p>
            </div>
            <button
              onClick={() => setNotifications({ email: !notifications.email })}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: notifications.email ? colors.primary : colors.border }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: colors.text }}>
                Push Notifications
              </h3>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Receive push notifications on your device
              </p>
            </div>
            <button
              onClick={() => setNotifications({ push: !notifications.push })}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: notifications.push ? colors.primary : colors.border }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.surface }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
          Account
        </h2>
        
        <div className="space-y-4">
          <button 
            className="w-full text-left p-4 rounded-lg border transition-colors hover:opacity-80"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <h3 className="font-medium" style={{ color: colors.text }}>
              Change Password
            </h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Update your account password
            </p>
          </button>

          <button 
            className="w-full text-left p-4 rounded-lg border transition-colors hover:opacity-80"
            style={{ borderColor: colors.border, backgroundColor: colors.background }}
          >
            <h3 className="font-medium" style={{ color: colors.text }}>
              Privacy Settings
            </h3>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
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

      {/* Settings Management */}
      <SettingsExport />
    </div>
  );
};

export default PreferencesContent;