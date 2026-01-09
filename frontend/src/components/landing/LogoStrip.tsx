const TrendUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const BoltIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
  </svg>
);

const LogoStrip = () => {
  const metrics = [
    { value: "94%", label: "Pass Rate Improvement", icon: <TrendUpIcon /> },
    { value: "2.5x", label: "Faster Learning", icon: <BoltIcon /> },
    { value: "50K+", label: "Students Helped", icon: <UsersIcon /> },
    { value: "4.9/5", label: "Student Rating", icon: <StarIcon /> },
  ];

  return (
    <div
      className="py-12 relative z-10"
      style={{
        background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-medium mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
          Trusted by students worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
              >
                {metric.icon}
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-white">{metric.value}</div>
                <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoStrip;
