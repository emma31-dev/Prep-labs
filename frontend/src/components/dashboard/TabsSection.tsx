import { useState } from "react";
import ProgressChart from "./ProgressChart";

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "progress", label: "Progress" },
  { id: "attendance", label: "Attendance" },
  { id: "subscription", label: "Subscription" },
];

// Subscription History Component
const SubscriptionHistory = () => {
  const subscriptions = [
    {
      id: 1,
      plan: "Pro",
      status: "active",
      startDate: "Jan 1, 2026",
      endDate: "Jan 1, 2027",
      price: "$99.00",
      billingCycle: "Yearly",
    },
    {
      id: 2,
      plan: "Pro",
      status: "expired",
      startDate: "Jan 1, 2025",
      endDate: "Jan 1, 2026",
      price: "$99.00",
      billingCycle: "Yearly",
    },
    {
      id: 3,
      plan: "Basic",
      status: "expired",
      startDate: "Jul 1, 2024",
      endDate: "Jan 1, 2025",
      price: "$29.00",
      billingCycle: "6 Months",
    },
    {
      id: 4,
      plan: "Free Trial",
      status: "expired",
      startDate: "Jun 1, 2024",
      endDate: "Jul 1, 2024",
      price: "$0.00",
      billingCycle: "1 Month",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Current Plan Summary */}
      <div className="p-4 rounded-xl border-2" style={{ borderColor: '#581c87', backgroundColor: '#faf5ff' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: '#171717' }}>Current Plan: Pro</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: '#16a34a', color: '#ffffff' }}>
                Active
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: '#737373' }}>
              Renews on Jan 1, 2027
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#581c87' }}>$99.00</div>
            <div className="text-sm" style={{ color: '#737373' }}>per year</div>
          </div>
        </div>
      </div>

      {/* Subscription History List */}
      <div className="space-y-3">
        <h4 className="font-medium" style={{ color: '#171717' }}>Payment History</h4>
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{ borderColor: '#e5e5e5' }}
          >
            <div className="flex items-center gap-4">
              {/* Plan Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: sub.status === 'active' ? '#faf5ff' : '#f5f5f5',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={sub.status === 'active' ? '#581c87' : '#737373'}
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              {/* Plan Details */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium" style={{ color: '#171717' }}>{sub.plan}</span>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: sub.status === 'active' ? '#dcfce7' : '#f5f5f5',
                      color: sub.status === 'active' ? '#16a34a' : '#737373',
                    }}
                  >
                    {sub.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </div>
                <div className="text-sm" style={{ color: '#737373' }}>
                  {sub.startDate} — {sub.endDate} · {sub.billingCycle}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="font-semibold" style={{ color: '#171717' }}>{sub.price}</div>
              <div className="text-xs" style={{ color: '#737373' }}>
                {sub.status === 'active' ? 'Paid' : 'Completed'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Streak Calendar Component
const StreakCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock data for test completion days (dates when user completed tests)
  const testCompletedDays = [
    new Date(2026, 0, 2),
    new Date(2026, 0, 3),
    new Date(2026, 0, 4),
    new Date(2026, 0, 5),
    new Date(2026, 0, 6),
    new Date(2026, 0, 7),
    new Date(2026, 0, 8),
    new Date(2026, 0, 9),
  ];

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

  // Calculate current streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    const sortedDays = [...testCompletedDays].sort((a, b) => b.getTime() - a.getTime());
    
    for (let i = 0; i < sortedDays.length; i++) {
      const dayDiff = Math.floor((today.getTime() - sortedDays[i].getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === streak || dayDiff === streak + 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  return (
    <div className="space-y-6">
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
            {testCompletedDays.length}
          </div>
          <div className="text-sm mt-1" style={{ color: '#737373' }}>Tests This Month</div>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ backgroundColor: '#f0fdf4' }}>
          <div className="text-3xl font-bold" style={{ color: '#16a34a' }}>
            12
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
          <span style={{ color: '#737373' }}>Test Completed</span>
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
  const [activeTab, setActiveTab] = useState("progress");

  const renderTabContent = () => {
    switch (activeTab) {
      case "progress":
        return <ProgressChart />;
      case "attendance":
        return <StreakCalendar />;
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