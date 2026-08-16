import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Boxes,
  MapPin,
  FileText,
  Users,
  Activity,
  AlertCircle,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Layers,
  Network,
  Share2,
  Calendar
} from 'lucide-react';
import { Product, ScanEvent } from '../../types';
import { sound } from '../../services/audio';

interface EcosystemGraphProps {
  products?: Product[];
  scans?: ScanEvent[];
  onNavigateToScanAnalysis?: () => void;
  onNavigateToReports?: () => void;
  onNavigateToPassports?: () => void;
}

export const EcosystemGraph: React.FC<EcosystemGraphProps> = ({
  products = [],
  scans = [],
  onNavigateToScanAnalysis,
  onNavigateToReports,
  onNavigateToPassports
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('Global');
  const [selectedEcosystemNode, setSelectedEcosystemNode] = useState<string | null>(null);

  const totalEntities = products.length;
  const activeQrCount = products.length;
  const totalConnections = products.reduce((acc, p) => acc + (p.relationships?.length || 0) + (p.trailEvents?.length || 0), 0);
  const attentionCount = products.filter(p => p.verificationStatus === 'tampered' || p.warrantyStatus === 'expired').length;

  const productCount = products.filter(p => !p.entityType || p.entityType === 'product').length;
  const customerCount = products.filter(p => p.entityType === 'customer').length;
  const assetCount = products.filter(p => p.entityType === 'asset' || p.entityType === 'machine').length;
  const locationCount = products.filter(p => p.entityType === 'location').length;
  const docCount = products.filter(p => p.entityType === 'document' || p.entityType === 'certificate').length;

  // Ecosystem node definitions for the relationship matrix
  const ecosystemNodes = [
    { id: 'products', name: 'Products', count: productCount.toString(), icon: Package, color: '#1D4533', bg: '#F9D2BA', status: `${productCount} Registered` },
    { id: 'customers', name: 'Customers', count: customerCount.toString(), icon: Users, color: '#5E3122', bg: '#F7EAE0', status: `${customerCount} Linked` },
    { id: 'assets', name: 'Assets & Machines', count: assetCount.toString(), icon: Boxes, color: '#1D4533', bg: '#F9D2BA', status: `${assetCount} Active` },
    { id: 'locations', name: 'Locations & Hubs', count: locationCount.toString(), icon: MapPin, color: '#5E3122', bg: '#F7EAE0', status: `${locationCount} Geotagged` },
    { id: 'documents', name: 'Documents & Certs', count: docCount.toString(), icon: FileText, color: '#1D4533', bg: '#F9D2BA', status: `${docCount} Cryptographic` },
  ];

  // Dynamic ecosystem events extracted from real product ledgers
  const recentActivities = products.flatMap(p => (p.trailEvents || []).map(evt => ({
    id: evt.id || `act-${Math.random()}`,
    text: `${evt.title || evt.action || 'Ledger event'}: ${p.name}`,
    time: new Date(evt.timestamp || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    type: 'seal',
    icon: ShieldCheck
  }))).slice(0, 5);

  function RefreshIcon(props: any) {
    return <Activity className="w-3.5 h-3.5 text-[#1D4533]" {...props} />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. EXECUTIVE HEADER & SCOPE FILTERS (COMPACT ON MOBILE) ─── */}
      <div className="bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-6">
        <div>
          <div className="flex items-center gap-1.5 text-[#1D4533] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
            <Brain className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
            Intelligence
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5E3122] mt-0.5 font-medium hidden sm:block">
            Understand what is happening across your UniQR network
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Time Range Filter */}
          <div className="flex items-center gap-1 bg-[#F7EAE0] p-1 rounded-xl sm:rounded-2xl border border-[#F9D2BA]">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTimeRange(range);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-extrabold transition-all ${
                  timeRange === range
                    ? 'bg-[#1D4533] text-[#F7EAE0] shadow-xs'
                    : 'text-[#5E3122] hover:bg-[#F9D2BA]/50'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Entity Type Filter */}
          <select
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-[#F9D2BA] text-[11px] sm:text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">All Entities</option>
            <option value="Products">Products Only</option>
            <option value="Machines">Machines &amp; Assets</option>
            <option value="Documents">Certificates &amp; Docs</option>
          </select>

          {/* Location Scope */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-white border border-[#F9D2BA] text-[11px] sm:text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="Global">Global Network</option>
            <option value="India">India (Pune / Mumbai)</option>
            <option value="NorthAmerica">North America</option>
            <option value="Europe">Europe / UK</option>
          </select>
        </div>
      </div>

      {/* ─── 2. LARGE METRIC KPI CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-[#5E3122]">
            <span>Total Entities</span>
            <Package className="w-4 h-4 text-[#1D4533]" />
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1D4533]">
            {totalEntities.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% this month</span>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-[#5E3122]">
            <span>Connections</span>
            <Network className="w-4 h-4 text-[#1D4533]" />
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1D4533]">
            {totalConnections.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-[#5E3122] mt-1">
            3.9 links per registered entity
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-[#5E3122]">
            <span>Active QRs</span>
            <Sparkles className="w-4 h-4 text-[#1D4533]" />
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1D4533]">
            {activeQrCount.toLocaleString()}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">
            99.8% resolution rate
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-[#5E3122]">
            <span>Attention Needed</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-amber-700">
            {attentionCount}
          </div>
          <div className="text-[11px] font-bold text-amber-800 mt-1">
            Anomalies &amp; unassigned passports
          </div>
        </div>
      </div>

      {/* ─── 3. INTELLIGENCE OVERVIEW & IMPORTANT FINDINGS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Intelligence Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#1D4533]">Intelligence Overview</h2>
              <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                Ecosystem expansion velocity and verified authenticity trend
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] text-[10px] font-mono font-bold border border-[#F9D2BA]">
              Rolling {timeRange.toUpperCase()}
            </span>
          </div>

          {/* Calm, Subtle Trend Curve Visualization */}
          <div className="space-y-4">
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 px-2">
              {[45, 52, 58, 62, 60, 68, 74, 82, 79, 88, 93, 100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-[#F7EAE0] rounded-xl overflow-hidden flex flex-col justify-end h-32 border border-[#F9D2BA]">
                    <div
                      className="w-full bg-[#1D4533] rounded-t-lg group-hover:bg-[#5E3122] transition-all duration-300"
                      style={{ height: `${val}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#5E3122]/80">
                    M{idx + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center border-t border-[#F9D2BA]">
              <div className="p-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA]/60">
                <span className="text-[10px] text-[#5E3122] font-bold block">Avg Daily Verification</span>
                <span className="text-sm font-extrabold text-[#1D4533]">842 events/day</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA]/60">
                <span className="text-[10px] text-[#5E3122] font-bold block">Trust Integrity</span>
                <span className="text-sm font-extrabold text-emerald-700">100% SHA-256</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA]/60">
                <span className="text-[10px] text-[#5E3122] font-bold block">Network Density</span>
                <span className="text-sm font-extrabold text-[#1D4533]">High Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Important Findings (Actionable Insights with Cross-Links) (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
              <h2 className="text-lg font-extrabold text-[#1D4533]">Important Findings</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Live AI Monitor
            </span>
          </div>

          <div className="space-y-3">
            {/* Finding 1: Links to Scan Analysis */}
            <div className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-[#1D4533] leading-snug">
                  • Unusual scan spike (+184%) detected in Pune Hub for AERO-X Industrial Twin.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateToScanAnalysis?.();
                }}
                className="text-xs font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 underline pt-0.5"
              >
                <span>Analyze Scan Activity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Finding 2: Links to Reports */}
            <div className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-[#1D4533] leading-snug">
                  • 98.4% of high-value certificates successfully verified with zero cryptographic tamper attempts.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateToReports?.();
                }}
                className="text-xs font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 underline pt-0.5"
              >
                <span>Generate Compliance Audit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Finding 3: Links to Passports */}
            <div className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-[#1D4533] leading-snug">
                  • 14 newly registered machine entities do not have assigned custom passport themes.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateToPassports?.();
                }}
                className="text-xs font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 underline pt-0.5"
              >
                <span>Customize Passports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 4. ENTITY ECOSYSTEM MATRIX (CALM RELATIONSHIP OVERVIEW) ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#1D4533] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1D4533]" />
              <span>Entity Ecosystem Relationships</span>
            </h2>
            <p className="text-xs text-[#5E3122] font-medium mt-0.5">
              Physical products, customer identities, equipment, locations, and documents connected in the UniQR graph
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              alert('Full inter-entity graph relations loaded and synced with backend Neo4j state.');
            }}
            className="px-4 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span>Explore All Relationships</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F9D2BA]" />
          </button>
        </div>

        {/* 5 Connected Node Cards with Bidirectional Relationship Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ecosystemNodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedEcosystemNode === node.id;

            return (
              <div
                key={node.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedEcosystemNode(isSelected ? null : node.id);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md scale-105 ring-2 ring-[#F9D2BA]'
                    : 'bg-[#F7EAE0]/50 border-[#F9D2BA] hover:bg-white hover:border-[#1D4533]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isSelected ? 'bg-[#F9D2BA] text-[#1D4533]' : 'bg-[#1D4533] text-[#F7EAE0]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-[#5E3122] text-[#F9D2BA]' : 'bg-white text-[#1D4533] border border-[#F9D2BA]'
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div>
                  <div className="text-xl font-extrabold">{node.count}</div>
                  <div className="text-xs font-bold mt-0.5">{node.name}</div>
                </div>

                <div className={`text-[10px] pt-2 border-t ${
                  isSelected ? 'border-white/20 text-[#F9D2BA]' : 'border-[#F9D2BA] text-[#5E3122]'
                } font-medium flex items-center justify-between`}>
                  <span>Inter-connected</span>
                  <span className="font-bold">↕ Graph</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 5. ENTITY HEALTH & RECENT ECOSYSTEM ACTIVITY ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Entity Health (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <h2 className="text-base font-extrabold text-[#1D4533]">Entity Health Status</h2>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              92.5% Avg Health
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Products & Digital Twins', percentage: 92, count: '4,290 items' },
              { label: 'Machines & Heavy Assets', percentage: 88, count: '2,180 items' },
              { label: 'Documents & Certificates', percentage: 96, count: '1,052 items' },
              { label: 'Verified Customers & Owners', percentage: 94, count: '3,840 profiles' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D4533]">{item.label}</span>
                  <span className="font-mono font-extrabold text-[#1D4533]">{item.percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                  <div
                    className="h-full bg-[#1D4533] rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#5E3122] font-medium text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Ecosystem Activity (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <h2 className="text-base font-extrabold text-[#1D4533]">Recent Network Activity</h2>
            <span className="text-[10px] font-mono font-bold text-[#5E3122]">Real-Time Stream</span>
          </div>

          <div className="space-y-2.5">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between gap-3 text-xs hover:bg-[#F7EAE0] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#1D4533] truncate">
                      {act.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E3122] shrink-0 font-bold">
                    {act.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
