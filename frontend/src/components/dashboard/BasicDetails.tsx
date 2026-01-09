interface DetailItem {
  label: string;
  value: string;
  subValue?: string;
  badge?: boolean; // For subscription status
}

interface BasicDetailsProps {
  details?: DetailItem[];
}

const defaultDetails: DetailItem[] = [
  { label: "Gender", value: "Female" },
  { label: "Age", value: "23 years" },
  { label: "Subscription", value: "Pro", badge: true },
  { label: "Joined", value: "March 15, 2024" },
];

const BasicDetails = ({ details = defaultDetails }: BasicDetailsProps) => {
  const getSubscriptionColor = (subscription: string) => {
    switch (subscription.toLowerCase()) {
      case 'free':
        return { bg: '#f3f4f6', text: '#6b7280' }; // Gray
      case 'pro':
        return { bg: '#ddd6fe', text: '#7c3aed' }; // Purple
      case 'premium':
        return { bg: '#fed7aa', text: '#ea580c' }; // Orange
      default:
        return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <h2 className="text-2xl font-semibold mb-6" style={{ color: '#171717' }}>
        Basic Details
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {details.map((detail, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm" style={{ color: '#737373' }}>{detail.label}</p>
            {detail.badge && detail.label === "Subscription" ? (
              <div className="inline-flex">
                <span 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: getSubscriptionColor(detail.value).bg,
                    color: getSubscriptionColor(detail.value).text,
                  }}
                >
                  {detail.value}
                </span>
              </div>
            ) : (
              <p className="font-semibold text-lg" style={{ color: '#171717' }}>{detail.value}</p>
            )}
            {detail.subValue && (
              <p className="text-sm" style={{ color: '#171717' }}>{detail.subValue}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicDetails;