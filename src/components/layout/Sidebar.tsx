import React from 'react';
import { 
  Home, 
  Package, 
  PlusCircle, 
  Camera, 
  Network, 
  BarChart3, 
  CreditCard, 
  Code2, 
  Shield, 
  Building2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Palette,
  Brain,
  FileText,
  X,
  Zap,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../services/audio';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenUpgrade: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenUpgrade,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  setIsMobileOpen
}) => {
  const menuSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'products', label: 'Inventory', icon: Package },
        { id: 'qr-studio', label: 'QR Studio', icon: PlusCircle },
        { id: 'builder', label: 'Passport', icon: Palette },
        { id: 'scanner', label: 'Scanner', icon: Camera },
      ]
    },
    {
      title: 'ANALYTICS & INSIGHTS',
      items: [
        { id: 'graph', label: 'Intelligence', icon: Brain },
        { id: 'analytics', label: 'Scan Analysis', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    },
    {
      title: 'DEVELOPMENT',
      items: [
        { id: 'app-api-docs', label: 'API Keys', icon: Code2 },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'admin', label: 'Admin', icon: Shield },
        { id: 'billing', label: 'Subscription', icon: CreditCard },
      ]
    }
  ];

  const handleSelectTab = (tabId: string) => {
    sound.playClick();
    setCurrentTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* ─── MOBILE SLIDE-OVER DRAWER (FULL ACCESS FOR MOBILE USERS) ─── */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileOpen?.(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Container */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-[#1D4533] border-r-2 border-[#F9D2BA]/50 p-4 text-[#F7EAE0] shadow-2xl z-10 h-full overflow-y-auto animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F9D2BA]/30">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/logo.jpg" 
                  alt="UniQR" 
                  className="w-8 h-8 rounded-xl border border-[#F9D2BA] object-cover shadow-sm" 
                />
                <div>
                  <span className="font-black text-sm tracking-tight text-[#F7EAE0] block">
                    UNIQR MENU
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#F9D2BA]">
                    All Features
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMobileOpen?.(false);
                }}
                className="p-2 rounded-xl bg-[#5E3122] text-[#F9D2BA] hover:text-white transition-all shadow-xs"
                title="Close Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu List */}
            <div className="space-y-4 flex-1">
              {menuSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <h4 className="text-[9px] uppercase font-black tracking-widest text-[#F9D2BA]/70 px-2">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                            isActive
                              ? 'bg-[#F9D2BA] text-[#1D4533] shadow-md font-black'
                              : 'text-[#F7EAE0] hover:text-[#F9D2BA] hover:bg-[#5E3122]/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1D4533]' : 'text-[#F9D2BA]'}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ArrowRight className="w-3.5 h-3.5 text-[#1D4533]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Plan Badge */}
            <div className="mt-4 pt-3 border-t border-[#F9D2BA]/30">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsMobileOpen?.(false);
                  onOpenUpgrade();
                }}
                className="w-full p-2.5 rounded-xl bg-[#5E3122] hover:bg-[#F9D2BA] hover:text-[#1D4533] text-[#F7EAE0] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Upgrade Plan / Quota</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className={`hidden md:flex flex-col bg-[#1D4533] border-r border-[#5E3122]/30 min-h-[calc(100vh-65px)] p-4 select-none shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        
        {/* COLLAPSE / EXPAND TOGGLE HEADER */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#5E3122]/30">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-2">
              <img src="/logo.jpg" alt="UniQR" className="w-6 h-6 rounded-lg border border-[#F9D2BA] object-cover" />
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#F9D2BA]">
                Navigation Menu
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCollapsed(prev => !prev);
            }}
            className={`p-2 rounded-xl text-[#F9D2BA] hover:bg-[#5E3122]/80 hover:text-[#F7EAE0] transition-all ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
          {menuSections.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#F9D2BA]/80 mb-2 px-3 truncate">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#F9D2BA] ${
                        isCollapsed ? 'justify-center px-0' : ''
                      } ${
                        isActive
                          ? 'bg-[#F9D2BA] text-[#1D4533] shadow-md'
                          : 'text-[#F7EAE0] hover:text-[#F9D2BA] hover:bg-[#5E3122]/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1D4533]' : 'text-[#F9D2BA]'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Banner in Sidebar */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t border-[#5E3122]/30">
            <div className="p-4 rounded-2xl bg-[#5E3122]/40 border border-[#F9D2BA]/20 text-center">
              <div className="w-9 h-9 rounded-2xl bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center mx-auto mb-2 font-bold shadow-md">
                <CreditCard className="w-4 h-4" />
              </div>
              <h5 className="font-extrabold text-xs text-[#F7EAE0]">Industrial Digital Identity</h5>
              <p className="text-[11px] text-[#F9D2BA]/80 mt-1 mb-3">
                Unlimited asset relationships &amp; high precision laser vector formats.
              </p>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenUpgrade();
                }}
                className="w-full py-2 rounded-xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-extrabold text-xs shadow-md transition-all"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
