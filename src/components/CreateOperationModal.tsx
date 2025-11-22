
import React, { useState, useEffect } from 'react';
import { X, Printer, Check, Plus, Trash2, AlertCircle, AlertTriangle } from 'lucide-react';
import Button from './ui/Button';
import { OperationType, OperationStatus, OperationItem } from '../types';

interface CreateOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: OperationType;
  onSuccess: (type: OperationType, ref: string) => void;
  editData?: any; // If editing existing operation
}

// Mock available stock for demo
const mockStock: Record<string, number> = {
  'NC-X1': 154,
  'QS-M2': 12,
  'HP-V4': 85,
  'OD-4K': 45,
};

const mockProducts = [
  { id: '1', name: 'NanoTech Chipset X1', sku: 'NC-X1' },
  { id: '2', name: 'Quantum Sensor Module', sku: 'QS-M2' },
  { id: '3', name: 'Hydraulic Piston V4', sku: 'HP-V4' },
  { id: '5', name: 'OLED Display 4K', sku: 'OD-4K' },
];

const CreateOperationModal: React.FC<CreateOperationModalProps> = ({ isOpen, onClose, initialType = 'Receipt', onSuccess, editData }) => {
  const [status, setStatus] = useState<OperationStatus>('Draft');
  const [formData, setFormData] = useState({
    reference: '',
    contact: '', // Supplier or Customer
    source: '',
    destination: '',
    scheduleDate: new Date().toISOString().split('T')[0],
    responsible: 'Current User',
    operationType: initialType
  });
  const [items, setItems] = useState<OperationItem[]>([]);

  // Generate auto-reference on open
  useEffect(() => {
    if (isOpen && !editData) {
      const prefix = initialType === 'Receipt' ? 'WH/IN/' : initialType === 'Delivery' ? 'WH/OUT/' : 'WH/INT/';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData(prev => ({
        ...prev,
        reference: `${prefix}2024/${randomNum}`,
        operationType: initialType,
        source: initialType === 'Receipt' ? 'Vendor' : 'WH/Stock',
        destination: initialType === 'Receipt' ? 'WH/Stock' : 'Customer'
      }));
      setStatus('Draft');
      setItems([]);
    }
  }, [isOpen, initialType, editData]);

  const handleAddItem = () => {
    setItems([...items, {
      productId: '',
      productName: '',
      sku: '',
      quantity: 1,
      doneQuantity: 0,
      stockAvailable: 0
    }]);
  };

  const updateItem = (index: number, field: keyof OperationItem, value: any) => {
    const newItems = [...items];
    if (field === 'productId') {
      // Handle product selection
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        newItems[index].productId = product.id;
        newItems[index].productName = product.name;
        newItems[index].sku = product.sku;
        newItems[index].stockAvailable = mockStock[product.sku] || 0;
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleValidate = () => {
    if (status === 'Draft') {
      // Check availability logic for Delivery
      if (initialType === 'Delivery') {
        const allAvailable = items.every(i => (i.stockAvailable || 0) >= i.quantity);
        setStatus(allAvailable ? 'Ready' : 'Waiting');
      } else {
        setStatus('Ready');
      }
    } else if (status === 'Ready' || status === 'Waiting') {
      setStatus('Done');
      setTimeout(() => {
        onSuccess(initialType, formData.reference);
        onClose();
      }, 500);
    }
  };

  if (!isOpen) return null;

  const steps: OperationStatus[] = ['Draft', 'Waiting', 'Ready', 'Done'];
  const filteredSteps = initialType === 'Receipt' ? ['Draft', 'Ready', 'Done'] : steps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-[#131824] rounded-xl shadow-2xl border border-white/10 flex flex-col h-[90vh] animate-fade-in-up overflow-hidden">
        
        {/* Header Actions */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              disabled={status === 'Done'}
              onClick={handleValidate}
              className={status === 'Done' ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {status === 'Draft' ? 'Mark as Todo' : status === 'Done' ? 'Validated' : 'Validate'}
            </Button>
            <Button variant="glass" icon={<Printer className="w-4 h-4" />}>Print</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
          
          {/* Status Breadcrumbs */}
          <div className="flex items-center">
             {filteredSteps.map((s, i) => (
               <div key={s} className="flex items-center">
                 <div className={`px-4 py-1.5 text-sm font-bold clip-path-arrow 
                   ${status === s ? 'bg-ocean text-white' : 
                     filteredSteps.indexOf(status) > i ? 'bg-emerald-500 text-white' : 
                     'bg-white/5 text-slate-500 border-y border-r border-white/10'
                   } transition-colors`}>
                   {s}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-bold text-white">{formData.reference}</h1>
            {status === 'Done' && <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-sm font-bold">POSTED</div>}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8 bg-white/[0.02] p-6 rounded-xl border border-white/5">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-300 w-32">
                     {initialType === 'Receipt' ? 'Receive From' : 'Delivery Address'}
                   </label>
                   <input 
                     type="text" 
                     className="flex-1 bg-transparent border-b border-white/20 focus:border-ocean outline-none py-1 text-white"
                     value={formData.contact}
                     onChange={(e) => setFormData({...formData, contact: e.target.value})}
                     placeholder={initialType === 'Receipt' ? 'Select Vendor...' : 'Select Customer...'}
                   />
                </div>
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-300 w-32">Operation Type</label>
                   <span className="flex-1 text-slate-400">{formData.reference.split('/')[0] + '/' + formData.reference.split('/')[1]}</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-300 w-32">Schedule Date</label>
                   <input 
                     type="date" 
                     className="flex-1 bg-transparent border-b border-white/20 focus:border-ocean outline-none py-1 text-white"
                     value={formData.scheduleDate}
                     onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                   />
                </div>
                 <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-300 w-32">Source Doc</label>
                   <input 
                     type="text" 
                     className="flex-1 bg-transparent border-b border-white/20 focus:border-ocean outline-none py-1 text-white"
                     placeholder="e.g. PO001"
                   />
                </div>
             </div>
          </div>

          {/* Products Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-bold text-white">Operations</h3>
               {status === 'Draft' && (
                 <Button variant="glass" size="sm" onClick={handleAddItem} icon={<Plus className="w-4 h-4" />}>Add Line</Button>
               )}
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400 font-medium">
                  <tr>
                    <th className="p-3 w-[40%]">Product</th>
                    <th className="p-3 text-right w-[15%]">Demand</th>
                    <th className="p-3 text-right w-[15%]">Done</th>
                    {initialType === 'Delivery' && <th className="p-3 text-center w-[10%]">Avail</th>}
                    <th className="p-3 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02]">
                      <td className="p-3">
                        {status === 'Draft' ? (
                          <select 
                            className="w-full bg-transparent outline-none text-white"
                            value={item.productId}
                            onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                          >
                            <option value="" className="bg-deep">Select Product...</option>
                            {mockProducts.map(p => (
                              <option key={p.id} value={p.id} className="bg-deep">{p.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-white">{item.productName}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                         {status === 'Draft' ? (
                           <input 
                             type="number" 
                             className="w-20 bg-transparent text-right outline-none border-b border-white/10 focus:border-ocean text-white"
                             value={item.quantity}
                             onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                           />
                         ) : (
                           <span className="text-white">{item.quantity}</span>
                         )}
                      </td>
                      <td className="p-3 text-right">
                         {status === 'Done' ? (
                            <span className="text-emerald-400 font-bold">{item.quantity}</span>
                         ) : (
                            <span className="text-slate-500">0</span>
                         )}
                      </td>
                      {initialType === 'Delivery' && (
                        <td className="p-3 text-center">
                           {item.productId && (item.stockAvailable || 0) < item.quantity ? (
                             <div className="flex justify-center text-rose-400" title={`Only ${item.stockAvailable} available`}>
                               <AlertTriangle className="w-4 h-4" />
                             </div>
                           ) : item.productId ? (
                             <div className="flex justify-center text-emerald-400">
                               <Check className="w-4 h-4" />
                             </div>
                           ) : null}
                        </td>
                      )}
                      <td className="p-3 text-center">
                        {status === 'Draft' && (
                          <button onClick={() => removeItem(idx)} className="text-slate-500 hover:text-rose-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        No products added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
             
            {/* Availability Alert logic visual */}
            {initialType === 'Delivery' && items.some(i => i.productId && (i.stockAvailable || 0) < i.quantity) && (
               <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 p-3 rounded border border-rose-500/20">
                 <AlertCircle className="w-4 h-4" />
                 <span className="text-sm font-medium">Warning: Some products are not available in stock.</span>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOperationModal;
