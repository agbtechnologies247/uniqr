import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, ChevronRight, X, ShieldCheck } from 'lucide-react';

interface OnboardingChecklistProps {
  onOpenNewProduct: () => void;
  onNavigate: (tab: string) => void;
  onOpenUpgrade: () => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  onOpenNewProduct,
  onNavigate,
  onOpenUpgrade
}) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'create-product': true,
    'add-details': true,
    'add-trail': true,
    'publish': true,
    'scan-qr': false,
    'download': false,
    'share': false,
    'create-account': false
  });

  const steps = [
    { id: 'create-product', label: 'Create Product Twin', action: () => onOpenNewProduct() },
    { id: 'add-details', label: 'Add Notion Details', action: () => onNavigate('products') },
    { id: 'add-trail', label: 'Add Trail Ledger', action: () => onNavigate('products') },
    { id: 'publish', label: 'Publish Dynamic Identity', action: () => onNavigate('qr-studio') },
    { id: 'scan-qr', label: 'Scan Live QR', action: () => onNavigate('scanner') },
    { id: 'download', label: 'Download Vector/Raster', action: () => onNavigate('qr-studio') },
    { id: 'share', label: 'Share Digital Twin', action: () => onNavigate('qr-studio') },
    { id: 'create-account', label: 'Unlock Enterprise Account', action: () => onOpenUpgrade() }
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const toggleStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isDismissed) return null;

  return (
    <div className="bg-[#1D4533] border-b border-[#F9D2BA]/30 px-4 py-3 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left info & progress */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5 text-[#1D4533] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F9D2BA]">Product Hunt Interactive Guide</span>
              <span className="text-[10px] bg-[#F9D2BA] text-[#1D4533] font-mono px-2 py-0.5 rounded-full font-bold">
                {completedCount}/{steps.length} Completed ({progressPercent}%)
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#F7EAE0] flex items-center gap-1.5 mt-0.5">
              Build your first Living Digital Twin QR Code
            </h4>
          </div>
        </div>

        {/* Horizontal step pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar">
          {steps.map((step) => {
            const isDone = completedSteps[step.id];
            return (
              <button
                key={step.id}
                onClick={(e) => {
                  step.action();
                  toggleStep(step.id, e);
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#F9D2BA] ${
                  isDone
                    ? 'bg-[#F9D2BA] border-[#F9D2BA] text-[#1D4533] font-bold'
                    : 'bg-[#5E3122] border-[#5E3122] text-[#F7EAE0] hover:bg-[#F9D2BA] hover:text-[#1D4533]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4533]" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#F9D2BA]" />
                )}
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 shrink-0 self-end md:self-center"
          title="Dismiss guide"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
