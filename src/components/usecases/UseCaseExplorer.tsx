import React, { useState } from 'react';
import { 
  Sparkles, Layers, ArrowRight, Play, CheckCircle2, ShieldCheck, 
  Search, SlidersHorizontal, HelpCircle, Film, Grid, Smartphone
} from 'lucide-react';
import { INDUSTRY_USE_CASES, IndustryUseCase } from '../../data/useCaseData';
import { ReelViewerModal } from './ReelViewerModal';
import { sound } from '../../services/audio';

interface UseCaseExplorerProps {
  onSelectUseCase?: (useCase: IndustryUseCase) => void;
  onNavigateToApp?: () => void;
}

export const UseCaseExplorer: React.FC<UseCaseExplorerProps> = ({ onSelectUseCase, onNavigateToApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'reels'>('grid');
  const [activeReelUseCase, setActiveReelUseCase] = useState<IndustryUseCase | null>(null);
  const [isReelModalOpen, setIsReelModalOpen] = useState<boolean>(false);

  const categories = ['All', 'Industrial', 'Health & Pharma', 'Retail & Services', 'Assets & Spaces'];

  const filteredUseCases = INDUSTRY_USE_CASES.filter(uc => {
    const matchesCat = selectedCategory === 'All' || uc.category === selectedCategory;
    const matchesSearch = 
      uc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenReel = (useCase: IndustryUseCase) => {
    sound.playClick();
    setActiveReelUseCase(useCase);
    setIsReelModalOpen(true);
    if (onSelectUseCase) onSelectUseCase(useCase);
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* PAGE HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-[#1D4533] font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Interactive Operational Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D4533] tracking-tight">
            Use cases
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3122] font-medium leading-relaxed">
            Step by Step operational pipelines, tamper-evident ledgers, and dynamic product passports.
          </p>
        </div>

        {/* VIEW MODE SWITCHER */}
        <div className="flex items-center gap-2 bg-[#F7EAE0] p-1.5 rounded-2xl border border-[#F9D2BA] shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setViewMode('grid');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                : 'text-[#5E3122] hover:bg-[#F9D2BA]'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Card Grid</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setViewMode('reels');
              handleOpenReel(filteredUseCases[0] || INDUSTRY_USE_CASES[0]);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              viewMode === 'reels'
                ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                : 'text-[#5E3122] hover:bg-[#F9D2BA]'
            }`}
          >
            <Film className="w-4 h-4 text-[#F9D2BA]" />
            <span>Reels Feed</span>
          </button>
        </div>
      </div>

      {/* FILTER PILLS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm'
                  : 'bg-white border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E3122]/60" />
          <input
            type="text"
            placeholder="Search use cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#F9D2BA] rounded-xl text-xs font-medium text-[#1D4533] placeholder-[#5E3122]/50 focus:outline-none focus:border-[#1D4533]"
          />
        </div>
      </div>

      {/* USE CASES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUseCases.map((uc) => (
          <div
            key={uc.id}
            className="bg-white rounded-3xl border border-[#F9D2BA] p-6 space-y-4 hover:border-[#1D4533] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-black uppercase tracking-wider">
                  {uc.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#5E3122]">16 Pipeline Steps</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-[#1D4533] group-hover:text-[#5E3122] transition-colors">
                  {uc.title}
                </h3>
                <p className="text-xs text-[#5E3122] font-semibold mt-1 leading-relaxed">
                  {uc.subtitle}
                </p>
              </div>

              {/* 3 SAMPLE STEPS */}
              <div className="space-y-2 pt-3 border-t border-[#F9D2BA]">
                {uc.steps.slice(0, 3).map((st) => (
                  <div key={st.step} className="flex items-center gap-2 text-xs font-semibold text-[#5E3122]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                    <span className="truncate">Step {st.step}: {st.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WATCH REEL BUTTON */}
            <button
              onClick={() => handleOpenReel(uc)}
              className="w-full py-3 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Film className="w-4 h-4 text-[#F9D2BA]" />
              <span>Watch Reel</span>
            </button>
          </div>
        ))}
      </div>

      {/* REEL VIEWER MODAL / DRAWER */}
      <ReelViewerModal
        isOpen={isReelModalOpen}
        useCase={activeReelUseCase}
        onClose={() => setIsReelModalOpen(false)}
        onSelectUseCase={(uc) => setActiveReelUseCase(uc)}
        onNavigateToApp={onNavigateToApp}
      />

    </div>
  );
};
