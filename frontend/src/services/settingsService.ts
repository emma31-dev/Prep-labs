import { type SettingsState } from '../store/settingsAtoms';

/**
 * Settings service for handling settings persistence and synchronization
 */
export class SettingsService {
  private static readonly STORAGE_KEY = 'settings';
  
  /**
   * Load settings from localStorage
   */
  static loadSettings(): SettingsState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Save settings to localStorage
   */
  static saveSettings(settings: SettingsState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }
  
  /**
   * Clear all settings from localStorage
   */
  static clearSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear settings from localStorage:', error);
    }
  }
  
  /**
   * Export settings as JSON string
   */
  static exportSettings(settings: SettingsState): string {
    return JSON.stringify(settings, null, 2);
  }
  
  /**
   * Import settings from JSON string
   */
  static importSettings(jsonString: string): SettingsState | null {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate the structure
      if (this.validateSettings(parsed)) {
        return parsed;
      }
      
      throw new Error('Invalid settings format');
    } catch (error) {
      console.warn('Failed to import settings:', error);
      return null;
    }
  }
  
  /**
   * Validate settings object structure
   */
  private static validateSettings(obj: any): obj is SettingsState {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.theme === 'string' &&
      ['light', 'dark', 'auto'].includes(obj.theme) &&
      obj.display &&
      typeof obj.display === 'object' &&
      typeof obj.display.highContrast === 'boolean' &&
      typeof obj.display.reduceMotion === 'boolean' &&
      typeof obj.display.compactMode === 'boolean' &&
      obj.notifications &&
      typeof obj.notifications === 'object' &&
      typeof obj.notifications.enabled === 'boolean' &&
      typeof obj.notifications.email === 'boolean' &&
      typeof obj.notifications.push === 'boolean'
    );
  }
  
  /**
   * Reset settings to default values
   */
  static getDefaultSettings(): SettingsState {
    return {
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
  }
}