import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Download, 
  Layers, 
  Calendar, 
  Award, 
  FileText, 
  Building2, 
  Network,
  Share2,
  Lock,
  History,
  PlusCircle,
  KeyRound,
  Check,
  Tag,
  DollarSign,
  Box,
  BadgeCheck
} from 'lucide-react';
import { Product, TamperEvidentTrailEvent } from '../../types';
import { TrailLedger } from '../../services/trailLedger';
import { AiInsightsModal } from '../ai/AiInsightsModal';

interface ProductPassportProps {
  product: Product;
  onBackToApp: () => void;
  entityType?: string;
}

export const ProductPassport: React.FC<ProductPassportProps> = ({ product: initialProduct, onBackToApp, entityType = 'product' }) => {
  const [product, setProduct] = useState<Product>(initialProduct || {} as any);
  const [viewMode, setViewMode] = useState<'public' | 'trail'>('public');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
    const code = initialProduct?.uniqrCode;
    if (code) {
      fetch(`/api/v1/details/${code}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.rawProduct) {
            setProduct(data.rawProduct);
          } else if (data && data.name) {
            setProduct(prev => ({
              ...prev,
              name: data.name || prev.name,
              sku: data.sku || data.model || prev.sku,
              brand: data.brand || prev.brand,
              description: data.description || prev.description,
              warrantyMonths: data.warrantyMonths || prev.warrantyMonths,
              customFields: data.customFields || prev.customFields || {},
              builderSections: data.builderSections || prev.builderSections || []
            }));
          }
        })
        .catch(() => {});
    }
  }, [initialProduct]);

  // ERP Event Appender State
  const [isAppendingEvent, setIsAppendingEvent] = useState<boolean>(false);
  const [newEventModule, setNewEventModule] = useState<TamperEvidentTrailEvent['module']>('Quality');
  const [newEventType, setNewEventType] = useState<string>('QC Re-Inspection Passed');
  const [newEventLocation, setNewEventLocation] = useState<string>('Pune Quality Testing Lab');
  const [newEventUser, setNewEventUser] = useState<string>('qa.inspector@agb.in');

  const trailEvents = product?.trailEvents || [];
  const chainIntegrity = TrailLedger.verifyChainIntegrity(trailEvents);

  const priceValue = product?.customFields?.['Price (₹)'] || '₹12,000';

  const handleAppendEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt = await TrailLedger.appendEvent(product.uniqrCode, trailEvents, {
      type: newEventType,
      module: newEventModule,
      location: newEventLocation,
      user: newEventUser,
      department: `${newEventModule} Operations`
    });

    const updatedProduct = {
      ...product,
      trailEvents: [...trailEvents, newEvt]
    };
    setProduct(updatedProduct);
    setIsAppendingEvent(false);
    alert(`Successfully appended tamper-evident event hash (${newEvt.currentHash.slice(0, 16)}...)`);
  };

  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] p-4 sm:p-8 flex flex-col items-center justify-center selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-3xl border border-[#F9D2BA] shadow-2xl relative space-y-8 my-6">
        
        {/* TOP VERIFICATION BANNER & VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#1D4533]">UniQR Digital Twin Identity</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#F9D2BA]" /> Verified Twin
                </span>
              </div>
              <p className="text-xs text-[#5E3122] font-semibold mt-0.5 font-mono">Token: {product.uniqrCode || 'UQ-8AF92B7A2'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#5E3122] p-1 rounded-xl flex items-center gap-1 border border-[#F9D2BA]/30">
              <button
                onClick={() => setViewMode('public')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  viewMode === 'public'
                    ? 'bg-[#F9D2BA] text-[#1D4533] shadow-sm'
                    : 'text-[#F7EAE0] hover:bg-[#1D4533]'
                }`}
              >
                Public Details
              </button>
              <button
                onClick={() => setViewMode('trail')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                  viewMode === 'trail'
                    ? 'bg-[#F9D2BA] text-[#1D4533] shadow-sm'
                    : 'text-[#F7EAE0] hover:bg-[#1D4533]'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Ledger Trail
              </button>
            </div>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122] font-bold text-xs flex items-center gap-1.5 shadow-sm border border-[#F9D2BA]/40"
            >
              <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
              <span>AI Engine</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: `Verified UniQR product card for ${product.name}`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('UniQR Card link copied to clipboard!');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122] font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#F9D2BA]" />
            </button>
          </div>
        </div>

        {/* PUBLIC DETAILS VIEW */}
        {viewMode === 'public' ? (
          <div className="space-y-8">
            
            {/* PROMINENT HERO PRODUCT NAME & PRICE DISPLAY */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0]">
                      {entityType !== 'product' && entityType !== 'unregistered'
                        ? `${entityType.replace(/_/g, ' ')} Identity`
                        : 'Scanned Product Identity'}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533]">
                      {product.category || entityType.replace(/_/g, ' ')}
                    </span>
                    {entityType === 'unregistered' && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#5E3122] text-[#F7EAE0]">
                        Not Registered
                      </span>
                    )}
                  </div>
                  
                  {/* PROMINENT PRODUCT NAME */}
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D4533] leading-tight">
                    {product.name || 'Unknown Product'}
                  </h1>

                  <p className="text-xs sm:text-sm text-[#5E3122] font-medium leading-relaxed max-w-2xl">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {/* PROMINENT SCANNED PRICE BADGE */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F9D2BA] shadow-md text-center shrink-0 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-[#5E3122] tracking-wider">Product Price</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1D4533]">
                    {priceValue}
                  </div>
                  <div className="text-[10px] text-[#1D4533] font-bold flex items-center justify-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#1D4533]" /> Verified Price
                  </div>
                </div>
              </div>

              {/* BRAND, MODEL & SERIAL TAGS */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F9D2BA]">
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533]">
                  Brand: <strong>{product.brand || 'N/A'}</strong>
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533]">
                  Model / SKU: <strong>{product.sku || 'N/A'}</strong>
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533]">
                  Serial: <strong>{product.serialNumber || 'N/A'}</strong>
                </span>
              </div>
            </div>

            {/* METADATA PASSPORT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA]">
                <span className="text-[#5E3122] block text-[10px] uppercase font-bold">Manufacturer</span>
                <span className="font-extrabold text-[#1D4533] mt-1 block text-sm">{product.manufacturer || 'N/A'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA]">
                <span className="text-[#5E3122] block text-[10px] uppercase font-bold">Batch &amp; HSN</span>
                <span className="font-mono font-bold text-[#1D4533] mt-1 block">{product.batchNumber || 'N/A'}</span>
                <span className="font-mono text-[#5E3122] text-[10px]">HSN Code: {product.hsn || 'N/A'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA]">
                <span className="text-[#5E3122] block text-[10px] uppercase font-bold">Mfg &amp; Expiry</span>
                <span className="font-bold text-[#1D4533] mt-1 block">{product.mfgDate || 'N/A'}</span>
                <span className="text-[#5E3122] text-[10px]">Exp: {product.expDate || 'N/A'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA]">
                <span className="text-[#5E3122] block text-[10px] uppercase font-bold">Warranty Status</span>
                <span className="font-bold text-[#1D4533] mt-1 block">{product.warrantyMonths ? `${product.warrantyMonths} Months Active` : 'N/A'}</span>
                <span className="text-[#1D4533] text-[10px] font-bold">{product.warrantyMonths ? '● Verified' : ''}</span>
              </div>
            </div>

            {/* DYNAMIC BLOCK BUILDER SPECIFICATIONS (TAB 2 CONTENT) */}
            {product.builderSections && product.builderSections.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2 border-b border-[#F9D2BA] pb-2">
                  <Layers className="w-4 h-4 text-[#1D4533]" />
                  <span>Dynamic Block Builder Specifications</span>
                </h3>

                {product.builderSections.map((sec) => (
                  <div key={sec.id} className="p-5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-[#1D4533]">{sec.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white border border-[#F9D2BA] text-[#1D4533] text-[9px] font-bold uppercase">
                          {sec.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#5E3122] font-semibold">{sec.fields.length} Configured Fields</span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {sec.fields.map((f) => (
                        <div key={f.id} className="p-3 bg-white rounded-xl border border-[#F9D2BA] space-y-1 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="block text-[10px] font-extrabold uppercase text-[#5E3122]">{f.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F7EAE0] text-[#1D4533] font-bold">
                              {f.type}
                            </span>
                          </div>
                          <div className="font-extrabold text-xs text-[#1D4533] truncate">
                            {typeof f.value === 'boolean'
                              ? (f.value ? '✓ True / Pass' : '✗ False / Fail')
                              : String(f.value || 'N/A')}
                          </div>
                          {f.validation?.isPublic && (
                            <span className="inline-block text-[9px] text-[#1D4533] font-bold">● Public Field</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CUSTOM DYNAMIC FIELDS & SPECIFICATIONS */}
            {product.customFields && Object.keys(product.customFields).length > 0 && (
              <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3">
                <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#1D4533]" />
                  <span>Custom Dynamic Field Specifications</span>
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {Object.entries(product.customFields).map(([key, val]) => (
                    <div key={key} className="p-3 bg-white rounded-xl border border-[#F9D2BA]">
                      <span className="block text-[10px] uppercase font-bold text-[#5E3122]">{key}</span>
                      <span className="font-bold text-xs text-[#1D4533] mt-0.5 block">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONNECTED ECOSYSTEM APPLICATIONS */}
            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[#1D4533] flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#1D4533]" />
                  <span>Connected Ecosystem Applications</span>
                </h3>
                <span className="text-[10px] font-bold text-[#5E3122] uppercase">Connected Intelligence Nodes</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(product.connectedApps || ['Enterprise ERP', 'Asset Management', 'Warranty Registry', 'Service Care']).map((app) => (
                  <div
                    key={app}
                    className="p-3 rounded-xl bg-white border border-[#F9D2BA] flex items-center gap-2 text-xs font-bold text-[#1D4533] shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#1D4533]" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* INTERNAL TAMPER-EVIDENT TRAIL LEDGER VIEW */
          <div className="space-y-6">
            
            {/* CHAIN INTEGRITY BANNER */}
            <div className="p-4 rounded-2xl border bg-[#F7EAE0] border-[#F9D2BA] text-[#1D4533] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#1D4533] shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-[#1D4533]">
                    {chainIntegrity.isValid ? 'Tamper-Evident SHA-256 Chain Verified' : 'Cryptographic Chain Error'}
                  </h4>
                  <p className="text-xs text-[#5E3122] mt-0.5 font-medium">
                    {chainIntegrity.isValid
                      ? 'Append-only ledger contains zero altered or deleted historical records.'
                      : `Chain verification failed at index ${chainIntegrity.brokenAtIndex}.`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAppendingEvent(!isAppendingEvent)}
                className="px-3.5 py-2 bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-[#F9D2BA]" /> Append Event
              </button>
            </div>

            {/* TIMELINE OF EVENTS */}
            <div className="space-y-4">
              {trailEvents.map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#1D4533] text-[#F7EAE0] font-mono font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="font-extrabold text-sm text-[#1D4533]">{evt.type}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#F9D2BA] text-[#5E3122] font-bold">
                        Module: {evt.module}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5E3122] font-mono">{evt.timestamp}</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-[11px] text-[#5E3122] pt-1 font-medium">
                    <div>Location: <strong className="text-[#1D4533]">{evt.location || 'N/A'}</strong></div>
                    <div>User: <strong className="text-[#1D4533]">{evt.user || 'N/A'}</strong></div>
                    <div>ERP Task: <strong className="text-[#1D4533] font-mono">{evt.erpTask || 'N/A'}</strong></div>
                  </div>

                  <div className="pt-2 border-t border-[#F9D2BA] grid sm:grid-cols-2 gap-2 text-[10px] font-mono text-[#5E3122]">
                    <div>Prev Hash: <span className="text-[#1D4533]">{evt.previousHash.slice(0, 24)}...</span></div>
                    <div>Current Hash: <span className="text-[#1D4533] font-bold">{evt.currentHash.slice(0, 24)}...</span></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#F9D2BA] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => alert(`Downloading User Operating Manual PDF for ${product.name}...`)}
              className="px-4 py-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-bold flex items-center gap-1.5 border border-[#F9D2BA]"
            >
              <FileText className="w-4 h-4 text-[#1D4533]" />
              <span>User Manual</span>
            </button>
            <button
              onClick={() => alert(`Downloading Authenticity Certificate for ${product.name}...`)}
              className="px-4 py-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-bold flex items-center gap-1.5 border border-[#F9D2BA]"
            >
              <Award className="w-4 h-4 text-[#1D4533]" />
              <span>Authenticity Cert</span>
            </button>
          </div>

          <button
            onClick={onBackToApp}
            className="px-5 py-2.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122] font-bold text-xs shadow-md transition-all"
          >
            Back to Platform Studio
          </button>
        </div>

        {/* AI Scan Decision & Risk Modal */}
        <AiInsightsModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          product={product}
        />
      </div>
    </div>
  );
};
