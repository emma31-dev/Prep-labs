import { useUserStats } from '../../hooks/useUserStats';

const StatsCard = () => {
  const { stats, isLoading, error } = useUserStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
          Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
          Statistics
        </h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-500">Failed to load statistics</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statItems = [
    {
      icon: '🔥',
      value: stats.streakCount,
      label: 'Current Streak',
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      icon: '🏆',
      value: stats.bestStreak,
      label: 'Best Streak',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      icon: '📝',
      value: stats.totalTestsTaken,
      label: 'Tests Taken',
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      icon: '📊',
      value: `${stats.averageScore}%`,
      label: 'Avg Score',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#1f2937' }}>
        Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: item.bgColor }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: item.color }}
            >
              {item.value}
            </div>
            <div className="text-xs text-gray-600">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Attendance Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900">This Month</h4>
            <p className="text-sm text-gray-500">
              {stats.thisMonthAttendance} days active
            </p>
          </div>
          <div className="text-right">
            <h4 className="font-medium text-gray-900">Total Tests</h4>
            <p className="text-sm text-gray-500">
              {stats.totalTestsCompleted} completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;