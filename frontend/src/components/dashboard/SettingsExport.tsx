import { useAtomValue, useSetAtom } from 'jotai';
import { settingsAtom } from '../../store/settingsAtoms';
import { SettingsService } from '../../services/settingsService';
import { useThemeColors } from '../../hooks/useTheme';

const SettingsExport = () => {
  const settings = useAtomValue(settingsAtom);
  const setSettings = useSetAtom(settingsAtom);
  const colors = useThemeColors();

  const handleExport = () => {
    const exportData = SettingsService.exportSettings(settings);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedSettings = SettingsService.importSettings(content);
        
        if (importedSettings) {
          setSettings(importedSettings);
          alert('Settings imported successfully!');
        } else {
          alert('Failed to import settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      const defaultSettings = SettingsService.getDefaultSettings();
      setSettings(defaultSettings);
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: colors.surface }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
        Settings Management
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: colors.border, 
              backgroundColor: colors.background,
              color: colors.text 
            }}
          >
            Export Settings
          </button>
          
          <button
            onClick={handleImport}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: colors.border, 
              backgroundColor: colors.background,
              color: colors.text 
            }}
          >
            Import Settings
          </button>
          
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors text-red-600 border-red-300 hover:bg-red-50"
          >
            Reset to Default
          </button>
        </div>
        
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Export your settings to backup or share them. Import settings from a previously exported file.
        </p>
      </div>
    </div>
  );
};

export default SettingsExport;