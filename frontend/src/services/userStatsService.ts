const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface TestHistoryItem {
  id: string;
  title: string;
  completedAt: string;
  score: number;
}

export interface UserStats {
  streakCount: number;
  bestStreak: number;
  totalTestsTaken: number;
  attendanceDays: Date[];
  thisMonthAttendance: number;
  averageScore: number;
  totalTestsCompleted: number;
  testHistory: TestHistoryItem[];
}

export interface UserStatsResponse {
  success: boolean;
  stats?: UserStats;
  message?: string;
}

class UserStatsService {
  async getUserStats(accessToken: string): Promise<UserStatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user statistics');
      }

      // Convert date strings back to Date objects
      if (data.stats?.attendanceDays) {
        data.stats.attendanceDays = data.stats.attendanceDays.map((dateStr: string) => new Date(dateStr));
      }

      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch user statistics',
      };
    }
  }
}

export const userStatsService = new UserStatsService();