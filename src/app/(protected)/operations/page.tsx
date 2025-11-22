"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import CreateOperationModal from '@/components/CreateOperationModal';
import SuccessOverlay from '@/components/SuccessOverlay';
import { Operation, OperationType, OperationStatus } from '@/types';
import { 
  Package, 
  Truck, 
  ArrowRightLeft, 
  Scale, 
  Filter, 
  Search, 
  MoreHorizontal, 
  FileText,
  Calendar,
  Plus,
  Kanban,
  List as ListIcon,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Initial Mock Data
const initialOperations: Operation[] = [
  { id: '1', reference: 'WH/IN/0001', type: 'Receipt', status: 'Done', scheduleDate: '2024-10-24', contact: 'TechGlobal', items: [], responsible: 'Admin', sourceLocation: 'Vendor', destinationLocation: 'WH/Stock' },
  { id: '2', reference: 'WH/OUT/0001', type: 'Delivery', status: 'Ready', scheduleDate: '2024-10-24', contact: 'CyberDyne', items: [], responsible: 'John Doe', sourceLocation: 'WH/Stock', destinationLocation: 'Customer' },
  { id: '3', reference: 'WH/INT/0001', type: 'Transfer', status: 'Draft', scheduleDate: '2024-10-26', sourceLocation: 'WH/Stock', destinationLocation: 'WH/Output', items: [], responsible: 'Admin' },
  { id: '4', reference: 'WH/IN/0002', type: 'Receipt', status: 'Draft', scheduleDate: '2024-11-01', contact: 'RawMaterials Co.', items: [], responsible: 'Admin', sourceLocation: 'Vendor', destinationLocation: 'WH/Stock' },
];

const Operations: React.FC = () => {
  const searchParams = useSearchParams();
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  const [activeTab, setActiveTab] = useState<'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment'>('Receipt');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{isOpen: boolean, type: OperationType, ref: string}>({ isOpen: false, type: 'Receipt', ref: '' });

  // Check for navigation state
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setActiveTab(type as any);
    }
  }, [searchParams]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = (type: OperationType, ref: string) => {
    setSuccessData({ isOpen: true, type, ref });
    const newOp: Operation = {
      id: Math.random().toString(36).substr(2, 9),
      reference: ref,
      type: type,
      status: 'Done',
      scheduleDate: new Date().toISOString().split('T')[0],
      items: [],
      responsible: 'You',
      contact: 'New Partner',
      sourceLocation: type === 'Receipt' ? 'Vendor' : 'WH/Stock',
      destinationLocation: type === 'Receipt' ? 'WH/Stock' : 'Customer'
    };
    setOperations([newOp, ...operations]);
  };

  const filteredOps = operations.filter(op => {
    const matchesTab = op.type === activeTab;
    const matchesSearch = op.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusVariant = (status: OperationStatus) => {
    switch (status) {
      case 'Done': return 'success';
      case 'Ready': return 'info';
      case 'Waiting': return 'warning';
      case 'Draft': return 'neutral';
      case 'Cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  const isLate = (date: string, status: string) => {
    const today = new Date().toISOString().split('T')[0];
    return status !== 'Done' && status !== 'Cancelled' && date < today;
  };

  // Kanban Columns Logic
  const kanbanColumns: OperationStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];
  const relevantColumns = activeTab === 'Receipt' ? ['Draft', 'Ready', 'Done'] : kanbanColumns;

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <CreateOperationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialType={activeTab}
        onSuccess={handleSuccess}
      />
      
      <SuccessOverlay 
        isOpen={successData.isOpen}
        onClose={() => setSuccessData({...successData, isOpen: false})}
        type={successData.type}
        reference={successData.ref}
      />

      {/* Sidebar & Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2 flex-shrink-0">
          <GlassCard className="p-2 space-y-1 sticky top-24">
            {[
              { id: 'Receipt', icon: Package, label: 'Receipts' },
              { id: 'Delivery', icon: Truck, label: 'Deliveries' },
              { id: 'Transfer', icon: ArrowRightLeft, label: 'Transfers' },
              { id: 'Adjustment', icon: Scale, label: 'Adjustments' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-ocean/10 text-ocean border border-ocean/20 shadow-sm' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-ocean" />}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Main Data Area */}
        <div className="flex-1 space-y-4 min-w-0">
          
          {/* Header Toolbar */}
          <GlassCard className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
               <h2 className="text-lg font-bold text-white hidden sm:block">{activeTab}s</h2>
               <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenModal}>
                  New
               </Button>
               
               <div className="flex bg-deep/50 rounded-lg p-1 border border-white/10 ml-2">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-medium ${viewMode === 'list' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-md transition-all flex items-center gap-2 text-xs font-medium ${viewMode === 'kanban' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Kanban className="w-4 h-4" />
                  </button>
               </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
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

          {/* List View */}
          {viewMode === 'list' && (
            <GlassCard className="p-0 overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-medium">Reference</th>
                      <th className="p-4 font-medium">From</th>
                      <th className="p-4 font-medium">To</th>
                      <th className="p-4 font-medium">Contact</th>
                      <th className="p-4 font-medium">Schedule Date</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    {filteredOps.map((op) => (
                      <tr key={op.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="p-4 font-medium text-ocean group-hover:underline underline-offset-4">
                          {op.reference}
                        </td>
                        <td className="p-4 text-slate-300">{op.sourceLocation}</td>
                        <td className="p-4 text-slate-300">{op.destinationLocation}</td>
                        <td className="p-4 text-white">{op.contact || '-'}</td>
                        <td className="p-4 text-slate-400">
                           <div className={`flex items-center gap-2 ${isLate(op.scheduleDate, op.status) ? 'text-rose-400 font-bold' : ''}`}>
                             <Calendar className="w-3 h-3" /> {op.scheduleDate}
                             {isLate(op.scheduleDate, op.status) && <AlertCircle className="w-3 h-3" />}
                           </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(op.status)}>{op.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOps.length === 0 && (
                   <div className="p-12 text-center text-slate-500">No operations found.</div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="flex gap-6 overflow-x-auto pb-4 min-h-[500px]">
              {relevantColumns.map((status) => (
                <div key={status} className="flex-1 min-w-[300px] flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         status === 'Done' ? 'bg-emerald-400' : 
                         status === 'Ready' ? 'bg-ocean' : 
                         status === 'Waiting' ? 'bg-amber-400' : 'bg-slate-500'
                       }`} />
                       <h3 className="font-bold text-white text-sm">{status}</h3>
                       <span className="bg-white/5 text-slate-400 text-xs px-2 py-0.5 rounded-full border border-white/5">
                         {filteredOps.filter(op => op.status === status).length}
                       </span>
                    </div>
                  </div>

                  <div className="flex-1 bg-white/[0.02] rounded-xl border border-dashed border-white/10 p-3">
                    {filteredOps.filter(op => op.status === status).map((op) => (
                      <div 
                        key={op.id}
                        className="bg-[#131824] border border-white/10 rounded-lg p-4 mb-3 hover:border-ocean/50 hover:shadow-lg hover:shadow-ocean/5 transition-all group relative cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-sm text-white">{op.reference}</span>
                          <span className={`text-xs ${isLate(op.scheduleDate, op.status) ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                            {op.scheduleDate}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-slate-300 mb-1">{op.contact}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                           <div className="text-xs text-slate-500">
                             {op.sourceLocation} → {op.destinationLocation}
                           </div>
                           {op.status === 'Done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Operations;
