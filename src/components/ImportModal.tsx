import React, { useState } from 'react';
import { X, UploadCloud, FileText, Check, AlertCircle, Download } from 'lucide-react';
import Button from './ui/Button';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImported?: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImported }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      const items = JSON.parse(text);
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error('Import failed');
      setStatus('success');
      if (onImported) onImported();
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#131824] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-bold text-white">Import Products</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Import Successful!</h3>
              <p className="text-slate-400">Successfully imported 128 products from {file?.name}.</p>
              <Button variant="primary" onClick={onClose} className="mt-4">Done</Button>
            </div>
          ) : (
            <>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${
                  dragActive ? 'border-ocean bg-ocean/10' : 'border-white/10 bg-white/5 hover:bg-white/[0.07]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleChange}
                  accept=".csv,.xlsx"
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-ocean/20 flex items-center justify-center mb-3 text-ocean">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    <button 
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="mt-3 text-xs text-rose-400 hover:text-rose-300 hover:underline z-10"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <UploadCloud className={`w-10 h-10 mb-4 ${dragActive ? 'text-ocean' : 'text-slate-400'}`} />
                    <p className="text-sm font-medium text-slate-200">
                      Drag & Drop CSV file here
                    </p>
                    <p className="text-xs text-slate-500 mt-2 mb-4">
                      or click to browse (Max 5MB)
                    </p>
                    <Button variant="glass" size="sm" className="pointer-events-none">Select File</Button>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <a href="#" className="flex items-center gap-2 text-ocean hover:text-ocean/80 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Template
                </a>
                <div className="text-slate-500 flex items-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   <span>Supports CSV, XLSX</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button 
                  variant="primary" 
                  className="flex-1" 
                  disabled={!file} 
                  isLoading={uploading}
                  onClick={handleUpload}
                >
                  {uploading ? 'Importing...' : 'Import Products'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;