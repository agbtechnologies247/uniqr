import React from 'react';
import { 
  Sparkles, ShieldCheck, Cpu, Network, Zap, Layers, Lock, Sliders, ArrowRight, QrCode
} from 'lucide-react';
import { Footer } from '../layout/Footer';
import { sound } from '../../services/audio';

interface FeaturesPageProps {
  onNavigate: (tab: string) => void;
  onOpenContactSales: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, onOpenContactSales }) => {
  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      <div className="py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto w-full flex-1">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Universal QR Capability Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#1D4533] tracking-tight">
            Comprehensive Platform Features &amp; Specifications
          </h1>

          <p className="text-sm sm:text-base text-[#5E3122] font-semibold leading-relaxed">
            UniQR turns static QR images into living product digital twins with dynamic field schema builders, SHA-256 tamper-evident ledgers, laser engraving cut specs, and REST API connectors.
          </p>
        </div>

        {/* 6 CORE FEATURE BLOCKS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">28+ Dynamic Field Schema Builder</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Configurable core identity parameters (SKU, VIN, HSN, Batch Lot, Serial ID, Expiry Date) and dynamic custom section builders.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">SHA-256 Tamper-Evident Ledger</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Every status update, inspection signoff, custody transfer, and maintenance scan is locked under cryptographic ledger hashes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">AI Predictive Maintenance Engine</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Automated failure probability scoring, telemetry threshold anomaly alerts, and scheduled service recommendations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">Neo4j Connected Graph Intelligence</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Map asset relationship trees: Component -&gt; Assembly -&gt; Factory Batch -&gt; Carrier Delivery -&gt; Warranty Owner.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">8192px Ultra High-Res &amp; Laser Vector Exports</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Export 8K PNG, SVG vector, or DXF laser engraving cut specifications for permanent metal and ceramic asset tagging.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1D4533]">Developer REST API &amp; Webhooks</h3>
            <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
              Programmatic product registration, JSON schema generation, OpenAPI 3.0 specs, and webhooks for ERP synchronization.
            </p>
          </div>

        </div>

      </div>

      <Footer onNavigate={onNavigate} onOpenContactSales={onOpenContactSales} />

    </div>
  );
};
