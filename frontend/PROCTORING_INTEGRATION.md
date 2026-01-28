# Proctoring Integration Guide

This document outlines how to implement proctoring features to prevent cheating during tests by monitoring tab switching, window focus, and other suspicious activities.

## Overview

The proctoring system will monitor user behavior during tests to detect potential cheating attempts such as:
- Tab switching or window focus loss
- Copy/paste attempts
- Right-click context menu usage
- Developer tools opening
- Multiple failed focus attempts
- Suspicious keyboard shortcuts

## Implementation Strategy

### 1. Proctoring Context & State Management

Create a proctoring context to manage monitoring state across the test session.

```typescript
// src/contexts/ProctoringContext.tsx
interface ProctoringState {
  isActive: boolean;
  violations: ProctoringViolation[];
  warningCount: number;
  maxWarnings: number;
  testId: string | null;
}

interface ProctoringViolation {
  id: string;
  type: 'tab_switch' | 'focus_loss' | 'copy_paste' | 'right_click' | 'dev_tools' | 'suspicious_keys';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

const ProctoringContext = createContext<{
  state: ProctoringState;
  startProctoring: (testId: string) => void;
  stopProctoring: () => void;
  recordViolation: (violation: Omit<ProctoringViolation, 'id' | 'timestamp'>) => void;
} | null>(null);
```

### 2. Core Proctoring Hook

```typescript
// src/hooks/useProctoring.ts
export const useProctoring = () => {
  const [state, setState] = useState<ProctoringState>({
    isActive: false,
    violations: [],
    warningCount: 0,
    maxWarnings: 3,
    testId: null
  });

  const recordViolation = useCallback((violation: Omit<ProctoringViolation, 'id' | 'timestamp'>) => {
    const newViolation: ProctoringViolation = {
      ...violation,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      violations: [...prev.violations, newViolation],
      warningCount: prev.warningCount + (violation.severity === 'high' ? 2 : 1)
    }));

    // Show warning to user
    showProctoringWarning(violation);

    // Auto-submit test if too many violations
    if (state.warningCount >= state.maxWarnings) {
      handleTestAutoSubmit();
    }
  }, [state.warningCount, state.maxWarnings]);

  const startProctoring = useCallback((testId: string) => {
    setState(prev => ({
      ...prev,
      isActive: true,
      testId,
      violations: [],
      warningCount: 0
    }));
  }, []);

  const stopProctoring = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
      testId: null
    }));
  }, []);

  return { state, startProctoring, stopProctoring, recordViolation };
};
```

### 3. Window Focus Monitoring

