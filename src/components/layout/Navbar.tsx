import React from 'react';
import { Sparkles, Zap, ArrowRight, PanelLeftClose, BookOpen, GitBranch } from 'lucide-react';
import { sound } from '../../services/audio';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenUpgrade: () => void;
  onOpenCommandPalette?: () => void;
  onOpenCapabilityGuide?: () => void;
  onOpenVersionModal?: () => void;
  quotaUsed: number;
  quotaLimit: number;
  onToggleSidebar?: () => void;
  onOpenContactSales?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenUpgrade,
  onOpenCapabilityGuide,
  onOpenVersionModal,
  quotaUsed,
  quotaLimit,
  onToggleSidebar
}) => {
  const isPublicSite = ['landing', 'use-cases', 'features', 'pricing', 'api-docs', 'contact'].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1D4533] border-b border-[#5E3122]/30 px-4 lg:px-8 py-3 transition-all shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isPublicSite && onToggleSidebar && (
            <>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleSidebar();
                }}
                className="hidden md:flex p-2 rounded-xl text-[#F9D2BA] hover:bg-[#5E3122]/80 hover:text-[#F7EAE0] transition-all"
                title="Toggle Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleSidebar();
                }}
                className="md:hidden p-2 rounded-xl text-[#F9D2BA] bg-[#5E3122]/60 hover:text-[#F7EAE0] transition-all"
                title="Open Navigation Menu"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </>
          )}

          <div 
            onClick={() => {
              sound.playClick();
              if (!isPublicSite && onToggleSidebar) {
                onToggleSidebar();
              } else {
                setCurrentTab('landing');
              }
            }} 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#F9D2BA] rounded-2xl"
            tabIndex={0}
            title={!isPublicSite ? "Click logo to open menu" : "UniQR Home"}
          >
            <img 
              src="/logo.jpg" 
              alt="UniQR Logo" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border border-[#F9D2BA] object-cover shadow-md group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#F7EAE0]">
                  UNIQR
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-pill bg-[#F9D2BA] text-[#5E3122]">
                  {isPublicSite ? 'PLATFORM' : 'APP 1.0'}
                </span>
              </div>
              <p className="text-[11px] text-[#F9D2BA]/80 -mt-0.5 font-medium hidden sm:block">
                Universal Product QR Platform
              </p>
            </div>
          </div>
        </div>

        {/* Public Landing Site Navigation */}
        {isPublicSite && (
          <nav className="hidden md:flex items-center gap-1 bg-[#5E3122] p-1.5 rounded-pill border border-[#F9D2BA]/20">
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('landing');
              }}
              className={`px-4 py-1.5 rounded-pill text-xs font-bold transition-all ${
                currentTab === 'landing' ? 'bg-[#F9D2BA] text-[#1D4533]' : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('use-cases');
              }}
              className={`px-4 py-1.5 rounded-pill text-xs font-bold transition-all ${
                currentTab === 'use-cases' ? 'bg-[#F9D2BA] text-[#1D4533]' : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              Use Cases
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('features');
              }}
              className={`px-4 py-1.5 rounded-pill text-xs font-medium transition-all ${
                currentTab === 'features' ? 'bg-[#F9D2BA] text-[#1D4533]' : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('pricing');
              }}
              className={`px-4 py-1.5 rounded-pill text-xs font-medium transition-all ${
                currentTab === 'pricing' ? 'bg-[#F9D2BA] text-[#1D4533]' : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('api-docs');
              }}
              className={`px-4 py-1.5 rounded-pill text-xs font-medium transition-all ${
                currentTab === 'api-docs' ? 'bg-[#F9D2BA] text-[#1D4533]' : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              Developer API
            </button>
          </nav>
        )}

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          
          {/* Version Management Pill Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenVersionModal) onOpenVersionModal();
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F9D2BA] text-[11px] font-mono font-extrabold border border-[#F9D2BA]/20 transition-all shadow-xs"
            title="UniQR Version & Platform Changelog"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>v3.2.0</span>
          </button>

          {/* App-only Controls: Platform Capability Guide Trigger & Quota Gauge */}
          {!isPublicSite && (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenCapabilityGuide) onOpenCapabilityGuide();
                }}
                className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-[#5E3122] hover:bg-[#F9D2BA] text-[#F9D2BA] hover:text-[#1D4533] border border-[#F9D2BA]/30 transition-all shadow-xs"
                title="Platform Capability Guide"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenUpgrade();
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#5E3122] border border-[#F9D2BA]/20 hover:border-[#F9D2BA] transition-all text-xs text-[#F7EAE0]"
                title="Upgrade Subscription Plan"
              >
                <Zap className="w-3.5 h-3.5 text-[#F9D2BA] animate-pulse" />
                <div className="text-left">
                  <div className="font-bold text-[#F7EAE0] leading-none text-[11px]">
                    {quotaUsed} / {quotaLimit} QRs
                  </div>
                </div>
                <span className="text-[9px] bg-[#F9D2BA] text-[#1D4533] font-black px-2 py-0.5 rounded-pill">
                  PRO
                </span>
              </button>
            </>
          )}

          {/* Main Action Button for Public Site */}
          {isPublicSite && (
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('dashboard');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-extrabold text-xs shadow-md transition-all"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
