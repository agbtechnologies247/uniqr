import React from 'react';
import { 
  GitBranch, 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Layers, 
  FileCode, 
  Zap, 
  Clock, 
  Server, 
  Boxes 
} from 'lucide-react';
import { sound } from '../../services/audio';

interface VersionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionManagementModal: React.FC<VersionManagementModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const versionSpecs = [
    { label: 'Platform Release', val: 'v3.2.0 (Enterprise Stable)', icon: GitBranch },
    { label: 'Build Stamp', val: 'BUILD-2026.08.15-PROD', icon: Clock },
    { label: 'Cryptographic Core', val: 'SHA-256 Merkle Ledger', icon: ShieldCheck },
    { label: 'Schema Engine', val: 'Universal Meta-Registry v2.0', icon: Layers },
    { label: 'Vector & CAD Engine', val: 'DXF / SVG / EPS / PDF Pipeline', icon: FileCode },
    { label: 'Graph Topology', val: 'Neo4j & In-Memory Graph Node Engine', icon: Boxes },
  ];

  const changelog = [
    {
      version: 'v3.2.0',
      date: 'August 15, 2026',
      title: 'Context-Aware Dynamic Schema Engine & Custom Templates',
      highlights: [
        'Dynamic Core Identity Metadata mapping with full field-level inline renamability and deletion.',
        '1-Click Clone Entity feature to duplicate complex machines, batches, and products in seconds.',
        'Custom User Schema Templates saved locally and elevated to the top of the entity creator.',
        'Direct resolution pipeline syncing QR Studio canvas with live digital passports.',
        'Persistent Platform Capability Guide onboarding banner.'
      ]
    },
    {
      version: 'v3.1.0',
      date: 'August 10, 2026',
      title: 'Dynamic QR & Multi-Format CAD Vector Studio',
      highlights: [
        '8 industrial export formats: DXF (AutoCAD/Laser), SVG (Vector), EPS, AI, PDF, PNG, JPG, BMP.',
        'Customizable finder eyes, module rounding, background alpha, and error correction levels.',
        'Developer API Keys management console with granular CRUD permission scoping.',
        'Platform Administration Control Center with security posture metrics and audit logs.'
      ]
    },
    {
      version: 'v3.0.0',
      date: 'July 28, 2026',
      title: 'Universal 12-Schema Entity Engine & Living Passports',
      highlights: [
        'Expanded beyond consumer goods to support Machines, Equipment, Documents, Certificates, and Batches.',
        'Role-aware dynamic digital twin passports with public/private visibility toggles.',
        'Tamper-evident chronological trail ledger with cryptographic block verification.'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      <div className="bg-white text-[#5E3122] w-full max-w-2xl rounded-3xl border border-[#F9D2BA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="bg-[#1D4533] p-6 text-[#F7EAE0] flex items-center justify-between border-b border-[#F9D2BA]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center font-black shadow-md">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#F9D2BA] tracking-widest block">
                System Governance &amp; Version Management
              </span>
              <h2 className="text-xl font-extrabold text-[#F7EAE0]">
                UniQR Platform v3.2.0
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-[#F9D2BA] hover:text-white rounded-xl hover:bg-[#5E3122] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* SYSTEM SPECS GRID */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
              Active System Architecture Specs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {versionSpecs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="p-3 bg-[#F7EAE0]/50 rounded-2xl border border-[#F9D2BA] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#1D4533] flex items-center justify-center font-bold shadow-xs shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-[#5E3122] font-bold block">{spec.label}</span>
                      <span className="text-xs font-black text-[#1D4533] block truncate">{spec.val}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHANGELOG TIMELINE */}
          <div className="space-y-3 pt-4 border-t border-[#F9D2BA]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1D4533]">
              Platform Release Changelog
            </h3>
            
            <div className="space-y-4">
              {changelog.map((entry, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-[#F9D2BA] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#1D4533] text-[#F9D2BA] font-mono text-xs font-bold">
                        {entry.version}
                      </span>
                      <span className="text-xs font-bold text-[#1D4533]">{entry.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5E3122] font-semibold">{entry.date}</span>
                  </div>

                  <ul className="space-y-1.5 pt-1">
                    {entry.highlights.map((item, hi) => (
                      <li key={hi} className="flex items-start gap-2 text-xs text-[#5E3122] font-medium leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4533] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#F7EAE0] px-6 py-4 border-t border-[#F9D2BA] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Channel: Enterprise Production Stable</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-sm"
          >
            Close Version Info
          </button>
        </div>

      </div>
    </div>
  );
};
