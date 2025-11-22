import React from 'react';
import { X, Check } from 'lucide-react';
import Button from './ui/Button';

export interface FilterState {
  categories: string[];
  status: string;
  minPrice: string;
  maxPrice: string;
  warehouses: string[];
}

interface ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ isOpen, onClose, filters, setFilters }) => {
  
  const toggleCategory = (cat: string) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters({ ...filters, categories: newCats });
  };

  const toggleWarehouse = (wh: string) => {
    const newWhs = filters.warehouses.includes(wh)
      ? filters.warehouses.filter(w => w !== wh)
      : [...filters.warehouses, wh];
    setFilters({ ...filters, warehouses: newWhs });
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      status: 'All Products',
      minPrice: '',
      maxPrice: '',
      warehouses: []
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-deep/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[350px] sm:w-[400px] bg-surface/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Categories</h3>
            <div className="space-y-3">
              {['Electronics', 'Tools', 'Materials', 'Safety Gear', 'Packaging'].map((cat) => (
                <label key={cat} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <div className="w-5 h-5 border-2 border-slate-600 rounded bg-transparent peer-checked:bg-ocean peer-checked:border-ocean transition-all"></div>
                    <Check className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className={`ml-3 transition-colors ${filters.categories.includes(cat) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Stock Status</h3>
            <div className="space-y-3">
              {['All Products', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                <label key={status} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input 
                      type="radio" 
                      name="status" 
                      checked={filters.status === status}
                      onChange={() => setFilters({ ...filters, status })}
                      className="peer sr-only" 
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 bg-transparent peer-checked:border-ocean peer-checked:border-4 transition-all"></div>
                  </div>
                  <span className={`ml-3 transition-colors ${filters.status === status ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Price Range</h3>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-ocean focus:bg-white/10 outline-none transition-all" 
                />
              </div>
              <span className="text-slate-500">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-ocean focus:bg-white/10 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

           {/* Warehouse */}
           <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Warehouse</h3>
            <div className="space-y-3">
              {['Main Warehouse (A)', 'East Wing (B)', 'Cold Storage (C)'].map((wh) => (
                <label key={wh} className="flex items-center group cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={filters.warehouses.includes(wh)}
                      onChange={() => toggleWarehouse(wh)}
                    />
                    <div className="w-5 h-5 border-2 border-slate-600 rounded bg-transparent peer-checked:bg-ocean peer-checked:border-ocean transition-all"></div>
                    <Check className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className={`ml-3 transition-colors ${filters.warehouses.includes(wh) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                    {wh}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={handleReset}>Reset</Button>
            <Button variant="primary" className="flex-1" onClick={onClose}>Show Results</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;