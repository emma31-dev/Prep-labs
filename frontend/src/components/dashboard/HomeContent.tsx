import { useAtom } from "jotai";
import { userAtom } from "../../store/authAtoms";
import { useUserStats } from "../../hooks/useUserStats";

const HomeContent = () => {
  const [user] = useAtom(userAtom);
  const { stats, isLoading } = useUserStats();
  
  // Get first name for greeting
  const firstName = user?.fullName?.split(' ')[0] || 'User';
  
  // Use real test history data
  const recentActivity = stats?.testHistory?.slice(0, 3).map((test, index) => ({
    id: index + 1,
    title: test.title,
    time: formatTimeAgo(test.completedAt),
    questions: 20, // Default since we don't store question count in test results
    score: test.score,
    status: test.score >= 70 ? "exceeded" : test.score >= 60 ? "at-target" : "below",
    icon: getSubjectIcon(test.title),
    color: getScoreColor(test.score),
  })) || [];

  // Calculate subject mastery from test history
  const subjectMastery = calculateSubjectMastery(stats?.testHistory || []);

  // Helper functions
  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  function getSubjectIcon(title: string): string {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('math') || titleLower.includes('algebra') || titleLower.includes('calculus')) return "math";
    if (titleLower.includes('english') || titleLower.includes('literature') || titleLower.includes('writing')) return "book";
    if (titleLower.includes('science') || titleLower.includes('physics') || titleLower.includes('chemistry') || titleLower.includes('biology')) return "science";
    if (titleLower.includes('history') || titleLower.includes('geography')) return "history";
    return "book";
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return "#16a34a";
    if (score >= 80) return "#2563eb";
    if (score >= 70) return "#f59e0b";
    if (score >= 60) return "#ea580c";
    return "#dc2626";
  }

  function calculateSubjectMastery(testHistory: any[]): Array<{subject: string, progress: number, color: string}> {
    if (!testHistory || testHistory.length === 0) {
      return [
        { subject: "Mathematics", progress: 0, color: "#581c87" },
        { subject: "English", progress: 0, color: "#ea580c" },
        { subject: "Science", progress: 0, color: "#2563eb" },
        { subject: "History", progress: 0, color: "#16a34a" },
      ];
    }

    const subjectScores: Record<string, number[]> = {};
    
    testHistory.forEach(test => {
      const title = test.title.toLowerCase();
      let subject = "Other";
      
      if (title.includes('math') || title.includes('algebra') || title.includes('calculus')) {
        subject = "Mathematics";
      } else if (title.includes('english') || title.includes('literature') || title.includes('writing')) {
        subject = "English";
      } else if (title.includes('science') || title.includes('physics') || title.includes('chemistry') || title.includes('biology')) {
        subject = "Science";
      } else if (title.includes('history') || title.includes('geography')) {
        subject = "History";
      }
      
      if (!subjectScores[subject]) {
        subjectScores[subject] = [];
      }
      subjectScores[subject].push(test.score);
    });

    const subjects = [
      { name: "Mathematics", color: "#581c87" },
      { name: "English", color: "#ea580c" },
      { name: "Science", color: "#2563eb" },
      { name: "History", color: "#16a34a" },
    ];

    return subjects.map(subject => ({
      subject: subject.name,
      progress: subjectScores[subject.name] 
        ? Math.round(subjectScores[subject.name].reduce((sum, score) => sum + score, 0) / subjectScores[subject.name].length)
        : 0,
      color: subject.color
    }));
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="rounded-2xl p-6 md:p-8 bg-gray-200 animate-pulse h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-40"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  // Circular Progress Component
  const CircularProgress = ({
    percentage,
    color,
    size = 128,
    label,
    sublabel,
  }: {
    percentage: number;
    color: string;
    size?: number;
    label: string;
    sublabel: string;
  }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#e5e5e5"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: "#171717" }}>
              {percentage}%
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs font-medium" style={{ color: "#737373" }}>
          {label} • <span style={{ color }}>{sublabel}</span>
        </p>
      </div>
    );
  };

  // Activity Icon Component
  const ActivityIcon = ({ type, color }: { type: string; color: string }) => {
    const icons: Record<string, React.ReactNode> = {
      math: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      book: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      science: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3h6v2H9zM12 8v5M7 21h10a2 2 0 0 0 1.67-3.1L14 12V8h-4v4l-4.67 5.9A2 2 0 0 0 7 21z" />
        </svg>
      ),
    };
    return (
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icons[type] || icons.book}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #581c87 0%, #7c3aed 100%)",
        }}
      >
        <div className="relative z-10 max-w-lg">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
          >
            AI TEST READY
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {firstName}!</h2>
          <p className="text-purple-100 mb-6">
            Your personalized study plan is ready. You've completed 12 mock tests this week. Keep it up!
          </p>
          <button
            className="px-6 py-2.5 font-bold rounded-xl transition-all hover:shadow-lg"
            style={{ backgroundColor: "#ffffff", color: "#581c87" }}
          >
            Go to Latest Test
          </button>
        </div>

        {/* Homepage Illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-48 md:w-64 lg:w-80 hidden sm:flex items-end">
          <img 
            src="/homepageillustration.png" 
            alt="Welcome illustration" 
            className="w-full h-full object-contain object-bottom"
          />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Goal */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h3 className="text-sm font-semibold mb-4 self-start" style={{ color: "#737373" }}>
            Today's Goal
          </h3>
          <CircularProgress percentage={85} color="#ea580c" label="Today's goal" sublabel="Progress" />
        </div>

        {/* Overall Score */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h3 className="text-sm font-semibold mb-4 self-start" style={{ color: "#737373" }}>
            Your score looks good!
          </h3>
          <CircularProgress percentage={72} color="#581c87" label="Overall Score" sublabel="Above Average" />
        </div>

        {/* Subject Mastery */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h3 className="text-sm font-semibold mb-6" style={{ color: "#737373" }}>
            Subject Mastery
          </h3>
          <div className="space-y-4">
            {subjectMastery.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium" style={{ color: "#171717" }}>
                    {item.subject}
                  </span>
                  <span style={{ color: "#737373" }}>{item.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#e5e5e5" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Start Mock Test", icon: "🚀", color: "#ea580c", bg: "#fff7ed" },
          { label: "Create Quiz", icon: "✨", color: "#581c87", bg: "#faf5ff" },
          { label: "View Resources", icon: "📚", color: "#2563eb", bg: "#eff6ff" },
          { label: "Check Analytics", icon: "📊", color: "#16a34a", bg: "#f0fdf4" },
        ].map((action, index) => (
          <button
            key={index}
            className="p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
            style={{ backgroundColor: action.bg }}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-semibold" style={{ color: action.color }}>
              {action.label}
            </span>
          </button>
        ))}
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: "#171717" }}>
            Recent Activity
          </h3>
          <button className="text-sm font-semibold" style={{ color: "#ea580c" }}>
            View all
          </button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md group border"
              style={{ backgroundColor: "#ffffff", borderColor: "#f5f5f5" }}
            >
              <div className="flex items-center gap-4">
                <ActivityIcon type={activity.icon} color={activity.color} />
                <div>
                  <h4 className="font-bold text-sm" style={{ color: "#171717" }}>
                    {activity.title}
                  </h4>
                  <p className="text-xs" style={{ color: "#737373" }}>
                    Generated {activity.time} • {activity.questions} Questions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold" style={{ color: "#171717" }}>
                    {activity.score}% Score
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        activity.status === "exceeded"
                          ? "#16a34a"
                          : activity.status === "at-target"
                            ? "#ea580c"
                            : "#dc2626",
                    }}
                  >
                    {activity.status === "exceeded"
                      ? "Exceeded target"
                      : activity.status === "at-target"
                        ? "At target"
                        : "Below target"}
                  </p>
                </div>
                <button className="opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: "#737373" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                    <circle cx="5" cy="12" r="2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming & Streak */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Up Next */}
        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#737373" }}>
            Up Next Today
          </h3>
          <div className="p-5 rounded-2xl shadow-sm" style={{ backgroundColor: "#ffffff", border: "1px solid #f5f5f5" }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: "#171717" }}>
              Modern JavaScript Bootcamp
            </h4>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "#737373" }}>
              The most up-to-date JS resource online! Master JavaScript by building a beautiful portfolio.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold mb-4" style={{ color: "#737373" }}>
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                4h 30'
              </div>
              <div className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21 5,3" />
                </svg>
                7 lectures
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 py-2 text-xs font-bold rounded-lg transition-colors"
                style={{ border: "1px solid #ea580c", color: "#ea580c" }}
              >
                Reschedule
              </button>
              <button
                className="flex-1 py-2 text-xs font-bold text-white rounded-lg shadow-md"
                style={{ backgroundColor: "#ea580c" }}
              >
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
          }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-orange-100">Your Streak</h3>
          <div className="text-center py-6">
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-white mb-1">
              {stats?.streakCount || 0} Days
            </div>
            <p className="text-orange-100 text-sm">
              {stats?.streakCount ? "Keep going! You're on fire!" : "Start your streak today!"}
            </p>
          </div>
          <div className="flex justify-between text-sm text-white mt-4 pt-4 border-t border-orange-400/30">
            <div>
              <div className="text-orange-100 text-xs">Best Streak</div>
              <div className="font-bold">{stats?.bestStreak || 0} Days</div>
            </div>
            <div>
              <div className="text-orange-100 text-xs">This Month</div>
              <div className="font-bold">{stats?.thisMonthAttendance || 0} Tests</div>
            </div>
            <div>
              <div className="text-orange-100 text-xs">Avg Score</div>
              <div className="font-bold">{stats?.averageScore || 0}%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
