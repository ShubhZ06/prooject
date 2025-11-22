"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/ui/GlassCard';
import { 
  Package, 
  Truck, 
  ArrowRight,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Operation } from '@/types';

// Mock Data for Charts
const stockTrendData = [
  { name: 'Mon', in: 400, out: 240 },
  { name: 'Tue', in: 300, out: 139 },
  { name: 'Wed', in: 200, out: 980 },
  { name: 'Thu', in: 278, out: 390 },
  { name: 'Fri', in: 189, out: 480 },
  { name: 'Sat', in: 239, out: 380 },
  { name: 'Sun', in: 349, out: 430 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Tools', value: 200 },
];

const COLORS = ['#0EA5E9', '#14B8A6', '#F97316', '#8B5CF6'];

// Mock Operations for calculating counts (normally passed via props or context)
const mockOperations: Operation[] = [
  { id: '1', reference: 'WH/IN/0001', type: 'Receipt', status: 'Ready', scheduleDate: '2024-10-24', contact: 'TechGlobal', items: [], responsible: 'Admin' },
  { id: '2', reference: 'WH/OUT/0001', type: 'Delivery', status: 'Draft', scheduleDate: '2023-12-01', contact: 'CyberDyne', items: [], responsible: 'John Doe' }, // Late
  { id: '3', reference: 'WH/IN/0002', type: 'Receipt', status: 'Draft', scheduleDate: '2023-11-15', contact: 'RawMaterials', items: [], responsible: 'Admin' }, // Late
  { id: '4', reference: 'WH/OUT/0002', type: 'Delivery', status: 'Ready', scheduleDate: '2024-10-26', contact: 'Massive Dynamic', items: [], responsible: 'Alex' },
];

const Dashboard: React.FC = () => {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];

  // Calculation Logic
  const receipts = mockOperations.filter(op => op.type === 'Receipt');
  const deliveries = mockOperations.filter(op => op.type === 'Delivery');

  const receiptsToProcess = receipts.filter(op => op.status !== 'Done' && op.status !== 'Cancelled').length;
  const receiptsLate = receipts.filter(op => op.status !== 'Done' && op.status !== 'Cancelled' && op.scheduleDate < today).length;

  const deliveriesToProcess = deliveries.filter(op => op.status !== 'Done' && op.status !== 'Cancelled').length;
  const deliveriesLate = deliveries.filter(op => op.status !== 'Done' && op.status !== 'Cancelled' && op.scheduleDate < today).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Overview of operations and stock.</p>
        </div>
      </div>

      {/* Operations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Receipts Card */}
        <div 
          onClick={() => router.push('/operations?type=Receipt')}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-white">Receipts</h3>
             <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
               <Package className="w-6 h-6" />
             </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
             <div>
               <p className="text-3xl font-bold text-white">{receiptsToProcess}</p>
               <p className="text-xs text-emerald-400 uppercase tracking-wider mt-1">To Process</p>
             </div>
             <div className="text-right">
                {receiptsLate > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                    {receiptsLate} Late
                  </span>
                )}
             </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500/20">
            <div className="h-full bg-emerald-500 w-1/2"></div>
          </div>
        </div>

        {/* Delivery Orders Card */}
        <div 
          onClick={() => router.push('/operations?type=Delivery')}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:bg-ocean/5 hover:border-ocean/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-white">Delivery Orders</h3>
             <span className="p-2 rounded-lg bg-ocean/10 text-ocean group-hover:bg-ocean group-hover:text-white transition-colors">
               <Truck className="w-6 h-6" />
             </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
             <div>
               <p className="text-3xl font-bold text-white">{deliveriesToProcess}</p>
               <p className="text-xs text-ocean uppercase tracking-wider mt-1">To Process</p>
             </div>
             <div className="text-right">
                {deliveriesLate > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
                    {deliveriesLate} Late
                  </span>
                )}
             </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-ocean/20">
            <div className="h-full bg-ocean w-1/3"></div>
          </div>
        </div>

        {/* Stock Card */}
        <div 
          onClick={() => router.push('/products')}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:bg-amber-500/5 hover:border-amber-500/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-white">Stock</h3>
             <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
               <TrendingUp className="w-6 h-6" />
             </span>
          </div>
          
          <div className="flex items-center justify-between mt-4">
             <div>
               <p className="text-3xl font-bold text-white">1,248</p>
               <p className="text-xs text-amber-400 uppercase tracking-wider mt-1">Items On Hand</p>
             </div>
          </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500/20">
            <div className="h-full bg-amber-500 w-3/4"></div>
          </div>
        </div>
        
        {/* Locations Card (Quick Link) */}
        <div 
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-xl font-bold text-white">Warehouses</h3>
             <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
               <AlertCircle className="w-6 h-6" />
             </span>
          </div>
          
           <div className="flex items-center justify-between mt-4">
             <div>
               <p className="text-3xl font-bold text-white">3</p>
               <p className="text-xs text-indigo-400 uppercase tracking-wider mt-1">Active Locations</p>
             </div>
          </div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500/20">
            <div className="h-full bg-indigo-500 w-full"></div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Trend */}
        <GlassCard className="lg:col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-ocean" />
              Stock Movement
            </h2>
            <button className="text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131824', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F1F5F9' }}
                />
                <Area type="monotone" dataKey="in" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} name="Received" />
                <Area type="monotone" dataKey="out" stroke="#14B8A6" fillOpacity={1} fill="url(#colorOut)" strokeWidth={3} name="Delivered" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Categories */}
        <GlassCard>
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Distribution</h2>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#131824', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white">4</span>
              <span className="text-slate-400 text-sm">Categories</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-slate-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
