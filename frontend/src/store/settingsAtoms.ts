import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

/**
 * Theme mode type definition
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Display settings interface
 */
export interface DisplaySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  compactMode: boolean;
}

/**
 * Notification settings interface
 */
export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
}

/**
 * Complete settings state interface
 */
export interface SettingsState {
  theme: ThemeMode;
  display: DisplaySettings;
  notifications: NotificationSettings;
}

/**
 * Default settings state
 */
const defaultSettingsState: SettingsState = {
  theme: 'light',
  display: {
    highContrast: false,
    reduceMotion: false,
    compactMode: false,
  },
  notifications: {
    enabled: true,
    email: false,
    push: true,
  },
};

/**
 * Main settings atom with localStorage persistence
 */
export const settingsAtom = atomWithStorage<SettingsState>('settings', defaultSettingsState);

/**
 * Derived atom for theme mode
 */
export const themeAtom = atom(
  (get) => get(settingsAtom).theme,
  (get, set, newTheme: ThemeMode) => {
    const current = get(settingsAtom);
    set(settingsAtom, { ...current, theme: newTheme });
  }
);

/**
 * Derived atom for display settings
 */
export const displaySettingsAtom = atom(
  (get) => get(settingsAtom).display,
  (get, set, newDisplay: Partial<DisplaySettings>) => {
    const current = get(settingsAtom);
    set(settingsAtom, { 
      ...current, 
      display: { ...current.display, ...newDisplay } 
    });
  }
);

/**
 * Derived atom for notification settings
 */
export const notificationSettingsAtom = atom(
  (get) => get(settingsAtom).notifications,
  (get, set, newNotifications: Partial<NotificationSettings>) => {
    const current = get(settingsAtom);
    set(settingsAtom, { 
      ...current, 
      notifications: { ...current.notifications, ...newNotifications } 
    });
  }
);

/**
 * Computed atom for effective theme (resolves 'auto' to actual theme)
 */
export const effectiveThemeAtom = atom((get) => {
  const theme = get(themeAtom);
  
  if (theme === 'auto') {
    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  
  return theme;
});