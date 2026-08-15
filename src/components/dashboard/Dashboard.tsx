import React from 'react';
import { 
  PlusCircle, 
  Camera, 
  Package, 
  FileSpreadsheet, 
  BarChart3, 
  Printer, 
  Zap, 
  ArrowUpRight, 
  QrCode, 
  Download, 
  Scan,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  Network
} from 'lucide-react';
import { Product, QrCodeRecord, ScanEvent } from '../../types';

interface DashboardProps {
  products: Product[];
  qrRecords: QrCodeRecord[];
  scans: ScanEvent[];
  quotaUsed: number;
  quotaLimit: number;
  setCurrentTab: (tab: string) => void;
  onOpenNewProduct: () => void;
  onOpenUpgrade: () => void;
  onSelectProductForQr: (p: Product) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  qrRecords,
  scans,
  quotaUsed,
  quotaLimit,
  setCurrentTab,
  onOpenNewProduct,
  onOpenUpgrade,
  onSelectProductForQr
}) => {
  const isLimitReached = quotaUsed >= quotaLimit;

  return (
    <div className="space-y-8 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* GREETING & QUOTA BANNER */}
      <div className="bg-[#1D4533] p-6 sm:p-8 rounded-3xl border border-[#F9D2BA]/30 relative overflow-hidden shadow-md text-[#F7EAE0]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F7EAE0]">
              Dashboard
            </h1>
            <p className="text-[#F9D2BA]/90 text-xs sm:text-sm mt-1 font-medium">
              Manage product identities, track scans, create passports, build intelligance and link applications.
            </p>
          </div>

          {/* Quota Progress Meter */}
          <div className="w-full md:w-80 p-4 rounded-2xl bg-[#5E3122] border border-[#F9D2BA]/30">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#F7EAE0] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#F9D2BA]" />
                <span>Free Plan Limit</span>
              </span>
              <span className="font-bold text-[#F9D2BA]">{quotaUsed} / {quotaLimit} QRs</span>
            </div>

            <div className="w-full h-2.5 bg-[#1D4533] rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-500 ${
                  isLimitReached 
                    ? 'bg-red-500' 
                    : 'bg-[#F9D2BA]'
                }`}
                style={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#F7EAE0]/70">10 Lifetime Free Cap</span>
              <button
                onClick={onOpenUpgrade}
                className="text-[11px] font-bold text-[#F9D2BA] hover:text-[#F7EAE0] flex items-center gap-0.5"
              >
                <span>Upgrade to Unlimited</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTION TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          onClick={() => setCurrentTab('qr-studio')}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Generate QR</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">Custom Studio</span>
        </button>

        <button
          onClick={onOpenNewProduct}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1D4533] text-[#F7EAE0] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <Package className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Add Entity</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">Single Record</span>
        </button>

        <button
          onClick={() => setCurrentTab('scanner')}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#5E3122] text-[#F7EAE0] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <Camera className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Scan QR</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">WebRTC Camera</span>
        </button>

        <button
          onClick={() => setCurrentTab('products')}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Bulk CSV</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">Import / Export</span>
        </button>

        <button
          onClick={() => setCurrentTab('graph')}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <Network className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Connected Intelligence</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">Asset Network</span>
        </button>

        <button
          onClick={() => setCurrentTab('analytics')}
          className="bg-white p-4 rounded-2xl border border-[#F9D2BA] flex flex-col items-center text-center group shadow-sm hover:border-[#1D4533] transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-[#F7EAE0] text-[#1D4533] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold">
            <BarChart3 className="w-6 h-6" />
          </div>
          <span className="font-bold text-xs text-[#1D4533]">Scan Telemetry</span>
          <span className="text-[10px] text-[#5E3122] mt-0.5 font-medium">Live Analytics</span>
        </button>
      </div>

      {/* RECENT PRODUCTS INVENTORY & SCAN AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Products List (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div>
              <h2 className="font-extrabold text-lg text-[#1D4533]">Active Entities & Identities</h2>
              <p className="text-xs text-[#5E3122] font-semibold mt-0.5">Total {products.length} registered entity identities</p>
            </div>
            <button
              onClick={() => setCurrentTab('products')}
              className="text-xs text-[#1D4533] font-extrabold hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#F7EAE0] p-4 rounded-2xl border border-[#F9D2BA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#F9D2BA]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#1D4533] border border-[#F9D2BA] flex items-center justify-center text-[#F9D2BA] font-bold text-xs">
                      UQ
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-[#1D4533] line-clamp-1">{product.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5E3122] font-medium mt-0.5">
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#F9D2BA] text-[#1D4533] font-bold">
                        {product.uniqrCode}
                      </span>
                      <span>SKU: {product.sku}</span>
                      <span className="text-[#1D4533] font-bold">● {product.warrantyMonths}m Warranty</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectProductForQr(product);
                      setCurrentTab('qr-studio');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#F9D2BA]" />
                    <span>Generate QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('builder')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9D2BA] text-[#1D4533] border border-[#F9D2BA] font-bold text-xs transition-all shadow-sm"
                  >
                    Passport
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Scans & Activity Feed (1 Column) */}
        <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <h2 className="font-extrabold text-lg text-[#1D4533]">Live Scan Stream</h2>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0]">
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {scans.slice(0, 5).map((scan) => (
              <div key={scan.id} className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between font-bold text-[#1D4533]">
                  <span className="truncate max-w-[170px]">{scan.productName}</span>
                  <span className="text-[10px] font-mono text-[#5E3122] font-bold">{scan.uniqrCode}</span>
                </div>
                <div className="flex items-center justify-between text-[#5E3122] text-[11px] font-medium">
                  <span>{scan.city}, {scan.country}</span>
                  <span className="text-[#5E3122]/80 font-mono">{new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-[#5E3122]">
                  <span className="bg-white px-2 py-0.5 rounded-md border border-[#F9D2BA] font-bold">{scan.device} ({scan.os})</span>
                  <span className="text-[#1D4533] font-bold">{scan.appSource}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
