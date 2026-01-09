import { useState } from "react";

type ThemeMode = 'light' | 'dark' | 'auto';

const ThemeContent = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('light');

  const ThemePreview = ({ mode, isSelected, onClick }: { 
    mode: ThemeMode; 
    isSelected: boolean; 
    onClick: () => void;
  }) => {
    // For Auto mode, we render a split view with both light and dark halves
    if (mode === 'auto') {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold capitalize" style={{ color: '#171717' }}>
              Auto
            </h3>
            <button
              onClick={onClick}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                isSelected ? 'border-purple-600' : 'border-gray-300'
              }`}
              style={{ backgroundColor: isSelected ? '#581c87' : 'transparent' }}
            >
              {isSelected && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>

          {/* Auto Theme Preview - Split View */}
          <div 
            className="w-full h-48 rounded-lg border-2 overflow-hidden transition-all cursor-pointer relative"
            style={{ borderColor: isSelected ? '#581c87' : '#e5e5e5' }}
            onClick={onClick}
          >
            {/* Left Half - Light */}
            <div className="absolute inset-0 w-1/2 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              {/* Header */}
              <div className="h-8 border-b flex items-center px-3" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
              {/* Content */}
              <div className="flex h-40">
                <div className="w-16 border-r flex flex-col items-center py-2 gap-1" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-2 rounded" style={{ backgroundColor: '#64748b' }} />
                  ))}
                </div>
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3 w-24 rounded" style={{ backgroundColor: '#171717' }} />
                  <div className="h-8 w-full rounded border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} />
                  <div className="h-6 w-3/4 rounded border" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }} />
                  <div className="h-4 w-1/2 rounded" style={{ backgroundColor: '#64748b' }} />
                </div>
              </div>
            </div>

            {/* Right Half - Dark */}
            <div className="absolute inset-0 left-1/2 w-1/2 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
              {/* Header */}
              <div className="h-8 border-b flex items-center px-3" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <div className="w-16" /> {/* Spacer for dots on left side */}
              </div>
              {/* Content */}
              <div className="flex h-40">
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3 w-24 rounded" style={{ backgroundColor: '#f1f5f9' }} />
                  <div className="h-8 w-full rounded border" style={{ backgroundColor: '#334155', borderColor: '#334155' }} />
                  <div className="h-6 w-3/4 rounded border" style={{ backgroundColor: '#475569', borderColor: '#334155' }} />
                  <div className="h-4 w-1/2 rounded" style={{ backgroundColor: '#94a3b8' }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-center" style={{ color: '#737373' }}>
            Adapts to your system preference
          </p>
        </div>
      );
    }

    // Light and Dark modes
    const styles = mode === 'light' 
      ? { bg: '#ffffff', sidebar: '#f8fafc', header: '#ffffff', text: '#171717', muted: '#64748b', border: '#e2e8f0', card1: '#f8fafc', card2: '#f1f5f9' }
      : { bg: '#0f172a', sidebar: '#1e293b', header: '#1e293b', text: '#f1f5f9', muted: '#94a3b8', border: '#334155', card1: '#334155', card2: '#475569' };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize" style={{ color: '#171717' }}>
            {mode}
          </h3>
          <button
            onClick={onClick}
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              isSelected ? 'border-purple-600' : 'border-gray-300'
            }`}
            style={{ backgroundColor: isSelected ? '#581c87' : 'transparent' }}
          >
            {isSelected && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </button>
        </div>

        {/* Theme Preview Window */}
        <div 
          className="w-full h-48 rounded-lg border-2 overflow-hidden transition-all cursor-pointer"
          style={{ borderColor: isSelected ? '#581c87' : '#e5e5e5', backgroundColor: styles.bg }}
          onClick={onClick}
        >
          {/* Preview Header */}
          <div className="h-8 border-b flex items-center px-3" style={{ backgroundColor: styles.header, borderColor: styles.border }}>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex h-40">
            {/* Sidebar Preview */}
            <div className="w-16 border-r flex flex-col items-center py-2 gap-1" style={{ backgroundColor: styles.sidebar, borderColor: styles.border }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-2 rounded" style={{ backgroundColor: styles.muted }} />
              ))}
            </div>

            {/* Main Content Preview */}
            <div className="flex-1 p-3 space-y-2">
              <div className="h-3 w-24 rounded" style={{ backgroundColor: styles.text }} />
              <div className="space-y-2">
                <div className="h-8 w-full rounded border" style={{ backgroundColor: styles.card1, borderColor: styles.border }} />
                <div className="h-6 w-3/4 rounded border" style={{ backgroundColor: styles.card2, borderColor: styles.border }} />
                <div className="h-4 w-1/2 rounded" style={{ backgroundColor: styles.muted }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-center" style={{ color: '#737373' }}>
          {mode === 'light' ? 'Clean and bright interface' : 'Easy on the eyes in low light'}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#171717' }}>
          Theme Settings
        </h1>
        <p className="text-lg mt-2" style={{ color: '#737373' }}>
          Choose your preferred appearance for the interface
        </p>
      </div>

      {/* Theme Selection */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#171717' }}>
          Appearance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ThemePreview 
            mode="light" 
            isSelected={selectedTheme === 'light'}
            onClick={() => setSelectedTheme('light')}
          />
          <ThemePreview 
            mode="dark" 
            isSelected={selectedTheme === 'dark'}
            onClick={() => setSelectedTheme('dark')}
          />
          <ThemePreview 
            mode="auto" 
            isSelected={selectedTheme === 'auto'}
            onClick={() => setSelectedTheme('auto')}
          />
        </div>

        {/* Apply Button */}
        <div className="mt-8 flex justify-end">
          <button 
            className="px-6 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: '#581c87' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
          >
            Apply Theme
          </button>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#171717' }}>
          Display Options
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                High Contrast
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Increase contrast for better visibility
              </p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                Reduce Motion
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Minimize animations and transitions
              </p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium" style={{ color: '#171717' }}>
                Compact Mode
              </h3>
              <p className="text-sm" style={{ color: '#737373' }}>
                Show more content by reducing spacing
              </p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{ backgroundColor: '#e5e7eb' }}
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeContent;