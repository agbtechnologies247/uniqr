import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Smartphone,
  Globe,
  ShieldCheck,
  Clock,
  Layers,
  Filter,
  Search,
  Download,
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  QrCode,
  Laptop,
  Check
} from 'lucide-react';
import { ScanEvent, Product } from '../../types';
import { sound } from '../../services/audio';

interface AnalyticsDashboardProps {
  scans: ScanEvent[];
  products?: Product[];
  onNavigateToReports?: () => void;
  onOpenPassport?: (uniqrCode: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  scans = [],
  products = [],
  onNavigateToReports,
  onOpenPassport
}) => {
  const [dateFilter, setDateFilter] = useState<string>('30d');
  const [qrFilter, setQrFilter] = useState<string>('All');
  const [entityFilter, setEntityFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [deviceFilter, setDeviceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTableQuery, setSearchTableQuery] = useState<string>('');
  const [distributionTab, setDistributionTab] = useState<'entity' | 'qr' | 'device' | 'browser'>('entity');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Build scan list from real scans or fallback
  const baseScans = scans.map(s => ({
    id: s.id || `sc-${Math.random().toString(36).substring(2, 7)}`,
    uniqrCode: s.uniqrCode || 'UQ-TOKEN',
    entityName: s.productName || 'Product Identity',
    entityType: 'Product',
    city: s.city || 'Pune',
    country: s.country || 'India',
    device: s.device || s.os || 'Mobile',
    browser: s.browser || 'Chrome Mobile',
    status: s.status || 'Success',
    timestamp: s.timestamp || new Date().toISOString(),
    ip: s.ip || '127.0.0.1',
    latency: '34ms'
  }));

  const totalScans = scans.length;
  const uniqueDevices = new Set(scans.map(s => s.device || s.os)).size;
  const successfulScans = scans.filter(s => s.status !== 'Failed').length;
  const failedScans = scans.filter(s => s.status === 'Failed').length;

  // Filtered scans table
  const filteredScanEvents = baseScans.filter((s) => {
    const matchesSearch = 
      s.uniqrCode.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      s.entityName.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      s.device.toLowerCase().includes(searchTableQuery.toLowerCase());
    
    const matchesQr = qrFilter === 'All' || s.uniqrCode === qrFilter;
    const matchesEntity = entityFilter === 'All' || s.entityType === entityFilter;
    const matchesLocation = locationFilter === 'All' || s.city === locationFilter;
    const matchesDevice = deviceFilter === 'All' || s.device.includes(deviceFilter);
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Success' ? s.status === 'Success' : s.status !== 'Success');

    return matchesSearch && matchesQr && matchesEntity && matchesLocation && matchesDevice && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredScanEvents.length / pageSize));
  const paginatedScans = filteredScanEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic distribution datasets from products and scans
  const entityDistribution = [
    { label: 'Products', count: products.filter(p => !p.entityType || p.entityType === 'product').length, pct: 50 },
    { label: 'Machines & Assets', count: products.filter(p => p.entityType === 'machine' || p.entityType === 'asset').length, pct: 25 },
    { label: 'Documents & Certificates', count: products.filter(p => p.entityType === 'document').length, pct: 15 },
    { label: 'Work Orders & Operations', count: products.filter(p => p.entityType === 'work_order').length, pct: 10 },
  ];

  const qrDistribution = products.slice(0, 4).map((p, idx) => ({
    label: `${p.uniqrCode} (${p.name})`,
    count: scans.filter(s => s.uniqrCode === p.uniqrCode).length,
    pct: Math.round(100 / Math.max(1, products.length))
  }));

  const deviceDistribution = [
    { label: 'Android Mobile', count: scans.filter(s => (s.os || s.device || '').toLowerCase().includes('android')).length, pct: 60 },
    { label: 'iOS Mobile (iPhone)', count: scans.filter(s => (s.os || s.device || '').toLowerCase().includes('ios')).length, pct: 30 },
    { label: 'Desktop (Chrome/Edge)', count: scans.filter(s => (s.device || '').toLowerCase().includes('desktop')).length, pct: 10 },
  ];

  const browserDistribution = [
    { label: 'Google Chrome / Mobile', count: 11200, pct: 61.2 },
    { label: 'Apple Safari / WebKit', count: 5120, pct: 28.0 },
    { label: 'Microsoft Edge / Samsung', count: 1973, pct: 10.8 },
  ];

  // Geographic top hubs
  const geoHubs = [
    { city: 'Pune', country: 'India', scans: 6840, share: '37.4%', latency: '32ms', status: 'High Traffic' },
    { city: 'Mumbai', country: 'India', scans: 4120, share: '22.5%', latency: '39ms', status: 'Normal' },
    { city: 'Bengaluru', country: 'India', scans: 2840, share: '15.5%', latency: '38ms', status: 'Normal' },
    { city: 'Delhi NCR', country: 'India', scans: 1980, share: '10.8%', latency: '29ms', status: 'Normal' },
    { city: 'London', country: 'UK', scans: 1240, share: '6.8%', latency: '68ms', status: 'Cross-Border' },
    { city: 'San Francisco', country: 'USA', scans: 890, share: '4.9%', latency: '82ms', status: 'Cross-Border' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. ANALYTICS WORKSPACE HEADER & MULTI-DIMENSIONAL FILTERS (COMPACT ON MOBILE) ─── */}
      <div className="bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#F9D2BA] pb-3 sm:pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#1D4533] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#F9D2BA]" />
              <span>Interactive Analytics</span>
            </div>
            <h1 className="text-lg sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
              Scan Analysis
            </h1>
            <p className="text-[11px] sm:text-sm text-[#5E3122] mt-0.5 font-medium hidden sm:block">
              Analyze QR scanning activity across devices, locations, and time
            </p>
          </div>

          {/* Cross-Link Action to Reports */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onNavigateToReports?.();
            }}
            className="px-3.5 py-2 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>Generate Report →</span>
          </button>
        </div>

        {/* Dense Interactive Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="today">Date: Today</option>
            <option value="7d">Date: Last 7 Days</option>
            <option value="30d">Date: Last 30 Days</option>
            <option value="90d">Date: Last 90 Days</option>
          </select>

          {/* QR Code Filter */}
          <select
            value={qrFilter}
            onChange={(e) => setQrFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">QR: All Codes</option>
            <option value="UQ-8AF92B7A2">UQ-8AF92B7A2</option>
            <option value="UQR-PROD-000001">UQR-PROD-000001</option>
            <option value="UQR-DOC-000002">UQR-DOC-000002</option>
          </select>

          {/* Entity Filter */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">Entity: All Types</option>
            <option value="Product">Products</option>
            <option value="Machine">Machines</option>
            <option value="Document">Documents</option>
            <option value="Asset">Assets</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">Location: All Cities</option>
            <option value="Pune">Pune, India</option>
            <option value="Mumbai">Mumbai, India</option>
            <option value="Delhi">Delhi, India</option>
            <option value="Bengaluru">Bengaluru, India</option>
            <option value="London">London, UK</option>
          </select>

          {/* Device Filter */}
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">Device: All OS</option>
            <option value="Android">Android Only</option>
            <option value="iOS">iOS (Apple)</option>
            <option value="Windows">Desktop PC</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F7EAE0]/50 border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
          >
            <option value="All">Status: All Scans</option>
            <option value="Success">Success Only</option>
            <option value="Failed">Failed / Challenge</option>
          </select>
        </div>
      </div>

      {/* ─── 2. 4 TOP ANALYTICS KPI CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="text-xs text-[#5E3122] font-extrabold uppercase">Total Scans</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1D4533]">{totalScans.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">↑ +28% vs previous period</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="text-xs text-[#5E3122] font-extrabold uppercase">Unique Devices</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-[#1D4533]">{uniqueDevices.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-[#5E3122] mt-1">51.5% unique client ratio</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="text-xs text-[#5E3122] font-extrabold uppercase">Successful Scans</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-emerald-700">{successfulScans.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">97.5% verification success</div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-1 hover:border-[#1D4533] transition-colors">
          <div className="text-xs text-[#5E3122] font-extrabold uppercase">Failed / Anomalies</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-rose-700">{failedScans.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-rose-700 mt-1">2.5% challenge triggers</div>
        </div>
      </div>

      {/* ─── 3. FULL-WIDTH INTERACTIVE SCAN ACTIVITY TIMELINE ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9D2BA] pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#1D4533] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1D4533]" />
              <span>Scan Activity Velocity</span>
            </h2>
            <p className="text-xs text-[#5E3122] font-medium mt-0.5">
              Hourly and daily scan traffic volume with peak discovery analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#1D4533] bg-[#F7EAE0] px-2.5 py-1 rounded-full border border-[#F9D2BA]">
              Peak Hour: 10:00 AM - 12:30 PM
            </span>
          </div>
        </div>

        {/* Detailed Activity Graph Bars */}
        <div className="space-y-3">
          <div className="h-44 w-full flex items-end justify-between gap-1 sm:gap-2 px-1 pt-6">
            {[24, 38, 45, 62, 78, 92, 100, 84, 76, 68, 54, 48, 62, 85, 94, 78, 65, 82, 90, 72, 60, 52, 68, 74].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="w-full bg-[#F7EAE0] rounded-lg overflow-hidden flex flex-col justify-end h-32 border border-[#F9D2BA]">
                  <div
                    className="w-full bg-[#1D4533] rounded-t-md group-hover:bg-[#5E3122] transition-all duration-300"
                    style={{ height: `${v}%` }}
                    title={`Hour ${i}:00 — ${Math.round(v * 18.2)} scans`}
                  />
                </div>
                <span className="text-[8px] font-mono text-[#5E3122] hidden sm:block">
                  {i % 4 === 0 ? `${i}h` : ''}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#5E3122] font-medium pt-2 border-t border-[#F9D2BA]">
            <span>00:00 (Midnight)</span>
            <span>06:00 (Morning Rush)</span>
            <span>12:00 (Peak Operations)</span>
            <span>18:00 (Evening Logistics)</span>
            <span>23:59 (End of Day)</span>
          </div>
        </div>
      </div>

      {/* ─── 4. SCAN DISTRIBUTION BREAKDOWN & GEOGRAPHIC HEATMAP ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Scan Distribution with Tabs (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9D2BA] pb-3">
            <h2 className="text-base font-extrabold text-[#1D4533]">Scan Distribution</h2>
            
            {/* Distribution Sub-Tabs */}
            <div className="flex items-center gap-1 bg-[#F7EAE0] p-1 rounded-xl border border-[#F9D2BA]">
              {[
                { id: 'entity', label: 'Entity' },
                { id: 'qr', label: 'QR Token' },
                { id: 'device', label: 'Device' },
                { id: 'browser', label: 'Browser' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setDistributionTab(t.id as any);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    distributionTab === t.id
                      ? 'bg-[#1D4533] text-[#F7EAE0] shadow-xs'
                      : 'text-[#5E3122] hover:bg-[#F9D2BA]/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Distribution Dataset */}
          <div className="space-y-4">
            {(distributionTab === 'entity' ? entityDistribution :
              distributionTab === 'qr' ? qrDistribution :
              distributionTab === 'device' ? deviceDistribution : browserDistribution
            ).map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#1D4533] truncate max-w-[220px]">{item.label}</span>
                  <span className="font-mono font-bold text-[#5E3122]">{item.count.toLocaleString()} scans ({item.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
                  <div
                    className="h-full bg-[#1D4533] rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Geographic Distribution Map & Hub Table (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1D4533]" />
              <h2 className="text-base font-extrabold text-[#1D4533]">Geographic Distribution</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              6 Active Cities
            </span>
          </div>

          <div className="divide-y divide-[#F9D2BA]/60 overflow-y-auto max-h-[260px]">
            {geoHubs.map((hub) => (
              <div key={hub.city} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#F7EAE0] border border-[#F9D2BA] flex items-center justify-center text-[#1D4533] font-bold shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1D4533] block truncate">{hub.city}, {hub.country}</span>
                    <span className="text-[10px] text-[#5E3122] font-mono">{hub.latency} CDN edge</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-extrabold text-[#1D4533] block">{hub.scans.toLocaleString()} scans</span>
                  <span className="text-[10px] font-bold text-emerald-700">{hub.share}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── 5. SCAN EVENTS LOG TABLE (INVESTIGATIVE DRILL-DOWN) ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F9D2BA] pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#1D4533]">Scan Events Ledger</h2>
            <p className="text-xs text-[#5E3122] font-medium mt-0.5">
              Live chronological telemetry with device fingerprinting and location attribution
            </p>
          </div>

          {/* Table Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5E3122]/60" />
            <input
              type="text"
              placeholder="Search scan events..."
              value={searchTableQuery}
              onChange={(e) => setSearchTableQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F7EAE0]/50 border border-[#F9D2BA] rounded-xl text-xs font-medium text-[#1D4533] focus:outline-none focus:border-[#1D4533]"
            />
          </div>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">QR Token</th>
                <th className="py-2.5 px-3">Entity Name</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Device / Browser</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9D2BA]/40">
              {paginatedScans.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7EAE0]/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#1D4533]">
                    {s.uniqrCode}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1D4533] truncate max-w-[180px]">
                    {s.entityName}
                  </td>
                  <td className="py-3 px-3 text-[#5E3122] font-medium">
                    {s.city}, {s.country}
                  </td>
                  <td className="py-3 px-3 text-[#5E3122] text-[11px]">
                    <span className="font-semibold block">{s.device}</span>
                    <span className="text-[10px] text-[#5E3122]/70 font-mono">{s.ip}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'Success'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#5E3122]">
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onOpenPassport?.(s.uniqrCode);
                      }}
                      className="p-1.5 rounded-lg bg-white border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] transition-all inline-flex items-center justify-center"
                      title="Inspect Passport"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F9D2BA] text-xs text-[#5E3122]">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredScanEvents.length)} of {filteredScanEvents.length} events
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-[#1D4533]">
              Page {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
