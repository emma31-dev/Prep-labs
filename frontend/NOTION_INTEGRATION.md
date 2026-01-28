# Notion Integration Guide

This document outlines how to integrate Notion authentication and database storage for enhanced organizational features available to Notion-authenticated users.

## Overview

Notion-authenticated users will have access to premium organizational features including:
- Automatic creation of quiz databases in Notion
- Test results and analytics stored as Notion pages
- Interactive charts and progress tracking in Notion
- PDF storage and organization in Notion
- Study notes and quiz preparation pages
- Team collaboration features via shared Notion workspaces

## Dependencies

```bash
pnpm install @notionhq/client notion-to-md
pnpm install --save-dev @types/notion
```

## Environment Variables

```env
# Notion Integration Configuration
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/auth/notion/callback

# Notion API
NOTION_API_VERSION=2022-06-28
NOTION_INTERNAL_INTEGRATION_TOKEN=your_internal_integration_token
```

## Implementation Strategy

### 1. Notion OAuth Setup

Configure Notion OAuth for authentication:

```typescript
// src/lib/notionAuth.ts
import { Client } from '@notionhq/client';

interface NotionAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class NotionAuthService {
  private config: NotionAuthConfig;

  constructor() {
    this.config = {
      clientId: process.env.NOTION_CLIENT_ID!,
      clientSecret: process.env.NOTION_CLIENT_SECRET!,
      redirectUri: process.env.NOTION_REDIRECT_URI!
    };
  }

  generateAuthUrl(): string {
    const baseUrl = 'https://api.notion.com/v1/oauth/authorize';
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      owner: 'user',
      redirect_uri: this.config.redirectUri
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  async getUserInfo(accessToken: string): Promise<any> {
    const notion = new Client({ auth: accessToken });
    
    try {
      const response = await notion.users.me({});
      return response;
    } catch (error) {
      console.error('Error getting user info:', error);
      throw new Error('Failed to get user information');
    }
  }
}
```

### 2. Notion Database Service

