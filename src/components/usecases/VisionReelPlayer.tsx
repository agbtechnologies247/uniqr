import React, { useState, useEffect } from 'react';
import { 
  Sparkles, QrCode, ShieldCheck, Cpu, Terminal, Wifi, Battery, Signal, FileText, CheckCircle2, RefreshCw, Lock
} from 'lucide-react';
import { IndustryUseCase } from '../../data/useCaseData';

interface VisionReelPlayerProps {
  useCase: IndustryUseCase;
}

export const VisionReelPlayer: React.FC<VisionReelPlayerProps> = ({ useCase }) => {
  const [activePhase, setActivePhase] = useState<'filling' | 'document' | 'scanning'>('filling');
  const [typedTextLength, setTypedTextLength] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeQrSize, setActiveQrSize] = useState<'micro' | 'packaging' | 'metal'>('packaging');

  const fullTextToType = useCase.title + " — " + useCase.subtitle;

  useEffect(() => {
    let startTime = performance.now();
    let animId: number;
    const loopDuration = 12; // 12-second total multi-phase motion loop

    const updatePhaseLoop = (now: number) => {
      const elapsed = ((now - startTime) / 1000) % loopDuration;
      const pct = (elapsed / loopDuration) * 100;
      setProgressPercent(pct);

      // Phase 1: 0s to 4s (Form Auto-Filling)
      // Phase 2: 4s to 8s (Document & Digital Twin Ledger Creation)
      // Phase 3: 8s to 12s (Multi-Size QR Code Scan & Passport Verification)
      if (elapsed < 4) {
        setActivePhase('filling');
        const charCount = Math.floor((elapsed / 4) * fullTextToType.length);
        setTypedTextLength(charCount);
      } else if (elapsed < 8) {
        setActivePhase('document');
      } else {
        setActivePhase('scanning');
        const sizeIdx = Math.floor(((elapsed - 8) / 4) * 3);
        const sizes: ('micro' | 'packaging' | 'metal')[] = ['micro', 'packaging', 'metal'];
        setActiveQrSize(sizes[sizeIdx] || 'packaging');
      }

      animId = requestAnimationFrame(updatePhaseLoop);
    };

    animId = requestAnimationFrame(updatePhaseLoop);
    return () => cancelAnimationFrame(animId);
  }, [useCase, fullTextToType]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* PHASE HEADER BADGE */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] font-extrabold text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F9D2BA] animate-pulse" />
          <span>
            {activePhase === 'filling' && 'Phase 1: Dynamic Form Auto-Filling'}
            {activePhase === 'document' && 'Phase 2: Digital Twin & Ledger Creation'}
            {activePhase === 'scanning' && 'Phase 3: Multi-Size QR Passport Authentication'}
          </span>
        </div>
      </div>

      {/* SLEEK MOBILE DEVICE MOCKUP FRAME */}
      <div className="relative w-full max-w-[340px] bg-black p-3.5 rounded-[42px] shadow-2xl border-4 border-[#5E3122] overflow-hidden">
        
        {/* SMARTPHONE NOTCH */}
        <div className="absolute top-4 inset-x-0 flex justify-center z-30 pointer-events-none">
          <div className="w-24 h-4 bg-black rounded-b-xl flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* SCREEN VIEWPORT */}
        <div className="bg-[#F7EAE0] rounded-[32px] overflow-hidden border border-[#F9D2BA] text-[#5E3122] flex flex-col justify-between min-h-[560px] pt-7 relative">
          
          {/* MOBILE STATUS BAR */}
          <div className="px-5 py-1 flex items-center justify-between text-[10px] font-bold text-[#1D4533] border-b border-[#F9D2BA]/50">
            <span>9:41 AM</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-[#1D4533]" />
              <Wifi className="w-3 h-3 text-[#1D4533]" />
              <Battery className="w-3.5 h-3.5 text-[#1D4533]" />
            </div>
          </div>

          {/* SCREEN BODY: 3 ANIMATED MOTION PHASES */}
          <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            
            {/* PHASE 1: DYNAMIC FORM AUTO-FILLING */}
            {activePhase === 'filling' && (
              <div className="space-y-4 animate-fadeIn my-auto">
                <div className="p-3 bg-white rounded-2xl border border-[#F9D2BA] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[#1D4533]">
                    <span>Form Auto-Filler</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-[#5E3122]">Entity Name:</label>
                      <div className="p-2.5 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA] text-[#1D4533] font-extrabold flex items-center justify-between">
                        <span>{fullTextToType.slice(0, typedTextLength)}</span>
                        <span className="w-1.5 h-3.5 bg-[#1D4533] animate-pulse inline-block" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold uppercase text-[#5E3122]">Industry Category:</label>
                      <div className="p-2.5 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA] text-[#1D4533] font-extrabold">
                        {useCase.category}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#1D4533] text-[#F7EAE0] rounded-xl text-[10px] font-semibold text-center shadow-md">
                  Simulating Real-Time Attribute Auto-Filling...
                </div>
              </div>
            )}

            {/* PHASE 2: DIGITAL TWIN & LEDGER DOCUMENT CREATION */}
            {activePhase === 'document' && (
              <div className="space-y-4 animate-fadeIn my-auto">
                <div className="p-4 bg-white rounded-2xl border-2 border-[#1D4533] shadow-lg text-center space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-[#1D4533] animate-bounce" />
                  </div>

                  <h4 className="font-extrabold text-xs text-[#1D4533]">
                    Digital Twin Record Created
                  </h4>

                  <div className="p-2.5 bg-[#1D4533] text-[#F7EAE0] rounded-xl font-mono text-[9px] text-left space-y-1">
                    <div className="text-[#F9D2BA] font-extrabold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#F9D2BA]" />
                      <span>SHA-256 Ledger Lock:</span>
                    </div>
                    <div className="truncate text-[#F7EAE0] font-bold">e3b0c44298fc1c149afbf4c8996fb924</div>
                  </div>
                </div>

                <div className="p-3 bg-[#5E3122] text-[#F7EAE0] rounded-xl text-[10px] font-extrabold text-center shadow-md flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Permanent Passport Seal Applied</span>
                </div>
              </div>
            )}

            {/* PHASE 3: MULTI-SIZE QR CODE SCANNING & AUTHENTICATION */}
            {activePhase === 'scanning' && (
              <div className="space-y-3 animate-fadeIn my-auto">
                
                {/* SIZE INDICATOR CHIPS */}
                <div className="flex justify-center gap-1.5 text-[9px] font-bold">
                  {[
                    { id: 'micro', label: 'Micro Tag (0.8mm)' },
                    { id: 'packaging', label: '8K Packaging QR' },
                    { id: 'metal', label: 'Laser Steel Engraved' }
                  ].map(sz => (
                    <span 
                      key={sz.id}
                      className={`px-2 py-0.5 rounded-full transition-all ${
                        activeQrSize === sz.id
                          ? 'bg-[#1D4533] text-[#F7EAE0] font-extrabold scale-105'
                          : 'bg-white text-[#5E3122] border border-[#F9D2BA]'
                      }`}
                    >
                      {sz.label}
                    </span>
                  ))}
                </div>

                {/* QR CANVAS WITH LASER WAVE */}
                <div className="bg-white p-4 rounded-2xl border-2 border-[#1D4533] shadow-md text-center space-y-2 relative overflow-hidden">
                  <div 
                    className={`mx-auto bg-[#F7EAE0] p-2 rounded-xl border border-[#F9D2BA] flex items-center justify-center transition-all ${
                      activeQrSize === 'micro' ? 'w-20 h-20' : activeQrSize === 'packaging' ? 'w-28 h-28' : 'w-36 h-36 border-2 border-[#5E3122]'
                    }`}
                  >
                    <QrCode className="w-full h-full text-[#1D4533]" />
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 py-1 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PASSPORT AUTHENTICATED</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* SCREEN PROGRESS BAR */}
          <div className="w-full bg-[#F9D2BA] h-1.5">
            <div 
              className="bg-[#1D4533] h-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
