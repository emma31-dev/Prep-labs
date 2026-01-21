import { useState } from "react";
import { useUserStats } from "../../hooks/useUserStats";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

const HistoryContent = () => {
  const { stats, isLoading, error } = useUserStats();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Tests', value: 'all' },
    { id: 'passed', label: 'Passed (≥70%)', value: 'passed' },
    { id: 'failed', label: 'Failed (<70%)', value: 'failed' },
    { id: 'excellent', label: 'Excellent (≥90%)', value: 'excellent' },
  ];

  const sortOptions: FilterOption[] = [
    { id: 'recent', label: 'Most Recent', value: 'recent' },
    { id: 'oldest', label: 'Oldest First', value: 'oldest' },
    { id: 'highest', label: 'Highest Score', value: 'highest' },
    { id: 'lowest', label: 'Lowest Score', value: 'lowest' },
  ];

  // Filter and sort test history
  const getFilteredAndSortedTests = () => {
    if (!stats?.testHistory) return [];

    let filtered = [...stats.testHistory];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(test => 
        test.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply score filter
    switch (selectedFilter) {
      case 'passed':
        filtered = filtered.filter(test => test.score >= 70);
        break;
      case 'failed':
        filtered = filtered.filter(test => test.score < 70);
        break;
      case 'excellent':
        filtered = filtered.filter(test => test.score >= 90);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
        break;
      case 'highest':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.score - b.score);
        break;
      default: // recent
        filtered.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    }

    return filtered;
  };

  const filteredTests = getFilteredAndSortedTests();

  // Calculate comprehensive statistics
  const calculateStats = () => {
    if (!stats?.testHistory || stats.testHistory.length === 0) {
      return {
        totalTests: 0,
        avgScore: 0,
        passRate: 0,
        totalTime: "0h 0m",
        bestStreak: 0,
        currentStreak: 0,
        excellentCount: 0,
        improvementTrend: 0,
      };
    }

    const tests = stats.testHistory;
    const totalTests = tests.length;
    const avgScore = Math.round(tests.reduce((sum, test) => sum + test.score, 0) / totalTests);
    const passedTests = tests.filter(test => test.score >= 70).length;
    const passRate = Math.round((passedTests / totalTests) * 100);
    const excellentCount = tests.filter(test => test.score >= 90).length;

    // Calculate improvement trend (last 5 vs previous 5)
    let improvementTrend = 0;
    if (tests.length >= 10) {
      const recent5 = tests.slice(0, 5);
      const previous5 = tests.slice(5, 10);
      const recentAvg = recent5.reduce((sum, test) => sum + test.score, 0) / 5;
      const previousAvg = previous5.reduce((sum, test) => sum + test.score, 0) / 5;
      improvementTrend = Math.round(recentAvg - previousAvg);
    }

    return {
      totalTests,
      avgScore,
      passRate,
      totalTime: "0h 0m", // Would need duration data
      bestStreak: stats.bestStreak || 0,
      currentStreak: stats.streakCount || 0,
      excellentCount,
      improvementTrend,
    };
  };

  const statsData = calculateStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#16a34a'; // Green
    if (score >= 80) return '#2563eb'; // Blue
    if (score >= 70) return '#f59e0b'; // Orange
    if (score >= 60) return '#ea580c'; // Dark orange
    return '#dc2626'; // Red
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🎯';
    if (score >= 70) return '✅';
    if (score >= 60) return '📈';
    return '❌';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: '#16a34a', bg: '#dcfce7' };
    if (score >= 80) return { text: 'Good', color: '#2563eb', bg: '#dbeafe' };
    if (score >= 70) return { text: 'Passed', color: '#f59e0b', bg: '#fef3c7' };
    if (score >= 60) return { text: 'Fair', color: '#ea580c', bg: '#fed7aa' };
    return { text: 'Failed', color: '#dc2626', bg: '#fecaca' };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Filters skeleton */}
        <div className="flex gap-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>

        {/* List skeleton */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#171717' }}>
          Failed to load test history
        </h3>
        <p className="text-sm text-center mb-6" style={{ color: '#737373' }}>
          {error}
        </p>
        <button
          className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#581c87' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!stats?.testHistory || stats.testHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: '#f3e8ff' }}
        >
          <svg 
            className="w-12 h-12" 
            style={{ color: '#581c87' }} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-3" style={{ color: '#171717' }}>
          No test history yet
        </h3>
        <p className="text-sm text-center max-w-md mb-8" style={{ color: '#737373' }}>
          Start taking quizzes to build your test history! All your completed tests will appear here with detailed analytics and performance insights.
        </p>
        <button
          className="px-8 py-3 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#581c87' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
        >
          Take Your First Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comprehensive Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#581c87' }}>
            {statsData.totalTests}
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Total Tests</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#ea580c' }}>
            {statsData.avgScore}%
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Average Score</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#16a34a' }}>
            {statsData.passRate}%
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Pass Rate</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            🏆 {statsData.excellentCount}
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Excellent</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#581c87' }}>
            🔥 {statsData.currentStreak}
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Current Streak</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold"
              style={{ 
                color: statsData.improvementTrend >= 0 ? '#16a34a' : '#dc2626' 
              }}
            >
              {statsData.improvementTrend >= 0 ? '📈' : '📉'} {Math.abs(statsData.improvementTrend)}%
            </div>
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>Trend</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {filterOptions.map(option => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="mt-4 text-sm" style={{ color: '#737373' }}>
          Showing {filteredTests.length} of {stats?.testHistory?.length || 0} tests
        </div>
      </div>

      {/* Test History List */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#171717' }}>
            No tests found
          </h3>
          <p className="text-sm" style={{ color: '#737373' }}>
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTests.map((test, index) => {
            const badge = getScoreBadge(test.score);
            return (
              <div
                key={`${test.id}-${index}`}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                      style={{ 
                        backgroundColor: `${getScoreColor(test.score)}20`,
                        color: getScoreColor(test.score)
                      }}
                    >
                      {getScoreIcon(test.score)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-semibold text-lg" style={{ color: '#171717' }}>
                          {test.title}
                        </h5>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: badge.bg,
                            color: badge.color
                          }}
                        >
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#737373' }}>
                        Completed {formatDate(test.completedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-3xl font-bold mb-1"
                      style={{ color: getScoreColor(test.score) }}
                    >
                      {test.score}%
                    </div>
                    <div className="text-xs" style={{ color: '#737373' }}>
                      Score
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Insights */}
      {stats?.testHistory && stats.testHistory.length >= 5 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#171717' }}>
            📊 Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2" style={{ color: '#581c87' }}>
                Recent Performance
              </h4>
              <p className="text-sm" style={{ color: '#737373' }}>
                {statsData.improvementTrend > 0 
                  ? `You've improved by ${statsData.improvementTrend}% in your last 5 tests! Keep it up! 🚀`
                  : statsData.improvementTrend < 0
                  ? `Your scores have dropped by ${Math.abs(statsData.improvementTrend)}% recently. Consider reviewing your study materials. 📚`
                  : 'Your performance has been consistent. Great job maintaining your level! 👍'
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: '#581c87' }}>
                Achievement Status
              </h4>
              <p className="text-sm" style={{ color: '#737373' }}>
                {statsData.excellentCount >= 5 
                  ? `Outstanding! You've achieved excellence in ${statsData.excellentCount} tests! 🏆`
                  : statsData.passRate >= 80
                  ? `Great consistency with ${statsData.passRate}% pass rate! 🎯`
                  : 'Focus on improving your pass rate for better results. 💪'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryContent;