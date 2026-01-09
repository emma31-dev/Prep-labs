interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PsychologyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

const GridIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const SpeedIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const features: Feature[] = [
  {
    icon: <PsychologyIcon />,
    title: "Smart AI Analysis",
    description: "Elite-level context understanding using proprietary models to extract nuanced learning objectives and cognitive patterns.",
  },
  {
    icon: <GridIcon />,
    title: "Elite Asset Management",
    description: "Scale your question banks with automated metadata tagging, version control, and multi-tier difficulty categorization.",
  },
  {
    icon: <SpeedIcon />,
    title: "Instant Feedback",
    description: "Hyper-fast evaluation loops with detailed AI-generated rationales that transform grading into a learning moment.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl relative overflow-hidden transition-all duration-400"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(199, 210, 254, 0.5)',
                boxShadow: '0 10px 30px -5px rgba(45, 27, 105, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.border = '1px solid rgba(139, 92, 246, 0.4)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.border = '1px solid rgba(199, 210, 254, 0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div 
                className="absolute -right-8 -top-8 w-24 h-24 blur-2xl transition-colors"
                style={{ backgroundColor: 'rgba(199, 210, 254, 0.3)' }}
              />
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ 
                  background: 'rgba(245, 243, 255, 0.4)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(224, 231, 255, 0.6)',
                  color: '#4F46E5',
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2D1B69' }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: '#64748b' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;