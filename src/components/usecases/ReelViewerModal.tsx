import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Heart, Share2, ChevronUp, ChevronDown, 
  Sparkles, ShieldCheck, QrCode, MapPin, ArrowRight, Layers, CheckCircle2, Lock,
  FileText, Truck, ShieldAlert, Calendar, Hash, RefreshCw, Zap, ExternalLink, Search,
  Wifi, Battery, Smartphone, Copy, Check, Boxes, Award, CheckSquare, ChevronRight, ChevronLeft,
  Wrench, Activity, Clock
} from 'lucide-react';
import { IndustryUseCase, INDUSTRY_USE_CASES } from '../../data/useCaseData';
import { sound } from '../../services/audio';

interface ReelViewerModalProps {
  useCase: IndustryUseCase | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectUseCase?: (useCase: IndustryUseCase) => void;
  onNavigateToApp?: () => void;
}

export const ReelViewerModal: React.FC<ReelViewerModalProps> = ({
  useCase,
  isOpen,
  onClose,
  onSelectUseCase,
  onNavigateToApp
}) => {
  const [currentUseCaseIndex, setCurrentUseCaseIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(4820);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const activeUseCase = useCase || INDUSTRY_USE_CASES[currentUseCaseIndex] || INDUSTRY_USE_CASES[0];
  const totalSteps = activeUseCase.steps.length;

  useEffect(() => {
    if (useCase) {
      const idx = INDUSTRY_USE_CASES.findIndex(u => u.id === useCase.id);
      if (idx !== -1) setCurrentUseCaseIndex(idx);
    }
    setCurrentStepIndex(0);
    setStepProgress(0);
    setIsPlaying(true);
  }, [useCase, isOpen]);

  // Lively step progress timer (1.4 seconds per step)
  useEffect(() => {
    if (!isOpen || !isPlaying || !activeUseCase) return;

    const interval = setInterval(() => {
      setStepProgress(prev => {
        if (prev >= 100) {
          if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex(s => s + 1);
            if (!isMuted) sound.playClick();
            return 0;
          } else {
            setCurrentStepIndex(0); // loop reel
            return 0;
          }
        }
        return prev + 8;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, currentStepIndex, totalSteps, activeUseCase, isMuted]);

  // Keyboard navigation (ArrowUp / ArrowDown / Escape / Space)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentUseCaseIndex]);

  if (!isOpen || !activeUseCase) return null;

  const currentStep = activeUseCase.steps[currentStepIndex] || activeUseCase.steps[0];
  const screenPhase = currentStepIndex < 4 ? 1 : currentStepIndex < 8 ? 2 : currentStepIndex < 12 ? 3 : 4;

  const handleNextReel = () => {
    sound.playClick();
    const nextIdx = (currentUseCaseIndex + 1) % INDUSTRY_USE_CASES.length;
    setCurrentUseCaseIndex(nextIdx);
    setCurrentStepIndex(0);
    setStepProgress(0);
    if (onSelectUseCase) onSelectUseCase(INDUSTRY_USE_CASES[nextIdx]);
  };

  const handlePrevReel = () => {
    sound.playClick();
    const prevIdx = (currentUseCaseIndex - 1 + INDUSTRY_USE_CASES.length) % INDUSTRY_USE_CASES.length;
    setCurrentUseCaseIndex(prevIdx);
    setCurrentStepIndex(0);
    setStepProgress(0);
    if (onSelectUseCase) onSelectUseCase(INDUSTRY_USE_CASES[prevIdx]);
  };

  const handleCopyHash = () => {
    sound.playClick();
    navigator.clipboard.writeText('0x8f4a2b91e70c483a992d11e5f884b92e');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto selection:bg-[#F9D2BA] selection:text-[#1D4533]">
      
      {/* MODAL CONTAINER */}
      <div className="bg-[#12281e] text-white w-full max-w-5xl rounded-3xl border border-[#F9D2BA]/30 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col lg:flex-row relative max-h-[92vh]">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-10 h-10 rounded-2xl bg-white/15 hover:bg-[#F9D2BA] hover:text-[#1D4533] text-white flex items-center justify-center transition-all shadow-md backdrop-blur-md"
          title="Close Modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── LEFT COLUMN: HYPER-REALISTIC SMARTPHONE WITH LIVE APP SCREEN (5 COLS) ─── */}
        <div className="lg:w-5/12 bg-[#091610] p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#F9D2BA]/20 relative">
          
          {/* IPHONE 16 PRO DEVICE FRAME */}
          <div className="relative w-full max-w-[280px] aspect-[9/18.5] bg-[#020604] rounded-[48px] border-[6px] border-[#2a3a32] shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-between p-3 select-none ring-1 ring-[#F9D2BA]/30">
            
            {/* DYNAMIC ISLAND & STATUS BAR */}
            <div className="flex items-center justify-between px-3 pt-1 z-30">
              <span className="text-[10px] font-mono font-bold text-white tracking-widest">9:41</span>
              <div className="w-20 h-4 bg-black rounded-full border border-[#2a3a32] flex items-center justify-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-white">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* TOP SCRUBBED STORY PROGRESS BARS */}
            <div className="flex gap-1 my-1.5 z-30 px-1">
              {activeUseCase.steps.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex(idx);
                    setStepProgress(0);
                  }}
                  className="flex-1 h-1 rounded-full bg-white/25 cursor-pointer overflow-hidden relative"
                  title={`Step ${idx + 1}`}
                >
                  <div 
                    className="h-full bg-[#F9D2BA] transition-all duration-100 rounded-full"
                    style={{
                      width: idx < currentStepIndex ? '100%' : idx === currentStepIndex ? `${stepProgress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* INSIDE MOBILE SCREEN: REAL UNIR APP VIEW */}
            <div className="relative flex-1 bg-gradient-to-b from-[#1b3b2c] to-[#0c1f16] rounded-3xl border border-[#F9D2BA]/30 overflow-hidden p-3 flex flex-col justify-between shadow-inner">
              
              {/* APP BAR */}
              <div className="flex items-center justify-between border-b border-[#F9D2BA]/20 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-black text-[10px] flex items-center justify-center">
                    U
                  </div>
                  <span className="font-extrabold text-[11px] text-[#F7EAE0]">UniQR Studio</span>
                </div>
                <span className="text-[8px] font-mono font-bold bg-[#F9D2BA] text-[#1D4533] px-1.5 py-0.5 rounded-full">
                  STEP {currentStep.step}/16
                </span>
              </div>

              {/* DYNAMIC SCREEN CONTENT BASED ON ACTIVE STEP */}
              <div className="flex-1 my-2 flex flex-col justify-center space-y-2 overflow-hidden">
                
                {/* SCREEN 1: ENTITY CREATOR */}
                {screenPhase === 1 && (
                  <div className="bg-[#0f241a]/95 p-2.5 rounded-2xl border border-[#F9D2BA]/40 space-y-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#F9D2BA] uppercase">1. Register Entity</span>
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">SHA-256 OK</span>
                    </div>
                    <div className="bg-[#1b3b2c] p-1.5 rounded-xl text-[9px] font-bold text-white truncate">
                      {currentStep.payload?.entity || activeUseCase.title}
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-1.5 rounded-xl text-[8px] font-mono">
                      <span className="text-[#F9D2BA]">SKU Code:</span>
                      <span className="text-white font-bold">{currentStep.payload?.sku || 'HM500-IND'}</span>
                    </div>
                  </div>
                )}

                {/* SCREEN 2: ATTRIBUTES & BOM */}
                {screenPhase === 2 && (
                  <div className="bg-[#0f241a]/95 p-2.5 rounded-2xl border border-[#F9D2BA]/40 space-y-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#F9D2BA] uppercase">2. Specs &amp; Line</span>
                      <span className="text-[8px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">TELEMETRY</span>
                    </div>
                    <div className="space-y-1 text-[8px] font-mono">
                      <div className="flex justify-between bg-black/40 p-1.5 rounded-lg">
                        <span className="text-slate-300">Plant / Line:</span>
                        <span className="text-[#F9D2BA] font-bold">{currentStep.payload?.plant || 'Pune Line A-1'}</span>
                      </div>
                      <div className="flex justify-between bg-black/40 p-1.5 rounded-lg">
                        <span className="text-slate-300">Batch Code:</span>
                        <span className="text-emerald-400 font-bold">{currentStep.payload?.batch || 'BATCH-2026-08A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 3: QC AUDIT & QR STAMP */}
                {screenPhase === 3 && (
                  <div className="bg-[#0f241a]/95 p-2.5 rounded-2xl border border-[#F9D2BA]/40 space-y-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#F9D2BA] uppercase">3. Cryptographic Seal</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl">
                      <div className="w-10 h-10 bg-white p-1 rounded-lg shrink-0">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>
                      <div className="min-w-0 text-[8px] font-mono">
                        <span className="text-emerald-400 font-bold block">100% VERIFIED</span>
                        <span className="text-slate-300 truncate block">0x8f4a2b...b92e</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCREEN 4: CUSTOMER PASSPORT */}
                {screenPhase === 4 && (
                  <div className="bg-[#0f241a]/95 p-2.5 rounded-2xl border border-[#F9D2BA]/40 space-y-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#F9D2BA] uppercase">4. Customer Passport</span>
                      <Award className="w-3.5 h-3.5 text-[#F9D2BA]" />
                    </div>
                    <div className="bg-[#1b3b2c] p-2 rounded-xl text-center space-y-0.5">
                      <span className="text-[10px] font-black text-[#F9D2BA] block truncate">
                        {activeUseCase.title}
                      </span>
                      <span className="text-[8px] text-emerald-300 font-mono font-bold block">
                        36 Months Active Warranty
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* MOBILE BOTTOM NAVIGATION BAR */}
              <div className="bg-black/60 rounded-2xl p-1.5 flex items-center justify-around text-[7px] font-bold text-slate-400 border border-white/10">
                <span className="text-[#F9D2BA]">Home</span>
                <span>Twins</span>
                <span className="p-1 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-black">SCAN</span>
                <span>Graph</span>
                <span>Studio</span>
              </div>

            </div>

            {/* IPHONE HOME BAR */}
            <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-1" />

          </div>

        </div>

        {/* ─── RIGHT COLUMN: INTERACTIVE OPERATIONAL CONTROLS (7 COLS) ─── */}
        <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[90vh]">
          
          {/* HEADER & REEL SWITCHER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] font-black text-xs uppercase tracking-wider">
                  {activeUseCase.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#F9D2BA]/80">
                  REEL {currentUseCaseIndex + 1} OF {INDUSTRY_USE_CASES.length}
                </span>
              </div>

              {/* Mini Audio & Play Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(prev => !prev)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#F9D2BA] transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setIsPlaying(prev => !prev)}
                  className="p-2 rounded-xl bg-[#F9D2BA] text-[#1D4533] hover:bg-[#F7EAE0] transition-colors font-bold"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F7EAE0] tracking-tight">
                {activeUseCase.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#F9D2BA] font-medium mt-1">
                {activeUseCase.subtitle} — {activeUseCase.description}
              </p>
            </div>
          </div>

          {/* ACTIVE STEP CARD */}
          <div className="bg-[#1a382b] p-5 rounded-3xl border border-[#F9D2BA]/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-[#F9D2BA]/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F9D2BA] text-[#1D4533] font-black text-xs flex items-center justify-center">
                  {currentStep.step}
                </span>
                <h3 className="font-black text-base text-[#F7EAE0]">
                  {currentStep.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-black/40 px-2 py-0.5 rounded-lg">
                Phase {screenPhase}
              </span>
            </div>

            <p className="text-xs text-[#F7EAE0]/90 leading-relaxed font-medium">
              {currentStep.description}
            </p>

            {/* Voiceover Callout */}
            <div className="p-3 bg-[#0d2218] rounded-2xl border border-emerald-500/20 text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F9D2BA] shrink-0" />
              <span>Voiceover: "{currentStep.voiceover}"</span>
            </div>
          </div>

          {/* 16 STEP SCRUBBER BUTTONS */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-[#F9D2BA] tracking-wider block">
              Jump to Lifecycle Step:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {activeUseCase.steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex(idx);
                    setStepProgress(0);
                  }}
                  className={`p-1.5 rounded-xl border text-center font-bold text-xs transition-all ${
                    currentStepIndex === idx
                      ? 'bg-[#F9D2BA] text-[#1D4533] border-[#F9D2BA] shadow-sm font-black'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {s.step}
                </button>
              ))}
            </div>
          </div>

          {/* FOOTER ACTIONS & NEXT/PREV REEL NAVIGATION */}
          <div className="pt-4 border-t border-[#F9D2BA]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrevReel}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7EAE0] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Reel</span>
              </button>
              <button
                onClick={handleNextReel}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F7EAE0] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Next Reel</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                if (onNavigateToApp) onNavigateToApp();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Build this in UniQR Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
