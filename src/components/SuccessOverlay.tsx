
import React, { useEffect, useState } from 'react';
import { Check, Package, ArrowRight, Truck } from 'lucide-react';
import Button from './ui/Button';

interface SuccessOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
  reference: string;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ isOpen, onClose, type, reference }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case 'Receipt': return { icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500', text: 'Stock Received Successfully' };
      case 'Delivery': return { icon: Truck, color: 'text-ocean', bg: 'bg-ocean', text: 'Delivery Processed' };
      case 'Transfer': return { icon: ArrowRight, color: 'text-amber-400', bg: 'bg-amber-500', text: 'Transfer Initiated' };
      default: return { icon: Check, color: 'text-teal', bg: 'bg-teal', text: 'Adjustment Recorded' };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep/95 backdrop-blur-xl animate-fade-in">
      {/* Confetti / Particles Background (Simulated with CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-2 h-2 rounded-full ${['bg-ocean', 'bg-teal', 'bg-amber-400', 'bg-rose-400'][i % 4]} opacity-0 animate-ping`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>

      <div className={`relative max-w-md w-full text-center transition-all duration-700 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* 3D Icon Container */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className={`absolute inset-0 ${config.bg} rounded-3xl opacity-20 blur-2xl animate-pulse`} />
          <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
             <config.icon className={`w-16 h-16 ${config.color}`} />
             
             {/* Floating Badge */}
             <div className="absolute -bottom-4 -right-4 bg-surface border border-white/10 p-3 rounded-full shadow-xl">
               <Check className="w-6 h-6 text-emerald-500" />
             </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
          {config.text}
        </h2>
        <p className="text-slate-400 mb-8">
          Operation <span className="text-white font-mono">{reference}</span> has been validated and processed. Inventory has been updated.
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={onClose} icon={<ArrowRight className="w-4 h-4" />}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;
