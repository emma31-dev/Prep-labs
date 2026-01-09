import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LandingHeader, 
  HeroSection, 
  FeaturesSection, 
  LogoStrip, 
  LandingFooter,
  BackgroundBlobs,
  ShowcaseSection,
  StatsSection,
} from "../components/landing";

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle hash navigation on page load
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden scroll-smooth" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Background Blobs */}
      <BackgroundBlobs />
      
      {/* Content */}
      <div className="relative z-10">
        <LandingHeader onLogin={handleLogin} />
        <HeroSection />
        <LogoStrip />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="solutions">
          <ShowcaseSection />
        </section>
        <section id="resources">
          <StatsSection />
        </section>
        <LandingFooter />
      </div>
    </div>
  );
};

export default Landing;