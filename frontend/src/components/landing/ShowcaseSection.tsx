const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7,7 17,7 17,17"/>
  </svg>
);

const ShowcaseSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          {/* Left - Card */}
          <div className="lg:w-1/2">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(199, 210, 254, 0.3)', filter: 'blur(100px)' }}
              />
              <div 
                className="relative p-8 rounded-[2.5rem] shadow-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(199, 210, 254, 0.5)',
                }}
              >
                <div className="space-y-6">
                  <div 
                    className="p-5 rounded-2xl"
                    style={{ 
                      background: 'rgba(245, 243, 255, 0.4)',
                      border: '1px solid rgba(238, 242, 255, 0.5)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }}/>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6366F1' }}>
                        Advanced Module
                      </span>
                    </div>
                    <p className="font-semibold" style={{ color: '#2D1B69' }}>
                      Compare the algorithmic paradigms of Dynamic Programming and Greedy strategies.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-2xl opacity-60" style={{ background: 'rgba(245, 243, 255, 0.4)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B5CF6' }}/>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>
                        System Design
                      </span>
                    </div>
                    <p className="font-semibold" style={{ color: '#2D1B69' }}>
                      Design a scalable rate-limiting service using Redis.
                    </p>
                  </div>
                  
                  <div 
                    className="p-5 rounded-2xl"
                    style={{ 
                      background: 'linear-gradient(to bottom right, rgba(238, 242, 255, 0.5), rgba(243, 232, 255, 0.5))',
                      border: '1px solid rgba(199, 210, 254, 0.5)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#4F46E5' }}>
                        Elite AI Suggestion
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#6366F1">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <p className="text-sm" style={{ color: '#475569' }}>
                      Synthesizing multi-modal assessment items based on current curriculum trends...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight" style={{ color: '#2D1B69' }}>
              A Master View of Educational Excellence
            </h2>
            <p className="mb-8 text-lg leading-relaxed font-medium" style={{ color: '#64748b' }}>
              Strategic oversight of your entire evaluation ecosystem. Align faculty, students, 
              and curriculum with precision-driven data and elite CBT frameworks.
            </p>
            <ul className="space-y-5 mb-10">
              {[
                "Autonomous curriculum generation workflows",
                "Predictive analytics for student outcomes",
                "Zero-latency export to major LMS platforms"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div 
                    className="p-1 rounded-full transition-all"
                    style={{ 
                      background: 'rgba(245, 243, 255, 0.4)',
                      border: '1px solid rgba(224, 231, 255, 0.6)',
                      color: '#4F46E5',
                    }}
                  >
                    <CheckIcon />
                  </div>
                  <span className="font-semibold" style={{ color: '#475569' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-6">
              <button 
                className="px-8 py-3 rounded-full font-bold text-white"
                style={{ backgroundColor: '#F97316', boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)' }}
              >
                Try Elite Demo
              </button>
              <a 
                href="#" 
                className="font-bold flex items-center gap-2 transition-colors"
                style={{ color: '#4338ca' }}
              >
                Contact Sales <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;