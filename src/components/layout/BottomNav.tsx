import React from 'react';
import { Home, Package, Camera, PlusCircle, Menu } from 'lucide-react';
import { sound } from '../../services/audio';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenMobileDrawer?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, onOpenMobileDrawer }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'scanner', label: 'Scan', icon: Camera, isMain: true },
    { id: 'qr-studio', label: 'Studio', icon: PlusCircle },
    { id: 'menu', label: 'Menu', icon: Menu, isMenuTrigger: true },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 flex justify-center pointer-events-none">
      {/* Floating Dock */}
      <div className="bg-[#1D4533]/95 backdrop-blur-lg border-2 border-[#F9D2BA]/50 rounded-full px-2 py-1.5 flex items-center justify-around w-full max-w-md shadow-2xl pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrentTab(tab.id);
                }}
                className="flex flex-col items-center -mt-5 group"
                title="Open Mobile Camera Scanner"
              >
                <div className="w-12 h-12 rounded-full bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center shadow-2xl ring-4 ring-[#1D4533] group-active:scale-95 transition-transform font-bold">
                  <Icon className="w-6 h-6 text-[#1D4533]" />
                </div>
                <span className="text-[9px] font-black text-[#F9D2BA] mt-0.5 uppercase tracking-wider">
                  {tab.label}
                </span>
              </button>
            );
          }

          if (tab.isMenuTrigger) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenMobileDrawer?.();
                }}
                className="flex flex-col items-center py-1 px-2.5 rounded-full transition-all text-[#F7EAE0]/80 hover:text-[#F9D2BA] active:scale-95"
                title="Open Full Navigation Menu"
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setCurrentTab(tab.id);
              }}
              className={`flex flex-col items-center py-1 px-2.5 rounded-full transition-all active:scale-95 ${
                isActive 
                  ? 'text-[#F9D2BA] font-extrabold bg-[#5E3122]' 
                  : 'text-[#F7EAE0]/80 hover:text-[#F9D2BA]'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
