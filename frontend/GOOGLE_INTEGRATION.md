# Google Integration Guide

This document outlines how to integrate Google authentication and Google Drive storage for enhanced features available to Google-authenticated users.

## Overview

Google-authenticated users will have access to premium features including:
- Automatic backup of uploaded images to Google Drive
- Storage of generated quiz PDFs in Google Drive
- Sync quiz data across devices via Google Drive
- Enhanced storage quotas
- Google Classroom integration (future)

## Dependencies

```bash
pnpm install @google-cloud/storage googleapis google-auth-library
pnpm install --save-dev @types/google-auth-library
```

## Environment Variables

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Google Drive API
GOOGLE_DRIVE_API_KEY=your_drive_api_key
GOOGLE_SERVICE_ACCOUNT_KEY=path_to_service_account_key.json

# Google Cloud Storage (optional for advanced features)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_storage_bucket
```

## Implementation Strategy

### 1. Google OAuth Setup

Configure Google OAuth for authentication:

```typescript
// src/lib/googleAuth.ts
import { GoogleAuth } from 'google-auth-library';

interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export class GoogleAuthService {
  private auth: GoogleAuth;
  private config: GoogleAuthConfig;

  constructor() {
    this.config = {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata'
      ]
    };

    this.auth = new GoogleAuth({
      scopes: this.config.scopes,
      credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    });
  }

  generateAuthUrl(): string {
    const oauth2Client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(code: string) {
    const oauth2Client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    return { oauth2Client, tokens };
  }

  async getUserInfo(oauth2Client: any) {
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return data;
  }
}
```

### 2. Google Drive Integration Service

```typescript
// src/services/googleDriveService.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
}

interface UploadOptions {
  name: string;
  mimeType: string;
  parents?: string[];
  description?: string;
}

export class GoogleDriveService {
  private drive: any;
  private oauth2Client: OAuth2Client;

  constructor(oauth2Client: OAuth2Client) {
    this.oauth2Client = oauth2Client;
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async createAppFolder(): Promise<string> {
    try {
      // Check if QuizApp folder already exists
      const existingFolders = await this.drive.files.list({
        q: "name='QuizApp' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name)'
      });

      if (existingFolders.data.files.length > 0) {
        return existingFolders.data.files[0].id;
      }

      // Create new folder
      const folderMetadata = {
        name: 'QuizApp',
        mimeType: 'application/vnd.google-apps.folder',
        description: 'QuizApp data storage folder'
      };

      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      });

      return folder.data.id;
    } catch (error) {
      console.error('Error creating app folder:', error);
      throw new Error('Failed to create app folder in Google Drive');
    }
  }

  async uploadImage(imageBlob: Blob, options: UploadOptions): Promise<DriveFile> {
    try {
      const appFolderId = await this.createAppFolder();
      const imagesFolderId = await this.createSubFolder(appFolderId, 'Images');

      const media = {
        mimeType: options.mimeType,
        body: imageBlob
      };

      const fileMetadata = {
        name: options.name,
        parents: [imagesFolderId],
        description: options.description || 'Quiz image uploaded from QuizApp'
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink'
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image to Google Drive');
    }
  }

  async uploadPDF(pdfBlob: Blob, quizTitle: string): Promise<DriveFile> {
    try {
      const appFolderId = await this.createAppFolder();
      const pdfFolderId = await this.createSubFolder(appFolderId, 'Quiz PDFs');

      const media = {
        mimeType: 'application/pdf',
        body: pdfBlob
      };

      const fileMetadata = {
        name: `${quizTitle}_quiz.pdf`,
        parents: [pdfFolderId],
        description: `Quiz PDF: ${quizTitle}`
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink'
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to upload PDF to Google Drive');
    }
  }

  async syncQuizData(quizData: any): Promise<DriveFile> {
    try {
      const appFolderId = await this.createAppFolder();
      const dataFolderId = await this.createSubFolder(appFolderId, 'Quiz Data');

      const jsonData = JSON.stringify(quizData, null, 2);
      const media = {
        mimeType: 'application/json',
        body: jsonData
      };

      const fileMetadata = {
        name: `quiz_${quizData.id}.json`,
        parents: [dataFolderId],
        description: `Quiz data backup: ${quizData.title}`
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, mimeType, size, createdTime, modifiedTime'
      });

      return response.data;
    } catch (error) {
      console.error('Error syncing quiz data:', error);
      throw new Error('Failed to sync quiz data to Google Drive');
    }
  }

  async listFiles(folderId?: string): Promise<DriveFile[]> {
    try {
      const query = folderId 
        ? `'${folderId}' in parents and trashed=false`
        : "trashed=false";

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({ fileId });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file from Google Drive');
    }
  }

  async getStorageQuota(): Promise<{ used: string; limit: string; usageInDrive: string }> {
    try {
      const response = await this.drive.about.get({
        fields: 'storageQuota'
      });

      return response.data.storageQuota;
    } catch (error) {
      console.error('Error getting storage quota:', error);
      throw new Error('Failed to get storage quota');
    }
  }

  private async createSubFolder(parentId: string, folderName: string): Promise<string> {
    try {
      // Check if subfolder already exists
      const existingFolders = await this.drive.files.list({
        q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)'
      });

      if (existingFolders.data.files.length > 0) {
        return existingFolders.data.files[0].id;
      }

      // Create new subfolder
      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId]
      };

      const folder = await this.drive.files.create({
        resource: folderMetadata,
        fields: 'id'
      });

      return folder.data.id;
    } catch (error) {
      console.error(`Error creating ${folderName} folder:`, error);
      throw new Error(`Failed to create ${folderName} folder`);
    }
  }
}
```

### 3. Google Authentication Hook

```typescript
// src/hooks/useGoogleAuth.ts
import { useState, useEffect } from 'react';
import { GoogleAuthService } from '../lib/googleAuth';
import { GoogleDriveService } from '../services/googleDriveService';

