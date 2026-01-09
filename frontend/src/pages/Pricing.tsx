import { LandingHeader, LandingFooter, BackgroundBlobs } from "../components/landing";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for individual educators getting started with AI assessments.",
    features: [
      "50 AI-generated questions/month",
      "Basic question types",
      "Export to PDF",
      "Email support",
      "1 user account",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Professional",
    price: "$29",
    period: "per month",
    description: "For educators and small teams who need more power and flexibility.",
    features: [
      "500 AI-generated questions/month",
      "All question types",
      "Export to PDF, Word, LMS",
      "Priority support",
      "5 user accounts",
      "Question bank storage",
      "Analytics dashboard",
    ],
    highlighted: true,
    buttonText: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For institutions requiring unlimited scale and custom solutions.",
    features: [
      "Unlimited AI generations",
      "Custom AI model training",
      "API access",
      "Dedicated support",
      "Unlimited users",
      "SSO integration",
      "Custom branding",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
  },
];

const Pricing = () => {

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <BackgroundBlobs />
      
      <div className="relative z-10">
        <LandingHeader />
        
        {/* Pricing Header */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              Simple, Transparent Pricing
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: '#2D1B69' }}>
              Choose Your{' '}
              <span style={{ 
                background: 'linear-gradient(to right, #2D1B69, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Perfect Plan
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: '#64748b' }}>
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-3xl transition-all ${tier.highlighted ? 'scale-105' : ''}`}
                  style={{ 
                    background: tier.highlighted 
                      ? 'linear-gradient(135deg, #2D1B69 0%, #4F46E5 100%)'
                      : 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: tier.highlighted 
                      ? 'none' 
                      : '1px solid rgba(199, 210, 254, 0.5)',
                    boxShadow: tier.highlighted 
                      ? '0 25px 50px -12px rgba(45, 27, 105, 0.25)'
                      : '0 10px 30px -5px rgba(45, 27, 105, 0.05)',
                  }}
                >
                  {tier.highlighted && (
                    <div 
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#F97316', color: 'white' }}
                    >
                      Most Popular
                    </div>
                  )}
                  
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: tier.highlighted ? 'white' : '#2D1B69' }}
                  >
                    {tier.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span 
                      className="text-4xl font-extrabold"
                      style={{ color: tier.highlighted ? 'white' : '#2D1B69' }}
                    >
                      {tier.price}
                    </span>
                    <span 
                      className="text-sm ml-2"
                      style={{ color: tier.highlighted ? 'rgba(255,255,255,0.7)' : '#64748b' }}
                    >
                      {tier.period}
                    </span>
                  </div>
                  
                  <p 
                    className="text-sm mb-6"
                    style={{ color: tier.highlighted ? 'rgba(255,255,255,0.8)' : '#64748b' }}
                  >
                    {tier.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div 
                          className="p-0.5 rounded-full"
                          style={{ 
                            backgroundColor: tier.highlighted ? 'rgba(255,255,255,0.2)' : 'rgba(79, 70, 229, 0.1)',
                            color: tier.highlighted ? 'white' : '#4F46E5',
                          }}
                        >
                          <CheckIcon />
                        </div>
                        <span 
                          className="text-sm"
                          style={{ color: tier.highlighted ? 'rgba(255,255,255,0.9)' : '#475569' }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className="w-full py-3 rounded-full font-bold transition-all"
                    style={{ 
                      backgroundColor: tier.highlighted ? '#F97316' : 'transparent',
                      color: tier.highlighted ? 'white' : '#2D1B69',
                      border: tier.highlighted ? 'none' : '2px solid rgba(45, 27, 105, 0.2)',
                      boxShadow: tier.highlighted ? '0 4px 14px 0 rgba(249, 115, 22, 0.3)' : 'none',
                    }}
                  >
                    {tier.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: '#2D1B69' }}>
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
                { q: "Is there a free trial?", a: "Yes! The Professional plan comes with a 14-day free trial. No credit card required." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans." },
                { q: "Can I cancel my subscription?", a: "Absolutely. You can cancel anytime with no questions asked. Your access continues until the end of your billing period." },
              ].map((faq, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(199, 210, 254, 0.5)',
                  }}
                >
                  <h4 className="font-bold mb-2" style={{ color: '#2D1B69' }}>{faq.q}</h4>
                  <p className="text-sm" style={{ color: '#64748b' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LandingFooter />
      </div>
    </div>
  );
};

export default Pricing;