import React, { useState } from 'react';
import { 
  Sparkles, Layers, RefreshCw, Cpu, Database, Network, ArrowRight, ShieldCheck, 
  History, GitBranch, Search, Zap, CheckCircle2, Lock, Terminal, Activity, FileText, Server
} from 'lucide-react';
import { sound } from '../../services/audio';

export const IntelligenceArchitectureShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'versioning' | 'scanId' | 'layers' | 'stack'>('matrix');
  const [activeLayer, setActiveLayer] = useState<number>(1);

  // 15 Industry Passports Matrix Data
  const industryMatrix = [
    { industry: 'Manufacturing', passport: 'Product Passport', desc: 'Component BOM, plant assembly line, quality inspection certificates & recall tracking.' },
    { industry: 'Electronics', passport: 'Device Passport', desc: 'IMEI, MAC address, factory burn-in logs, active warranty coverage & repair history.' },
    { industry: 'Automotive', passport: 'Vehicle Passport', desc: 'VIN number, motor serials, battery SOH, service history, RTO details & resale transfer.' },
    { industry: 'Healthcare', passport: 'Equipment Passport', desc: 'FDA UDI code, ISO 13485 compliance, NABL calibration schedules & biomedical technician logs.' },
    { industry: 'Pharmacy', passport: 'Medicine Traceability', desc: 'GS1 DataMatrix 2D serialization, sterile batch lots, expiry alerts & cold-chain temperature logs.' },
    { industry: 'Retail', passport: 'Product Experience', desc: 'EAN-13 barcodes, material care guides, dynamic pricing, instant warranty & loyalty rewards.' },
    { industry: 'Logistics', passport: 'Shipment Passport', desc: 'Waybill manifests, origin FC, destination sorting hub, carrier pickup & proof of delivery (POD).' },
    { industry: 'Hospitality', passport: 'Room Intelligence', desc: 'PMS room state, Wi-Fi credentials, 1-tap housekeeping, in-room dining & express checkout.' },
    { industry: 'Restaurant', passport: 'Table & Order Intelligence', desc: 'Table seating state, dynamic digital menu, shared table cart, KOT kitchen printing & UPI billing.' },
    { industry: 'Education', passport: 'Campus & Asset Identity', desc: 'Geo-fenced attendance, GPU lab workstation allocation, assignment repos & IT issue tickets.' },
    { industry: 'Real Estate', passport: 'Property Passport', desc: 'RERA registration, Occupancy Certificate (OC), utility meter IDs, lease contracts & maintenance dues.' },
    { industry: 'Construction', passport: 'Material Traceability', desc: 'Structural steel heat codes, ultrasonic NDT test reports, crane hoisting & BIM milestone locks.' },
    { industry: 'Agriculture', passport: 'Crop Passport', desc: 'USDA Organic certification, 0% chemical residue lab reports, Brix rating & farm-to-table origin.' },
    { industry: 'Jewellery', passport: 'Authenticity Passport', desc: 'GIA / IGI grading reports, 18K white gold purity, solitaire diamond specs & ownership title deeds.' },
    { industry: 'Rental & Equipment', passport: 'Asset Rental Passport', desc: 'Heavy machinery hour-meters, pre-rental video inspections, return signoffs & rental readiness.' }
  ];

  // 5 Database Thinking Layers Data
  const databaseLayers = [
    {
      layer: 1,
      title: 'Identity',
      question: 'What is this?',
      description: 'Permanent cryptographic identity token that uniquely identifies physical products, components, assets, or properties.',
      fields: ['qr_uid', 'entity_id', 'entity_type'],
      example: 'qr_uid: UQ-AUTO-1729 | entity_type: Vehicle | entity_id: prod-vin-8819'
    },
    {
      layer: 2,
      title: 'Configuration',
      question: 'What should this QR do?',
      description: 'Defines Notion + Airtable style dynamic schema, form fields, validation rules, permissions, and available UI actions.',
      fields: ['template', 'fields', 'sections', 'validation', 'permissions', 'actions'],
      example: 'template: Automotive_Vehicle_Passport | validation: { required: true, isPublic: true }'
    },
    {
      layer: 3,
      title: 'Version',
      question: 'What did this QR look/behave like at a point in time?',
      description: 'Maintains complete historical schema evolution. The physical QR code remains static while intelligence updates across versions.',
      fields: ['version_number', 'schema_version', 'configuration', 'valid_from', 'change_reason'],
      example: 'version_number: 3 | change_reason: Added 36-Month Warranty & Service History'
    },
    {
      layer: 4,
      title: 'Event',
      question: 'What happened?',
      description: 'Records every scan, view, maintenance check, payment, or ownership transfer as an immutable cryptographic event.',
      fields: ['scan_id', 'timestamp', 'session_id', 'device_id_hash', 'ip_hash', 'action'],
      example: 'scan_id: SCAN-20260812-8F72A9C1 | action: WARRANTY_VERIFICATION_PASS'
    },
    {
      layer: 5,
      title: 'Intelligence',
      question: 'What can UniQR infer?',
      description: 'Evaluates context, rules, ML risk models, and graph relationships to trigger real-time predictions and dynamic UI experiences.',
      fields: ['risk', 'anomaly', 'recommendation', 'next_action', 'prediction', 'relationship'],
      example: 'prediction: { failureRisk: "LOW (2.1%)", warrantyStatus: "354 Days Active" }'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-[#F9D2BA] selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      <div className="max-w-7xl mx-auto space-y-12">
        


        {/* NAVIGATION TABS FOR ARCHITECTURE SHOWCASE */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-[#F9D2BA]">
          {[
            { id: 'matrix', label: '1. Traditional vs UniQR' },
            { id: 'versioning', label: '2. QR Version Management' },
            { id: 'scanId', label: '3. Scan ID & Reproducibility' },
            { id: 'layers', label: '4. 5-Layer Database Thinking' },
            { id: 'stack', label: '5. 15 Industry Passports' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(t.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'bg-[#1D4533] text-[#F7EAE0] shadow-md scale-105'
                  : 'bg-[#F7EAE0] text-[#5E3122] hover:bg-[#F9D2BA]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: TRADITIONAL VS UNIQR (THE IMPORTANT PART: UNIQR IS NOT JUST QR) */}
        {activeTab === 'matrix' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase text-[#1D4533] tracking-widest">The Core Architectural Shift</span>
              <h3 className="text-2xl font-extrabold text-[#1D4533]">The Important Part: UniQR Is Not Just QR</h3>
              <p className="text-xs text-[#5E3122] font-semibold">
                The physical QR code is merely an access point. The real asset is the living digital identity behind it.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* TRADITIONAL QR */}
              <div className="bg-[#F7EAE0] p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] space-y-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-extrabold inline-block border border-red-200">
                    Traditional QR Code
                  </div>
                  <h4 className="text-xl font-extrabold text-[#5E3122]">Static Link Pointer</h4>
                  <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                    Treats the QR code as a disposable image pointing to a single static URL webpage. Cannot update without replacing physical stickers.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#F9D2BA] font-mono text-xs text-[#5E3122] space-y-2 text-center shadow-inner">
                  <div className="font-extrabold text-[#1D4533]">QR Matrix</div>
                  <div className="text-[#5E3122]">&darr;</div>
                  <div className="font-bold text-red-700">Static URL Webpage</div>
                  <div className="text-[#5E3122]">&darr;</div>
                  <div className="text-[10px] text-gray-500">Unchanged HTML Output</div>
                </div>
              </div>

              {/* UNIQR LIVING IDENTITY */}
              <div className="bg-[#1D4533] p-6 sm:p-8 rounded-3xl border-2 border-[#F9D2BA] text-[#F7EAE0] space-y-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] text-xs font-extrabold inline-block">
                    UniQR Living Digital Identity
                  </div>
                  <h4 className="text-xl font-extrabold text-white">Dynamic Multi-Entity Identity Engine</h4>
                  <p className="text-xs text-[#F7EAE0]/90 font-semibold leading-relaxed">
                    A single persistent physical QR connects products, owners, transactions, warranties, service logs, and real-time AI context rules.
                  </p>
                </div>

                {/* LIVING IDENTITY MATRIX CHIPS */}
                <div className="p-4 bg-[#5E3122]/60 rounded-2xl border border-[#F9D2BA]/30 space-y-3 relative z-10 shadow-inner">
                  <div className="text-[10px] font-extrabold uppercase text-[#F9D2BA] text-center tracking-wider">
                    QR Identity Connected Entities
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {[
                      'Product', 'Customer', 'Location', 'Owner', 'Transaction', 
                      'Warranty', 'Service', 'Inventory', 'Documents', 'Events', 
                      'Scans', 'Versions', 'Intelligence'
                    ].map(item => (
                      <span key={item} className="px-2.5 py-1 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-bold text-[11px] shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: QR VERSION MANAGEMENT */}
        {activeTab === 'versioning' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase text-[#1D4533] tracking-widest">Database Level Schema Evolution</span>
              <h3 className="text-2xl font-extrabold text-[#1D4533]">UniQR Version Management</h3>
              <p className="text-xs text-[#5E3122] font-semibold">
                The physical QR code remains 100% unchanged while its underlying schema and intelligence evolve over time.
              </p>
            </div>

            {/* VERSION EVOLUTION DIAGRAM */}
            <div className="p-6 bg-[#F7EAE0] rounded-3xl border border-[#F9D2BA] space-y-4">
              <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                <span className="font-extrabold text-sm text-[#1D4533] flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-[#1D4533]" />
                  <span>Physical QR Code: UQ-PRD-000001 (Static Engraving)</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs">
                  Physical Code Unchanged
                </span>
              </div>

              <div className="grid sm:grid-cols-4 gap-3 text-xs">
                {[
                  { v: 'Version 1', label: 'Manufacturing Info', desc: 'Basic product specs & serial number.' },
                  { v: 'Version 2', label: '+ Active Warranty', desc: 'Adds automated digital warranty tracking.' },
                  { v: 'Version 3', label: '+ Service History', desc: 'Integrates maintenance & repair audit logs.' },
                  { v: 'Version 4', label: '+ Ownership Transfer', desc: 'Enables customer resale & title deed transfer.' }
                ].map((ver, idx) => (
                  <div key={ver.v} className="p-4 bg-white rounded-2xl border border-[#F9D2BA] space-y-2 shadow-sm relative">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#1D4533] text-xs">{ver.v}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="font-bold text-[#5E3122] text-xs">{ver.label}</div>
                    <p className="text-[11px] text-[#5E3122] font-medium leading-relaxed">{ver.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DATABASE SCHEMAS TABLES */}
            <div className="grid md:grid-cols-2 gap-6 text-xs">
              
              {/* QR_IDENTITY SCHEMA TABLE */}
              <div className="bg-white p-5 rounded-2xl border border-[#F9D2BA] space-y-3 shadow-sm">
                <h4 className="font-extrabold text-xs text-[#1D4533] uppercase flex items-center gap-1.5 border-b border-[#F9D2BA] pb-2">
                  <Database className="w-4 h-4 text-[#1D4533]" />
                  <span>Schema: qr_identity Table</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold text-[11px]">
                        <th className="py-1.5">Field</th>
                        <th className="py-1.5">Type</th>
                        <th className="py-1.5">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F9D2BA]/50 text-[11px] font-semibold text-[#1D4533]">
                      <tr><td className="py-1.5 font-bold">id</td><td>UUID</td><td>Internal unique primary key</td></tr>
                      <tr><td className="py-1.5 font-bold">qr_uid</td><td>String</td><td>Permanent public UniQR identifier</td></tr>
                      <tr><td className="py-1.5 font-bold">entity_type</td><td>String</td><td>Product, Customer, Asset, Property</td></tr>
                      <tr><td className="py-1.5 font-bold">current_version_id</td><td>UUID</td><td>Active schema version pointer</td></tr>
                      <tr><td className="py-1.5 font-bold">status</td><td>Enum</td><td>Active / Inactive / Revoked</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR_VERSION SCHEMA TABLE */}
              <div className="bg-white p-5 rounded-2xl border border-[#F9D2BA] space-y-3 shadow-sm">
                <h4 className="font-extrabold text-xs text-[#1D4533] uppercase flex items-center gap-1.5 border-b border-[#F9D2BA] pb-2">
                  <Database className="w-4 h-4 text-[#1D4533]" />
                  <span>Schema: qr_version Table</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold text-[11px]">
                        <th className="py-1.5">Field</th>
                        <th className="py-1.5">Type</th>
                        <th className="py-1.5">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F9D2BA]/50 text-[11px] font-semibold text-[#1D4533]">
                      <tr><td className="py-1.5 font-bold">id</td><td>UUID</td><td>Version unique identifier</td></tr>
                      <tr><td className="py-1.5 font-bold">version_number</td><td>Int</td><td>1, 2, 3, 4 (Incremental)</td></tr>
                      <tr><td className="py-1.5 font-bold">configuration</td><td>JSONB</td><td>Form fields, validation &amp; actions</td></tr>
                      <tr><td className="py-1.5 font-bold">change_reason</td><td>Text</td><td>Audit trail reason for upgrade</td></tr>
                      <tr><td className="py-1.5 font-bold">valid_from</td><td>Timestamp</td><td>Activation timestamp</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: SCAN ID & HISTORICAL REPRODUCIBILITY */}
        {activeTab === 'scanId' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase text-[#1D4533] tracking-widest">Cryptographic Scan Audit Events</span>
              <h3 className="text-2xl font-extrabold text-[#1D4533]">Scan ID Event Management</h3>
              <p className="text-xs text-[#5E3122] font-semibold">
                Every scan becomes an immutable cryptographic event with a unique <code className="font-mono bg-[#F7EAE0] px-1 py-0.5 rounded text-[#1D4533]">scan_id</code> instead of simple counter increments.
              </p>
            </div>

            {/* SCAN EVENT STRUCTURE SHOWCASE */}
            <div className="p-6 bg-[#1D4533] text-[#F7EAE0] rounded-3xl border border-[#F9D2BA] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#F9D2BA]/30 pb-3">
                <span className="font-extrabold text-sm text-[#F9D2BA] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#F9D2BA]" />
                  <span>Unique Event Token: SCAN-20260812-8F72A9C1</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs">
                  Historical Reproducibility Verified
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#5E3122]/60 rounded-xl border border-[#F9D2BA]/30 space-y-1">
                  <div className="text-[10px] text-[#F9D2BA] uppercase font-bold">Version 1 Scans</div>
                  <div className="text-[#F7EAE0]">Scan 001 - Manufacturing Check</div>
                  <div className="text-[#F7EAE0]">Scan 002 - Warehouse Intake</div>
                </div>

                <div className="p-3 bg-[#5E3122]/60 rounded-xl border border-[#F9D2BA]/30 space-y-1">
                  <div className="text-[10px] text-[#F9D2BA] uppercase font-bold">Version 2 Scans</div>
                  <div className="text-[#F7EAE0]">Scan 003 - Customer Purchase</div>
                  <div className="text-[#F7EAE0]">Scan 004 - Warranty Activation</div>
                </div>

                <div className="p-3 bg-[#5E3122]/60 rounded-xl border border-[#F9D2BA]/30 space-y-1">
                  <div className="text-[10px] text-[#F9D2BA] uppercase font-bold">Version 3 Scans</div>
                  <div className="text-[#F7EAE0]">Scan 005 - Maintenance Check</div>
                  <div className="text-[#F7EAE0]">Scan 006 - Title Resale Transfer</div>
                </div>
              </div>
            </div>

            {/* QR_SCAN SCHEMA TABLE */}
            <div className="bg-white p-6 rounded-2xl border border-[#F9D2BA] space-y-3 shadow-sm text-xs">
              <h4 className="font-extrabold text-xs text-[#1D4533] uppercase flex items-center gap-1.5 border-b border-[#F9D2BA] pb-2">
                <TableIcon className="w-4 h-4 text-[#1D4533]" />
                <span>Schema: qr_scan Table</span>
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { k: 'scan_id', v: 'Unique scan event token' },
                  { k: 'qr_id', v: 'Parent QR identity' },
                  { k: 'qr_version_id', v: 'Active version during scan' },
                  { k: 'timestamp', v: 'Precise UTC scan timestamp' },
                  { k: 'session_id', v: 'Privacy-safe session token' },
                  { k: 'ip_hash', v: 'Privacy-hashed IP address' },
                  { k: 'action', v: 'Verify, Order, Report, Transfer' },
                  { k: 'result', v: 'Success / Warning / Blocked' },
                  { k: 'location_id', v: 'Geo-fenced scan location' }
                ].map(item => (
                  <div key={item.k} className="p-2.5 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA]">
                    <div className="font-extrabold text-[#1D4533]">{item.k}</div>
                    <div className="text-[10px] text-[#5E3122] font-semibold">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: 5-LAYER DATABASE THINKING */}
        {activeTab === 'layers' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase text-[#1D4533] tracking-widest">Multi-Dimensional Architecture</span>
              <h3 className="text-2xl font-extrabold text-[#1D4533]">The UniQR Database Thinks in 5 Layers</h3>
              <p className="text-xs text-[#5E3122] font-semibold">
                Click each layer to inspect how UniQR organizes identity, configuration, versions, events, and AI inferences.
              </p>
            </div>

            {/* LAYER SELECTOR BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {databaseLayers.map(l => (
                <button
                  key={l.layer}
                  onClick={() => {
                    sound.playClick();
                    setActiveLayer(l.layer);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeLayer === l.layer
                      ? 'bg-[#1D4533] text-[#F7EAE0] border-[#F9D2BA] shadow-lg scale-105'
                      : 'bg-[#F7EAE0] text-[#5E3122] border-[#F9D2BA] hover:bg-[#F9D2BA]'
                  }`}
                >
                  <div className="text-[10px] font-extrabold uppercase opacity-80">Layer {l.layer}</div>
                  <div className="font-extrabold text-sm mt-0.5">{l.title}</div>
                  <div className="text-[10px] opacity-90 mt-1 font-semibold">{l.question}</div>
                </button>
              ))}
            </div>

            {/* ACTIVE LAYER DETAIL CARD */}
            {(() => {
              const layer = databaseLayers.find(l => l.layer === activeLayer)!;
              return (
                <div className="p-6 bg-[#F7EAE0] rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm text-xs">
                  <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#1D4533]">Layer {layer.layer}: {layer.title}</span>
                      <h4 className="text-lg font-extrabold text-[#1D4533]">{layer.question}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#1D4533] text-[#F7EAE0] text-xs font-extrabold">
                      Active Layer
                    </span>
                  </div>

                  <p className="text-xs text-[#5E3122] font-semibold leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="space-y-2">
                    <span className="font-extrabold text-[#1D4533] uppercase text-[10px]">Key Schema Fields:</span>
                    <div className="flex flex-wrap gap-2">
                      {layer.fields.map(f => (
                        <span key={f} className="px-3 py-1 rounded-xl bg-white text-[#1D4533] font-bold text-xs border border-[#F9D2BA] shadow-sm">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-[#1D4533] text-[#F7EAE0] rounded-xl font-mono text-[11px] space-y-1">
                    <span className="text-[10px] text-[#F9D2BA] font-bold uppercase">Runtime Example:</span>
                    <div>{layer.example}</div>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        {/* TAB 5: 15 INDUSTRY PASSPORTS MATRIX */}
        {activeTab === 'stack' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase text-[#1D4533] tracking-widest">Industry Positioning Matrix</span>
              <h3 className="text-2xl font-extrabold text-[#1D4533]">15 Industry UniQR Passports</h3>
              <p className="text-xs text-[#5E3122] font-semibold">
                Every industry vertical connects to a specialized UniQR digital identity passport.
              </p>
            </div>

            {/* INDUSTRY MATRIX TABLE */}
            <div className="bg-white rounded-3xl border border-[#F9D2BA] shadow-sm overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs">
                      <th className="p-4">Industry Vertical</th>
                      <th className="p-4">UniQR Digital Identity Passport</th>
                      <th className="p-4">Operational Process Capabilities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F9D2BA]/60 text-xs">
                    {industryMatrix.map((row, idx) => (
                      <tr key={row.industry} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F7EAE0]/50'}>
                        <td className="p-4 font-extrabold text-[#1D4533]">{row.industry}</td>
                        <td className="p-4 font-bold text-[#5E3122]">
                          <span className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] font-extrabold text-[11px] inline-block shadow-sm">
                            {row.passport}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-[#5E3122] leading-relaxed">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

const TableIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);
