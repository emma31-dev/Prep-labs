const HistoryContent = () => {
  // Mock data for test history
  const testHistory = [
    { id: 1, title: "MCT Mock Test - Session 1", date: "Jan 9, 2026", score: 85, total: 100, duration: "28 min", status: "passed" },
    { id: 2, title: "Contract Law Quiz", date: "Jan 8, 2026", score: 72, total: 100, duration: "22 min", status: "passed" },
    { id: 3, title: "Biology Chapter 5", date: "Jan 7, 2026", score: 45, total: 100, duration: "30 min", status: "failed" },
    { id: 4, title: "Mathematics - Calculus", date: "Jan 6, 2026", score: 90, total: 100, duration: "25 min", status: "passed" },
    { id: 5, title: "History - World War II", date: "Jan 5, 2026", score: 68, total: 100, duration: "35 min", status: "passed" },
    { id: 6, title: "Physics - Mechanics", date: "Jan 4, 2026", score: 55, total: 100, duration: "40 min", status: "failed" },
  ];

  // Topic distribution data for pie chart
  const topicData = [
    { topic: "Law", percentage: 30, color: "#581c87", count: 12 },
    { topic: "Science", percentage: 25, color: "#ea580c", count: 10 },
    { topic: "Mathematics", percentage: 20, color: "#16a34a", count: 8 },
    { topic: "History", percentage: 15, color: "#2563eb", count: 6 },
    { topic: "Others", percentage: 10, color: "#64748b", count: 4 },
  ];

  // Stats summary
  const stats = {
    totalTests: 40,
    avgScore: 74,
    passRate: 82,
    totalTime: "18h 45m",
    bestStreak: 12,
    currentStreak: 8,
  };

  // SVG Pie Chart component
  const PieChart = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;

    const getCoordinatesForPercent = (percent: number) => {
      const x = center + radius * Math.cos(2 * Math.PI * percent - Math.PI / 2);
      const y = center + radius * Math.sin(2 * Math.PI * percent - Math.PI / 2);
      return [x, y];
    };

    let cumulativePercent = 0;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {topicData.map((slice, index) => {
          const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
          cumulativePercent += slice.percentage / 100;
          const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
          const largeArcFlag = slice.percentage > 50 ? 1 : 0;

          const pathData = [
            `M ${center} ${center}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            "Z",
          ].join(" ");

          return <path key={index} d={pathData} fill={slice.color} className="transition-all hover:opacity-80" />;
        })}
        {/* Center circle for donut effect */}
        <circle cx={center} cy={center} r={50} fill="white" />
        <text x={center} y={center - 8} textAnchor="middle" className="text-2xl font-bold" fill="#171717">
          {stats.totalTests}
        </text>
        <text x={center} y={center + 12} textAnchor="middle" className="text-xs" fill="#737373">
          Total Tests
        </text>
      </svg>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#171717" }}>
          Test History & Analytics
        </h1>
        <p className="text-lg mt-2" style={{ color: "#737373" }}>
          Track your progress and analyze your performance
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#581c87" }}>
            {stats.totalTests}
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Total Tests
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#ea580c" }}>
            {stats.avgScore}%
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Avg Score
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#16a34a" }}>
            {stats.passRate}%
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Pass Rate
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#2563eb" }}>
            {stats.totalTime}
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Total Time
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#581c87" }}>
            🔥 {stats.currentStreak}
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Current Streak
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
            🏆 {stats.bestStreak}
          </div>
          <div className="text-sm" style={{ color: "#737373" }}>
            Best Streak
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Topics Practiced */}
        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#171717" }}>
            Topics Practiced
          </h2>
          <div className="flex flex-col items-center">
            <PieChart />
            {/* Legend */}
            <div className="mt-6 w-full space-y-2">
              {topicData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm" style={{ color: "#171717" }}>
                      {item.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: "#737373" }}>
                      {item.count} tests
                    </span>
                    <span className="text-sm font-semibold" style={{ color: item.color }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="lg:col-span-2 rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#171717" }}>
            Performance Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accuracy by Difficulty */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#f5f5f5" }}>
              <h3 className="font-medium mb-3" style={{ color: "#171717" }}>
                Accuracy by Difficulty
              </h3>
              <div className="space-y-3">
                {[
                  { level: "Easy", accuracy: 92, color: "#16a34a" },
                  { level: "Medium", accuracy: 78, color: "#ea580c" },
                  { level: "Hard", accuracy: 54, color: "#dc2626" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "#171717" }}>{item.level}</span>
                      <span style={{ color: item.color }}>{item.accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: "#e5e5e5" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.accuracy}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Analysis */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#f5f5f5" }}>
              <h3 className="font-medium mb-3" style={{ color: "#171717" }}>
                Time Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#737373" }}>
                    Avg. Time per Test
                  </span>
                  <span className="font-semibold" style={{ color: "#171717" }}>
                    28 min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#737373" }}>
                    Fastest Completion
                  </span>
                  <span className="font-semibold" style={{ color: "#16a34a" }}>
                    15 min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#737373" }}>
                    Slowest Completion
                  </span>
                  <span className="font-semibold" style={{ color: "#dc2626" }}>
                    45 min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "#737373" }}>
                    Avg. per Question
                  </span>
                  <span className="font-semibold" style={{ color: "#171717" }}>
                    1.4 min
                  </span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#dcfce7" }}>
              <h3 className="font-medium mb-3" style={{ color: "#16a34a" }}>
                💪 Strengths
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#171717" }}>
                <li>• Contract Law (92% accuracy)</li>
                <li>• Mathematics - Algebra (88%)</li>
                <li>• Quick completion time</li>
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: "#fef3c7" }}>
              <h3 className="font-medium mb-3" style={{ color: "#d97706" }}>
                📈 Areas to Improve
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: "#171717" }}>
                <li>• Physics - Mechanics (55%)</li>
                <li>• Biology - Cell Structure (62%)</li>
                <li>• Hard difficulty questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{ color: "#171717" }}>
            Recent Test Results
          </h2>
          <button className="text-sm font-medium" style={{ color: "#581c87" }}>
            View All →
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "#e5e5e5" }}>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Test Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Score
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: "#737373" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map((test) => (
                <tr key={test.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "#f5f5f5" }}>
                  <td className="py-4 px-4">
                    <span className="font-medium" style={{ color: "#171717" }}>
                      {test.title}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm" style={{ color: "#737373" }}>
                      {test.date}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: "#e5e5e5" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${test.score}%`,
                            backgroundColor: test.score >= 70 ? "#16a34a" : test.score >= 50 ? "#ea580c" : "#dc2626",
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: test.score >= 70 ? "#16a34a" : test.score >= 50 ? "#ea580c" : "#dc2626" }}
                      >
                        {test.score}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm" style={{ color: "#737373" }}>
                      {test.duration}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: test.status === "passed" ? "#dcfce7" : "#fee2e2",
                        color: test.status === "passed" ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {test.status === "passed" ? "Passed" : "Failed"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                      style={{ color: "#581c87", backgroundColor: "#faf5ff" }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryContent;
