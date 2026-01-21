import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../store/authAtoms";
import { useUserStats } from "../../hooks/useUserStats";
import TestHistory from "./TestHistory";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "progress", label: "Test History" },
  { id: "attendance", label: "Attendance" },
  { id: "subscription", label: "Subscription" },
];

// Subscription History Component
const SubscriptionHistory = () => {
  const [user] = useAtom(userAtom);
  
  const getPlanDetails = (planType: string | undefined) => {
    switch (planType?.toLowerCase()) {
      case 'premium':
        return { name: 'Premium', price: '$19.99', cycle: 'Monthly', color: '#ea580c' };
      case 'pro':
        return { name: 'Pro', price: '$9.99', cycle: 'Monthly', color: '#7c3aed' };
      default:
        return { name: 'Free', price: '$0.00', cycle: 'Forever', color: '#6b7280' };
    }
  };

  const currentPlan = getPlanDetails(user?.planType);
  const isFreePlan = user?.planType === 'free' || !user?.planType;

  // Mock subscription history - in real app, fetch from backend
  const subscriptions = isFreePlan ? [] : [
    {
      id: 1,
      plan: currentPlan.name,
      status: "active",
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      price: currentPlan.price,
      billingCycle: currentPlan.cycle,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Current Plan Summary */}
      <div 
        className="p-4 rounded-xl border-2" 
        style={{ 
          borderColor: isFreePlan ? '#e5e5e5' : '#581c87', 
          backgroundColor: isFreePlan ? '#f9fafb' : '#faf5ff' 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: '#171717' }}>
                Current Plan: {currentPlan.name}
              </h3>
              <span 
                className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: currentPlan.color }}
              >
                {isFreePlan ? 'Free' : 'Active'}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: '#737373' }}>
              {isFreePlan 
                ? 'Upgrade to unlock more features' 
                : `Renews on ${subscriptions[0]?.endDate}`
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: currentPlan.color }}>
              {currentPlan.price}
            </div>
            <div className="text-sm" style={{ color: '#737373' }}>
              {isFreePlan ? 'forever' : 'per month'}
            </div>
          </div>
        </div>

        {isFreePlan && (
          <button
            className="mt-4 w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#581c87' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b21a8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#581c87'}
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Plan Features */}
      <div className="p-4 rounded-xl border" style={{ borderColor: '#e5e5e5' }}>
        <h4 className="font-medium mb-3" style={{ color: '#171717' }}>
          {currentPlan.name} Plan Features
        </h4>
        <ul className="space-y-2">
          {isFreePlan ? (
            <>
              <FeatureItem text="Basic quiz access" included />
              <FeatureItem text="Progress tracking" included />
              <FeatureItem text="Community support" included />
              <FeatureItem text="Unlimited quiz attempts" included={false} />
              <FeatureItem text="Advanced analytics" included={false} />
              <FeatureItem text="AI-powered recommendations" included={false} />
            </>
          ) : user?.planType === 'pro' ? (
            <>
              <FeatureItem text="Everything in Free" included />
              <FeatureItem text="Unlimited quiz attempts" included />
              <FeatureItem text="Advanced analytics" included />
              <FeatureItem text="Priority support" included />
              <FeatureItem text="Custom study plans" included />
              <FeatureItem text="AI-powered recommendations" included={false} />
            </>
          ) : (
            <>
              <FeatureItem text="Everything in Pro" included />
              <FeatureItem text="AI-powered recommendations" included />
              <FeatureItem text="Personal coaching" included />
              <FeatureItem text="1-on-1 tutoring sessions" included />
              <FeatureItem text="Advanced reporting" included />
              <FeatureItem text="Team collaboration" included />
            </>
          )}
        </ul>
      </div>

      {/* Payment History */}
      {subscriptions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium" style={{ color: '#171717' }}>Payment History</h4>
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl border flex items-center justify-between"
              style={{ borderColor: '#e5e5e5' }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#faf5ff' }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#581c87"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#171717' }}>{sub.plan}</span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded-full"
                      style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
                    >
                      Active
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: '#737373' }}>
                    {sub.startDate} — {sub.endDate} · {sub.billingCycle}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold" style={{ color: '#171717' }}>{sub.price}</div>
                <div className="text-xs" style={{ color: '#737373' }}>Paid</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFreePlan && (
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: '#737373' }}>
            No payment history yet. Upgrade to a paid plan to see your billing history.
          </p>
        </div>
      )}
    </div>
  );
};