interface GoogleAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  driveService: GoogleDriveService | null;
  error: string | null;
}

export const useGoogleAuth = () => {
  const [state, setState] = useState<GoogleAuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    driveService: null,
    error: null
  });

  const googleAuthService = new GoogleAuthService();

  const initiateGoogleAuth = () => {
    const authUrl = googleAuthService.generateAuthUrl();
    window.location.href = authUrl;
  };

  const handleAuthCallback = async (code: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { oauth2Client, tokens } = await googleAuthService.exchangeCodeForTokens(code);
      const userInfo = await googleAuthService.getUserInfo(oauth2Client);

      // Store tokens securely (consider using secure storage)
      localStorage.setItem('google_tokens', JSON.stringify(tokens));
      localStorage.setItem('google_user', JSON.stringify(userInfo));

      const driveService = new GoogleDriveService(oauth2Client);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
        user: userInfo,
        driveService
      }));

      return { success: true, user: userInfo };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      }));

      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('google_tokens');
    localStorage.removeItem('google_user');
    
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      driveService: null,
      error: null
    });
  };

  const checkExistingAuth = async () => {
    const tokens = localStorage.getItem('google_tokens');
    const user = localStorage.getItem('google_user');

    if (tokens && user) {
      try {
        const parsedTokens = JSON.parse(tokens);
        const parsedUser = JSON.parse(user);

        // Recreate OAuth2 client with stored tokens
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        
        oauth2Client.setCredentials(parsedTokens);
        const driveService = new GoogleDriveService(oauth2Client);

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: parsedUser,
          driveService
        }));
      } catch (error) {
        console.error('Error restoring Google auth:', error);
        signOut();
      }
    }
  };

  useEffect(() => {
    checkExistingAuth();
  }, []);

  return {
    ...state,
    initiateGoogleAuth,
    handleAuthCallback,
    signOut,
    checkExistingAuth
  };
};
```

### 4. Google Integration Components

```typescript
// src/components/google/GoogleAuthButton.tsx
import React from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

interface GoogleAuthButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError
}) => {
  const { isAuthenticated, isLoading, user, initiateGoogleAuth, signOut } = useGoogleAuth();

  const handleAuth = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      initiateGoogleAuth();
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">Google Drive Connected</p>
          </div>
        </div>
        <button
          onClick={handleAuth}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoading}
      className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? 'Connecting...' : 'Connect Google Drive'}
    </button>
  );
};
```

```typescript
// src/components/google/GoogleDriveManager.tsx
import React, { useState, useEffect } from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { Cloud, Download, Trash2, FileText, Image } from 'lucide-react';

