import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { themeAtom, effectiveThemeAtom, displaySettingsAtom } from '../store/settingsAtoms';

/**
 * Hook for managing theme state and applying theme to document
 */
export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const effectiveTheme = useAtomValue(effectiveThemeAtom);
  const displaySettings = useAtomValue(displaySettingsAtom);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'high-contrast', 'reduce-motion', 'compact');
    
    // Apply effective theme
    root.classList.add(effectiveTheme);
    
    // Apply display settings
    if (displaySettings.highContrast) {
      root.classList.add('high-contrast');
    }
    
    if (displaySettings.reduceMotion) {
      root.classList.add('reduce-motion');
    }
    
    if (displaySettings.compactMode) {
      root.classList.add('compact');
    }
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [effectiveTheme, displaySettings]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Force re-evaluation of effectiveThemeAtom
      const event = new CustomEvent('themechange');
      window.dispatchEvent(event);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    effectiveTheme,
    setTheme,
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
  };
};

/**
 * Hook for getting theme-aware CSS variables
 */
export const useThemeColors = () => {
  const { effectiveTheme } = useTheme();
  
  const colors = {
    light: {
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceSecondary: '#f1f5f9',
      text: '#171717',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      borderSecondary: '#cbd5e1',
      primary: '#581c87',
      primaryHover: '#6b21a8',
    },
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceSecondary: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      border: '#334155',
      borderSecondary: '#475569',
      primary: '#7c3aed',
      primaryHover: '#8b5cf6',
    },
  };
  
  return colors[effectiveTheme];
};