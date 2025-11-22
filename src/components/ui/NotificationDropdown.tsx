import React from 'react';
import { Bell, Check, Info, AlertTriangle, Truck, X } from 'lucide-react';
import Button from './Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'NanoTech Chipset X1 is below min level (12 units).', time: '10 min ago', type: 'alert', read: false },
  { id: '2', title: 'Receipt Validated', message: 'Receipt #REC-2024-001 has been processed successfully.', time: '1 hour ago', type: 'success', read: false },
  { id: '3', title: 'New Login', message: 'New login detected from San Francisco, US.', time: '2 hours ago', type: 'warning', read: true },
  { id: '4', title: 'Shipment Dispatched', message: 'Order #DEL-2024-089 is on the way.', time: '5 hours ago', type: 'info', read: true },
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'success': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Truck className="w-4 h-4 text-ocean" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-[#131824] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-ocean" /> Notifications
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2 New</span>
          </h3>
          <button className="text-xs text-ocean hover:text-white transition-colors">Mark all read</button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {mockNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative group ${!notif.read ? 'bg-white/[0.02]' : ''}`}
            >
              <div className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'alert' ? 'bg-rose-500/10' : 
                  notif.type === 'success' ? 'bg-emerald-500/10' : 
                  notif.type === 'warning' ? 'bg-amber-500/10' : 'bg-ocean/10'
                }`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-slate-300'}`}>{notif.title}</span>
                    <span className="text-xs text-slate-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{notif.message}</p>
                </div>
                {!notif.read && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white/5 border-t border-white/10 text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs">View All Notifications</Button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;