import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div 
      className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${hoverEffect ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
    >
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      {children}
    </div>
  );
};

export default GlassCard;