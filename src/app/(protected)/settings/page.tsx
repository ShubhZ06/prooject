"use client";

import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  Building2,
  Map,
  Tags,
  Users,
  Bell,
  Link as LinkIcon,
  Settings as SettingsIcon,
  Plus,
  MoreVertical,
  Search,
  Save,
  Shield,
  Database,
  Activity
} from 'lucide-react';

// Mock Data
const mockWarehouses = [
  { id: 1, name: 'Main Warehouse', code: 'WH-001', address: '123 Tech Blvd, San Francisco', capacity: 85, status: 'Active', stockValue: '$1.2M' },
  { id: 2, name: 'East Wing Depot', code: 'WH-002', address: '456 Logistics Way, Oakland', capacity: 42, status: 'Active', stockValue: '$450k' },
  { id: 3, name: 'Cold Storage Facility', code: 'WH-003', address: '789 Freeze St, San Jose', capacity: 12, status: 'Maintenance', stockValue: '$120k' },
];

const mockUsers = [
  { id: 1, name: 'Alex Morgan', email: 'alex@stockmaster.io', role: 'Admin', status: 'Active', lastLogin: '2 mins ago' },
  { id: 2, name: 'Sarah Connor', email: 'sarah@stockmaster.io', role: 'Manager', status: 'Active', lastLogin: '1 day ago' },
  { id: 3, name: 'John Doe', email: 'john@stockmaster.io', role: 'Viewer', status: 'Inactive', lastLogin: '5 days ago' },
];

const mockIntegrations = [
  { name: 'Slack', icon: 'MessageSquare', status: 'Connected', description: 'Receive stock alerts in #inventory channel.' },
  { name: 'QuickBooks', icon: 'FileText', status: 'Disconnected', description: 'Sync inventory value and invoices automatically.' },
  { name: 'Shopify', icon: 'ShoppingBag', status: 'Connected', description: 'Real-time stock sync with your e-commerce store.' },
  { name: 'SendGrid', icon: 'Mail', status: 'Disconnected', description: 'Transactional emails for receipts and deliveries.' },
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Warehouses');

  const tabs = [
    { id: 'Warehouses', icon: Building2 },
    { id: 'Locations', icon: Map },
    { id: 'Categories', icon: Tags },
    { id: 'Users & Roles', icon: Users },
    { id: 'Notifications', icon: Bell },
    { id: 'Integrations', icon: LinkIcon },
    { id: 'System', icon: SettingsIcon },
  ];

  const renderWarehouses = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
      {mockWarehouses.map((wh) => (
        <GlassCard key={wh.id} className="group hover:border-ocean/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-ocean group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <Badge variant={wh.status === 'Active' ? 'success' : 'warning'}>{wh.status}</Badge>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{wh.name}</h3>
          <p className="text-sm text-slate-400 mb-4 flex items-center gap-1">
            <span className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">{wh.code}</span>
            {wh.address}
          </p>
          
          <div className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Stock Value</span>
              <span className="text-white font-medium">{wh.stockValue}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Capacity</span>
                <span className={wh.capacity > 80 ? 'text-amber-400' : 'text-emerald-400'}>{wh.capacity}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-ocean to-teal" style={{ width: `${wh.capacity}%` }} />
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <Button variant="ghost" size="sm">Edit</Button>
             <Button variant="glass" size="sm">Manage Locations</Button>
          </div>
        </GlassCard>
      ))}
      
      {/* Add New Card */}
      <button className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-ocean/50 hover:text-ocean hover:bg-ocean/5 transition-all group min-h-[280px]">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6" />
        </div>
        <span className="font-medium">Add Warehouse</span>
      </button>
    </div>
  );

  const renderUsers = () => (
    <GlassCard className="animate-fade-in p-0 overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input type="text" placeholder="Search users..." className="w-full bg-deep border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-ocean outline-none text-white" />
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Invite User</Button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-slate-400 border-b border-white/10">
          <tr>
            <th className="p-4 font-medium">User</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Last Login</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {mockUsers.map(user => (
            <tr key={user.id} className="hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name}</div>
                    <div className="text-slate-500 text-xs">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-slate-300">{user.role}</td>
              <td className="p-4"><Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>{user.status}</Badge></td>
              <td className="p-4 text-slate-400">{user.lastLogin}</td>
              <td className="p-4 text-right">
                <button className="text-slate-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );

  const renderIntegrations = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {mockIntegrations.map((item) => (
        <GlassCard key={item.name} className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
             <LinkIcon className="w-6 h-6 text-slate-300" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white">{item.name}</h3>
              <Badge variant={item.status === 'Connected' ? 'success' : 'neutral'}>{item.status}</Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1 mb-4">{item.description}</p>
            <Button variant={item.status === 'Connected' ? 'outline' : 'glass'} size="sm" className="w-full">
              {item.status === 'Connected' ? 'Configure' : 'Connect'}
            </Button>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <GlassCard>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-ocean" /> General Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Company Name</label>
            <input type="text" defaultValue="Acme Corp" className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-ocean outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Currency</label>
            <select className="w-full bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-ocean outline-none">
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" icon={<Save className="w-4 h-4" />}>Save Changes</Button>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" /> Security & Backup
        </h3>
        <div className="space-y-4">
           <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <div className="font-medium text-white">Two-Factor Authentication</div>
                <div className="text-sm text-slate-400">Enforce 2FA for all admin users</div>
              </div>
              <div className="w-12 h-6 bg-ocean rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
           </div>
           <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div>
                <div className="font-medium text-white">Data Backup</div>
                <div className="text-sm text-slate-400">Last backup: 2 hours ago</div>
              </div>
              <Button variant="glass" icon={<Database className="w-4 h-4" />}>Backup Now</Button>
           </div>
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up pb-10">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-ocean/10 text-ocean border border-ocean/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.id}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{activeTab}</h2>
          <p className="text-slate-400 text-sm">Manage your {activeTab.toLowerCase()} settings</p>
        </div>

        {activeTab === 'Warehouses' && renderWarehouses()}
        {activeTab === 'Users & Roles' && renderUsers()}
        {activeTab === 'Integrations' && renderIntegrations()}
        {activeTab === 'System' && renderSystem()}
        
        {/* Placeholder for others */}
        {['Locations', 'Categories', 'Notifications'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center h-[400px] glass-panel rounded-2xl text-slate-500">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p>Configuration for {activeTab} coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
