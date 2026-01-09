const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Blobs */}
      <div 
        className="absolute w-[800px] h-[800px] top-[-200px] right-[-150px] rounded-full opacity-30"
        style={{ background: '#8B5CF6', filter: 'blur(100px)', zIndex: -1 }}
      />
      <div 
        className="absolute w-[600px] h-[600px] top-[15%] left-[-200px] rounded-full opacity-30"
        style={{ background: '#6366F1', filter: 'blur(100px)', zIndex: -1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8"
          style={{ 
            background: 'rgba(245, 243, 255, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(224, 231, 255, 0.6)',
            color: '#4F46E5',
          }}
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          AI-Powered Elite Assessment Engine
        </div>

        {/* Heading */}
        <h1 
          className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight max-w-4xl mx-auto leading-tight"
          style={{ color: '#2D1B69' }}
        >
          Instant AI{' '}
          <span 
            style={{ 
              background: 'linear-gradient(to right, #2D1B69, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Test Generation
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          style={{ color: '#64748b' }}
        >
          Elevate your academic workflow. Transform complex study materials into professional elite-level assessments in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 group text-white transition-all"
            style={{ 
              backgroundColor: '#F97316',
              boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EA580C';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F97316';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Start Generating 
            <span className="group-hover:translate-x-1 transition-transform">
              <ArrowIcon />
            </span>
          </button>
          <button 
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg transition-all"
            style={{ 
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(199, 210, 254, 0.5)',
              color: '#2D1B69',
            }}
          >
            Watch Demo
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto max-w-5xl">
          {/* Floating Card - Right */}
          <div 
            className="absolute -top-10 -right-6 p-4 rounded-xl shadow-xl hidden lg:flex items-center gap-3 z-20"
            style={{ 
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(199, 210, 254, 0.5)',
            }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase" style={{ color: '#64748b' }}>Status</p>
              <p className="text-sm font-bold" style={{ color: '#2D1B69' }}>120 CBT Questions</p>
            </div>
          </div>

          {/* Main Preview Container */}
          <div 
            className="rounded-2xl p-2 md:p-4 shadow-xl relative overflow-hidden"
            style={{ 
              background: 'rgba(245, 243, 255, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(224, 231, 255, 0.6)',
            }}
          >
            {/* Browser Dots */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#818cf8' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#a5b4fc' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#c7d2fe' }} />
              </div>
              <div 
                className="mx-auto px-4 py-1 rounded-md text-[10px] font-mono"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  color: '#a5b4fc',
                }}
              >
                app.preplabs.ai/elite-dashboard
              </div>
            </div>
            
            {/* Placeholder for dashboard image */}
            <div 
              className="rounded-lg h-64 md:h-96 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(199, 210, 254, 0.3)' }}
            >
              <span style={{ color: '#6366F1' }} className="font-medium">Dashboard Preview</span>
            </div>
          </div>

          {/* Floating Card - Left */}
          <div 
            className="absolute -bottom-10 -left-10 p-6 rounded-2xl shadow-xl max-w-xs hidden md:block z-20"
            style={{ 
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(199, 210, 254, 0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold" style={{ color: '#2D1B69' }}>Generation Progress</span>
              <span className="text-sm font-bold" style={{ color: '#4F46E5' }}>84%</span>
            </div>
            <div className="w-full rounded-full h-2 mb-2" style={{ backgroundColor: 'rgba(238, 242, 255, 1)' }}>
              <div 
                className="h-2 rounded-full w-[84%]"
                style={{ background: 'linear-gradient(to right, #2D1B69, #6366F1)' }}
              />
            </div>
            <p className="text-xs" style={{ color: '#64748b' }}>Processing analytical depth...</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;