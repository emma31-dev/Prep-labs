const BackgroundBlobs = () => {
  return (
    <>
      {/* Purple blob - top right */}
      <div 
        className="fixed w-[800px] h-[800px] top-[-200px] right-[-150px] rounded-full pointer-events-none"
        style={{ 
          background: '#8B5CF6', 
          filter: 'blur(100px)', 
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      {/* Indigo blob - top left */}
      <div 
        className="fixed w-[600px] h-[600px] top-[15%] left-[-200px] rounded-full pointer-events-none"
        style={{ 
          background: '#6366F1', 
          filter: 'blur(100px)', 
          zIndex: 0,
          opacity: 0.3,
        }}
      />
      {/* Purple blob - bottom right */}
      <div 
        className="fixed w-[700px] h-[700px] bottom-[-200px] right-[10%] rounded-full pointer-events-none"
        style={{ 
          background: '#8B5CF6', 
          filter: 'blur(100px)', 
          zIndex: 0,
          opacity: 0.2,
        }}
      />
      {/* Orange blob - middle right */}
      <div 
        className="fixed w-[400px] h-[400px] top-[40%] right-[15%] rounded-full pointer-events-none"
        style={{ 
          background: '#FDBA74', 
          filter: 'blur(100px)', 
          zIndex: 0,
          opacity: 0.15,
        }}
      />
    </>
  );
};

export default BackgroundBlobs;