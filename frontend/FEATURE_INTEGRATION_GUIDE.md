# Feature Integration Guide - Page Impact Analysis

This document outlines how the new features (Google Integration, Notion Integration, Proctoring, and PDF Export) will affect different pages and components throughout the frontend application.

## Overview of New Features

1. **Google Integration**: Drive storage, automatic backup, enhanced quotas
2. **Notion Integration**: Database organization, progress tracking, collaborative features
3. **Proctoring**: Anti-cheating monitoring during tests
4. **PDF Export**: Offline quiz generation and sharing

---

## Page-by-Page Impact Analysis

### 1. Landing Page (`src/pages/Landing.tsx`)

#### Changes Required:
- **Hero Section**: Add premium feature highlights
- **Features Section**: Showcase integration capabilities
- **Pricing Section**: Update to reflect integration benefits

#### New Components to Add:
```typescript
// src/components/landing/IntegrationShowcase.tsx
export const IntegrationShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <IntegrationCard
            icon={<GoogleDriveIcon />}
            title="Google Drive"
            description="Automatic backup and sync across devices"
            features={["15GB free storage", "Cross-device sync", "Automatic backup"]}
          />
          <IntegrationCard
            icon={<NotionIcon />}
            title="Notion"
            description="Organize quizzes in your workspace"
            features={["Database organization", "Progress tracking", "Team collaboration"]}
          />
          <IntegrationCard
            icon={<ShieldIcon />}
            title="Proctoring"
            description="Secure test environment"
            features={["Anti-cheating", "Violation tracking", "Integrity scoring"]}
          />
        </div>
      </div>
    </section>
  );
};
```

#### Updated Features Section:
```typescript
const features = [
  // Existing features...
  {
    title: "Google Drive Integration",
    description: "Automatic backup and sync with unlimited storage",
    icon: <Cloud className="w-6 h-6" />,
    premium: true
  },
  {
    title: "Notion Organization",
    description: "Organize quizzes and track progress in Notion",
    icon: <Database className="w-6 h-6" />,
    premium: true
  },
  {
    title: "PDF Export",
    description: "Export quizzes for offline practice and sharing",
    icon: <FileText className="w-6 h-6" />
  },
  {
    title: "Proctored Testing",
    description: "Secure test environment with anti-cheating measures",
    icon: <Shield className="w-6 h-6" />
  }
];
```

---

### 2. Dashboard Home (`src/components/dashboard/HomeContent.tsx`)

#### Changes Required:
- Add integration status cards
- Show premium feature availability
- Display storage usage for connected services

#### New Components:
```typescript
// Integration status overview
const IntegrationStatus: React.FC = () => {
  const { isAuthenticated: googleAuth } = useGoogleAuth();
  const { isAuthenticated: notionAuth } = useNotionAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <IntegrationStatusCard
        service="Google Drive"
        connected={googleAuth}
        icon={<GoogleDriveIcon />}
        benefits={["Auto backup", "15GB storage", "Cross-device sync"]}
      />
      <IntegrationStatusCard
        service="Notion"
        connected={notionAuth}
        icon={<NotionIcon />}
        benefits={["Database organization", "Progress tracking", "Collaboration"]}
      />
    </div>
  );
};
```

#### Enhanced Stats Cards:
```typescript
const statsCards = [
  // Existing stats...
  {
    title: "Cloud Storage Used",
    value: googleAuth ? `${storageUsed}GB / 15GB` : "Not connected",
    icon: <Cloud className="w-5 h-5" />,
    premium: true
  },
  {
    title: "Proctored Tests",
    value: proctoredTestCount,
    icon: <Shield className="w-5 h-5" />
  }
];
```

---

### 3. Profile Settings (`src/components/dashboard/ProfileContent.tsx`)

#### Changes Required:
- Add integration management section
- Include privacy settings for proctoring
- Add export preferences

