import { Link, useLocation } from "react-router-dom";

interface LandingHeaderProps {
  onLogin?: () => void;
  onGetStarted?: () => void;
}

const LandingHeader = ({ onLogin }: LandingHeaderProps) => {
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If we're on the landing page, scroll to section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to landing page then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header 
      className="fixed top-0 w-full z-50 border-b"
      style={{ 
        background: 'rgba(245, 243, 255, 0.4)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(224, 231, 255, 0.6)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Prep Labs Logo" 
            className="h-12 w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold" style={{ color: 'rgba(49, 46, 129, 0.7)' }}>
          <button 
            onClick={() => scrollToSection('features')}
            className="hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            Product
          </button>
          <button 
            onClick={() => scrollToSection('solutions')}
            className="hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            Solutions
          </button>
          <Link 
            to="/pricing"
            className="hover:text-indigo-600 transition-colors"
            style={{ color: location.pathname === '/pricing' ? '#4F46E5' : undefined }}
          >
            Pricing
          </Link>
          <button 
            onClick={() => scrollToSection('resources')}
            className="hover:text-indigo-600 transition-colors cursor-pointer bg-transparent border-none"
          >
            Resources
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden sm:block text-sm font-semibold transition-colors hover:text-indigo-600 bg-transparent border-none cursor-pointer"
            style={{ color: 'rgba(49, 46, 129, 0.6)' }}
          >
            Log in
          </button>
          <Link 
            to="/auth?mode=signup"
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all no-underline"
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
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;