import React, { useState, useEffect } from 'react';
import { Sparkles, Package, ShieldCheck, Cpu, RefreshCw, Network, ArrowRight, X } from 'lucide-react';
import { sound } from '../../services/audio';

interface FeatureExplorerProps {
  onNavigate: (tab: string) => void;
  onOpenNewProduct: () => void;
  onClose?: () => void;
  forceOpen?: boolean;
}

export const FeatureExplorer: React.FC<FeatureExplorerProps> = ({
  onNavigate,
  onOpenNewProduct,
  onClose,
  forceOpen = false
}) => {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (forceOpen) return false;
    return localStorage.getItem('uniqr_capability_guide_dismissed') === 'true';
  });

  useEffect(() => {
    if (forceOpen) {
      setIsDismissed(false);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    sound.playClick();
    setIsDismissed(true);
    localStorage.setItem('uniqr_capability_guide_dismissed', 'true');
    if (onClose) onClose();
  };

  const capabilities = [
    {
      id: 'digital-twins',
      title: 'Register Digital Twin Identities',
      subtitle: 'Physical Product & Asset Identification',
      description: 'Assign scannable, permanent identity tokens to physical products, equipment, vehicles, or inventory items.',
      icon: Package,
      actionLabel: 'Register New Asset',
      action: () => onOpenNewProduct(),
    },
    {
      id: 'authenticity-ledger',
      title: 'Audit Life-Cycle History',
      subtitle: 'Tamper-Evident Business Trail',
      description: 'View chronological manufacturing, quality check, repair, and transfer records with digital signatures.',
      icon: ShieldCheck,
      actionLabel: 'Explore Product History',
      action: () => onNavigate('inventory'),
    },
    {
      id: 'ai-predictive',
      title: 'AI Predictive Maintenance',
      subtitle: 'Real-Time Failure Risk & Part Alerts',
      description: 'Detect high failure probability in advance and get automated component replacement recommendations on scan.',
      icon: Cpu,
      actionLabel: 'Test AI Decision Engine',
      action: () => onNavigate('inventory'),
    },
    {
      id: 'dynamic-persona',
      title: 'Persona-Aware Dynamic Scans',
      subtitle: 'Role-Based Gateway Views',
      description: 'A single QR code dynamically adapts to display User Manuals for Customers or Diagnostic Logs for Engineers.',
      icon: RefreshCw,
      actionLabel: 'Open Dynamic Gateway',
      action: () => onNavigate('qr-studio'),
    },
    {
      id: 'connected-networks',
      title: 'Map Connected Asset Networks',
      subtitle: 'Relationship & Ownership Mapping',
      description: 'Visualize connections between companies, sub-components, engineers, locations, and invoices in real time.',
      icon: Network,
      actionLabel: 'View Asset Network',
      action: () => onNavigate('graph'),
    },
  ];

  if (isDismissed && !forceOpen) return null;

  const currentCap = capabilities[activeFeature];
  const Icon = currentCap.icon;

  return (
    <div className="bg-[#1D4533] border-b border-[#F9D2BA]/30 px-4 py-4 sm:px-6 shadow-md text-[#F7EAE0] animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#1D4533] animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F9D2BA]">Platform Capability Guide</span>
              <h3 className="text-sm font-extrabold text-[#F7EAE0] -mt-0.5">What You Can Do on UniQR</h3>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#F9D2BA] hover:text-[#F7EAE0] p-1.5 rounded-lg hover:bg-[#5E3122]/60 transition-colors"
            title="Dismiss Guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {capabilities.map((cap, idx) => {
            const CapIcon = cap.icon;
            const isSelected = activeFeature === idx;
            return (
              <button
                key={cap.id}
                onClick={() => {
                  sound.playClick();
                  setActiveFeature(idx);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#F9D2BA] text-[#1D4533] border-[#F9D2BA] font-extrabold shadow-sm'
                    : 'bg-[#5E3122] text-[#F7EAE0] border-[#5E3122] hover:bg-[#1D4533] hover:border-[#F9D2BA]/40'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <CapIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#1D4533]' : 'text-[#F9D2BA]'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Step 0{idx + 1}</span>
                </div>
                <div className="text-xs font-bold line-clamp-1">{cap.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Capability Feature Spotlight */}
        <div className="bg-[#5E3122] p-4 rounded-2xl border border-[#F9D2BA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center shrink-0 font-bold shadow-sm mt-0.5">
              <Icon className="w-5 h-5 text-[#1D4533]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#F9D2BA]">{currentCap.subtitle}</span>
              </div>
              <h4 className="text-base font-extrabold text-[#F7EAE0] mt-0.5">{currentCap.title}</h4>
              <p className="text-xs text-[#F7EAE0]/90 font-medium mt-1 leading-relaxed max-w-3xl">
                {currentCap.description}
              </p>
            </div>
          </div>

          <button
            onClick={currentCap.action}
            className="px-5 py-2.5 rounded-xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-extrabold text-xs flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>{currentCap.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