#### New Sections:
```typescript
const IntegrationsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Integrations</h3>
      
      <div className="space-y-4">
        <GoogleAuthButton />
        <NotionAuthButton />
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Integration Preferences</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Auto-backup uploaded images to Google Drive</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Sync quiz data to Notion automatically</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Enable proctoring by default for new tests</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 4. Resources Page (`src/components/dashboard/ResourcesContent.tsx`)

#### Changes Required:
- Add backup status indicators
- Include Google Drive and Notion sync options
- Show storage usage per resource

#### Enhanced Resource Cards:
```typescript
const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const { isGoogleDriveAvailable } = useGoogleDriveUpload();
  const { isAuthenticated: notionAuth } = useNotionAuth();

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Existing resource content */}
      
      {/* Integration Status */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
        {resource.drive_folder_id && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            <Cloud className="w-3 h-3 mr-1" />
            Google Drive
          </span>
        )}
        {resource.notion_page_id && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-black text-white">
            <Database className="w-3 h-3 mr-1" />
            Notion
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          {/* Existing buttons */}
        </div>
        
        <div className="flex space-x-1">
          {isGoogleDriveAvailable && !resource.drive_folder_id && (
            <button
              onClick={() => backupToGoogleDrive(resource.id)}
              className="p-1 text-blue-600 hover:text-blue-700"
              title="Backup to Google Drive"
            >
              <Cloud className="w-4 h-4" />
            </button>
          )}
          {notionAuth && !resource.notion_page_id && (
            <button
              onClick={() => syncToNotion(resource.id)}
              className="p-1 text-gray-800 hover:text-gray-900"
              title="Sync to Notion"
            >
              <Database className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### 5. Quiz Management (`src/components/dashboard/QuizzesContent.tsx`)

#### Changes Required:
- Add PDF export buttons
- Include proctoring toggle
- Show integration sync status

#### Enhanced Quiz Actions:
```typescript
const QuizActions: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProctoringSettings, setShowProctoringSettings] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* Existing actions */}
      
      {/* PDF Export */}
      <button
        onClick={() => setShowExportModal(true)}
        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Download className="w-4 h-4 mr-1" />
        Export PDF
      </button>

      {/* Proctoring Settings */}
      <button
        onClick={() => setShowProctoringSettings(true)}
        className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        <Shield className="w-4 h-4 mr-1" />
        Proctoring
      </button>

      {/* Modals */}
      <PDFExportModal
        quiz={quiz}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      <ProctoringSettingsModal
        quiz={quiz}
        isOpen={showProctoringSettings}
        onClose={() => setShowProctoringSettings(false)}
      />
    </div>
  );
};
```

---

### 6. Test Taking Page (`src/pages/Quiz.tsx`)

#### Changes Required:
- Integrate proctoring system
- Add proctoring status indicator
- Handle violation warnings

#### Proctored Test Implementation:
```typescript
const Quiz: React.FC = () => {
  const { testId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isProctoringEnabled, setIsProctoringEnabled] = useState(false);

  // Check if proctoring is enabled for this quiz
  useEffect(() => {
    if (quiz) {
      setIsProctoringEnabled(quiz.proctoring_enabled || false);
    }
  }, [quiz]);

  if (isProctoringEnabled) {
    return <ProctoredTest testId={testId!} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Regular test interface */}
      <TestInterface quiz={quiz} />
    </div>
  );
};
```

---

### 7. Test History (`src/components/dashboard/TestHistory.tsx`)

#### Changes Required:
- Show proctoring status
- Display violation counts
- Add integrity scores

#### Enhanced History Items:
```typescript
const TestHistoryItem: React.FC<{ result: TestResult }> = ({ result }) => {
  const proctoringData = result.proctoring_data;
  const wasProctored = proctoringData?.was_proctored;
  const violationCount = proctoringData?.violations?.length || 0;
  const integrityScore = proctoringData?.proctoring_score || 100;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Existing content */}
      
      {/* Proctoring Status */}
      {wasProctored && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Proctored Test</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className={`${violationCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {violationCount} violations
            </span>
            <span className={`${integrityScore < 80 ? 'text-red-600' : 'text-green-600'}`}>
              {integrityScore}% integrity
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### 8. Settings Page (`src/components/dashboard/SettingsExport.tsx`)

#### Changes Required:
- Add integration management
- Include proctoring preferences
- Add export settings

#### New Settings Sections:
```typescript
const IntegrationSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Cloud Integrations</h3>
        <GoogleDriveManager />
        <NotionDashboard />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Proctoring Settings</h3>
        <ProctoringPreferences />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Export Preferences</h3>
        <PDFExportPreferences />
      </div>
    </div>
  );
};
```

---

## Component Architecture Changes

### New Shared Components

#### 1. Integration Status Components
```typescript
// src/components/shared/IntegrationBadge.tsx
export const IntegrationBadge: React.FC<{
  service: 'google' | 'notion';
  connected: boolean;
}> = ({ service, connected }) => {
  // Badge component for showing integration status
};

// src/components/shared/PremiumFeatureBanner.tsx
export const PremiumFeatureBanner: React.FC<{
  feature: string;
  description: string;
  onConnect: () => void;
}> = ({ feature, description, onConnect }) => {
  // Banner to promote premium features
};
```

#### 2. Enhanced Navigation
```typescript
// Update src/components/dashboard/Sidebar.tsx
const navigationItems = [
  // Existing items...
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: <Puzzle className="w-5 h-5" />,
    badge: hasActiveIntegrations ? 'Connected' : null
  }
];
```

### State Management Updates

#### New Atoms for Integration State
```typescript
// src/store/integrationAtoms.ts
export const googleIntegrationAtom = atom({
  key: 'googleIntegration',
  default: {
    connected: false,
    user: null,
    storageUsed: 0,
    storageLimit: 15000000000 // 15GB in bytes
  }
});

export const notionIntegrationAtom = atom({
  key: 'notionIntegration',
  default: {
    connected: false,
    workspace: null,
    databases: {}
  }
});

export const proctoringSettingsAtom = atom({
  key: 'proctoringSettings',
  default: {
    enabledByDefault: false,
    maxWarnings: 3,
    strictMode: false
  }
});
```

## Feature Rollout Strategy

### Phase 1: Core Integration
1. Add integration buttons to profile settings
2. Implement basic Google Drive and Notion auth
3. Add PDF export functionality to quiz pages

### Phase 2: Enhanced Features
1. Add proctoring system to test pages
2. Implement automatic backup features
3. Add integration status indicators throughout app

### Phase 3: Advanced Features
1. Add bulk operations for integrations
2. Implement advanced proctoring analytics
3. Add collaborative features via Notion

### Phase 4: Optimization
1. Add caching for integration data
2. Implement offline support for PDF exports
3. Add advanced analytics and reporting

This comprehensive integration will transform the app from a basic quiz platform into a full-featured educational tool with cloud storage, organization, and security capabilities.