import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Printer,
  Filter,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Search,
  ArrowUpRight,
  Hash,
  MapPin,
  User,
  Building,
  Clock,
  Share2,
  FileSpreadsheet,
  FileCheck,
  Boxes,
  Activity,
  MoreVertical,
  X,
  Check,
  Eye
} from 'lucide-react';
import { sound } from '../../services/audio';

interface GeneratedReport {
  id: string;
  name: string;
  type: 'Analytics' | 'Compliance' | 'Activity' | 'Operations' | 'Inventory';
  format: 'PDF' | 'CSV' | 'Excel';
  size: string;
  createdAt: string;
  status: 'Ready' | 'Scheduled' | 'Archived';
  downloads: number;
}

export const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [endDate, setEndDate] = useState<string>('2026-08-15');
  const [reportStartDate, setReportStartDate] = useState<string>('2026-08-01');
  const [reportEndDate, setReportEndDate] = useState<string>('2026-08-15');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV' | 'Excel'>('PDF');
  const [newReportName, setNewReportName] = useState<string>('Comprehensive QR Scan Telemetry');
  const [newReportType, setNewReportType] = useState<string>('Analytics');

  // Initial reports catalog
  const [reports, setReports] = useState<GeneratedReport[]>([
    { id: 'rep-01', name: 'Monthly QR Scan Telemetry & Geo Audit', type: 'Analytics', format: 'PDF', size: '2.4 MB', createdAt: '2026-08-15', status: 'Ready', downloads: 14 },
    { id: 'rep-02', name: 'EU Digital Product Passport Compliance Certificate', type: 'Compliance', format: 'PDF', size: '1.8 MB', createdAt: '2026-08-12', status: 'Ready', downloads: 28 },
    { id: 'rep-03', name: 'Raw Scan Event Stream Dataset', type: 'Activity', format: 'CSV', size: '4.2 MB', createdAt: '2026-08-08', status: 'Ready', downloads: 6 },
    { id: 'rep-04', name: 'Hardware Asset Lifecycle & Maintenance Audit', type: 'Operations', format: 'Excel', size: '3.1 MB', createdAt: '2026-08-02', status: 'Ready', downloads: 19 },
    { id: 'rep-05', name: 'Q2 Ecosystem Inventory & Serial Traceability', type: 'Inventory', format: 'PDF', size: '5.6 MB', createdAt: '2026-07-28', status: 'Ready', downloads: 42 },
  ]);

  // Scheduled reports state
  const [scheduledReports, setScheduledReports] = useState([
    { id: 'sch-1', name: 'Monthly QR Scan Telemetry Digest', frequency: 'Every 1st of Month at 00:00 UTC', active: true, format: 'PDF & CSV' },
    { id: 'sch-2', name: 'Weekly Operations & Anomaly Ledger', frequency: 'Every Monday at 08:00 UTC', active: true, format: 'PDF' },
    { id: 'sch-3', name: 'Quarterly Cryptographic Audit Certificate', frequency: 'Every 90 Days', active: false, format: 'PDF (Sealed)' },
  ]);

  // Quick report generator presets
  const quickReports = [
    { title: 'Scan Activity', desc: 'Hourly scan telemetry, device breakdown & location distribution', type: 'Activity', format: 'PDF' as const },
    { title: 'Entity Overview', desc: 'Registered product, machine & document identities summary', type: 'Inventory', format: 'PDF' as const },
    { title: 'QR Performance', desc: 'Resolution rates, latency benchmark & top scanned tokens', type: 'Analytics', format: 'Excel' as const },
    { title: 'Compliance Audit', desc: 'SHA-256 tamper-evident trail history & verification seals', type: 'Compliance', format: 'PDF' as const },
    { title: 'Inventory Ledger', desc: 'SKU, batch numbers, manufacturing dates & warranty logs', type: 'Inventory', format: 'CSV' as const },
    { title: 'Operations Dispatch', desc: 'Work orders, maintenance logs & calibration certifications', type: 'Operations', format: 'Excel' as const },
  ];

  // Report templates
  const reportTemplates = [
    { title: 'Scan Telemetry & Geo Attribution', type: 'Analytics', desc: 'Pre-formatted visual charts, country maps, and device shares for executive review.' },
    { title: 'EU Digital Product Passport Compliance', type: 'Compliance', desc: 'Meets European Union Ecodesign DPP specifications with raw cryptographic hash logs.' },
    { title: 'End-to-End Serial Traceability', type: 'Inventory', desc: 'Complete batch genealogy, manufacturer certifications, and warranty verification.' },
    { title: 'Hardware Asset Inspection Ledger', type: 'Operations', desc: 'Maintenance cycles, component service logs, and technician sign-offs.' },
  ];

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 1-Click Quick Report Generator
  const handleQuickReport = (qr: typeof quickReports[0]) => {
    sound.playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const newRep: GeneratedReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        name: `${qr.title} Report (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
        type: qr.type as any,
        format: qr.format,
        size: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Ready',
        downloads: 1,
      };
      setReports(prev => [newRep, ...prev]);
      setIsGenerating(false);
      sound.playSuccessChime();
    }, 600);
  };

  // Create custom report modal handler
  const handleCreateReport = () => {
    sound.playClick();
    setIsGenerating(true);
    setTimeout(() => {
      const newRep: GeneratedReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        name: newReportName,
        type: newReportType as any,
        format: selectedFormat,
        size: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'Ready',
        downloads: 0,
      };
      setReports(prev => [newRep, ...prev]);
      setIsGenerating(false);
      setIsCreateModalOpen(false);
      sound.playSuccessChime();
    }, 800);
  };

  // Download simulation
  const handleDownload = (rep: GeneratedReport) => {
    sound.playClick();
    const content = `UniQR Generated Report: ${rep.name}\nType: ${rep.type}\nCreated: ${rep.createdAt}\nFormat: ${rep.format}\nCryptographic Integrity: Verified SHA-256 Ledger`;
    const mimeType = rep.format === 'PDF' ? 'application/pdf' : rep.format === 'CSV' ? 'text/csv' : 'application/vnd.ms-excel';
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rep.name.replace(/\s+/g, '_')}.${rep.format.toLowerCase()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. REPORTS HEADER & PRIMARY CREATE REPORT ACTION ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#1D4533] font-extrabold text-xs uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-[#F9D2BA]" />
              <span>Document Library &amp; Reporting Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
              Reports
            </h1>
            <p className="text-xs sm:text-sm text-[#5E3122] mt-0.5 font-medium">
              Generate, manage and export business reports for audits, analytics, and executive compliance
            </p>
          </div>

          {/* Primary Action Button: + Create Report */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#F9D2BA]" />
            <span>+ Create Report</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E3122]/60" />
            <input
              type="text"
              placeholder="Search reports by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F7EAE0]/50 border border-[#F9D2BA] rounded-xl text-xs font-medium text-[#1D4533] placeholder-[#5E3122]/50 focus:outline-none focus:border-[#1D4533]"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
            >
              <option value="All">Type: All Types</option>
              <option value="Analytics">Analytics</option>
              <option value="Compliance">Compliance</option>
              <option value="Activity">Activity</option>
              <option value="Operations">Operations</option>
              <option value="Inventory">Inventory</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
            >
              <option value="All">Date: All Time</option>
              <option value="today">Date: Today</option>
              <option value="7d">Date: Last 7 Days</option>
              <option value="30d">Date: Last 30 Days</option>
              <option value="quarter">Date: This Quarter</option>
              <option value="custom">Date: Custom Range...</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="flex items-center gap-1.5 bg-[#F7EAE0] p-1 rounded-xl border border-[#F9D2BA]">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2 py-1 bg-white rounded-lg border border-[#F9D2BA] text-[11px] font-mono font-bold text-[#1D4533] focus:outline-none"
                  title="From Date"
                />
                <span className="text-xs font-bold text-[#5E3122]">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2 py-1 bg-white rounded-lg border border-[#F9D2BA] text-[11px] font-mono font-bold text-[#1D4533] focus:outline-none"
                  title="To Date"
                />
              </div>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none"
            >
              <option value="All">Status: All</option>
              <option value="Ready">Ready</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 2. QUICK REPORTS (1-CLICK INSTANT GENERATORS) ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#1D4533]">Quick Reports</h2>
            <p className="text-xs text-[#5E3122] font-medium mt-0.5">
              1-click instant report generators pre-configured with current dataset snapshots
            </p>
          </div>
          {isGenerating && (
            <span className="text-xs font-bold text-[#1D4533] flex items-center gap-1.5 bg-[#F7EAE0] px-3 py-1 rounded-full border border-[#F9D2BA]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#1D4533]" />
              <span>Generating Artifact...</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickReports.map((qr) => (
            <button
              key={qr.title}
              type="button"
              disabled={isGenerating}
              onClick={() => handleQuickReport(qr)}
              className="p-4 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] hover:bg-[#1D4533] hover:text-[#F7EAE0] hover:border-[#1D4533] transition-all text-left group flex flex-col justify-between space-y-2 shadow-xs disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-[#1D4533] border border-[#F9D2BA] group-hover:bg-[#5E3122] group-hover:text-[#F9D2BA] group-hover:border-transparent">
                  {qr.format}
                </span>
                <Download className="w-3.5 h-3.5 text-[#5E3122] group-hover:text-[#F9D2BA]" />
              </div>

              <div>
                <h3 className="text-xs font-extrabold text-[#1D4533] group-hover:text-[#F7EAE0]">
                  {qr.title}
                </h3>
                <p className="text-[10px] text-[#5E3122] group-hover:text-[#F9D2BA] line-clamp-2 mt-0.5">
                  {qr.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── 3. RECENT REPORTS DOCUMENT TABLE ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
          <h2 className="text-lg font-extrabold text-[#1D4533]">Generated Reports Archive</h2>
          <span className="text-xs font-bold text-[#5E3122]">
            {filteredReports.length} Available Documents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Report Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Created Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9D2BA]/40">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-[#F7EAE0]/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] flex items-center justify-center text-[#1D4533] shrink-0">
                        {rep.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-[#1D4533]">{rep.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#5E3122]">
                    {rep.type}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1D4533]">
                    {rep.format}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#5E3122]">
                    {rep.size}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#5E3122]">
                    {rep.createdAt}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownload(rep)}
                        className="px-3 py-1.5 rounded-lg bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-bold text-xs transition-all flex items-center gap-1 shadow-xs"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 4. SCHEDULED REPORTS & REPORT TEMPLATES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Scheduled Reports (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1D4533]" />
              <h2 className="text-base font-extrabold text-[#1D4533]">Scheduled Automated Reports</h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cron Dispatch Active
            </span>
          </div>

          <div className="space-y-3">
            {scheduledReports.map((sch) => (
              <div
                key={sch.id}
                className="p-3.5 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h3 className="font-extrabold text-[#1D4533]">{sch.name}</h3>
                  <span className="text-[11px] text-[#5E3122] font-medium block mt-0.5">{sch.frequency}</span>
                  <span className="text-[10px] font-mono text-[#1D4533] font-bold mt-1 inline-block">Format: {sch.format}</span>
                </div>

                {/* Toggle Active */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setScheduledReports(prev => prev.map(s => s.id === sch.id ? { ...s, active: !s.active } : s));
                  }}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors relative ${
                    sch.active ? 'bg-[#1D4533]' : 'bg-[#5E3122]/30'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-sm ${
                    sch.active ? 'translate-x-4.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Report Templates Library (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1D4533]" />
              <h2 className="text-base font-extrabold text-[#1D4533]">Report Templates Library</h2>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#5E3122]">4 Standard Specs</span>
          </div>

          <div className="space-y-2.5">
            {reportTemplates.map((tpl) => (
              <div
                key={tpl.title}
                className="p-3 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-center justify-between gap-3 text-xs hover:bg-white hover:border-[#1D4533] transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-[#1D4533] truncate">{tpl.title}</h3>
                    <span className="px-2 py-0.2 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[9px] font-black uppercase shrink-0">
                      {tpl.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5E3122] font-medium truncate mt-0.5">
                    {tpl.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setNewReportName(tpl.title);
                    setNewReportType(tpl.type);
                    setIsCreateModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#F9D2BA] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs transition-all shrink-0 shadow-xs"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── 5. INTERACTIVE CREATE REPORT MODAL ─── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#F9D2BA] shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1D4533]" />
                <h3 className="text-lg font-extrabold text-[#1D4533]">Generate New Business Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Report Name */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Report Title</label>
                <input
                  type="text"
                  value={newReportName}
                  onChange={(e) => setNewReportName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-medium text-xs focus:outline-none focus:border-[#1D4533]"
                />
              </div>

              {/* Report Type */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Category / Module</label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-bold text-xs focus:outline-none"
                >
                  <option value="Analytics">Analytics &amp; Telemetry</option>
                  <option value="Compliance">Regulatory Compliance &amp; Traceability</option>
                  <option value="Activity">Raw Scan Activity Logs</option>
                  <option value="Operations">Operations &amp; Maintenance</option>
                  <option value="Inventory">Inventory &amp; Entity Registry</option>
                </select>
              </div>

              {/* Date Range Selection */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Data Time Window</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#5E3122] font-semibold block mb-0.5">Start Date</span>
                    <input
                      type="date"
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5E3122] font-semibold block mb-0.5">End Date</span>
                    <input
                      type="date"
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PDF', 'CSV', 'Excel'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedFormat(fmt);
                      }}
                      className={`p-3 rounded-xl font-extrabold text-xs flex flex-col items-center gap-1 border transition-all ${
                        selectedFormat === fmt
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-xs'
                          : 'bg-[#F7EAE0]/50 text-[#5E3122] border-[#F9D2BA] hover:bg-white'
                      }`}
                    >
                      <span>{fmt}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        {fmt === 'PDF' ? 'Formatted Document' : fmt === 'CSV' ? 'Raw Spreadsheet' : 'Structured Workbook'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F9D2BA]">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleCreateReport}
                className="px-5 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" /> : <Check className="w-4 h-4" />}
                <span>{isGenerating ? 'Building Report...' : 'Generate & Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
