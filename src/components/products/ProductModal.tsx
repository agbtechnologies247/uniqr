import React, { useState } from 'react';
import { X, Package, Check, Sparkles, Layers, Sliders } from 'lucide-react';
import { Product, BuilderSection } from '../../types';
import { SectionFieldBuilder } from './SectionFieldBuilder';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
  initialProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'builder'>('basic');

  const [formData, setFormData] = useState<Partial<Product>>({
    name: initialProduct?.name || '',
    sku: initialProduct?.sku || `AGB-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    brand: initialProduct?.brand || 'UniQR Industrial',
    manufacturer: initialProduct?.manufacturer || 'AGB Technologies Ltd',
    description: initialProduct?.description || '',
    category: initialProduct?.category || 'Fitness Equipment',
    hsn: initialProduct?.hsn || '95069190',
    gst: initialProduct?.gst || 18,
    batchNumber: initialProduct?.batchNumber || `BATCH-2026-${Math.floor(10 + Math.random() * 90)}`,
    serialNumber: initialProduct?.serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
    mfgDate: initialProduct?.mfgDate || new Date().toISOString().split('T')[0],
    expDate: initialProduct?.expDate || '2036-12-31',
    warrantyMonths: initialProduct?.warrantyMonths || 36,
    tags: initialProduct?.tags || ['UniQR', 'Industrial'],
    location: initialProduct?.location || 'Warehouse A-1',
    supplier: initialProduct?.supplier || 'AGB Supply Chain',
    status: initialProduct?.status || 'Active',
    imageUrl: initialProduct?.imageUrl || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80',
    connectedApps: initialProduct?.connectedApps || ['Enterprise ERP', 'Warranty']
  });

  const [builderSections, setBuilderSections] = useState<BuilderSection[]>(
    initialProduct?.builderSections || [
      {
        id: 'sec-info',
        title: 'Product Information',
        category: 'Details',
        isSystemProtected: true,
        fields: [
          { id: 'f-name', name: 'Product Name', type: 'Text', value: initialProduct?.name || 'Unnamed Product', validation: { required: true, isPublic: true } },
          { id: 'f-sku', name: 'SKU Code', type: 'Barcode', value: initialProduct?.sku || 'AGB-SKU-1001', validation: { required: true, isPublic: true } }
        ]
      }
    ]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productToSave: Product = {
      id: initialProduct?.id || 'prod-' + Date.now(),
      uniqrCode: initialProduct?.uniqrCode || `UQ-${Math.random().toString(16).substr(2, 8).toUpperCase()}`,
      name: formData.name || 'Unnamed Product',
      sku: formData.sku || 'SKU-000',
      brand: formData.brand || 'UniQR Industrial',
      manufacturer: formData.manufacturer || 'AGB Technologies Ltd',
      description: formData.description || '',
      category: formData.category || 'General',
      hsn: formData.hsn || '0000',
      gst: Number(formData.gst) || 18,
      batchNumber: formData.batchNumber || 'BATCH-01',
      serialNumber: formData.serialNumber || 'SN-00',
      mfgDate: formData.mfgDate || '2026-01-01',
      expDate: formData.expDate || '2036-01-01',
      warrantyMonths: Number(formData.warrantyMonths) || 36,
      customFields: initialProduct?.customFields || { 'Quality Grade': 'A+' },
      builderSections,
      trailEvents: initialProduct?.trailEvents || [],
      imageUrl: formData.imageUrl,
      tags: formData.tags || [],
      location: formData.location || 'Depot',
      supplier: formData.supplier || 'Supplier',
      status: formData.status as any || 'Active',
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      connectedApps: formData.connectedApps || ['Enterprise ERP']
    };

    onSave(productToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5E3122]/60 backdrop-blur-md overflow-y-auto selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      <div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-2xl relative my-8 text-[#5E3122]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F7EAE0] flex items-center justify-center font-bold shadow-sm">
              <Package className="w-5 h-5 text-[#F9D2BA]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#1D4533]">
                {initialProduct ? 'Edit Product Record' : 'Register New Product'}
              </h2>
              <p className="text-xs text-[#5E3122] font-semibold">UNIQR Universal Product Identity Setup</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5E3122] hover:bg-[#F7EAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-[#F9D2BA] my-4">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all ${
              activeTab === 'basic'
                ? 'bg-[#1D4533] text-[#F7EAE0]'
                : 'text-[#5E3122] hover:bg-[#F7EAE0]'
            }`}
          >
            Basic Attributes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'builder'
                ? 'bg-[#1D4533] text-[#F7EAE0]'
                : 'text-[#5E3122] hover:bg-[#F7EAE0]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#F9D2BA]" />
            Notion/Airtable Block Builder
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === 'builder' ? (
            <SectionFieldBuilder
              sections={builderSections}
              onChangeSections={setBuilderSections}
            />
          ) : (
            <>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                placeholder="e.g. AERO-X Pro Fitness Dumbbell (20kg)"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                placeholder="e.g. AGB-FT-DB20"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                placeholder="e.g. UniQR Industrial"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Warranty (Months)</label>
              <input
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5E3122] mb-1">Product Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              placeholder="Product specs and detailed description..."
            />
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Batch Number</label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Serial Number</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">HSN Code</label>
              <input
                type="text"
                value={formData.hsn}
                onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">GST Tax %</label>
              <input
                type="number"
                value={formData.gst}
                onChange={(e) => setFormData({ ...formData, gst: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5E3122] mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
            />
          </div>
          </>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F9D2BA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#5E3122] font-extrabold border border-[#F9D2BA] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Check className="w-4 h-4 text-[#F9D2BA]" />
              <span>Save &amp; Register Identity</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
