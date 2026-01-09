const LandingFooter = () => {
  const footerLinks = {
    product: [
      { label: "Elite Features", href: "#" },
      { label: "API Access", href: "#" },
      { label: "Models", href: "#" },
      { label: "Enterprise", href: "#" },
    ],
    company: [
      { label: "Our Story", href: "#" },
      { label: "Security", href: "#" },
      { label: "Research", href: "#" },
      { label: "Press", href: "#" },
    ],
    trust: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Governance", href: "#" },
    ],
  };

  return (
    <footer 
      className="pt-24 pb-12 relative overflow-hidden"
      style={{ 
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(224, 231, 255, 0.6)',
      }}
    >
      {/* Background Blobs */}
      <div 
        className="absolute w-96 h-96 bottom-[-100px] left-[-50px] rounded-full"
        style={{ background: '#8B5CF6', filter: 'blur(100px)', zIndex: -1, opacity: 0.1 }}
      />
      <div 
        className="absolute w-96 h-96 top-[-50px] right-[-50px] rounded-full"
        style={{ background: '#6366F1', filter: 'blur(100px)', zIndex: -1, opacity: 0.1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Prep Labs Logo" className="h-12 w-auto" />
            </div>
            <p className="max-w-sm mb-8 leading-relaxed text-sm" style={{ color: 'rgba(49, 46, 129, 0.6)' }}>
              Setting the global standard for AI-powered assessment generation. 
              Precision, scale, and elite performance for leading institutions.
            </p>
            <div className="flex gap-4">
              {['public', 'alternate_email', 'chat'].map((icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(199, 210, 254, 0.5)',
                    color: '#2D1B69',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {icon === 'public' && <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>}
                    {icon === 'alternate_email' && <><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></>}
                    {icon === 'chat' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: '#312e81' }}>
              Product
            </h5>
            <ul className="space-y-4 text-sm" style={{ color: 'rgba(49, 46, 129, 0.6)' }}>
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-600 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: '#312e81' }}>
              Company
            </h5>
            <ul className="space-y-4 text-sm" style={{ color: 'rgba(49, 46, 129, 0.6)' }}>
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-600 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Links */}
          <div>
            <h5 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: '#312e81' }}>
              Trust
            </h5>
            <ul className="space-y-4 text-sm" style={{ color: 'rgba(49, 46, 129, 0.6)' }}>
              {footerLinks.trust.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-600 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="pt-8 border-t text-center text-xs font-medium"
          style={{ borderColor: 'rgba(199, 210, 254, 0.5)', color: 'rgba(49, 46, 129, 0.4)' }}
        >
          © 2024 Prep Labs Elite AI. Engineered for Academic Excellence.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;