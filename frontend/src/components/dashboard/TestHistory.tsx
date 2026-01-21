import { useUserStats } from "../../hooks/useUserStats";

const TestHistory = () => {
  const { stats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#171717' }}>
          Failed to load test history
        </h3>
        <p className="text-sm text-center" style={{ color: '#737373' }}>
          {error}
        </p>
      </div>
    );
  }

  const testHistory = stats?.testHistory || [];

  if (testHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#f3e8ff' }}
        >
          <svg 
            className="w-10 h-10" 
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
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#171717' }}>
          No tests completed yet
        </h3>
        <p className="text-sm text-center max-w-xs" style={{ color: '#737373' }}>
          Complete your first quiz to see your test history here. All your completed tests will be displayed with scores and completion times.
        </p>
        <button
          className="mt-6 px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#581c87' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
        >
          Take Your First Quiz
        </button>
      </div>
    );
  }

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
    if (score >= 70) return '👍';
    if (score >= 60) return '📈';
    return '📉';
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#581c87' }}>
            {testHistory.length}
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>
            Total Tests
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#16a34a' }}>
            {stats?.averageScore || 0}%
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>
            Average Score
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            {testHistory.filter(test => test.score >= 70).length}
          </div>
          <div className="text-sm" style={{ color: '#737373' }}>
            Tests Passed
          </div>
        </div>
      </div>

      {/* Test History List */}
      <div className="space-y-3">
        <h4 className="font-medium" style={{ color: '#171717' }}>Recent Tests</h4>
        {testHistory.slice(0, 10).map((test, index) => (
          <div
            key={`${test.id}-${index}`}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: `${getScoreColor(test.score)}20` }}
              >
                {getScoreIcon(test.score)}
              </div>
              <div>
                <h5 className="font-medium" style={{ color: '#171717' }}>
                  {test.title}
                </h5>
                <p className="text-sm" style={{ color: '#737373' }}>
                  {formatDate(test.completedAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className="text-xl font-bold"
                style={{ color: getScoreColor(test.score) }}
              >
                {test.score}%
              </div>
              <div className="text-xs" style={{ color: '#737373' }}>
                {test.score >= 70 ? 'Passed' : 'Failed'}
              </div>
            </div>
          </div>
        ))}
        
        {testHistory.length > 10 && (
          <div className="text-center pt-4">
            <button
              className="text-sm font-medium transition-colors"
              style={{ color: '#581c87' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6b21a8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#581c87'}
            >
              View All Tests ({testHistory.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestHistory;