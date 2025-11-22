"use client";

import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Clock, 
  Camera, 
  Edit2, 
  LogOut,
  Smartphone,
  Globe
} from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'activity'>('overview');

  const activityLog = [
    { action: 'Created Product', detail: 'NanoTech Chipset X1', time: '2 hours ago', icon: 'Package' },
    { action: 'Validated Receipt', detail: '#REC-2024-001', time: '5 hours ago', icon: 'Check' },
    { action: 'Updated Stock', detail: 'Main Warehouse - Zone A', time: '1 day ago', icon: 'Edit' },
    { action: 'Login', detail: 'Chrome on MacOS', time: '1 day ago', icon: 'Globe' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 w-full rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-ocean to-teal opacity-20"></div>
          <div className="absolute inset-0 bg-[url('https://picsum.photos/1600/400')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute bottom-4 right-4">
            <Button variant="glass" size="sm" icon={<Camera className="w-3 h-3" />}>Change Cover</Button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="px-6 pb-0 relative -mt-16 flex flex-col md:flex-row items-end md:items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-[#0A0E1A] bg-slate-700 overflow-hidden shadow-2xl relative">
               <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <Camera className="w-6 h-6 text-white" />
               </div>
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-[#0A0E1A] rounded-full"></div>
          </div>

          <div className="flex-1 mb-2">
             <h1 className="text-3xl font-bold text-white">Alex Morgan</h1>
             <p className="text-slate-400">Senior Inventory Manager</p>
          </div>

          <div className="flex gap-3 mb-4 md:mb-0">
            <Button variant="outline">Edit Profile</Button>
            <Button variant="glass" className="text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 flex gap-6 px-2">
        {['Overview', 'Security', 'Activity'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase() as any)}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.toLowerCase() 
                ? 'border-ocean text-ocean' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              <GlassCard>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Personal Information</h3>
                  <Button variant="ghost" size="sm" icon={<Edit2 className="w-3 h-3" />}>Edit</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Name</label>
                    <div className="mt-1 flex items-center gap-3 text-slate-200">
                      <User className="w-4 h-4 text-ocean" /> Alex Morgan
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email Address</label>
                    <div className="mt-1 flex items-center gap-3 text-slate-200">
                      <Mail className="w-4 h-4 text-ocean" /> alex.morgan@stockmaster.io
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</label>
                    <div className="mt-1 flex items-center gap-3 text-slate-200">
                      <Phone className="w-4 h-4 text-ocean" /> +1 (555) 123-4567
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Location</label>
                    <div className="mt-1 flex items-center gap-3 text-slate-200">
                      <MapPin className="w-4 h-4 text-ocean" /> San Francisco, CA
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Role</label>
                    <div className="mt-1">
                      <Badge variant="info">Administrator</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Joined</label>
                    <div className="mt-1 flex items-center gap-3 text-slate-200">
                      <Clock className="w-4 h-4 text-ocean" /> Oct 24, 2022
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard>
                  <h3 className="text-lg font-bold text-white mb-4">Assigned Warehouses</h3>
                  <div className="space-y-3">
                    {['Main Warehouse (Zone A)', 'East Wing Depot'].map(wh => (
                      <div key={wh} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-sm text-slate-200">{wh}</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="text-lg font-bold text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Email Notifications</span>
                      <div className="w-10 h-5 bg-ocean rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Dark Mode</span>
                      <div className="w-10 h-5 bg-ocean rounded-full relative cursor-pointer opacity-50"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Two-Factor Auth</span>
                      <div className="w-10 h-5 bg-ocean rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </>
          )}

          {activeTab === 'security' && (
             <div className="space-y-6 animate-fade-in">
               <GlassCard>
                 <div className="flex items-start justify-between mb-6">
                   <div>
                     <h3 className="text-lg font-bold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Password & Security</h3>
                     <p className="text-sm text-slate-400 mt-1">Manage your login credentials and security settings.</p>
                   </div>
                   <Button variant="primary">Change Password</Button>
                 </div>
                 
                 <div className="border-t border-white/10 pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                         <div className="font-medium text-white">Two-Factor Authentication</div>
                         <div className="text-sm text-slate-400">Add an extra layer of security to your account.</div>
                       </div>
                       <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                 </div>
               </GlassCard>

               <GlassCard>
                 <h3 className="text-lg font-bold text-white mb-4">Active Sessions</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="w-10 h-10 rounded-full bg-ocean/20 flex items-center justify-center text-ocean">
                         <Globe className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                         <div className="font-medium text-white">Chrome on MacOS</div>
                         <div className="text-xs text-slate-500">San Francisco, US • Active Now</div>
                       </div>
                       <Badge variant="success">Current</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                       <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                         <Smartphone className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                         <div className="font-medium text-white">StockMaster App (iOS)</div>
                         <div className="text-xs text-slate-500">San Francisco, US • 2 days ago</div>
                       </div>
                       <Button variant="ghost" size="sm" className="text-rose-400">Revoke</Button>
                    </div>
                 </div>
               </GlassCard>
             </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="animate-fade-in">
              <GlassCard>
                <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
                <div className="relative pl-4 border-l border-white/10 space-y-8">
                  {activityLog.map((log, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-ocean border-2 border-[#131824]"></div>
                      <div>
                        <span className="text-xs font-mono text-slate-500 block mb-1">{log.time}</span>
                        <p className="text-white font-medium">{log.action}</p>
                        <p className="text-sm text-slate-400">{log.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-sm">View Full History</Button>
              </GlassCard>
            </div>
          )}
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-6">
          <GlassCard className="bg-gradient-to-br from-ocean/10 to-teal/5">
            <h3 className="text-lg font-bold text-white mb-6">Performance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Receipts Validated</span>
                  <span className="font-bold text-white">85%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-ocean w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">On-Time Deliveries</span>
                  <span className="font-bold text-white">92%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[92%]"></div>
                </div>
              </div>
            </div>
          </GlassCard>

           <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Team Members</h3>
            <div className="flex -space-x-3 mb-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#131824] bg-slate-700 flex items-center justify-center text-xs text-white font-bold">
                   {['JD', 'SA', 'MR', 'PL'][i-1]}
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-[#131824] bg-white/10 flex items-center justify-center text-xs text-white font-bold">
                 +5
               </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">Manage Team</Button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;