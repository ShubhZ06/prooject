import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Info, Layers, MapPin, Tag, Plus, Trash2 } from 'lucide-react';
import Button from './ui/Button';
import { Product } from '../types';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: {
    name: string;
    sku: string;
    category: string;
    barcode?: string;
    description?: string;
    unit: string;
    minStock: number;
    price: number;
    supplier?: string;
    stock?: number;
    location?: string;
    image?: string;
    isDraft?: boolean;
  }) => Promise<void> | void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'inventory' | 'details'>('basic');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    barcode: '',
    description: '',
    unit: 'pcs',
    minStock: '',
    reorderQty: '',
    price: '',
    supplier: '',
    stock: '',
    location: 'Main Warehouse (Zone A)',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        barcode: product.barcode || '',
        description: product.description || '',
        unit: product.unit || 'pcs',
        minStock: product.minStock.toString(),
        reorderQty: '50', // Mock default
        price: product.price.toString(),
        supplier: product.supplier || '',
        stock: product.stock.toString(),
        location: product.location || 'Main Warehouse (Zone A)',
        image: product.image || '',
      });
    } else {
      // Reset for new product
      setFormData({
        name: '',
        sku: '',
        category: 'Electronics',
        barcode: '',
        description: '',
        unit: 'pcs',
        minStock: '',
        reorderQty: '',
        price: '',
        supplier: '',
        stock: '',
        location: 'Main Warehouse (Zone A)',
        image: '',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const buildPayload = (isDraft?: boolean) => ({
    name: formData.name,
    sku: formData.sku,
    category: formData.category,
    barcode: formData.barcode || undefined,
    description: formData.description || undefined,
    unit: formData.unit,
    minStock: Number(formData.minStock || 0),
    price: Number(formData.price || 0),
    supplier: formData.supplier || undefined,
    stock: Number(formData.stock || 0),
    location: formData.location,
    image: formData.image || product?.image,
    isDraft,
  });

  const handleSubmit = async () => {
    await onSave(buildPayload(false));
  };

  const handleSaveDraft = async () => {
    await onSave(buildPayload(true));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageUploading(true);
      const url = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Failed to upload image to Cloudinary', err);
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#131824] rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {product ? `Updating details for ${product.sku}` : 'Fill in the details to create a new inventory item.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-white/[0.02] border-r border-white/5 p-6 space-y-2 hidden md:block">
            {[
              { id: 'basic', label: 'Basic Info', icon: Info },
              { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
              { id: 'details', label: 'Additional Details', icon: Tag },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-ocean/10 text-ocean border border-ocean/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* Image Upload Section (Always visible) */}
            <div className="mb-8 flex gap-6">
              <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-slate-400 hover:border-ocean/50 hover:bg-ocean/5 transition-all cursor-pointer group relative overflow-hidden">
                {formData.image || product?.image ? (
                   <img src={formData.image || product?.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Upload Image</span>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-ocean/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-2">Product Image</h3>
                <p className="text-sm text-slate-400 mb-1">Supports JPG, PNG and WEBP. Max file size 5MB.</p>
                {imageUploading && (
                  <p className="text-xs text-ocean mb-2">Uploading to Cloudinary...</p>
                )}
                <div className="flex gap-3 items-center">
                   <Button variant="glass" size="sm" onClick={handleBrowseClick} isLoading={imageUploading}>Browse Files</Button>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                     onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                   >
                     Remove
                   </Button>
                   <input 
                     ref={fileInputRef}
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleImageChange}
                   />
                </div>
              </div>
            </div>

            {activeTab === 'basic' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Product Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                      placeholder="e.g. NanoTech Chipset" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">SKU</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                        placeholder="NC-X1" 
                      />
                      <button 
                        type="button"
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-medium hover:bg-white/10 text-slate-300"
                        onClick={() => {
                          const base = (formData.name || 'PRD')
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, '')
                            .slice(0, 3) || 'PRD';
                          const rand = Math.floor(100 + Math.random() * 900);
                          setFormData({ ...formData, sku: `${base}-${rand}` });
                        }}
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-slate-300"
                    >
                      <option>Electronics</option>
                      <option>Tools</option>
                      <option>Materials</option>
                      <option>Packaging</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Barcode (ISBN/UPC)</label>
                    <input 
                      type="text" 
                      value={formData.barcode}
                      onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                      placeholder="Scan or enter barcode" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all h-24 text-white" 
                    placeholder="Product details..." 
                  />
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Unit of Measure</label>
                    <select 
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-slate-300"
                    >
                      <option value="pcs">Pieces (pcs)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="L">Liters (L)</option>
                      <option value="m">Meters (m)</option>
                      <option value="set">Sets</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Minimum Stock Level</label>
                    <input 
                      type="number" 
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                      placeholder="10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Reorder Quantity</label>
                    <input 
                      type="number" 
                      value={formData.reorderQty}
                      onChange={(e) => setFormData({...formData, reorderQty: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                      placeholder="50" 
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ocean" />
                    {product ? 'Current Locations' : 'Initial Stock Location'}
                  </h3>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                      <span className="text-sm font-medium text-slate-400">Warehouse</span>
                      <span className="text-sm font-medium text-slate-400">Quantity</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <select 
                        className="flex-1 bg-deep border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      >
                        <option>Main Warehouse (Zone A)</option>
                        <option>East Wing (Zone B)</option>
                      </select>
                      <input 
                        type="number" 
                        className="w-24 bg-deep border border-white/10 rounded-lg px-3 py-2 text-sm text-white" 
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                      <button className="p-2 hover:bg-rose-500/20 hover:text-rose-500 rounded text-slate-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button className="text-sm text-ocean hover:text-ocean/80 font-medium flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Location
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Supplier</label>
                    <select 
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-slate-300"
                    >
                      <option value="">Select Supplier...</option>
                      <option value="TechGlobal Inc.">TechGlobal Inc.</option>
                      <option value="RawMaterials Co.">RawMaterials Co.</option>
                      <option value="MechParts">MechParts</option>
                    </select>
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Unit Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:border-ocean focus:ring-1 focus:ring-ocean outline-none transition-all text-white" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Tags</label>
                    <div className="bg-surface border border-white/10 rounded-lg px-4 py-2.5 flex flex-wrap gap-2 min-h-[46px]">
                       <span className="px-2 py-1 bg-ocean/10 border border-ocean/20 rounded text-xs text-ocean flex items-center gap-1">
                         {formData.category} <X className="w-3 h-3 cursor-pointer hover:text-white" />
                       </span>
                       <input type="text" className="bg-transparent outline-none flex-1 min-w-[100px] text-sm text-white" placeholder="Add tag..." />
                    </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-surface/50 flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={handleSaveDraft}>Save as Draft</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {product ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;