const LogoStrip = () => {
  return (
    <div 
      className="py-12 relative z-10"
      style={{ 
        background: 'rgba(245, 243, 255, 0.4)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(224, 231, 255, 0.3)',
        borderBottom: '1px solid rgba(224, 231, 255, 0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40">
        <span className="text-2xl font-black italic tracking-tighter" style={{ color: '#2D1B69' }}>
          FORBES
        </span>
        <span className="text-2xl font-serif font-bold italic" style={{ color: '#2D1B69' }}>
          FORTUNE
        </span>
        <span className="text-3xl font-bold flex items-center" style={{ color: '#2D1B69' }}>
          TC
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#4F46E5" className="ml-1">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </span>
        <span className="text-xl font-bold tracking-widest uppercase" style={{ color: '#2D1B69' }}>
          FastCompany
        </span>
        <span className="text-2xl font-black" style={{ color: '#2D1B69' }}>
          Inc.
        </span>
      </div>
    </div>
  );
};

export default LogoStrip;