import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '../store/authAtoms';
import { userStatsService, type UserStats } from '../services/userStatsService';

export const useUserStats = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userStatsService.getUserStats(accessToken);
      
      if (response.success && response.stats) {
        setStats(response.stats);
      } else {
        setError(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [accessToken]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};