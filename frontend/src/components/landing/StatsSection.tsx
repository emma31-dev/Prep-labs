const StatsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Left - Chart Card */}
          <div className="lg:w-1/2">
            <div 
              className="p-10 rounded-[2.5rem] shadow-2xl relative"
              style={{ 
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(238, 242, 255, 0.5)',
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-2xl font-bold" style={{ color: '#2D1B69' }}>Elite Performance</h4>
                  <p className="text-sm" style={{ color: 'rgba(49, 46, 129, 0.4)' }}>Quarterly Assessment Matrix</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(245, 243, 255, 0.4)', border: '1px solid rgba(224, 231, 255, 0.6)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </button>
                  <button 
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(245, 243, 255, 0.4)', border: '1px solid rgba(224, 231, 255, 0.6)' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2D1B69" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-4 mb-10">
                {[40, 65, 50, 85, 95, 60].map((height, i) => (
                  <div 
                    key={i}
                    className="w-full rounded-t-xl transition-all hover:opacity-80"
                    style={{ 
                      height: `${height}%`,
                      background: i === 4 
                        ? 'linear-gradient(to top, #2D1B69, #6366F1)' 
                        : `rgba(${i % 2 === 0 ? '199, 210, 254' : '221, 214, 254'}, 0.5)`,
                    }}
                  />
                ))}
              </div>
              
              {/* Stats */}
              <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'rgba(238, 242, 255, 0.5)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#64748b' }}>Generation Throughput</span>
                  <span className="font-bold" style={{ color: '#2D1B69' }}>24,500+ Items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#64748b' }}>AI Accuracy Index</span>
                  <span className="font-bold" style={{ color: '#4F46E5' }}>99.98%</span>
                </div>
              </div>
              
              {/* Floating User Card */}
              <div 
                className="absolute -top-6 -left-6 p-4 rounded-xl shadow-xl flex items-center gap-3"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(238, 242, 255, 0.5)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#6366F1' }}
                >
                  SC
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: '#2D1B69' }}>Dr. Sarah Chen</p>
                  <p className="text-[10px] font-bold" style={{ color: '#4F46E5' }}>Chief Academics Officer</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right - Content */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight" style={{ color: '#2D1B69' }}>
              Global Command & Control
            </h2>
            <p className="mb-8 text-lg leading-relaxed font-medium" style={{ color: '#64748b' }}>
              Seamlessly navigate through massive question repositories. Orchestrate your assessment 
              strategy with elite tools designed for the modern educator.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div 
                className="p-4 rounded-2xl"
                style={{ 
                  background: 'rgba(245, 243, 255, 0.4)',
                  border: '1px solid rgba(238, 242, 255, 0.5)',
                }}
              >
                <p className="font-bold text-2xl mb-1" style={{ color: '#4F46E5' }}>90%</p>
                <p className="text-xs font-semibold uppercase" style={{ color: 'rgba(49, 46, 129, 0.5)' }}>
                  Reduction in Drafting Time
                </p>
              </div>
              <div 
                className="p-4 rounded-2xl"
                style={{ 
                  background: 'rgba(245, 243, 255, 0.4)',
                  border: '1px solid rgba(238, 242, 255, 0.5)',
                }}
              >
                <p className="font-bold text-2xl mb-1" style={{ color: '#4F46E5' }}>150+</p>
                <p className="text-xs font-semibold uppercase" style={{ color: 'rgba(49, 46, 129, 0.5)' }}>
                  Supported File Types
                </p>
              </div>
            </div>
            <button 
              className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-lg text-white"
              style={{ backgroundColor: '#F97316', boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.3)' }}
            >
              Start Generating Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;