// Feature item component
const FeatureItem = ({ text, included }: { text: string; included: boolean }) => (
  <li className="flex items-center gap-2 text-sm">
    {included ? (
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#16a34a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#d1d5db' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    <span style={{ color: included ? '#171717' : '#9ca3af' }}>{text}</span>
  </li>
);

// Streak Calendar Component
interface StreakCalendarProps {
  testCompletedDays?: Date[];
}

const StreakCalendar = ({ testCompletedDays = [] }: StreakCalendarProps) => {
  const [user] = useAtom(userAtom);
  const { stats } = useUserStats();
  const [currentDate, setCurrentDate] = useState(new Date());

  const hasData = testCompletedDays.length > 0;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const isTestDay = (day: number) => {
    return testCompletedDays.some(
      (d) =>
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calculate current streak using real data
  const currentStreak = stats?.streakCount || 0;
  const bestStreak = stats?.bestStreak || 0;
  const testsThisMonth = stats?.thisMonthAttendance || 0;

  // Empty state
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: '#fff7ed' }}
        >
          <span className="text-4xl">🔥</span>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#171717' }}>
          No activity yet
        </h3>
        <p className="text-sm text-center max-w-xs" style={{ color: '#737373' }}>
          Start taking quizzes to build your streak! Your activity calendar will show all the days you've completed tests.
        </p>
        <button
          className="mt-6 px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#ea580c' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
        >
          Start Your Streak
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User greeting */}
      <div className="text-center mb-2">
        <p className="text-sm" style={{ color: '#737373' }}>
          Keep up the great work, {user?.fullName?.split(' ')[0] || 'there'}! 🎯
        </p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#faf5ff' }}>
          <div className="text-3xl font-bold" style={{ color: '#581c87' }}>
            🔥 {currentStreak}
          </div>
          <div className="text-sm mt-1" style={{ color: '#737373' }}>Current Streak</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#fff7ed' }}>
          <div className="text-3xl font-bold" style={{ color: '#ea580c' }}>
            {testsThisMonth}
          </div>
          <div className="text-sm mt-1" style={{ color: '#737373' }}>Tests This Month</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f0fdf4' }}>
          <div className="text-3xl font-bold" style={{ color: '#16a34a' }}>
            {bestStreak}
          </div>
          <div className="text-sm mt-1" style={{ color: '#737373' }}>Best Streak</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border p-4" style={{ borderColor: '#e5e5e5' }}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold" style={{ color: '#171717' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium py-2"
              style={{ color: '#737373' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasTest = isTestDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day}
                className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isTodayDate ? "ring-2 ring-purple-400" : ""
                }`}
                style={{
                  backgroundColor: hasTest ? '#581c87' : 'transparent',
                  color: hasTest ? '#ffffff' : isTodayDate ? '#581c87' : '#171717',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#581c87' }} />
          <span style={{ color: '#737373' }}>Quiz Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-purple-400" />
          <span style={{ color: '#737373' }}>Today</span>
        </div>
      </div>
    </div>
  );
};

const TabsSection = () => {
  const { stats } = useUserStats();
  const [activeTab, setActiveTab] = useState("progress");

  const renderTabContent = () => {
    // Use real data from user stats
    const testCompletedDays: Date[] = stats?.attendanceDays || [];

    switch (activeTab) {
      case "progress":
        return <TestHistory />;
      case "attendance":
        return <StreakCalendar testCompletedDays={testCompletedDays} />;
      case "subscription":
        return <SubscriptionHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      {/* Tab Headers */}
      <div className="flex border-b" style={{ borderColor: '#e5e5e5' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-6 py-4 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab.id ? '#581c87' : '#737373',
              backgroundColor: activeTab === tab.id ? '#faf5ff' : 'transparent',
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#581c87' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabsSection;
