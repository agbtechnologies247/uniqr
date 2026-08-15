import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  QrCode, 
  Network, 
  ShieldCheck, 
  Printer, 
  Code2, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Search, 
  Database, 
  Server, 
  RefreshCw, 
  Layers, 
  FileText, 
  Download, 
  Play, 
  Check, 
  Cpu, 
  Tag, 
  User, 
  Receipt, 
  Warehouse, 
  Wrench, 
  Truck, 
  ShieldAlert, 
  Box, 
  Activity, 
  CheckSquare
} from 'lucide-react';
import QRCode from 'qrcode';
import { billSoftService } from '../../services/billsoftService';
import { BillSoftEntityItem, BillSoftQrIdentity, BillSoftEntityType, GraphNode, GraphLink, LabelTemplateConfig } from '../../types';
import { sound } from '../../services/audio';

export const BillSoftPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'entities' | 'graph' | 'resolver' | 'print' | 'ddl' | 'api' | 'roadmap'>('overview');
  
  // Data states
  const [entities, setEntities] = useState<BillSoftEntityItem[]>([]);
  const [qrIdentities, setQrIdentities] = useState<BillSoftQrIdentity[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New entity form modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newEntityType, setNewEntityType] = useState<BillSoftEntityType>('Product');
  const [newEntityName, setNewEntityName] = useState<string>('');
  const [newEntityCode, setNewEntityCode] = useState<string>('');
  const [newEntityCategory, setNewEntityCategory] = useState<string>('');
  const [newEntityPrice, setNewEntityPrice] = useState<string>('');
  const [newEntityLocation, setNewEntityLocation] = useState<string>('');

  // Resolver Simulator state
  const [resolverInput, setResolverInput] = useState<string>('BS-PROD-00001001');
  const [resolvedResult, setResolvedResult] = useState<any>(null);

  // Print Studio state
  const [selectedEntityForPrint, setSelectedEntityForPrint] = useState<BillSoftEntityItem | null>(null);
  const [labelTemplate, setLabelTemplate] = useState<LabelTemplateConfig>({
    id: 'tmpl-5030',
    name: '50x30 mm Standard Tag',
    dimensions: '50x30 mm',
    widthMm: 50,
    heightMm: 30,
    showLogo: true,
    showBarcode: true,
    showDetails: true,
    qrSizePx: 120
  });
  const [printedQrDataUrl, setPrintedQrDataUrl] = useState<string>('');

  // API Playground state
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/qr/generate');
  const [apiResponse, setApiResponse] = useState<string>('Select an API endpoint and click Execute to test response.');

  // Code Copy feedback state
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Graph Canvas Ref
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<GraphNode | null>(null);

  // Refresh data
  const refreshData = () => {
    setEntities(billSoftService.getEntities());
    setQrIdentities(billSoftService.getQrIdentities());
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (entities.length > 0 && !selectedEntityForPrint) {
      setSelectedEntityForPrint(entities[0]);
    }
  }, [entities]);

  // Generate QR Canvas data URL when selected entity or template changes
  useEffect(() => {
    if (selectedEntityForPrint) {
      QRCode.toDataURL(selectedEntityForPrint.publicQrId, {
        margin: 1,
        width: labelTemplate.qrSizePx,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(url => {
        setPrintedQrDataUrl(url);
      }).catch(err => console.error(err));
    }
  }, [selectedEntityForPrint, labelTemplate]);

  // Execute Resolver test
  const handleResolveTest = (idToTest?: string) => {
    const target = idToTest || resolverInput;
    sound.playClick();
    const res = billSoftService.resolveQr(target);
    setResolvedResult(res);
  };

  // Execute New Entity Creation
  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    sound.playSuccessChime();
    const details: Record<string, string> = {};
    if (newEntityPrice) details['Price'] = newEntityPrice;
    if (newEntityLocation) details['Location'] = newEntityLocation;
    details['CreatedVia'] = 'BillSoft UQIS Studio';

    const created = billSoftService.createEntity({
      name: newEntityName,
      type: newEntityType,
      codeOrSku: newEntityCode || `SKU-${Date.now().toString().slice(-4)}`,
      categoryOrRole: newEntityCategory || 'Standard Entity',
      details
    });

    refreshData();
    setIsCreateModalOpen(false);
    setNewEntityName('');
    setNewEntityCode('');
    setNewEntityCategory('');
    setNewEntityPrice('');
    setNewEntityLocation('');
    setSelectedEntityForPrint(created);
  };

  // Render Graph Visualization when 'graph' tab is active
  useEffect(() => {
    if (activeTab !== 'graph') return;
    const canvas = graphCanvasRef.current;
    if (!canvas) return;

    const width = canvas.offsetWidth || 800;
    const height = canvas.offsetHeight || 500;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { nodes, links } = billSoftService.getGraphData();

    // Assign positions around layout
    nodes.forEach((n, idx) => {
      if (!n.x || !n.y) {
        const angle = (idx / nodes.length) * 2 * Math.PI;
        const radius = Math.min(width, height) * 0.35;
        n.x = width / 2 + radius * Math.cos(angle);
        n.y = height / 2 + radius * Math.sin(angle);
      }
    });

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Links
    links.forEach((l) => {
      const src = nodes.find(n => n.id === l.source);
      const tgt = nodes.find(n => n.id === l.target);
      if (src && tgt && src.x && src.y && tgt.x && tgt.y) {
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const midX = (src.x + tgt.x) / 2;
        const midY = (src.y + tgt.y) / 2;
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(l.relation, midX, midY);
      }
    });

    // Draw Nodes
    nodes.forEach((n) => {
      if (!n.x || !n.y) return;
      const isSel = selectedGraphNode?.id === n.id;

      if (isSel) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 22, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, 15, 0, 2 * Math.PI);

      let color = '#0284c7';
      if (n.type === 'Product') color = '#10b981';
      if (n.type === 'Customer') color = '#ec4899';
      if (n.type === 'Invoice') color = '#06b6d4';
      if (n.type === 'Warehouse') color = '#f59e0b';
      if (n.type === 'QR') color = '#a855f7';
      if (n.type === 'RentalItem') color = '#eab308';
      if (n.type === 'Warranty') color = '#3b82f6';

      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isSel ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = isSel ? 3 : 1.5;
      ctx.stroke();

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(n.label.slice(0, 16), n.x, n.y + 26);
    });

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const clicked = nodes.find(n => {
        if (!n.x || !n.y) return false;
        return Math.hypot(n.x - clickX, n.y - clickY) <= 20;
      });

      setSelectedGraphNode(clicked || null);
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => canvas.removeEventListener('click', handleCanvasClick);
  }, [activeTab, entities, selectedGraphNode]);

  // Copy to clipboard helper
  const handleCopyCode = (code: string, sectionKey: string) => {
    navigator.clipboard.writeText(code);
    sound.playClick();
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Filtered entities list
  const filteredEntities = entities.filter(e => {
    const matchesType = selectedTypeFilter === 'All' || e.type === selectedTypeFilter;
    const matchesSearch = searchQuery === '' || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.publicQrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.codeOrSku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* TOP BRANDING & ENVIRONMENT HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#1D4533] font-extrabold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-[#F9D2BA]" />
              <span>BillSoft Invoicing &amp; Product Identity Hub</span>
              <span className="px-2 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533] font-mono text-[10px] font-bold">UQIS Active</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1D4533] flex items-center gap-3">
              BillSoft Universal Identity Module
            </h1>
            <p className="text-xs text-[#5E3122] max-w-2xl mt-1.5 leading-relaxed font-medium">
              Every BillSoft object (Products, Customers, Invoices, Warehouses, Rentals, Warranties, Batches) receives a globally unique digital identity paired with master records and relationship networks.
            </p>
          </div>

          {/* VPS & Environment Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a 
              href="https://billsoft.agbtechnologies.com/" 
              target="_blank" 
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] hover:border-[#1D4533] transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#1D4533]">
                <span className="w-2 h-2 rounded-full bg-[#1D4533] animate-ping" />
                <span>BillSoft PROD</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-mono text-[#5E3122] font-semibold mt-1">IP: 82.29.164.106</div>
            </a>

            <a 
              href="https://billsoft.agbitsolutions.com/" 
              target="_blank" 
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] hover:border-[#1D4533] transition-all group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#1D4533]">
                <Server className="w-3.5 h-3.5 text-[#5E3122]" />
                <span>BillSoft IAT</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] font-mono text-[#5E3122] font-semibold mt-1">Internal: 10.196.103.140</div>
            </a>
          </div>
        </div>

        {/* INTEGRATION NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-white/10 scrollbar-none">
          {[
            { id: 'overview', label: 'Architecture & VPS', icon: Server },
            { id: 'entities', label: 'Entity QR Manager', icon: QrCode, badge: entities.length },
            { id: 'graph', label: 'Neo4j Graph Engine', icon: Network },
            { id: 'resolver', label: 'Universal Resolver', icon: ShieldCheck },
            { id: 'print', label: 'Thermal Print Studio', icon: Printer },
            { id: 'ddl', label: 'SQL & Cypher Scripts', icon: Code2 },
            { id: 'api', label: 'REST API Tester', icon: Cpu },
            { id: 'roadmap', label: 'Sprint Roadmap', icon: CheckSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-[1.02]'
                    : 'bg-graphite-900/80 text-slate-400 hover:bg-graphite-700 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ARCHITECTURE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* STAT CARDS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-graphite-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Digital QR Identities</span>
                <QrCode className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">{qrIdentities.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Synced with PostgreSQL</span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-graphite-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Neo4j Graph Relationships</span>
                <Network className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">
                {entities.reduce((acc, curr) => acc + curr.neo4jRelations.length, 0) + entities.length}
              </div>
              <div className="text-[11px] text-purple-400 mt-1 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Active Cypher Nodes</span>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-graphite-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Resolver Avg Latency</span>
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white mt-2">1.8 ms</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                Indexed B-Tree Lookups
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-graphite-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">VPS Deployment Status</span>
                <Server className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">ONLINE</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                82.29.164.106 (root@mail)
              </div>
            </div>
          </div>

          {/* ARCHITECTURE DIAGRAM & DETAILS */}
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-400" />
                <span>Universal QR Identity (UQIS) Architecture</span>
              </h3>
              
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-sky-300 space-y-3">
                <div className="text-center font-bold text-white pb-2 border-b border-slate-800">
                  BillSoft ERP Core Ecosystem
                </div>
                <div className="grid grid-cols-3 text-center gap-2">
                  <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/30">
                    <div className="font-bold text-white">PostgreSQL</div>
                    <div className="text-[10px] text-slate-400 mt-1">Master Data (qr_identity)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30">
                    <div className="font-bold text-white">Neo4j Graph</div>
                    <div className="text-[10px] text-slate-400 mt-1">Relationships &amp; Traversal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30">
                    <div className="font-bold text-white">File Storage</div>
                    <div className="text-[10px] text-slate-400 mt-1">Thermal PDFs &amp; Labels</div>
                  </div>
                </div>
                <div className="text-center text-slate-500 font-sans text-xs pt-2">
                  ↓ Integrated via Universal QR Resolver API ↓
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-center font-bold text-emerald-300">
                  Every Entity Gets Global QR Token (BS-PROD / BS-CUST / BS-INV / BS-WH / BS-RENT)
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">Core Architecture Principles</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-300">
                  <li><strong className="text-white">Zero Database ID Exposure:</strong> Internal auto-increment IDs are never printed or shown. Only encrypted public QR IDs (`BS-PROD-00001254`) are visible.</li>
                  <li><strong className="text-white">Unified Identity Registry:</strong> Single transactional table `qr_identity` maps UUIDs, public IDs, and encrypted SHA tokens to PostgreSQL entity records.</li>
                  <li><strong className="text-white">Graph-Native Relationship Engine:</strong> Neo4j graph nodes capture full product lifecycle from supplier manufacturing to warehouse transfers, customer invoices, warranties, and service tickets.</li>
                </ul>
              </div>
            </div>

            {/* VPS DEPLOYMENT DETAILS */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <span>VPS Deployment Specs</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">Repository:</span>
                    <a href="https://github.com/agbtechnologies247/BillSoft_Shubham_Major" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">BillSoft_Shubham_Major</a>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">Public IP:</span>
                    <span className="text-emerald-400 font-bold">82.29.164.106</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">Internal IP:</span>
                    <span className="text-sky-400 font-bold">10.196.103.140</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">SSH Access:</span>
                    <span className="text-slate-300">root@mail:/var/www</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Domain PROD:</span>
                    <span className="text-emerald-400">billsoft.agbtechnologies.com</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/20 space-y-2">
                  <div className="font-bold text-sky-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Nginx Resolver Config Ready</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Nginx reverse proxy maps `/q/*` routes to the BillSoft UQIS Resolver controller, executing sub-5ms lookups against PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ENTITY QR MANAGER & GENERATOR */}
      {activeTab === 'entities' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-sky-400" />
                <span>BillSoft Entity Identity Registry</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generate and manage Universal QR identities for Products, Customers, Warehouses, Invoices, Rentals, Warranties, and Batches.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create BillSoft Entity QR</span>
            </button>
          </div>

          {/* FILTERS & SEARCH */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Type filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Product', 'Customer', 'Invoice', 'Warehouse', 'Rental Asset', 'Warranty', 'Service Ticket', 'Stock Batch', 'Supplier'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTypeFilter === t
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-graphite-900 text-slate-400 hover:bg-graphite-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Public QR or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* ENTITY GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities.map((ent) => (
              <div 
                key={ent.id}
                className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-sky-500/30 transition-all flex flex-col justify-between space-y-4 group bg-graphite-900/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-extrabold text-[10px] uppercase border border-sky-500/20">
                      {ent.type}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {ent.publicQrId}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm group-hover:text-sky-300 transition-colors">
                    {ent.name}
                  </h3>

                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Code/SKU: {ent.codeOrSku}
                  </div>

                  {/* Details Badges */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-[11px]">
                    {Object.entries(ent.details).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-slate-300 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedEntityForPrint(ent);
                      setActiveTab('print');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Print Label</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setResolverInput(ent.publicQrId);
                      handleResolveTest(ent.publicQrId);
                      setActiveTab('resolver');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold transition-all"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NEO4J GRAPH ENGINE */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase mb-1">
                <Database className="w-4 h-4" />
                <span>BillSoft Cypher Traversal Engine</span>
              </div>
              <h2 className="text-2xl font-black text-white">Neo4j Entity Relationship Engine</h2>
              <p className="text-xs text-slate-400 mt-1">
                Visual representation of connected BillSoft objects: (Customer)-[:BOUGHT]-&gt;(Invoice)-[:CONTAINS]-&gt;(Product)-[:STORED_IN]-&gt;(Warehouse).
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-panel p-4 rounded-3xl border border-white/5 relative min-h-[500px]">
              <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-slate-800 mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Interactive Graph Visualizer</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Click any node to inspect graph metadata
                </span>
              </div>

              <canvas ref={graphCanvasRef} className="w-full h-[450px] rounded-2xl cursor-pointer" />
            </div>

            {/* NODE INSPECTOR */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base mb-1">Graph Node Inspector</h3>
                <p className="text-xs text-slate-400 mb-4">Properties stored in Neo4j 5.x Graph Engine</p>

                {selectedGraphNode ? (
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{selectedGraphNode.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                          :{selectedGraphNode.type}
                        </span>
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">ID: {selectedGraphNode.id}</div>
                    </div>

                    {selectedGraphNode.details && (
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                        <div className="font-bold text-slate-400 uppercase text-[10px]">Node Attributes</div>
                        {Object.entries(selectedGraphNode.details).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-slate-900 pb-1">
                            <span className="text-slate-500">{k}:</span>
                            <span className="text-slate-300">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-500">
                    Click any node on the graph canvas to inspect its Cypher properties &amp; linked entity relationships.
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 mt-6">
                <strong className="block text-white mb-1">Graph Lifecycle Advantage:</strong>
                Track product warranty claims, rentals, and stock movements across multi-tenant warehouses without heavy SQL JOIN operations.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: UNIVERSAL RESOLVER & SECURITY */}
      {activeTab === 'resolver' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Universal QR Resolver &amp; Token Validator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Simulates camera scanning and HTTP request lookups to `/api/qr/resolve`. Public users see customer passport view, while logged-in staff see ERP management controls.
              </p>
            </div>

            {/* RESOLVER INPUT BAR */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={resolverInput}
                onChange={(e) => setResolverInput(e.target.value)}
                placeholder="Enter Public QR ID (e.g. BS-PROD-00001001 or URL)"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                onClick={() => handleResolveTest()}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Resolver</span>
              </button>
            </div>
          </div>

          {/* RESOLVED RESULT CARD */}
          {resolvedResult && (
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 animate-fade-in">
              <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                resolvedResult.success 
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}>
                {resolvedResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />}
                <div className="text-xs font-bold">{resolvedResult.message}</div>
              </div>

              {resolvedResult.success && resolvedResult.identity && (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* PostgreSQL Token Security */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-white text-sm">PostgreSQL Token Security Audit</h3>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">Public QR ID:</span>
                        <span className="text-sky-400 font-bold">{resolvedResult.identity.publicQrId}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">UUID v4:</span>
                        <span className="text-slate-300">{resolvedResult.identity.uuid}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">Encrypted Token:</span>
                        <span className="text-amber-400">{resolvedResult.identity.encryptedToken}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">Scan Count:</span>
                        <span className="text-emerald-400 font-bold">{resolvedResult.identity.scanCount} scans</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-slate-500">Neo4j Node ID:</span>
                        <span className="text-purple-400">{resolvedResult.identity.neo4jNodeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Public URL:</span>
                        <a href={resolvedResult.identity.publicUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                          {resolvedResult.identity.publicUrl}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Entity Information */}
                  {resolvedResult.entity && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-white text-sm">Associated Entity Passport Data</h3>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-base">{resolvedResult.entity.name}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[10px]">
                            {resolvedResult.entity.type}
                          </span>
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          Code: {resolvedResult.entity.codeOrSku}
                        </div>

                        <div className="pt-2 border-t border-slate-900 space-y-1 font-mono">
                          {Object.entries(resolvedResult.entity.details).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-500">{k}:</span>
                              <span className="text-slate-300">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: THERMAL PRINT STUDIO */}
      {activeTab === 'print' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-400" />
                <span>Thermal Label &amp; Sheet Printing Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Export vector CAD and thermal sticker label layouts for Bluetooth printer devices or A4 grid sheets.
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                window.print();
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Thermal Label</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* CONTROLS (5 cols) */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/5 space-y-5">
              {/* Select Entity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Target BillSoft Entity</label>
                <select
                  value={selectedEntityForPrint?.id || ''}
                  onChange={(e) => {
                    const sel = entities.find(x => x.id === e.target.value);
                    if (sel) setSelectedEntityForPrint(sel);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      [{e.type}] {e.name} ({e.publicQrId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Sizes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Label Template Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '4020', name: '40x20 mm Asset Sticker', w: 40, h: 20, qrPx: 90 },
                    { id: '5030', name: '50x30 mm Standard Tag', w: 50, h: 30, qrPx: 120 },
                    { id: '8050', name: '80x50 mm Shelf / Bin', w: 80, h: 50, qrPx: 160 },
                    { id: 'a4grid', name: 'A4 Grid (24 Labels)', w: 70, h: 37, qrPx: 130 },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        sound.playClick();
                        setLabelTemplate({
                          id: t.id,
                          name: t.name,
                          dimensions: `${t.w}x${t.h} mm`,
                          widthMm: t.w,
                          heightMm: t.h,
                          showLogo: true,
                          showBarcode: true,
                          showDetails: true,
                          qrSizePx: t.qrPx
                        });
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        labelTemplate.id === t.id
                          ? 'border-sky-500 bg-sky-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div>{t.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{t.w} × {t.h} mm</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-3 border-t border-white/5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={labelTemplate.showLogo}
                    onChange={(e) => setLabelTemplate({ ...labelTemplate, showLogo: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                  />
                  <span>Show BillSoft Logo Branding</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={labelTemplate.showBarcode}
                    onChange={(e) => setLabelTemplate({ ...labelTemplate, showBarcode: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                  />
                  <span>Include Human Readable SKU Barcode</span>
                </label>
              </div>
            </div>

            {/* PREVIEW CANVAS (7 cols) */}
            <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center bg-slate-950 min-h-[400px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Thermal Label Output Preview ({labelTemplate.dimensions})
              </div>

              {selectedEntityForPrint && (
                <div 
                  className="bg-white text-slate-950 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 border-2 border-slate-300 select-none transition-all"
                  style={{
                    width: `${labelTemplate.widthMm * 6}px`,
                    height: `${labelTemplate.heightMm * 6}px`,
                  }}
                >
                  <div className="flex flex-col justify-between h-full flex-1">
                    <div>
                      {labelTemplate.showLogo && (
                        <div className="text-[11px] font-black tracking-tighter uppercase text-sky-700">
                          BILLSOFT UQIS
                        </div>
                      )}
                      <div className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {selectedEntityForPrint.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-600">
                        {selectedEntityForPrint.publicQrId}
                      </div>
                    </div>

                    {labelTemplate.showBarcode && (
                      <div className="mt-auto">
                        <div className="text-[9px] font-mono font-bold text-slate-800">
                          SKU: {selectedEntityForPrint.codeOrSku}
                        </div>
                        <div className="text-[8px] font-mono text-slate-500">
                          https://billsoft.agbtechnologies.com/
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Image */}
                  {printedQrDataUrl && (
                    <img 
                      src={printedQrDataUrl} 
                      alt="QR Preview" 
                      className="object-contain shrink-0"
                      style={{ width: `${labelTemplate.qrSizePx * 0.75}px`, height: `${labelTemplate.qrSizePx * 0.75}px` }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SQL & CYPHER SCRIPTS */}
      {activeTab === 'ddl' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-sky-400" />
                <span>PostgreSQL &amp; Neo4j Database Setup Scripts</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Copy or export production schema migrations for BillSoft VPS PostgreSQL (`qr_identity` table) and Neo4j Cypher graph indexes.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* POSTGRESQL DDL */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>PostgreSQL DDL (qr_identity)</span>
                </h3>

                <button
                  onClick={() => handleCopyCode(billSoftService.generateMigrationSql(), 'pg')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedSection === 'pg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'pg' ? 'Copied SQL' : 'Copy DDL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto h-96 scrollbar-thin">
                {billSoftService.generateMigrationSql()}
              </pre>
            </div>

            {/* NEO4J CYPHER */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Neo4j 5.x Cypher Setup Script</span>
                </h3>

                <button
                  onClick={() => handleCopyCode(billSoftService.generateCypherScripts(), 'cypher')}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copiedSection === 'cypher' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'cypher' ? 'Copied Cypher' : 'Copy Cypher'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto h-96 scrollbar-thin">
                {billSoftService.generateCypherScripts()}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REST API PLAYGROUND */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                <span>REST API Playground &amp; Endpoints</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Test BillSoft Universal QR Identity System API routes supported on VPS server `82.29.164.106`.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { ep: '/api/qr/generate', method: 'POST' },
                { ep: '/api/qr/BS-PROD-00001001', method: 'GET' },
                { ep: '/api/qr/scan', method: 'POST' },
                { ep: '/api/qr/verify', method: 'POST' },
                { ep: '/api/qr/bulk', method: 'POST' },
                { ep: '/api/qr/print', method: 'POST' },
              ].map(item => (
                <button
                  key={item.ep}
                  onClick={() => {
                    sound.playClick();
                    setApiEndpoint(item.ep);
                    setApiResponse(JSON.stringify({
                      status: 200,
                      success: true,
                      timestamp: new Date().toISOString(),
                      endpoint: item.ep,
                      vps: '82.29.164.106',
                      domain: 'https://billsoft.agbtechnologies.com',
                      data: {
                        publicQrId: 'BS-PROD-00001001',
                        uuid: billSoftService.generateUuid(),
                        encryptedToken: 'TOK-9F2B-550E8400',
                        neo4jSync: 'SUCCESS'
                      }
                    }, null, 2));
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    apiEndpoint === item.ep
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] text-emerald-400 mr-1.5">{item.method}</span>
                  <span>{item.ep}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-sm">Response Body Preview</h3>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
              {apiResponse}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 8: IMPLEMENTATION ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-sky-400" />
              <span>BillSoft UQIS Implementation Roadmap</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sprint milestones for rolling out Universal QR Identities across BillSoft modules.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                sprint: 'Sprint 1',
                title: 'Universal QR Identity Service & Resolver APIs',
                deliverables: 'UUID generation, public QR ID allocation (BS-PROD / BS-CUST / BS-INV), resolver API controller, PostgreSQL qr_identity table schema.',
                status: 'Completed',
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
              },
              {
                sprint: 'Sprint 2',
                title: 'Core Entity Form Integrations',
                deliverables: 'Product, Customer, Supplier, Warehouse, and Inventory form integration with automatic QR generation upon save.',
                status: 'Completed',
                color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
              },
              {
                sprint: 'Sprint 3',
                title: 'Neo4j Graph Synchronization Service',
                deliverables: 'Graph node creation and relationship builders (BOUGHT, STORED_IN, RENTED, HAS_WARRANTY, SUPPLIED_BY).',
                status: 'In Progress',
                color: 'text-sky-400 border-sky-500/30 bg-sky-950/20'
              },
              {
                sprint: 'Sprint 4',
                title: 'BillSoft PWA Scanner & Warehouse Picking Mode',
                deliverables: 'Native camera scanner, offline scan queue with background sync, warehouse shelf picking, continuous inventory counting.',
                status: 'Upcoming',
                color: 'text-slate-400 border-slate-800 bg-slate-950/50'
              },
              {
                sprint: 'Sprint 5',
                title: 'Warranty, Rental, & Service Center Portal',
                deliverables: 'Asset tracking, rental deposit/return date calculator, warranty expiry tracker, service ticket technician dispatch.',
                status: 'Upcoming',
                color: 'text-slate-400 border-slate-800 bg-slate-950/50'
              },
              {
                sprint: 'Sprint 6',
                title: 'Thermal Label Printing & AI Graph Analytics',
                deliverables: '40x20mm / 50x30mm thermal label vector exporter, AI graph insights for inventory forecasting and customer purchase lifetime.',
                status: 'Upcoming',
                color: 'text-slate-400 border-slate-800 bg-slate-950/50'
              },
            ].map(s => (
              <div key={s.sprint} className={`p-5 rounded-2xl border ${s.color} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs uppercase">{s.sprint}</span>
                    <h3 className="font-bold text-white text-sm">{s.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{s.deliverables}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold border border-current shrink-0 self-start sm:self-center">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE ENTITY MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-lg w-full bg-graphite-950 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Create BillSoft Entity Identity</span>
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Entity Type</label>
                <select
                  value={newEntityType}
                  onChange={(e) => setNewEntityType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                >
                  {['Product', 'Customer', 'Invoice', 'Rental Asset', 'Warehouse', 'Stock Batch', 'Warranty', 'Service Ticket', 'Supplier'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Entity Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Barcode Scanner RF-900"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Code / SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. SKU-RF900"
                    value={newEntityCode}
                    onChange={(e) => setNewEntityCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category / Subtype</label>
                  <input
                    type="text"
                    placeholder="e.g. Hardware"
                    value={newEntityCategory}
                    onChange={(e) => setNewEntityCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price / Amount (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹8,500"
                    value={newEntityPrice}
                    onChange={(e) => setNewEntityPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Location / Zone (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Bin B-04"
                    value={newEntityLocation}
                    onChange={(e) => setNewEntityLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-sky-300 text-[11px]">
                Upon saving, UQIS automatically allocates a UUID, Public QR ID (e.g. {billSoftService.generatePublicQrId(newEntityType)}), and syncs with PostgreSQL &amp; Neo4j.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-lg shadow-sky-500/20 transition-all"
                >
                  Generate QR Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
