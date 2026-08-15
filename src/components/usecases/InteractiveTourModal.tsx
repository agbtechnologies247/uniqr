import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Sparkles, Layers, QrCode, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Terminal, Network
} from 'lucide-react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { IndustryUseCase } from '../../data/useCaseData';
import { sound } from '../../services/audio';

interface InteractiveTourModalProps {
  useCase: IndustryUseCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({ useCase, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inspector' | 'intelligence' | 'graph'>('inspector');

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    }
  }, [isOpen, useCase]);

  // Auto progression timer
  useEffect(() => {
    if (!isOpen || !isPlaying || !useCase) return;

    const currentStep = useCase.steps[currentStepIndex];
    const duration = ((currentStep?.durationSec || 6) * 1000) / playbackSpeed;

    timerRef.current = setTimeout(() => {
      if (currentStepIndex < useCase.steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        sound.playClick();
      } else {
        setIsPlaying(false);
      }
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, isPlaying, currentStepIndex, playbackSpeed, useCase]);

  // Driver.js step highlight effect
  useEffect(() => {
    if (!isOpen || !useCase) return;
    const currentStep = useCase.steps[currentStepIndex];

    try {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        popoverClass: 'uniqr-driver-popover'
      });

      const elementId = `step-target-${currentStepIndex + 1}`;
      const targetElem = document.getElementById(elementId);

      if (targetElem) {
        driverObj.highlight({
          element: `#${elementId}`,
          popover: {
            title: `Step ${currentStep.step}: ${currentStep.title}`,
            description: currentStep.description,
            side: "bottom",
            align: 'start'
          }
        });
      }
    } catch (err) {
      // Graceful fallback
    }
  }, [currentStepIndex, isOpen, useCase]);

  if (!isOpen || !useCase) return null;

  const currentStep = useCase.steps[currentStepIndex];
  const Icon = useCase.icon;
  const progressPercent = Math.round(((currentStepIndex + 1) / useCase.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#5E3122]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl border border-[#F9D2BA] shadow-2xl overflow-hidden flex flex-col my-4 max-h-[92vh]">
        
        {/* TOUR HEADER */}
        <div className="bg-[#1D4533] p-4 sm:p-5 text-[#F7EAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center font-bold shadow-md shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#F9D2BA] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>16-Step Day-to-Day Process Tour</span>
              </div>
              <h2 className="font-extrabold text-lg sm:text-xl text-white">
                {useCase.title} — {useCase.subtitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* PLAY / PAUSE CONTROLS */}
            <div className="flex items-center gap-1.5 bg-[#5E3122]/80 p-1 rounded-xl border border-[#F9D2BA]/30 text-xs font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F9D2BA] text-[#1D4533] hover:bg-[#F7EAE0] flex items-center gap-1 font-extrabold transition-all"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Tour' : 'Play Tour'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentStepIndex(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg text-[#F7EAE0] hover:bg-[#1D4533] transition-colors"
                title="Restart Tour"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-1.5 rounded-lg text-[#F7EAE0] hover:bg-[#1D4533] transition-colors"
                title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#F9D2BA]" />}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-[#1D4533] text-[#F9D2BA] px-2 py-1 rounded-md text-[10px] font-bold focus:outline-none border border-[#F9D2BA]/30"
              >
                <option value={1}>1x Speed</option>
                <option value={1.5}>1.5x Speed</option>
                <option value={2}>2x Speed</option>
              </select>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-[#F7EAE0] hover:bg-[#5E3122] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SPLIT-SCREEN TOUR BODY */}
        <div className="grid lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* LEFT PANE: VISUAL SIMULATION & ANIMATED QR PLAYER (6 COLS) */}
          <div className="lg:col-span-6 p-6 bg-[#F7EAE0] border-b lg:border-b-0 lg:border-r border-[#F9D2BA] flex flex-col justify-between space-y-6">
            
            {/* TOP METADATA CARD */}
            <div className="flex items-center justify-between text-xs font-bold text-[#5E3122]">
              <span className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] text-[10px] font-extrabold uppercase">
                Step {currentStepIndex + 1} of {useCase.steps.length}
              </span>
              <span className="font-mono text-[#1D4533]">
                Progress: {progressPercent}%
              </span>
            </div>

            {/* ANIMATED QR SCANNING CANVAS SIMULATOR */}
            <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-lg text-center space-y-5 relative overflow-hidden group">
              
              <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-bold text-[#1D4533] bg-[#F7EAE0] px-2.5 py-1 rounded-full border border-[#F9D2BA]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Simulating Live Scan</span>
              </div>

              {/* QR MATRIX & SCANNING WAVE */}
              <div className="relative w-48 h-48 mx-auto bg-[#F7EAE0] p-4 rounded-2xl border border-[#F9D2BA] shadow-inner flex items-center justify-center">
                <QrCode className="w-36 h-36 text-[#1D4533] transition-all transform group-hover:scale-105" />
                
                {/* SCANNING LASER LINE */}
                <div 
                  className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#1D4533] to-transparent shadow-[0_0_15px_#1D4533] transition-all"
                  style={{
                    top: `${((currentStepIndex % 4) + 1) * 20}%`
                  }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E3122]">Active Step Target</span>
                <h3 className="text-lg font-extrabold text-[#1D4533]">{currentStep.title}</h3>
              </div>
            </div>

            {/* VOICE-OVER SUBTITLES TICKER */}
            <div className="p-4 bg-[#1D4533] text-[#F7EAE0] rounded-2xl border border-[#F9D2BA]/40 space-y-1.5 shadow-md">
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#F9D2BA] uppercase">
                <Volume2 className="w-3.5 h-3.5 text-[#F9D2BA]" />
                <span>Audio Voiceover Subtitles</span>
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                "{currentStep.voiceover}"
              </p>
            </div>

            {/* SCRUBBER STEP TIMELINE BUTTONS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#F9D2BA]">
              {useCase.steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => {
                    sound.playClick();
                    setIsPlaying(false);
                    if (timerRef.current) clearTimeout(timerRef.current);
                    setCurrentStepIndex(idx);
                  }}
                  className={`w-7 h-7 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                    currentStepIndex === idx
                      ? 'bg-[#1D4533] text-[#F7EAE0] ring-2 ring-[#F9D2BA] scale-110'
                      : 'bg-white text-[#5E3122] border border-[#F9D2BA] hover:bg-[#F9D2BA]'
                  }`}
                  title={`Step ${s.step}: ${s.title}`}
                >
                  {s.step}
                </button>
              ))}
            </div>

          </div>

          {/* RIGHT PANE: DRIVER.JS HIGHLIGHTED UI & INSPECTOR (6 COLS) */}
          <div className="lg:col-span-6 p-6 space-y-6 flex flex-col justify-between bg-white">
            
            {/* INSPECTOR VIEW TABS */}
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
              <div className="flex items-center gap-2 bg-[#F7EAE0] p-1 rounded-xl border border-[#F9D2BA]">
                {[
                  { id: 'inspector', label: 'Step Inspector' },
                  { id: 'intelligence', label: 'Connected Intelligence' },
                  { id: 'graph', label: 'Neo4j Graph' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(t.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                      activeTab === t.id
                        ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                        : 'text-[#5E3122] hover:bg-[#F9D2BA]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-bold text-[#5E3122]">
                16-Step Pipeline
              </span>
            </div>

            {/* TAB 1: STEP INSPECTOR & DRIVER.JS POPOVER CARD */}
            {activeTab === 'inspector' && (
              <div className="space-y-5">
                
                {/* DRIVER.JS TARGET STEP CARD */}
                <div 
                  id={`step-target-${currentStep.step}`}
                  className="p-5 bg-[#F7EAE0] rounded-2xl border-2 border-[#1D4533] shadow-md space-y-3 relative transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] font-extrabold text-[10px]">
                      Step {currentStep.step} / 16
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#5E3122]">
                      Target ID: #{currentStep.targetId}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#1D4533]">
                    {currentStep.title}
                  </h3>

                  <p className="text-xs text-[#5E3122] font-semibold leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                {/* PAYLOAD SCHEMA JSON PREVIEW */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#1D4533]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-[#1D4533]" />
                      <span>Live Payload Schema:</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5E3122]">JSON Schema Valid</span>
                  </div>

                  <pre className="p-4 bg-[#1D4533] text-[#F7EAE0] rounded-2xl border border-[#F9D2BA]/40 font-mono text-xs overflow-x-auto shadow-inner">
                    {JSON.stringify(currentStep.payload, null, 2)}
                  </pre>
                </div>

              </div>
            )}

            {/* TAB 2: CONNECTED INTELLIGENCE Q&A */}
            {activeTab === 'intelligence' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-[#1D4533] uppercase">
                  Connected Intelligence Instant Answers Upon Scan
                </h4>

                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {useCase.intelligenceQA.map((qa, idx) => (
                    <div key={idx} className="p-3 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA] space-y-1 text-xs">
                      <div className="font-extrabold text-[#1D4533] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                        <span>{qa.question}</span>
                      </div>
                      <p className="text-[#5E3122] font-bold pl-5">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: NEO4J GRAPH RELATIONSHIPS */}
            {activeTab === 'graph' && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-[#1D4533] uppercase flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-[#1D4533]" />
                  <span>Neo4j Graph Relationship Map</span>
                </h4>

                <div className="p-4 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] space-y-3">
                  {useCase.graphRelationships.map((rel, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#F9D2BA] shadow-sm">
                      <span className="font-extrabold text-[#1D4533]">{rel.source}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] font-mono text-[10px] font-bold">
                        :{rel.label} &rarr;
                      </span>
                      <span className="font-extrabold text-[#5E3122]">{rel.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BOTTOM NAV PREV / NEXT BUTTONS */}
            <div className="pt-4 border-t border-[#F9D2BA] flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsPlaying(false);
                  if (timerRef.current) clearTimeout(timerRef.current);
                  setCurrentStepIndex(prev => Math.max(0, prev - 1));
                }}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] disabled:opacity-50 text-[#1D4533] font-extrabold text-xs flex items-center gap-1 border border-[#F9D2BA] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>

              <div className="text-[11px] font-bold text-[#5E3122]">
                Step {currentStepIndex + 1} of {useCase.steps.length}
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsPlaying(false);
                  if (timerRef.current) clearTimeout(timerRef.current);
                  if (currentStepIndex < useCase.steps.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                  } else {
                    setCurrentStepIndex(0);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs flex items-center gap-1 shadow-md transition-all"
              >
                <span>{currentStepIndex === useCase.steps.length - 1 ? 'Replay Tour' : 'Next Step'}</span>
                <ChevronRight className="w-4 h-4 text-[#F9D2BA]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