```typescript
// src/hooks/useFocusMonitoring.ts
export const useFocusMonitoring = (recordViolation: (violation: any) => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    let focusLostTime: number | null = null;
    let tabSwitchCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        focusLostTime = Date.now();
        tabSwitchCount++;
        
        recordViolation({
          type: 'tab_switch',
          description: `Tab switched or window minimized (occurrence #${tabSwitchCount})`,
          severity: tabSwitchCount > 2 ? 'high' : 'medium'
        });
      } else if (focusLostTime) {
        const timeAway = Date.now() - focusLostTime;
        if (timeAway > 5000) { // More than 5 seconds away
          recordViolation({
            type: 'focus_loss',
            description: `Extended focus loss: ${Math.round(timeAway / 1000)} seconds`,
            severity: 'high'
          });
        }
        focusLostTime = null;
      }
    };

    const handleWindowBlur = () => {
      recordViolation({
        type: 'focus_loss',
        description: 'Window lost focus',
        severity: 'medium'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, recordViolation]);
};
```

### 4. Keyboard & Mouse Monitoring

```typescript
// src/hooks/useInputMonitoring.ts
export const useInputMonitoring = (recordViolation: (violation: any) => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations
      const suspiciousKeys = [
        { keys: ['F12'], description: 'Developer tools shortcut' },
        { keys: ['Control', 'Shift', 'I'], description: 'Developer tools shortcut' },
        { keys: ['Control', 'Shift', 'J'], description: 'Console shortcut' },
        { keys: ['Control', 'U'], description: 'View source shortcut' },
        { keys: ['Control', 'Shift', 'C'], description: 'Inspect element shortcut' },
        { keys: ['Alt', 'Tab'], description: 'Alt+Tab window switching' },
        { keys: ['Control', 'Tab'], description: 'Ctrl+Tab tab switching' }
      ];

      for (const combo of suspiciousKeys) {
        if (combo.keys.every(key => 
          key === e.key || 
          (key === 'Control' && e.ctrlKey) || 
          (key === 'Shift' && e.shiftKey) || 
          (key === 'Alt' && e.altKey)
        )) {
          e.preventDefault();
          recordViolation({
            type: 'suspicious_keys',
            description: combo.description,
            severity: 'high'
          });
          return;
        }
      }

      // Detect copy/paste attempts
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        recordViolation({
          type: 'copy_paste',
          description: `Copy/paste attempt: ${e.key.toUpperCase()}`,
          severity: 'medium'
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation({
        type: 'right_click',
        description: 'Right-click context menu attempt',
        severity: 'low'
      });
    };

    const handleDevToolsOpen = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        recordViolation({
          type: 'dev_tools',
          description: 'Developer tools detected',
          severity: 'high'
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Check for dev tools every 2 seconds
    const devToolsInterval = setInterval(handleDevToolsOpen, 2000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(devToolsInterval);
    };
  }, [isActive, recordViolation]);
};
```

### 5. Proctoring Warning Component

```typescript
// src/components/proctoring/ProctoringWarning.tsx
interface ProctoringWarningProps {
  violation: ProctoringViolation;
  warningCount: number;
  maxWarnings: number;
  onDismiss: () => void;
}

export const ProctoringWarning: React.FC<ProctoringWarningProps> = ({
  violation,
  warningCount,
  maxWarnings,
  onDismiss
}) => {
  const remainingWarnings = maxWarnings - warningCount;
  const isLastWarning = remainingWarnings <= 1;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`bg-white rounded-lg p-6 max-w-md mx-4 ${
        isLastWarning ? 'border-2 border-red-500' : 'border border-orange-300'
      }`}>
        <div className="flex items-center mb-4">
          <AlertTriangle className={`w-6 h-6 mr-2 ${
            isLastWarning ? 'text-red-500' : 'text-orange-500'
          }`} />
          <h3 className="text-lg font-semibold">
            {isLastWarning ? 'Final Warning' : 'Proctoring Alert'}
          </h3>
        </div>
        
        <p className="text-gray-700 mb-4">{violation.description}</p>
        
        <div className={`p-3 rounded mb-4 ${
          isLastWarning ? 'bg-red-50 text-red-800' : 'bg-orange-50 text-orange-800'
        }`}>
          {isLastWarning ? (
            <p className="font-medium">
              This is your final warning. Any additional violations will result in automatic test submission.
            </p>
          ) : (
            <p>
              Warning {warningCount} of {maxWarnings}. 
              {remainingWarnings > 1 ? ` ${remainingWarnings} warnings remaining.` : ' 1 warning remaining.'}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onDismiss}
            className={`px-4 py-2 rounded font-medium ${
              isLastWarning 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 6. Proctored Test Component

```typescript
// src/components/test/ProctoredTest.tsx
export const ProctoredTest: React.FC<{ testId: string }> = ({ testId }) => {
  const { state, startProctoring, stopProctoring, recordViolation } = useProctoring();
  const [showWarning, setShowWarning] = useState<ProctoringViolation | null>(null);
  const [testStarted, setTestStarted] = useState(false);

  // Initialize monitoring hooks
  useFocusMonitoring(recordViolation, state.isActive);
  useInputMonitoring(recordViolation, state.isActive);

  const handleStartTest = () => {
    startProctoring(testId);
    setTestStarted(true);
    
    // Request fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        recordViolation({
          type: 'focus_loss',
          description: 'Fullscreen mode denied',
          severity: 'medium'
        });
      });
    }
  };

  const handleTestComplete = () => {
    stopProctoring();
    
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  // Show warning when violation occurs
  useEffect(() => {
    if (state.violations.length > 0) {
      const latestViolation = state.violations[state.violations.length - 1];
      setShowWarning(latestViolation);
    }
  }, [state.violations]);

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Proctored Test Environment
          </h2>
          
          <div className="space-y-3 text-sm text-gray-700">
            <p>This test is monitored to ensure academic integrity. The following activities are prohibited:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Switching tabs or applications</li>
              <li>Opening developer tools</li>
              <li>Copy/paste operations</li>
              <li>Right-clicking or using context menus</li>
              <li>Minimizing the browser window</li>
            </ul>
            <p className="font-medium text-orange-700">
              You will receive up to 3 warnings. Exceeding this limit will result in automatic test submission.
            </p>
          </div>
        </div>

        <button
          onClick={handleStartTest}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
        >
          Start Proctored Test
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Proctoring Status Bar */}
      <div className="bg-green-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
          Proctoring Active
        </div>
        <div>
          Warnings: {state.warningCount}/{state.maxWarnings}
        </div>
      </div>

      {/* Test Content */}
      <div className="p-6">
        {/* Your existing test component content */}
        <TestContent testId={testId} onComplete={handleTestComplete} />
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <ProctoringWarning
          violation={showWarning}
          warningCount={state.warningCount}
          maxWarnings={state.maxWarnings}
          onDismiss={() => setShowWarning(null)}
        />
      )}
    </div>
  );
};
```

### 7. Backend Integration

Add proctoring data to test results:

```typescript
// Update TestResult interface to include proctoring data
interface TestResult {
  // ... existing fields
  proctoring_violations: ProctoringViolation[];
  proctoring_score: number; // 0-100 based on violation severity
  was_proctored: boolean;
}
```

### 8. Admin Dashboard Integration

Create components to view proctoring reports:

```typescript
// src/components/admin/ProctoringReport.tsx
export const ProctoringReport: React.FC<{ testResultId: string }> = ({ testResultId }) => {
  // Display violation timeline, severity analysis, and recommendations
  // Show patterns of suspicious behavior
  // Provide tools for manual review
};
```

## Security Considerations

1. **Client-Side Limitations**: Remember that all client-side monitoring can be bypassed by determined users
2. **Privacy**: Clearly communicate what is being monitored and obtain consent
3. **Accessibility**: Ensure proctoring doesn't interfere with assistive technologies
4. **False Positives**: Implement reasonable thresholds to avoid penalizing legitimate behavior

## Future Enhancements

1. **Webcam Monitoring**: Add optional camera-based proctoring
2. **AI Analysis**: Implement ML models to detect suspicious patterns
3. **Biometric Verification**: Add fingerprint or face recognition
4. **Network Monitoring**: Detect unusual network activity
5. **Mobile Support**: Adapt proctoring for mobile devices

## Testing Strategy

1. Test all violation scenarios in different browsers
2. Verify accessibility compliance
3. Test with various screen sizes and devices
4. Validate warning thresholds and auto-submission
5. Ensure proper cleanup when test ends unexpectedly

This proctoring system provides a robust foundation for preventing common cheating methods while maintaining a good user experience for honest test-takers.