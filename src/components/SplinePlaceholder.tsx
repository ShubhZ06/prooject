import React from 'react';

const SplinePlaceholder: React.FC<{ type: 'cube' | 'warehouse' | 'hero' }> = ({ type }) => {
  // Simulating 3D visuals with CSS and standard elements since we can't guarantee external 3D assets load instantly
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br from-ocean/20 to-teal/20 blur-3xl rounded-full animate-pulse`} />
      
      {type === 'hero' && (
        <div className="relative w-64 h-64 md:w-96 md:h-96">
           {/* Abstract shape representing 3D */}
           <div className="absolute inset-0 border border-ocean/30 rounded-[2rem] transform rotate-12 bg-white/5 backdrop-blur-sm animate-[spin_10s_linear_infinite]" />
           <div className="absolute inset-4 border border-teal/30 rounded-[2rem] transform -rotate-12 bg-white/5 backdrop-blur-sm animate-[spin_15s_linear_infinite_reverse]" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 bg-gradient-to-br from-ocean to-teal rounded-xl shadow-[0_0_50px_rgba(14,165,233,0.5)] transform rotate-45" />
           </div>
        </div>
      )}
      
      {type === 'cube' && (
         <div className="w-12 h-12 bg-gradient-to-tr from-ocean to-teal rounded-lg shadow-lg transform rotate-45 border border-white/20" />
      )}
    </div>
  );
};

export default SplinePlaceholder;