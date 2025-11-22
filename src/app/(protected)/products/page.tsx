"use client";

import React, { useState, useMemo, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import TiltCard from '@/components/ui/TiltCard';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductFilters, { FilterState } from '@/components/ProductFilters';
import ProductModal from '@/components/ProductModal';
import ImportModal from '@/components/ImportModal';
import { getProducts } from '@/api/products';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  MapPin,
  Barcode,
  Download,
  Upload,
  ChevronRight,
  ArrowUpDown,
  X,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

// Products are now loaded from the API (/api/products) instead of a local mock array.
type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc' | 'price-asc' | 'price-desc';

const Products: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtering & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('stock-asc');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    status: 'All Products',
    minPrice: '',
    maxPrice: '',
    warehouses: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        console.error('Failed to load products', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Derived Data
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      
      const matchesStatus = filters.status === 'All Products' || product.status === filters.status;
      
      const matchesPrice = (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
                           (!filters.maxPrice || product.price <= Number(filters.maxPrice));

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'stock-asc': return a.stock - b.stock;
        case 'stock-desc': return b.stock - a.stock;
        default: return 0;
      }
    });
  }, [searchQuery, filters, sortOption]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      {/* Modals */}
      <ProductFilters 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters}
        setFilters={setFilters}
      />
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct}
      />
      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Header & Controls */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sticky top-20 z-30 shadow-xl shadow-black/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <h1 className="text-2xl font-bold text-white hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Products
          </h1>
          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
          
          {/* Advanced Search */}
          <div className="relative flex-1 w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SKU, supplier..." 
              className="w-full bg-deep/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-ocean/50 focus:bg-deep/80 focus:ring-1 focus:ring-ocean/20 transition-all placeholder:text-slate-500 text-white"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-500 border border-white/5">CMD+K</span>
            </div>
          </div>
          
          <Button 
            variant="glass" 
            className={`hidden sm:flex ${isFilterOpen ? 'bg-white/10 border-ocean/50 text-ocean' : ''}`}
            onClick={() => setIsFilterOpen(true)}
            icon={<Filter className="w-4 h-4" />}
          >
            Filters
            {(filters.categories.length > 0 || filters.status !== 'All Products' || filters.minPrice) && (
              <span className="ml-2 w-2 h-2 rounded-full bg-ocean"></span>
            )}
          </Button>

          {/* Sorting Dropdown (Simplified for UI) */}
          <div className="relative group hidden sm:block">
             <Button variant="glass" icon={<ArrowUpDown className="w-4 h-4" />}>
               Sort
             </Button>
             <div className="absolute top-full left-0 mt-2 w-40 bg-[#131824] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-40">
               {[
                 { label: 'Name (A-Z)', value: 'name-asc' },
                 { label: 'Stock (Low)', value: 'stock-asc' },
                 { label: 'Stock (High)', value: 'stock-desc' },
                 { label: 'Price (Low)', value: 'price-asc' },
                 { label: 'Price (High)', value: 'price-desc' },
               ].map((opt) => (
                 <button 
                   key={opt.value}
                   onClick={() => setSortOption(opt.value as SortOption)}
                   className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${sortOption === opt.value ? 'text-ocean bg-white/5' : 'text-slate-400'}`}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
          <div className="flex bg-deep/50 rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-ocean shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

          <Button 
            variant="ghost" 
            className="hidden sm:flex" 
            icon={<Upload className="w-4 h-4" />}
            onClick={() => setIsImportOpen(true)}
          >
            Import
          </Button>
          <Button variant="ghost" className="hidden sm:flex" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAdd}
            className="w-full sm:w-auto"
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.categories.length > 0 || filters.status !== 'All Products' || filters.minPrice) && (
        <div className="flex flex-wrap gap-2 items-center">
           <span className="text-sm text-slate-500 mr-2">Active Filters:</span>
           {filters.status !== 'All Products' && (
             <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white flex items-center gap-1">
               {filters.status} <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, status: 'All Products'})} />
             </span>
           )}
           {filters.categories.map(cat => (
             <span key={cat} className="px-2 py-1 rounded-full bg-ocean/10 border border-ocean/20 text-xs text-ocean flex items-center gap-1">
               {cat} <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({...filters, categories: filters.categories.filter(c => c !== cat)})} />
             </span>
           ))}
           <button onClick={() => setFilters({ categories: [], status: 'All Products', minPrice: '', maxPrice: '', warehouses: [] })} className="text-xs text-rose-400 hover:underline ml-2">
             Clear All
           </button>
        </div>
      )}

      {/* Error / loading states */}
      {error && (
        <div className="text-sm text-rose-400">{error}</div>
      )}

      {/* Views */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <TiltCard key={product.id}>
              <GlassCard className="h-full group p-0 overflow-hidden border border-white/5 hover:border-ocean/30 transition-colors">
                {/* Image Area */}
                <div className="relative h-48 w-full overflow-hidden bg-surface">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant={
                      product.status === 'In Stock' ? 'success' : 
                      product.status === 'Low Stock' ? 'warning' : 'danger'
                    }>
                      {product.status}
                    </Badge>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => handleEdit(product)}>Edit</Button>
                    <Button variant="glass" size="sm" className="rounded-full">History</Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="mb-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-slate-100 truncate pr-2 flex-1" title={product.name}>{product.name}</h3>
                      <button className="text-slate-500 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
                        <Barcode className="w-3 h-3" /> {product.sku}
                      </span>
                      <span>{product.category}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Stock</p>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold ${product.stock <= product.minStock ? 'text-amber-400' : 'text-white'}`}>
                          {product.stock}
                        </span>
                        <span className="text-xs text-slate-500">{product.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Price</p>
                      <p className="text-lg font-bold text-ocean">${product.price}</p>
                    </div>
                  </div>

                  {/* Location & Progress */}
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1 text-teal-400">
                        <MapPin className="w-3 h-3" /> {product.location}
                      </div>
                      <span className="text-slate-500">{(product.stock / (product.minStock * 3) * 100).toFixed(0)}% Capacity</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${product.stock < product.minStock ? 'bg-rose-500' : product.stock < product.minStock * 2 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((product.stock / (product.minStock * 3)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </TiltCard>
          ))}
        </div>
      ) : (
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-transparent checked:bg-ocean checked:border-ocean"
                      checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4 font-medium">Product Details</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => setSortOption('stock-desc')}>
                    <div className="flex items-center gap-1">
                      Stock <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => setSortOption('price-desc')}>
                    <div className="flex items-center gap-1">
                      Price <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-600 bg-transparent checked:bg-ocean checked:border-ocean"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface overflow-hidden border border-white/10">
                          <img src={product.image} alt="" className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{product.sku}</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{product.stock} <span className="text-xs text-slate-500 font-normal">{product.unit}</span></div>
                      <div className="text-xs text-slate-500">Min: {product.minStock}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        product.status === 'In Stock' ? 'success' : 
                        product.status === 'Low Stock' ? 'warning' : 'danger'
                      }>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-white">${product.price}</td>
                    <td className="p-4 text-slate-400">{product.location}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-ocean transition-colors"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Simple Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-slate-400">
             <span>Showing {filteredProducts.length} items</span>
             <div className="flex gap-2">
               <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5 disabled:opacity-50">Prev</button>
               <button className="px-3 py-1 rounded border border-white/10 bg-ocean/20 text-ocean border-ocean/30">1</button>
               <button className="px-3 py-1 rounded border border-white/10 hover:bg-white/5">Next</button>
             </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Products;