import React, { useState } from 'react';
import { 
  Package, 
  PlusCircle, 
  Search, 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Edit3, 
  Copy,
  QrCode, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Layers,
  Cpu,
  Wrench,
  Building2,
  FileText,
  ClipboardList,
  Award,
  Users,
  Boxes,
  Truck,
  MapPin,
  ShieldCheck,
  Zap,
  Link as LinkIcon
} from 'lucide-react';
import { Product, EntityType } from '../../types';
import { sound } from '../../services/audio';
import { ENTITY_TYPE_DEFINITIONS, getEntitySchema } from '../../data/entitySchemas';

interface ProductListProps {
  products: Product[];
  onOpenNewProduct: () => void;
  onOpenCsvImport: () => void;
  onEditProduct: (p: Product) => void;
  onCloneProduct?: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSelectProductForQr: (p: Product) => void;
  onOpenPassport: (uniqrCode: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onOpenNewProduct,
  onOpenCsvImport,
  onEditProduct,
  onCloneProduct,
  onDeleteProduct,
  onSelectProductForQr,
  onOpenPassport
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Entity Type Filter Tabs
  const entityTypeFilterTabs = [
    { id: 'All', label: `All Entities (${products.length})` },
    { id: 'product', label: 'Products', icon: Package },
    { id: 'machine', label: 'Machines', icon: Cpu },
    { id: 'equipment', label: 'Equipment & Tools', icon: Wrench },
    { id: 'asset', label: 'Assets', icon: Building2 },
    { id: 'location', label: 'Locations', icon: MapPin },
    { id: 'document', label: 'Documents & SOPs', icon: FileText },
    { id: 'work_order', label: 'Work Orders', icon: ClipboardList },
    { id: 'certificate', label: 'Certificates', icon: Award },
    { id: 'customer', label: 'Customers', icon: Users },
    { id: 'batch', label: 'Batches', icon: Boxes },
    { id: 'shipment', label: 'Shipments', icon: Truck }
  ];

  const filteredProducts = products.filter(p => {
    const pType = p.entityType || 'product';
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          p.uniqrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedTypeFilter === 'All' || pType === selectedTypeFilter;
    const matchesStatus = selectedStatusFilter === 'All' || p.status === selectedStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate pagination bounds
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const exportCsv = () => {
    sound.playClick();
    const headers = ['uniqrCode', 'name', 'entityType', 'identityNumber', 'brandOrManufacturer', 'category', 'status', 'qrPurpose'];
    const csvLines = [headers.join(',')];
    products.forEach(p => {
      csvLines.push([
        p.uniqrCode,
        `"${p.name.replace(/"/g, '""')}"`,
        p.entityType || 'product',
        p.identityNumber || p.sku || '',
        `"${(p.brand || p.manufacturer || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        p.status || 'Active',
        p.qrPurpose || 'authentication'
      ].join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uniqr-entities-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── HEADER BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0]">
              Universal Entity Core
            </span>
            <span className="text-[10px] font-bold text-[#5E3122]">
              {products.length} Registered Entities
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D4533] flex items-center gap-2 mt-1">
            <Layers className="w-6 h-6 text-[#1D4533]" />
            <span>Universal Identity & Entity Repository</span>
          </h1>
          <p className="text-xs text-[#5E3122] mt-0.5 font-medium">
            Manage products, machines, documents, work orders, certificates, and assets with permanent QR identities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2.5 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-[#1D4533]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCsvImport}
            className="px-3.5 py-2.5 rounded-xl border border-[#F9D2BA] bg-white hover:bg-[#F7EAE0] text-[#1D4533] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#1D4533]" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="px-5 py-2.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#F9D2BA]" />
            <span>Create Universal Entity</span>
          </button>
        </div>
      </div>

      {/* ─── ENTITY TYPE FILTER PILLS ─── */}
      <div className="bg-white p-3 rounded-2xl border border-[#F9D2BA] shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        {entityTypeFilterTabs.map(tab => {
          const Icon = tab.icon;
          const isSelected = selectedTypeFilter === tab.id;
          const count = tab.id === 'All' 
            ? products.length 
            : products.filter(p => (p.entityType || 'product') === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedTypeFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                  : 'bg-[#F7EAE0]/50 text-[#5E3122] hover:bg-[#F9D2BA]/60'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F9D2BA]' : 'text-[#5E3122]'}`} />}
              <span>{tab.label}</span>
              {tab.id !== 'All' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-[#F7EAE0]' : 'bg-[#5E3122]/10 text-[#5E3122]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── SEARCH & STATUS BAR ─── */}
      <div className="bg-white p-4 rounded-2xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#5E3122] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, SKU, code or brand..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7EAE0]/40 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5E3122]">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => {
                setSelectedStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl border border-[#F9D2BA] bg-[#F7EAE0]/40 text-xs font-bold text-[#1D4533]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Inspection">Under Inspection</option>
              <option value="Repair">Repair / Maintenance</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <span className="text-xs font-bold text-[#5E3122]">
            Showing <strong className="text-[#1D4533]">{filteredProducts.length}</strong> of {products.length}
          </span>
        </div>
      </div>

      {/* ─── ENTITY CARDS GRID ─── */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#F9D2BA] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#F7EAE0] text-[#1D4533] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#1D4533]">No matching entities found</h3>
            <p className="text-xs text-[#5E3122] font-semibold mt-1">Try adjusting your filters or create a new entity identity.</p>
          </div>
          <button
            onClick={onOpenNewProduct}
            className="px-5 py-2.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-bold text-xs inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#F9D2BA]" /> Create Universal Entity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProducts.map(prod => {
            const eType = prod.entityType || 'product';
            const schema = getEntitySchema(eType);
            const TypeIcon = schema.icon;
            const isExpanded = expandedId === prod.id;
            const relCount = prod.relationships?.length || 0;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#F9D2BA] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span 
                        className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: schema.bgColor, color: schema.color, border: `1px solid ${schema.borderColor}` }}
                      >
                        <TypeIcon className="w-3 h-3" />
                        {schema.label.split('/')[0].trim()}
                      </span>

                      {prod.status && (
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                          prod.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : prod.status === 'Under Inspection'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prod.status}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[10px] font-extrabold text-[#1D4533] px-2 py-0.5 rounded bg-[#F7EAE0]">
                      {prod.uniqrCode}
                    </span>
                  </div>

                  {/* Name & Identity */}
                  <div>
                    <h3 className="font-extrabold text-base text-[#1D4533] group-hover:text-[#5E3122] transition-colors leading-tight">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#5E3122] font-medium line-clamp-2 mt-1">
                      {prod.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Key Metadata Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F9D2BA]/60 text-[11px]">
                    <div className="p-2 rounded-xl bg-[#F7EAE0]/50">
                      <span className="text-[9px] font-extrabold uppercase text-[#5E3122] block">{schema.identityLabel}</span>
                      <span className="font-mono font-bold text-[#1D4533] truncate block">{prod.sku || prod.identityNumber || 'N/A'}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-[#F7EAE0]/50">
                      <span className="text-[9px] font-extrabold uppercase text-[#5E3122] block">Brand / Authority</span>
                      <span className="font-bold text-[#1D4533] truncate block">{prod.brand || prod.manufacturer || 'AGB Industrial'}</span>
                    </div>
                  </div>

                  {/* Relationship & Connected Nodes */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#5E3122]">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-[#1D4533]" />
                      <strong>{relCount}</strong> Linked Entities
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#1D4533]" />
                      Purpose: <strong>{(prod.qrPurpose || 'auth').replace('_', ' ')}</strong>
                    </span>
                  </div>

                  {/* Collapsible Details */}
                  {isExpanded && (
                    <div className="p-3 rounded-xl bg-[#F7EAE0]/60 space-y-2 text-xs border border-[#F9D2BA] animate-fadeIn">
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-[#5E3122]">
                        <div>Serial: <strong className="text-[#1D4533]">{prod.serialNumber || 'N/A'}</strong></div>
                        <div>HSN: <strong className="text-[#1D4533]">{prod.hsn || 'N/A'}</strong></div>
                        <div>Mfg Date: <strong className="text-[#1D4533]">{prod.mfgDate || 'N/A'}</strong></div>
                        <div>Warranty: <strong className="text-[#1D4533]">{prod.warrantyMonths ? `${prod.warrantyMonths} Mo` : 'N/A'}</strong></div>
                      </div>
                      {prod.customFields && Object.keys(prod.customFields).length > 0 && (
                        <div className="pt-2 border-t border-[#F9D2BA]/60 space-y-1">
                          <span className="text-[9px] font-extrabold uppercase text-[#5E3122] block">Custom Fields:</span>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(prod.customFields).slice(0, 4).map(([k, v]) => (
                              <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-white font-bold text-[#1D4533] border border-[#F9D2BA]/60">
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#F9D2BA] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : prod.id)}
                    className="text-[11px] font-bold text-[#5E3122] hover:text-[#1D4533] flex items-center gap-0.5"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenPassport(prod.uniqrCode)}
                      title="Open Public Passport"
                      className="p-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProductForQr(prod)}
                      title="Customize QR in Studio"
                      className="p-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProduct(prod)}
                      title="Edit Universal Entity"
                      className="p-2 rounded-xl bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122] transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (onCloneProduct) onCloneProduct(prod);
                      }}
                      title="Clone / Duplicate Universal Entity"
                      className="p-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteProduct(prod.id)}
                      title="Delete Entity"
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── PAGINATION ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#F9D2BA] shadow-sm">
          <div className="text-xs font-bold text-[#5E3122]">
            Page {validCurrentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="p-2 rounded-xl bg-[#F7EAE0] disabled:opacity-40 text-[#1D4533] hover:bg-[#F9D2BA]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold ${
                  validCurrentPage === i + 1
                    ? 'bg-[#1D4533] text-[#F7EAE0]'
                    : 'bg-[#F7EAE0] text-[#5E3122] hover:bg-[#F9D2BA]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="p-2 rounded-xl bg-[#F7EAE0] disabled:opacity-40 text-[#1D4533] hover:bg-[#F9D2BA]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