export const GoogleDriveManager: React.FC = () => {
  const { isAuthenticated, driveService } = useGoogleAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storageQuota, setStorageQuota] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && driveService) {
      loadFiles();
      loadStorageQuota();
    }
  }, [isAuthenticated, driveService]);

  const loadFiles = async () => {
    if (!driveService) return;

    setIsLoading(true);
    try {
      const fileList = await driveService.listFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageQuota = async () => {
    if (!driveService) return;

    try {
      const quota = await driveService.getStorageQuota();
      setStorageQuota(quota);
    } catch (error) {
      console.error('Error loading storage quota:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!driveService) return;

    try {
      await driveService.deleteFile(fileId);
      await loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType === 'application/pdf') return FileText;
    return FileText;
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect Google Drive to manage your files</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Storage Quota */}
      {storageQuota && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Google Drive Storage</h3>
          <div className="text-sm text-blue-700">
            <p>Used: {formatFileSize(storageQuota.usageInDrive)} / {formatFileSize(storageQuota.limit)}</p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(parseInt(storageQuota.usageInDrive) / parseInt(storageQuota.limit)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Files List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Your Files</h3>
          <button
            onClick={loadFiles}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No files found in your QuizApp folder</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => {
              const FileIcon = getFileIcon(file.mimeType);
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.modifiedTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 5. Enhanced Upload with Google Drive Backup

```typescript
// src/hooks/useGoogleDriveUpload.ts
import { useGoogleAuth } from './useGoogleAuth';

export const useGoogleDriveUpload = () => {
  const { isAuthenticated, driveService } = useGoogleAuth();

  const uploadImageWithBackup = async (imageFile: File, resourceId: string) => {
    // Upload to your regular storage first
    const regularUpload = await uploadImageToRegularStorage(imageFile, resourceId);

    // If Google Drive is connected, also backup there
    if (isAuthenticated && driveService) {
      try {
        const driveFile = await driveService.uploadImage(imageFile, {
          name: `${resourceId}_${imageFile.name}`,
          mimeType: imageFile.type,
          description: `Backup of image for resource ${resourceId}`
        });

        // Update resource record with Google Drive file ID
        await updateResourceWithDriveBackup(resourceId, driveFile.id);
      } catch (error) {
        console.error('Google Drive backup failed:', error);
        // Don't fail the main upload if backup fails
      }
    }

    return regularUpload;
  };

  const uploadPDFWithBackup = async (pdfBlob: Blob, quizTitle: string) => {
    if (isAuthenticated && driveService) {
      try {
        const driveFile = await driveService.uploadPDF(pdfBlob, quizTitle);
        return driveFile;
      } catch (error) {
        console.error('PDF upload to Google Drive failed:', error);
        throw error;
      }
    }

    throw new Error('Google Drive not connected');
  };

  return {
    uploadImageWithBackup,
    uploadPDFWithBackup,
    isGoogleDriveAvailable: isAuthenticated && !!driveService
  };
};
```

## Features for Google-Authenticated Users

### Premium Features
- **Automatic Backup**: All uploaded images automatically backed up to Google Drive
- **PDF Storage**: Generated quiz PDFs saved to Google Drive with organized folder structure
- **Cross-Device Sync**: Quiz data synchronized across devices via Google Drive
- **Enhanced Storage**: Access to Google Drive's 15GB free storage
- **File Management**: Built-in file manager for Google Drive content

### Security Considerations
- OAuth 2.0 with secure token storage
- Minimal required permissions (drive.file scope)
- Automatic token refresh
- Secure credential handling

### Future Enhancements
- Google Classroom integration
- Google Sheets export for quiz results
- Google Forms integration
- Collaborative quiz creation
- Google Calendar integration for scheduled tests

This Google integration provides significant value-add features for users willing to connect their Google accounts, enhancing the overall platform experience with cloud storage and synchronization capabilities.