const BackgroundBlobs = () => {
  return (
    <>
      {/* Purple blob - top right */}
      <div 
        className="fixed w-[600px] h-[600px] top-[-150px] right-[-100px] rounded-full pointer-events-none"
        style={{ 
          background: '#8B5CF6', 
          filter: 'blur(80px)', 
          zIndex: 0,
          opacity: 0.2,
        }}
      />
      {/* Indigo blob - bottom left */}
      <div 
        className="fixed w-[500px] h-[500px] bottom-[-150px] left-[-100px] rounded-full pointer-events-none"
        style={{ 
          background: '#6366F1', 
          filter: 'blur(80px)', 
          zIndex: 0,
          opacity: 0.15,
        }}
      />
    </>
  );
};

export default BackgroundBlobs;