```typescript
// src/services/notionDatabaseService.ts
import { Client } from '@notionhq/client';
import { Quiz, TestResult } from '../types/quiz';

interface NotionDatabase {
  id: string;
  title: string;
  url: string;
  properties: any;
}

interface NotionPage {
  id: string;
  url: string;
  properties: any;
  created_time: string;
  last_edited_time: string;
}

export class NotionDatabaseService {
  private notion: Client;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.notion = new Client({ auth: accessToken });
  }

  async createQuizDatabase(): Promise<NotionDatabase> {
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: await this.getOrCreateRootPage()
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'QuizApp - My Quizzes'
            }
          }
        ],
        properties: {
          'Quiz Title': {
            title: {}
          },
          'Category': {
            select: {
              options: [
                { name: 'Math', color: 'blue' },
                { name: 'English', color: 'green' },
                { name: 'Science', color: 'purple' },
                { name: 'History', color: 'orange' },
                { name: 'Geography', color: 'yellow' },
                { name: 'Other', color: 'gray' }
              ]
            }
          },
          'Difficulty': {
            select: {
              options: [
                { name: 'Easy', color: 'green' },
                { name: 'Medium', color: 'yellow' },
                { name: 'Hard', color: 'red' }
              ]
            }
          },
          'Questions': {
            number: {}
          },
          'Time Limit': {
            number: {}
          },
          'Created Date': {
            date: {}
          },
          'Last Attempt': {
            date: {}
          },
          'Best Score': {
            number: {}
          },
          'Attempts': {
            number: {}
          },
          'Status': {
            select: {
              options: [
                { name: 'Draft', color: 'gray' },
                { name: 'Active', color: 'green' },
                { name: 'Archived', color: 'red' }
              ]
            }
          },
          'Tags': {
            multi_select: {}
          }
        }
      });

      return {
        id: response.id,
        title: 'QuizApp - My Quizzes',
        url: response.url,
        properties: response.properties
      };
    } catch (error) {
      console.error('Error creating quiz database:', error);
      throw new Error('Failed to create quiz database in Notion');
    }
  }

  async createTestResultsDatabase(): Promise<NotionDatabase> {
    try {
      const response = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: await this.getOrCreateRootPage()
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'QuizApp - Test Results'
            }
          }
        ],
        properties: {
          'Test Name': {
            title: {}
          },
          'Quiz': {
            relation: {
              database_id: await this.getQuizDatabaseId()
            }
          },
          'Score': {
            number: {}
          },
          'Percentage': {
            formula: {
              expression: 'prop("Score") / prop("Total Questions") * 100'
            }
          },
          'Correct Answers': {
            number: {}
          },
          'Total Questions': {
            number: {}
          },
          'Time Taken': {
            number: {}
          },
          'Date Taken': {
            date: {}
          },
          'Status': {
            select: {
              options: [
                { name: 'Completed', color: 'green' },
                { name: 'In Progress', color: 'yellow' },
                { name: 'Abandoned', color: 'red' }
              ]
            }
          },
          'Performance': {
            select: {
              options: [
                { name: 'Excellent', color: 'green' },
                { name: 'Good', color: 'blue' },
                { name: 'Average', color: 'yellow' },
                { name: 'Needs Improvement', color: 'red' }
              ]
            }
          }
        }
      });

      return {
        id: response.id,
        title: 'QuizApp - Test Results',
        url: response.url,
        properties: response.properties
      };
    } catch (error) {
      console.error('Error creating test results database:', error);
      throw new Error('Failed to create test results database in Notion');
    }
  }

  async addQuizToDatabase(quiz: Quiz, databaseId: string): Promise<NotionPage> {
    try {
      const response = await this.notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Quiz Title': {
            title: [
              {
                text: {
                  content: quiz.title
                }
              }
            ]
          },
          'Category': {
            select: {
              name: quiz.category || 'Other'
            }
          },
          'Difficulty': {
            select: {
              name: quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)
            }
          },
          'Questions': {
            number: quiz.total_questions
          },
          'Time Limit': {
            number: quiz.time_limit_minutes
          },
          'Created Date': {
            date: {
              start: quiz.created_at
            }
          },
          'Status': {
            select: {
              name: quiz.is_public ? 'Active' : 'Draft'
            }
          },
          'Tags': {
            multi_select: quiz.tags?.map(tag => ({ name: tag })) || []
          }
        }
      });

      // Add quiz content as page content
      await this.addQuizContent(response.id, quiz);

      return {
        id: response.id,
        url: response.url,
        properties: response.properties,
        created_time: response.created_time,
        last_edited_time: response.last_edited_time
      };
    } catch (error) {
      console.error('Error adding quiz to database:', error);
      throw new Error('Failed to add quiz to Notion database');
    }
  }

  async addTestResultToDatabase(testResult: TestResult, quiz: Quiz, databaseId: string): Promise<NotionPage> {
    try {
      const performance = this.calculatePerformance(testResult.score);
      
      const response = await this.notion.pages.create({
        parent: {
          database_id: databaseId
        },
        properties: {
          'Test Name': {
            title: [
              {
                text: {
                  content: `${quiz.title} - ${new Date(testResult.completed_at).toLocaleDateString()}`
                }
              }
            ]
          },
          'Score': {
            number: testResult.score
          },
          'Correct Answers': {
            number: testResult.correct_answers
          },
          'Total Questions': {
            number: testResult.total_questions
          },
          'Time Taken': {
            number: Math.round(testResult.time_taken_seconds / 60) // Convert to minutes
          },
          'Date Taken': {
            date: {
              start: testResult.completed_at
            }
          },
          'Status': {
            select: {
              name: testResult.status.charAt(0).toUpperCase() + testResult.status.slice(1).replace('_', ' ')
            }
          },
          'Performance': {
            select: {
              name: performance
            }
          }
        }
      });

      // Add detailed results as page content
      await this.addTestResultContent(response.id, testResult, quiz);

      return {
        id: response.id,
        url: response.url,
        properties: response.properties,
        created_time: response.created_time,
        last_edited_time: response.last_edited_time
      };
    } catch (error) {
      console.error('Error adding test result to database:', error);
      throw new Error('Failed to add test result to Notion database');
    }
  }

  async createProgressChart(userId: string, testResults: TestResult[]): Promise<NotionPage> {
    try {
      const rootPageId = await this.getOrCreateRootPage();
      
      const response = await this.notion.pages.create({
        parent: {
          page_id: rootPageId
        },
        properties: {
          title: [
            {
              text: {
                content: 'Quiz Progress Dashboard'
              }
            }
          ]
        }
      });

      // Add chart content
      await this.addProgressChartContent(response.id, testResults);

      return {
        id: response.id,
        url: response.url,
        properties: response.properties,
        created_time: response.created_time,
        last_edited_time: response.last_edited_time
      };
    } catch (error) {
      console.error('Error creating progress chart:', error);
      throw new Error('Failed to create progress chart in Notion');
    }
  }

  async uploadPDFToNotion(pdfBlob: Blob, quizTitle: string): Promise<NotionPage> {
    try {
      // Note: Notion doesn't support direct file uploads via API
      // This would require using Notion's file upload through their web interface
      // or storing the PDF elsewhere and linking to it
      
      const rootPageId = await this.getOrCreateRootPage();
      
      const response = await this.notion.pages.create({
        parent: {
          page_id: rootPageId
        },
        properties: {
          title: [
            {
              text: {
                content: `${quizTitle} - PDF Export`
              }
            }
          ]
        }
      });

      // Add PDF information and download instructions
      await this.notion.blocks.children.append({
        block_id: response.id,
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: `PDF export for quiz: ${quizTitle}`
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Generated on: '
                  }
                },
                {
                  type: 'text',
                  text: {
                    content: new Date().toLocaleString()
                  },
                  annotations: {
                    bold: true
                  }
                }
              ]
            }
          }
        ]
      });

      return {
        id: response.id,
        url: response.url,
        properties: response.properties,
        created_time: response.created_time,
        last_edited_time: response.last_edited_time
      };
    } catch (error) {
      console.error('Error uploading PDF info to Notion:', error);
      throw new Error('Failed to create PDF page in Notion');
    }
  }

  private async getOrCreateRootPage(): Promise<string> {
    // This would need to be implemented based on your specific needs
    // You might want to create a dedicated QuizApp page in the user's workspace
    // For now, this is a placeholder that would need the actual implementation
    throw new Error('Root page creation not implemented');
  }

  private async getQuizDatabaseId(): Promise<string> {
    // Implementation to get or create the quiz database ID
    // This would store the database ID after creation
    throw new Error('Quiz database ID retrieval not implemented');
  }

  private async addQuizContent(pageId: string, quiz: Quiz): Promise<void> {
    const blocks = [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Quiz Details'
              }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: quiz.description || 'No description provided.'
              }
            }
          ]
        }
      }
    ];

    // Add questions
    quiz.questions.forEach((question, index) => {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Question ${index + 1}`
              }
            }
          ]
        }
      });

      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: question.question
              }
            }
          ]
        }
      });

      // Add options
      question.options.forEach((option, optionIndex) => {
        const isCorrect = optionIndex === question.correct_answer;
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${String.fromCharCode(65 + optionIndex)}. ${option}`
                },
                annotations: {
                  bold: isCorrect
                }
              }
            ]
          }
        });
      });
    });

    await this.notion.blocks.children.append({
      block_id: pageId,
      children: blocks
    });
  }

  private async addTestResultContent(pageId: string, testResult: TestResult, quiz: Quiz): Promise<void> {
    const blocks = [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Test Summary'
              }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Score: ${testResult.score}% (${testResult.correct_answers}/${testResult.total_questions})`
              }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Time taken: ${Math.round(testResult.time_taken_seconds / 60)} minutes`
              }
            }
          ]
        }
      }
    ];

    // Add detailed answers
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Detailed Results'
            }
          }
        ]
      }
    });

    testResult.answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer.is_correct;
      
      blocks.push({
        object: 'block',
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Question ${index + 1}: ${isCorrect ? '✅' : '❌'}`
              }
            }
          ],
          children: [
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: question.question
                    }
                  }
                ]
              }
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: `Your answer: ${answer.selected_answer !== null ? question.options[answer.selected_answer] : 'Not answered'}`
                    }
                  }
                ]
              }
            },
            {
              object: 'block',
              type: 'paragraph',
              paragraph: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: `Correct answer: ${question.options[question.correct_answer]}`
                    }
                  }
                ]
              }
            }
          ]
        }
      });
    });

    await this.notion.blocks.children.append({
      block_id: pageId,
      children: blocks
    });
  }

  private async addProgressChartContent(pageId: string, testResults: TestResult[]): Promise<void> {
    // Create a simple text-based progress chart
    // In a real implementation, you might want to use external charting services
    // and embed the images in Notion
    
    const sortedResults = testResults.sort((a, b) => 
      new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
    );

    const blocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Quiz Progress Dashboard'
              }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Total tests taken: ${testResults.length}`
              }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Average score: ${(testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length).toFixed(1)}%`
              }
            }
          ]
        }
      }
    ];

    // Add recent results table
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Recent Test Results'
            }
          }
        ]
      }
    });

    sortedResults.slice(-10).forEach((result, index) => {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${new Date(result.completed_at).toLocaleDateString()}: ${result.score}% - ${this.calculatePerformance(result.score)}`
              }
            }
          ]
        }
      });
    });

    await this.notion.blocks.children.append({
      block_id: pageId,
      children: blocks
    });
  }

  private calculatePerformance(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Improvement';
  }
}
```

### 3. Notion Authentication Hook

```typescript
// src/hooks/useNotionAuth.ts
import { useState, useEffect } from 'react';
import { NotionAuthService } from '../lib/notionAuth';
import { NotionDatabaseService } from '../services/notionDatabaseService';

interface NotionAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  databaseService: NotionDatabaseService | null;
  workspaceInfo: any | null;
  error: string | null;
}

export const useNotionAuth = () => {
  const [state, setState] = useState<NotionAuthState>({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    databaseService: null,
    workspaceInfo: null,
    error: null
  });

  const notionAuthService = new NotionAuthService();

  const initiateNotionAuth = () => {
    const authUrl = notionAuthService.generateAuthUrl();
    window.location.href = authUrl;
  };

  const handleAuthCallback = async (code: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const tokenResponse = await notionAuthService.exchangeCodeForToken(code);
      const userInfo = await notionAuthService.getUserInfo(tokenResponse.access_token);

      // Store tokens securely
      localStorage.setItem('notion_tokens', JSON.stringify(tokenResponse));
      localStorage.setItem('notion_user', JSON.stringify(userInfo));

      const databaseService = new NotionDatabaseService(tokenResponse.access_token);

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
        user: userInfo,
        databaseService,
        workspaceInfo: tokenResponse.workspace
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
    localStorage.removeItem('notion_tokens');
    localStorage.removeItem('notion_user');
    
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      databaseService: null,
      workspaceInfo: null,
      error: null
    });
  };

  const checkExistingAuth = async () => {
    const tokens = localStorage.getItem('notion_tokens');
    const user = localStorage.getItem('notion_user');

    if (tokens && user) {
      try {
        const parsedTokens = JSON.parse(tokens);
        const parsedUser = JSON.parse(user);

        const databaseService = new NotionDatabaseService(parsedTokens.access_token);

        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: parsedUser,
          databaseService,
          workspaceInfo: parsedTokens.workspace
        }));
      } catch (error) {
        console.error('Error restoring Notion auth:', error);
        signOut();
      }
    }
  };

  useEffect(() => {
    checkExistingAuth();
  }, []);

  return {
    ...state,
    initiateNotionAuth,
    handleAuthCallback,
    signOut,
    checkExistingAuth
  };
};
```

### 4. Notion Integration Components

```typescript
// src/components/notion/NotionAuthButton.tsx
import React from 'react';
import { useNotionAuth } from '../../hooks/useNotionAuth';

export const NotionAuthButton: React.FC = () => {
  const { isAuthenticated, isLoading, user, workspaceInfo, initiateNotionAuth, signOut } = useNotionAuth();

  const handleAuth = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      initiateNotionAuth();
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {workspaceInfo?.name || 'Notion Connected'}
            </p>
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
      <div className="w-5 h-5 mr-2 bg-black rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">N</span>
      </div>
      {isLoading ? 'Connecting...' : 'Connect Notion'}
    </button>
  );
};
```

```typescript
// src/components/notion/NotionDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNotionAuth } from '../../hooks/useNotionAuth';
import { Database, FileText, BarChart3, Upload } from 'lucide-react';

export const NotionDashboard: React.FC = () => {
  const { isAuthenticated, databaseService } = useNotionAuth();
  const [databases, setDatabases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setupNotionWorkspace = async () => {
    if (!databaseService) return;

    setIsLoading(true);
    try {
      // Create quiz database
      const quizDb = await databaseService.createQuizDatabase();
      
      // Create test results database
      const resultsDb = await databaseService.createTestResultsDatabase();

      setDatabases([quizDb, resultsDb]);
    } catch (error) {
      console.error('Error setting up Notion workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect Notion to organize your quizzes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black text-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">Notion Integration</h2>
        <p className="text-gray-300 mb-4">
          Organize your quizzes, track progress, and store results in your Notion workspace.
        </p>
        
        {databases.length === 0 ? (
          <button
            onClick={setupNotionWorkspace}
            disabled={isLoading}
            className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : 'Setup Notion Workspace'}
          </button>
        ) : (
          <div className="text-green-300">
            ✅ Notion workspace configured
          </div>
        )}
      </div>

      {databases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium">Quiz Database</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              All your quizzes organized in a Notion database
            </p>
            <a
              href={databases[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Open in Notion →
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <BarChart3 className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium">Test Results</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Track your performance and progress over time
            </p>
            <a
              href={databases[1]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm"
            >
              View Results →
            </a>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Available Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Automatic quiz backup to Notion databases</li>
          <li>• Test results tracking with detailed analytics</li>
          <li>• Progress charts and performance insights</li>
          <li>• PDF storage and organization</li>
          <li>• Collaborative study notes and preparation pages</li>
        </ul>
      </div>
    </div>
  );
};
```

## Features for Notion-Authenticated Users

### Premium Features
- **Organized Databases**: Automatic creation of quiz and test result databases
- **Progress Tracking**: Interactive charts and analytics in Notion pages
- **PDF Organization**: Store and organize quiz PDFs in Notion
- **Study Notes**: Create collaborative study materials and preparation pages
- **Team Collaboration**: Share quizzes and results with team members
- **Advanced Analytics**: Detailed performance tracking and insights

### Database Structure
- **Quiz Database**: Stores all quiz metadata, questions, and settings
- **Test Results Database**: Tracks all test attempts with detailed analytics
- **Progress Pages**: Dynamic pages showing performance trends and insights

### Security Considerations
- OAuth 2.0 with workspace-level permissions
- Secure token storage and refresh
- Minimal required permissions
- User-controlled data sharing

### Future Enhancements
- Advanced chart integration with external services
- Automated study schedules and reminders
- Integration with Notion AI for quiz insights
- Template sharing and community features
- Advanced collaboration tools for educators

This Notion integration provides powerful organizational and analytical capabilities for users who want to leverage Notion's database and page features for their quiz management and progress tracking.