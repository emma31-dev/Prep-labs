interface DetailItem {
  label: string;
  value: string;
  subValue?: string;
}

interface BasicDetailsProps {
  details?: DetailItem[];
}

const defaultDetails: DetailItem[] = [
  { label: "Gender", value: "Female" },
  { label: "Date of Birth", value: "02-05-2001" },
  { label: "Religion", value: "Christian" },
  { label: "Blood Group", value: "B+" },
  { label: "Address", value: "TA-107 Newyork" },
  { label: "Father", value: "John Pena", subValue: "+1603-965-4668" },
  { label: "Mother", value: "Sarah Pena", subValue: "+123 99885567" },
];

const BasicDetails = ({ details = defaultDetails }: BasicDetailsProps) => {
  return (
    <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <h2 className="text-2xl font-semibold mb-6" style={{ color: '#171717' }}>
        Basic Details
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {details.map((detail, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm" style={{ color: '#737373' }}>{detail.label}</p>
            <p className="font-semibold text-lg" style={{ color: '#171717' }}>{detail.value}</p>
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