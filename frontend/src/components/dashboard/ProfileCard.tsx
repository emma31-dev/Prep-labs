interface ProfileCardProps {
  name: string;
  className?: string;
  studentId: string;
  avatar?: string;
}

const ProfileCard = ({ 
  name = "Eleanor Pena",
  className = "Class VI",
  studentId = "F-6522",
  avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
}: ProfileCardProps) => {
  return (
    <div 
      className="rounded-2xl p-6 flex items-center gap-6"
      style={{ 
        background: 'linear-gradient(135deg, #581c87 0%, #7c3aed 100%)',
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-28 h-28 rounded-full object-cover border-4"
          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
        />
      </div>

      {/* Info */}
      <div className="text-white">
        <h1 className="text-3xl font-semibold mb-1">{name}</h1>
        <p className="text-white/80 text-lg">
          {className} <span className="mx-2">|</span> Student ID: {studentId}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;