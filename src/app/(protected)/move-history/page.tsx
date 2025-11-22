"use client";

import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { StockMovement } from '@/types';
import { 
  History, 
  Download, 
  Filter, 
  Search, 
  List, 
  LayoutGrid, 
  MapPin,
  User,
  Package
} from 'lucide-react';

// Enhanced Mock Data matching new requirements
const mockMovements: StockMovement[] = [
  { 
    id: 'm1', 
    date: '2024-10-24', 
    time: '14:30', 
    product: 'NanoTech Chipset X1', 
    sku: 'NC-X1', 
    type: 'Receipt', 
    reference: 'WH/IN/0001', 
    quantity: 120, 
    locationFrom: 'Vendor',
    locationTo: 'WH/Stock1', 
    contact: 'Azure Interior',
    status: 'Done'
  },
  { 
    id: 'm2', 
    date: '2024-10-24', 
    time: '11:15', 
    product: 'Quantum Sensor Module', 
    sku: 'QS-M2', 
    type: 'Receipt', 
    reference: 'WH/IN/0001', 
    quantity: 50, 
    locationFrom: 'Vendor',
    locationTo: 'WH/Stock1', 
    contact: 'Azure Interior',
    status: 'Done'
  },
  { 
    id: 'm3', 
    date: '2024-10-23', 
    time: '16:45', 
    product: 'Hydraulic Piston V4', 
    sku: 'HP-V4', 
    type: 'Delivery', 
    reference: 'WH/OUT/0002', 
    quantity: 5, 
    locationFrom: 'WH/Stock1', 
    locationTo: 'Customer',
    contact: 'Deco Addict',
    status: 'Done'
  },
  { 
    id: 'm4', 
    date: '2024-10-23', 
    time: '09:20', 
    product: 'OLED Display 4K', 
    sku: 'OD-4K', 
    type: 'Delivery', 
    reference: 'WH/OUT/0003', 
    quantity: 2, 
    locationFrom: 'WH/Stock2', 
    locationTo: 'Customer',
    contact: 'Gemini Furniture',
    status: 'Ready'
  }
];

const MoveHistory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovements = mockMovements.filter(m => 
    m.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isIncoming = (m: StockMovement) => m.type === 'Receipt' || (m.locationTo && m.locationTo.includes('WH/'));

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
            <History className="w-8 h-8 text-ocean" /> Move History
          </h1>
          <p className="text-slate-400 mt-1">Track all stock moves by reference and contact.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="glass" icon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      {/* Toolbar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-24 z-30 shadow-xl shadow-black/20">
         <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* View Toggle */}
            <div className="flex bg-deep/50 rounded-lg p-1 border border-white/10">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-medium ${viewMode === 'list' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 title="List View"
               >
                 <List className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('kanban')}
                 className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-medium ${viewMode === 'kanban' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
                 title="Kanban View"
               >
                 <LayoutGrid className="w-4 h-4" />
               </button>
            </div>
         </div>

         <div className="flex items-center gap-3 w-full sm:w-auto flex-1 justify-end">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search Reference, Contact..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-deep border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-ocean outline-none text-white"
              />
            </div>
            <Button variant="glass" icon={<Filter className="w-4 h-4" />} />
         </div>
      </GlassCard>

      {/* Content */}
      {viewMode === 'list' ? (
        <GlassCard className="p-0 overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">From</th>
                  <th className="p-4">To</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredMovements.map((m) => {
                  const incoming = isIncoming(m);
                  return (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 font-mono text-white group-hover:text-ocean transition-colors">
                        {m.reference}
                        <span className="block text-xs text-slate-500 mt-1">{m.product}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {m.date}
                      </td>
                      <td className="p-4 text-white">
                        {m.contact || '-'}
                      </td>
                      <td className="p-4 text-slate-400">
                        {m.locationFrom}
                      </td>
                      <td className="p-4 text-slate-400">
                        {m.locationTo}
                      </td>
                      <td className={`p-4 text-right font-bold ${incoming ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {m.quantity}
                      </td>
                      <td className="p-4 text-center">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium border 
                           ${m.status === 'Done' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 
                             m.status === 'Ready' ? 'text-ocean bg-ocean/10 border-ocean/20' : 
                             'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>
                           {m.status?.toUpperCase()}
                         </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredMovements.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                 <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                   <Search className="w-6 h-6 opacity-50" />
                 </div>
                 <p>No movements found.</p>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        /* Kanban View */
        <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
          {['Draft', 'Ready', 'Done'].map((status) => (
            <div key={status} className="flex-1 min-w-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                       status === 'Done' ? 'bg-emerald-400' :
                       status === 'Ready' ? 'bg-ocean' : 'bg-slate-500'
                    }`} />
                    <h3 className="font-bold text-white text-sm uppercase tracking-wide">{status}</h3>
                    <span className="bg-white/5 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-white/5">
                      {filteredMovements.filter(m => m.status === status).length}
                    </span>
                 </div>
              </div>

              <div className="flex-1 bg-white/[0.02] rounded-xl border border-dashed border-white/10 p-3">
                {filteredMovements.filter(m => m.status === status).map((m) => {
                  const incoming = isIncoming(m);
                  return (
                    <div 
                      key={m.id}
                      className="bg-[#131824] border border-white/10 rounded-lg p-4 mb-3 hover:border-ocean/50 hover:shadow-lg hover:shadow-ocean/5 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-mono text-white font-bold">
                          {m.reference}
                        </span>
                        <span className="text-xs text-slate-500">{m.date}</span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-sm text-white mb-1">{m.product}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> {m.contact}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3 h-3" /> {m.locationFrom} → {m.locationTo}
                         </div>
                         <span className={`text-sm font-bold ${incoming ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {m.quantity}
                         </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveHistory;
